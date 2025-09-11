/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.headless.cms.internal.resource.v1_0;

import com.liferay.document.library.display.context.DLMimeTypeDisplayContext;
import com.liferay.headless.cms.dto.v1_0.BulkAction;
import com.liferay.headless.cms.dto.v1_0.BulkActionItem;
import com.liferay.headless.cms.dto.v1_0.BulkActionPreviewItem;
import com.liferay.headless.cms.internal.odata.entity.v1_0.BulkActionEntityModel;
import com.liferay.headless.cms.resource.v1_0.BulkActionPreviewItemResource;
import com.liferay.layout.service.LayoutClassedModelUsageLocalService;
import com.liferay.object.entry.util.ObjectEntryThreadLocal;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectEntry;
import com.liferay.object.model.ObjectEntryVersion;
import com.liferay.object.model.ObjectRelationship;
import com.liferay.object.related.models.ObjectRelatedModelsProvider;
import com.liferay.object.related.models.ObjectRelatedModelsProviderRegistry;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectEntryLocalService;
import com.liferay.object.service.ObjectEntryVersionLocalService;
import com.liferay.object.service.ObjectRelationshipLocalService;
import com.liferay.portal.kernel.feature.flag.FeatureFlagManagerUtil;
import com.liferay.portal.kernel.json.JSONFactory;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.search.Sort;
import com.liferay.portal.kernel.search.filter.Filter;
import com.liferay.portal.kernel.servlet.DynamicServletRequest;
import com.liferay.portal.kernel.util.ArrayUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.odata.entity.EntityModel;
import com.liferay.portal.search.rest.dto.v1_0.SearchResult;
import com.liferay.portal.search.rest.resource.v1_0.SearchResultResource;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;

import jakarta.validation.ValidationException;

import jakarta.ws.rs.core.MultivaluedMap;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author Crescenzo Rega
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/bulk-action-preview-item.properties",
	scope = ServiceScope.PROTOTYPE,
	service = BulkActionPreviewItemResource.class
)
public class BulkActionPreviewItemResourceImpl
	extends BaseBulkActionPreviewItemResourceImpl {

	@Override
	public EntityModel getEntityModel(MultivaluedMap multivaluedMap)
		throws Exception {

		return _entityModel;
	}

	@Override
	public Page<BulkActionPreviewItem> postBulkActionPreviewPage(
			String search, Filter filter, Pagination pagination, Sort[] sorts,
			BulkAction bulkAction)
		throws Exception {

		if (!FeatureFlagManagerUtil.isEnabled(
				contextCompany.getCompanyId(), "LPD-17564") ||
			!BulkAction.Type.DELETE_BULK_ACTION.equals(bulkAction.getType())) {

			throw new UnsupportedOperationException();
		}

		BulkActionItem[] bulkActionItems = bulkAction.getBulkActionItems();

		if (ArrayUtil.isEmpty(bulkActionItems) && !bulkAction.getSelectAll()) {
			return Page.of(Collections.emptyList());
		}

		Page<BulkActionItem> bulkActionItemsPage = null;

		if (!bulkAction.getSelectAll()) {
			bulkActionItemsPage = _getBulkActionItemsPage(
				bulkActionItems, pagination, search, sorts);

			return Page.of(
				transform(
					ListUtil.subList(
						(List<BulkActionItem>)bulkActionItemsPage.getItems(),
						pagination.getStartPosition(),
						pagination.getEndPosition()),
					this::_toBulkActionPreviewItem),
				pagination, bulkActionItemsPage.getTotalCount());
		}

		bulkActionItemsPage = _getBulkActionItemsPage(
			filter, pagination, search, sorts);

		return Page.of(
			transform(
				bulkActionItemsPage.getItems(), this::_toBulkActionPreviewItem),
			pagination, bulkActionItemsPage.getTotalCount());
	}

	private Page<BulkActionItem> _getBulkActionItemsPage(
		BulkActionItem[] bulkActionItems, Pagination pagination, String search,
		Sort[] sorts) {

		List<BulkActionItem> bulkActionItemsList = ListUtil.fromArray(
			bulkActionItems);

		if (Validator.isNull(search) && ArrayUtil.isEmpty(sorts)) {
			return Page.of(
				ListUtil.subList(
					bulkActionItemsList, pagination.getStartPosition(),
					pagination.getEndPosition()),
				pagination, bulkActionItems.length);
		}

		if (Validator.isNotNull(search)) {
			bulkActionItemsList = ListUtil.filter(
				bulkActionItemsList,
				bulkActionItem -> StringUtil.containsIgnoreCase(
					bulkActionItem.getName(), search));
		}

		if (ArrayUtil.isNotEmpty(sorts)) {
			Sort sort = sorts[0];

			bulkActionItemsList = ListUtil.sort(
				bulkActionItemsList,
				(bulkActionItem1, bulkActionItem2) -> {
					String name = bulkActionItem1.getName();

					int value = name.compareTo(bulkActionItem2.getName());

					if (!sort.isReverse()) {
						return value;
					}

					return -value;
				});
		}

		return Page.of(
			bulkActionItemsList, pagination, bulkActionItemsList.size());
	}

	private Page<BulkActionItem> _getBulkActionItemsPage(
			Filter filter, Pagination pagination, String search, Sort[] sorts)
		throws Exception {

		if (filter == null) {
			throw new ValidationException("Filter must not be null");
		}

		List<BulkActionItem> bulkActionItemsList = new ArrayList<>();

		DynamicServletRequest dynamicServletRequest = new DynamicServletRequest(
			contextHttpServletRequest);

		dynamicServletRequest.setParameter("nestedFields", "embedded");

		SearchResultResource searchResultResource =
			_searchResultResourceFactory.create(
			).httpServletRequest(
				dynamicServletRequest
			).httpServletResponse(
				contextHttpServletResponse
			).preferredLocale(
				contextUser.getLocale()
			).uriInfo(
				contextUriInfo
			).user(
				contextUser
			).build();

		if (ArrayUtil.isNotEmpty(sorts)) {
			Sort sort1 = sorts[0];

			sort1.setFieldName("embedded.properties.title");
		}

		Page<SearchResult> searchPage = searchResultResource.getSearchPage(
			null, true, null, null, search, filter, pagination, sorts);

		for (SearchResult searchResult : searchPage.getItems()) {
			JSONObject jsonObject = _jsonFactory.createJSONObject(
				String.valueOf(searchResult.getEmbedded()));

			BulkActionItem bulkActionItem = new BulkActionItem();

			bulkActionItem.setClassExternalReferenceCode(
				() -> jsonObject.getString("externalReferenceCode"));
			bulkActionItem.setClassName(searchResult::getEntryClassName);
			bulkActionItem.setClassPK(() -> jsonObject.getLong("id"));

			JSONObject propertiesJSONObject = jsonObject.getJSONObject(
				"properties");

			if (propertiesJSONObject != null) {
				bulkActionItem.setName(
					() -> propertiesJSONObject.getString("title"));
			}
			else {
				bulkActionItem.setName(() -> jsonObject.getString("title"));
			}

			bulkActionItemsList.add(bulkActionItem);
		}

		return Page.of(
			bulkActionItemsList, pagination, searchPage.getTotalCount());
	}

	private String _getMimeType(
			ObjectDefinition objectDefinition, ObjectEntry objectEntry)
		throws Exception {

		if (Objects.equals(
				objectDefinition.getExternalReferenceCode(),
				"L_BASIC_WEB_CONTENT")) {

			return "basic-web-content";
		}
		else if (Objects.equals(
					objectDefinition.getExternalReferenceCode(), "L_BLOG")) {

			return "blog";
		}
		else if (Objects.equals(
					objectDefinition.getExternalReferenceCode(),
					"L_KNOWLEDGE_BASE")) {

			return "knowledge-base";
		}

		ObjectEntryVersion objectEntryVersion =
			_objectEntryVersionLocalService.getObjectEntryVersion(
				objectEntry.getObjectEntryId(), objectEntry.getVersion());

		JSONObject contentJSONObject = _jsonFactory.createJSONObject(
			objectEntryVersion.getContent());

		JSONObject propertiesJSONObject = contentJSONObject.getJSONObject(
			"properties");

		JSONObject fileJSONObject = propertiesJSONObject.getJSONObject("file");

		if (fileJSONObject != null) {
			return _dlMimeTypeDisplayContext.getIconFileMimeType(
				fileJSONObject.getString("mimeType"));
		}

		return "custom-structure";
	}

	private int _getUsages(
			String className, long objectDefinitionId, long objectEntryId)
		throws Exception {

		int usages =
			_layoutClassedModelUsageLocalService.
				getLayoutClassedModelUsagesCount(
					_portal.getClassNameId(className), objectEntryId);

		boolean skipObjectEntryResourcePermission =
			ObjectEntryThreadLocal.isSkipObjectEntryResourcePermission();

		try {
			ObjectEntryThreadLocal.setSkipObjectEntryResourcePermission(true);

			List<ObjectRelationship> objectRelationships =
				_objectRelationshipLocalService.
					getObjectRelationshipsByObjectDefinitionId2(
						objectDefinitionId);

			for (ObjectRelationship objectRelationship : objectRelationships) {
				ObjectRelatedModelsProvider objectRelatedModelsProvider =
					_objectRelatedModelsProviderRegistry.
						getObjectRelatedModelsProvider(
							className, contextCompany.getCompanyId(),
							objectRelationship.getType());

				usages += objectRelatedModelsProvider.getRelatedModelsCount(
					0, objectRelationship.getObjectRelationshipId(), null,
					objectEntryId, null);
			}
		}
		finally {
			ObjectEntryThreadLocal.setSkipObjectEntryResourcePermission(
				skipObjectEntryResourcePermission);
		}

		return usages;
	}

	private BulkActionPreviewItem _toBulkActionPreviewItem(
			BulkActionItem bulkActionItem)
		throws Exception {

		BulkActionPreviewItem bulkActionPreviewItem =
			new BulkActionPreviewItem();

		HashMapBuilder.HashMapWrapper<String, Object> hashMapWrapper =
			HashMapBuilder.<String, Object>put(
				"deletionType", "PERMANENT_DELETION");

		ObjectEntry objectEntry = _objectEntryLocalService.fetchObjectEntry(
			bulkActionItem.getClassPK());

		if (objectEntry != null) {
			ObjectDefinition objectDefinition =
				_objectDefinitionLocalService.getObjectDefinition(
					objectEntry.getObjectDefinitionId());

			hashMapWrapper.put(
				"mimeType", _getMimeType(objectDefinition, objectEntry));
			hashMapWrapper.put(
				"usages",
				_getUsages(
					objectDefinition.getClassName(),
					objectDefinition.getObjectDefinitionId(),
					objectEntry.getObjectEntryId()));

			hashMapWrapper.put("type", "ASSET");
		}
		else {
			hashMapWrapper.put("type", "FOLDER");
		}

		bulkActionPreviewItem.setAttributes(hashMapWrapper::build);

		bulkActionPreviewItem.setClassPK(bulkActionItem::getClassPK);
		bulkActionPreviewItem.setClassExternalReferenceCode(
			bulkActionItem::getClassExternalReferenceCode);
		bulkActionPreviewItem.setName(bulkActionItem::getName);

		return bulkActionPreviewItem;
	}

	private static final EntityModel _entityModel = new BulkActionEntityModel();

	@Reference
	private DLMimeTypeDisplayContext _dlMimeTypeDisplayContext;

	@Reference
	private JSONFactory _jsonFactory;

	@Reference
	private LayoutClassedModelUsageLocalService
		_layoutClassedModelUsageLocalService;

	@Reference
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@Reference
	private ObjectEntryLocalService _objectEntryLocalService;

	@Reference
	private ObjectEntryVersionLocalService _objectEntryVersionLocalService;

	@Reference
	private ObjectRelatedModelsProviderRegistry
		_objectRelatedModelsProviderRegistry;

	@Reference
	private ObjectRelationshipLocalService _objectRelationshipLocalService;

	@Reference
	private Portal _portal;

	@Reference
	private SearchResultResource.Factory _searchResultResourceFactory;

}