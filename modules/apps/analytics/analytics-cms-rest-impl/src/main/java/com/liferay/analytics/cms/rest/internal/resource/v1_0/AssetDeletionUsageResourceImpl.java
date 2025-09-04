/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.analytics.cms.rest.internal.resource.v1_0;

import com.liferay.analytics.cms.rest.dto.v1_0.AssetDeletionUsage;
import com.liferay.analytics.cms.rest.internal.depot.entry.util.DepotEntryUtil;
import com.liferay.analytics.cms.rest.resource.v1_0.AssetDeletionUsageResource;
import com.liferay.layout.model.LayoutClassedModelUsageTable;
import com.liferay.layout.service.LayoutClassedModelUsageLocalService;
import com.liferay.layout.util.constants.LayoutClassedModelUsageConstants;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectEntry;
import com.liferay.object.model.ObjectEntryTable;
import com.liferay.object.model.ObjectRelationship;
import com.liferay.object.related.models.ObjectRelatedModelsProvider;
import com.liferay.object.related.models.ObjectRelatedModelsProviderRegistry;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectEntryLocalService;
import com.liferay.object.service.ObjectRelationshipLocalService;
import com.liferay.petra.sql.dsl.DSLQueryFactoryUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.dao.orm.QueryUtil;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.search.Sort;
import com.liferay.portal.kernel.security.permission.ActionKeys;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionCheckerFactoryUtil;
import com.liferay.portal.kernel.service.LayoutLocalService;
import com.liferay.portal.kernel.service.permission.LayoutPermissionUtil;
import com.liferay.portal.kernel.util.ArrayUtil;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;

import jakarta.ws.rs.BadRequestException;

import java.util.ArrayList;
import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author Thiago Buarque
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/asset-deletion-usage.properties",
	scope = ServiceScope.PROTOTYPE, service = AssetDeletionUsageResource.class
)
public class AssetDeletionUsageResourceImpl
	extends BaseAssetDeletionUsageResourceImpl {

	@Override
	public Page<AssetDeletionUsage> getAssetDeletionUsagesAssetPage(
			Long assetId, String keywords, String languageId,
			Pagination pagination, Sort[] sorts)
		throws Exception {

		Sort sort = null;

		if (ArrayUtil.isEmpty(sorts)) {
			sort = new Sort("name", false);
		}
		else if (sorts.length > 1) {
			throw new BadRequestException("Only the 'name' field is sortable");
		}
		else {
			sort = sorts[0];
		}

		List<AssetDeletionUsage> assetDeletionUsages = _getAssetDeletionUsages(
			assetId, keywords, languageId);

		boolean reverse = sort.isReverse();

		return Page.of(
			ListUtil.subList(
				ListUtil.sort(
					assetDeletionUsages,
					(assetDeletionUsage1, assetDeletionUsage2) -> {
						String name = assetDeletionUsage1.getName();

						int value = name.compareTo(
							assetDeletionUsage2.getName());

						if (!reverse) {
							return value;
						}

						return -value;
					}),
				pagination.getStartPosition(), pagination.getEndPosition()),
			pagination, assetDeletionUsages.size());
	}

	private void _addLayoutUsages(
			List<AssetDeletionUsage> assetDeletionUsages, String keywords,
			String languageId, ObjectDefinition objectDefinition,
			Long objectEntryId)
		throws Exception {

		PermissionChecker permissionChecker =
			PermissionCheckerFactoryUtil.create(contextUser);

		for (Object[] objects :
				_getLayoutClassedModelUsageObjectsList(
					objectDefinition, objectEntryId)) {

			Layout layout = _layoutLocalService.getLayout((Long)objects[0]);

			if (!_hasViewAccess(layout, permissionChecker)) {
				continue;
			}

			String name = _getName(
				layout.isDraftLayout(), languageId,
				layout.getName(languageId, true));

			if ((keywords != null) &&
				!StringUtil.containsIgnoreCase(
					name, keywords, StringPool.BLANK)) {

				continue;
			}

			AssetDeletionUsage assetDeletionUsage = new AssetDeletionUsage();

			assetDeletionUsage.setName(() -> name);
			assetDeletionUsage.setType(
				() -> _getLayoutUsageTypeLabel(
					languageId, (Integer)objects[1]));

			assetDeletionUsages.add(assetDeletionUsage);
		}
	}

	private void _addObjectEntryUsages(
			List<AssetDeletionUsage> assetDeletionUsages, String keywords,
			String languageId, ObjectDefinition objectDefinition,
			long objectEntryId)
		throws Exception {

		List<ObjectRelationship> objectRelationships =
			_objectRelationshipLocalService.
				getObjectRelationshipsByObjectDefinitionId2(
					objectDefinition.getObjectDefinitionId());

		Long[] groupIds = DepotEntryUtil.getGroupIds(
			DepotEntryUtil.getDepotEntries(
				contextCompany.getCompanyId(), null));

		for (ObjectRelationship objectRelationship : objectRelationships) {
			ObjectRelatedModelsProvider objectRelatedModelsProvider =
				_objectRelatedModelsProviderRegistry.
					getObjectRelatedModelsProvider(
						objectDefinition.getClassName(),
						contextCompany.getCompanyId(),
						objectRelationship.getType());

			List<ObjectEntry> relatedObjectEntries =
				objectRelatedModelsProvider.getRelatedModels(
					0, objectRelationship.getObjectRelationshipId(),
					ObjectEntryTable.INSTANCE.groupId.in(groupIds),
					objectEntryId, keywords, QueryUtil.ALL_POS,
					QueryUtil.ALL_POS, null);

			for (ObjectEntry relatedObjectEntry : relatedObjectEntries) {
				AssetDeletionUsage assetDeletionUsage =
					new AssetDeletionUsage();

				assetDeletionUsage.setName(
					() -> _getName(
						relatedObjectEntry.isDraft(), languageId,
						relatedObjectEntry.getTitleValue(languageId)));
				assetDeletionUsage.setType(
					() -> objectDefinition.getLabel(languageId));

				assetDeletionUsages.add(assetDeletionUsage);
			}
		}
	}

	private List<AssetDeletionUsage> _getAssetDeletionUsages(
			Long assetId, String keywords, String languageId)
		throws Exception {

		List<AssetDeletionUsage> assetDeletionUsages = new ArrayList<>();

		ObjectEntry objectEntry = _objectEntryLocalService.getObjectEntry(
			assetId);

		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.getObjectDefinition(
				objectEntry.getObjectDefinitionId());

		_addLayoutUsages(
			assetDeletionUsages, keywords, languageId, objectDefinition,
			assetId);

		_addObjectEntryUsages(
			assetDeletionUsages, keywords, languageId, objectDefinition,
			assetId);

		return assetDeletionUsages;
	}

	private List<Object[]> _getLayoutClassedModelUsageObjectsList(
		ObjectDefinition objectDefinition, Long objectEntryId) {

		LayoutClassedModelUsageTable layoutClassedModelUsageTable =
			LayoutClassedModelUsageTable.INSTANCE;

		return _layoutClassedModelUsageLocalService.dslQuery(
			DSLQueryFactoryUtil.select(
				layoutClassedModelUsageTable.plid,
				layoutClassedModelUsageTable.type
			).from(
				layoutClassedModelUsageTable
			).where(
				layoutClassedModelUsageTable.classNameId.eq(
					_portal.getClassNameId(objectDefinition.getClassName())
				).and(
					layoutClassedModelUsageTable.classPK.eq(objectEntryId)
				).and(
					layoutClassedModelUsageTable.containerKey.isNotNull()
				).and(
					layoutClassedModelUsageTable.groupId.in(
						ArrayUtil.toArray(contextUser.getGroupIds()))
				)
			));
	}

	private String _getLayoutUsageTypeLabel(String languageId, long type) {
		if (type ==
				LayoutClassedModelUsageConstants.TYPE_DISPLAY_PAGE_TEMPLATE) {

			return LanguageUtil.get(
				LocaleUtil.fromLanguageId(languageId), "display-page-template");
		}
		else if (type == LayoutClassedModelUsageConstants.TYPE_PAGE_TEMPLATE) {
			return LanguageUtil.get(
				LocaleUtil.fromLanguageId(languageId), "page-template");
		}

		return LanguageUtil.get(LocaleUtil.fromLanguageId(languageId), "page");
	}

	private String _getName(boolean draft, String languageId, String name) {
		if (draft) {
			name += StringBundler.concat(
				StringPool.SPACE, StringPool.OPEN_PARENTHESIS,
				LanguageUtil.get(
					LocaleUtil.fromLanguageId(languageId, true, true), "draft"),
				StringPool.CLOSE_PARENTHESIS);
		}

		return name;
	}

	private boolean _hasViewAccess(
		Layout layout, PermissionChecker permissionChecker) {

		try {
			long plid = layout.getPlid();

			if (layout.isDraftLayout()) {
				plid = layout.getClassPK();
			}

			LayoutPermissionUtil.check(
				permissionChecker, plid, ActionKeys.VIEW);
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug(exception);
			}

			return false;
		}

		return true;
	}

	private static final Log _log = LogFactoryUtil.getLog(
		AssetDeletionUsageResourceImpl.class);

	@Reference
	private LayoutClassedModelUsageLocalService
		_layoutClassedModelUsageLocalService;

	@Reference
	private LayoutLocalService _layoutLocalService;

	@Reference
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@Reference
	private ObjectEntryLocalService _objectEntryLocalService;

	@Reference
	private ObjectRelatedModelsProviderRegistry
		_objectRelatedModelsProviderRegistry;

	@Reference
	private ObjectRelationshipLocalService _objectRelationshipLocalService;

	@Reference
	private Portal _portal;

}