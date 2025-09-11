/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.headless.cms.internal.resource.v1_0;

import com.liferay.document.library.display.context.DLMimeTypeDisplayContext;
import com.liferay.headless.cms.dto.v1_0.BulkActionPreviewItem;
import com.liferay.headless.cms.internal.odata.entity.v1_0.BulkActionEntityModel;
import com.liferay.headless.cms.resource.v1_0.BulkActionPreviewItemResource;
import com.liferay.layout.service.LayoutClassedModelUsageLocalService;
import com.liferay.object.entry.util.ObjectEntryThreadLocal;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectEntry;
import com.liferay.object.model.ObjectEntryFolder;
import com.liferay.object.model.ObjectEntryVersion;
import com.liferay.object.model.ObjectRelationship;
import com.liferay.object.related.models.ObjectRelatedModelsProvider;
import com.liferay.object.related.models.ObjectRelatedModelsProviderRegistry;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectEntryFolderLocalService;
import com.liferay.object.service.ObjectEntryLocalService;
import com.liferay.object.service.ObjectEntryVersionLocalService;
import com.liferay.object.service.ObjectRelationshipLocalService;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.feature.flag.FeatureFlagManagerUtil;
import com.liferay.portal.kernel.json.JSONFactory;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.search.Sort;
import com.liferay.portal.kernel.search.filter.Filter;
import com.liferay.portal.kernel.servlet.DynamicServletRequest;
import com.liferay.portal.kernel.util.ArrayUtil;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.odata.entity.EntityModel;
import com.liferay.portal.search.rest.dto.v1_0.SearchResult;
import com.liferay.portal.search.rest.resource.v1_0.SearchResultResource;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;

import jakarta.validation.ValidationException;

import jakarta.ws.rs.BadRequestException;
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
	public Page<BulkActionPreviewItem> getBulkActionDeletePreviewPage(
			String assetIdsString, String search, Boolean selectAll,
			Filter filter, Pagination pagination, Sort[] sorts)
		throws Exception {

		if (!FeatureFlagManagerUtil.isEnabled(
				contextCompany.getCompanyId(), "LPD-17564")) {

			throw new UnsupportedOperationException();
		}

		if (Validator.isBlank(assetIdsString) &&
			!GetterUtil.getBoolean(selectAll)) {

			return Page.of(Collections.emptyList());
		}

		if (ArrayUtil.isNotEmpty(sorts)) {
			Sort sort = sorts[0];

			if (!StringUtil.equalsIgnoreCase(sort.getFieldName(), "name") ||
				(sorts.length > 1)) {

				throw new BadRequestException(
					"Only the 'name' field is sortable");
			}
		}

		if (!GetterUtil.getBoolean(selectAll)) {
			return _getBulkActionPreviewItemsPage(
				assetIdsString, pagination, search, sorts);
		}

		return _getBulkActionPreviewItemsPage(
			filter, pagination, search, sorts);
	}

	@Override
	public EntityModel getEntityModel(MultivaluedMap multivaluedMap)
		throws Exception {

		return _entityModel;
	}

	private Page<BulkActionPreviewItem> _getBulkActionPreviewItemsPage(
			Filter filter, Pagination pagination, String search, Sort[] sorts)
		throws Exception {

		if (filter == null) {
			throw new ValidationException("Filter must not be null");
		}

		List<BulkActionPreviewItem> bulkActionPreviewItems = new ArrayList<>();

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
			Sort sort = sorts[0];

			sort.setFieldName("embedded.properties.title");
		}

		Page<SearchResult> searchPage = searchResultResource.getSearchPage(
			null, true, null, null, search, filter, pagination, sorts);

		for (SearchResult searchResult : searchPage.getItems()) {
			JSONObject jsonObject = _jsonFactory.createJSONObject(
				String.valueOf(searchResult.getEmbedded()));

			bulkActionPreviewItems.add(
				_toBulkActionPreviewItem(jsonObject.getLong("id")));
		}

		return Page.of(
			bulkActionPreviewItems, pagination, searchPage.getTotalCount());
	}

	private Page<BulkActionPreviewItem> _getBulkActionPreviewItemsPage(
			String assetIdsString, Pagination pagination, String search,
			Sort[] sorts)
		throws Exception {

		List<BulkActionPreviewItem> bulkActionPreviewItems = new ArrayList<>();

		List<String> assetIds = ListUtil.fromArray(
			assetIdsString.split(StringPool.COMMA));

		long totalCount = assetIds.size();

		if (Validator.isNull(search) && ArrayUtil.isEmpty(sorts)) {
			assetIds = ListUtil.subList(
				assetIds, pagination.getStartPosition(),
				pagination.getEndPosition());
		}

		for (String assetId : assetIds) {
			bulkActionPreviewItems.add(
				_toBulkActionPreviewItem(GetterUtil.getLong(assetId)));
		}

		if (Validator.isNotNull(search)) {
			bulkActionPreviewItems = ListUtil.filter(
				bulkActionPreviewItems,
				bulkActionPreviewItem -> StringUtil.containsIgnoreCase(
					bulkActionPreviewItem.getName(), search));

			totalCount = bulkActionPreviewItems.size();
		}

		if (ArrayUtil.isNotEmpty(sorts)) {
			Sort sort = sorts[0];

			bulkActionPreviewItems = ListUtil.sort(
				bulkActionPreviewItems,
				(bulkActionPreviewItem1, bulkActionPreviewItem2) -> {
					String name = bulkActionPreviewItem1.getName();

					int value = name.compareTo(
						bulkActionPreviewItem2.getName());

					if (!sort.isReverse()) {
						return value;
					}

					return -value;
				});
		}

		return Page.of(bulkActionPreviewItems, pagination, totalCount);
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

	private long _getUsages(
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

	private BulkActionPreviewItem _toBulkActionPreviewItem(long classPK)
		throws Exception {

		BulkActionPreviewItem bulkActionPreviewItem =
			new BulkActionPreviewItem();

		HashMapBuilder.HashMapWrapper<String, Object> hashMapWrapper =
			HashMapBuilder.<String, Object>put(
				"deletionType", "PERMANENT_DELETION");

		ObjectEntry objectEntry = _objectEntryLocalService.fetchObjectEntry(
			classPK);

		if (objectEntry != null) {
			ObjectDefinition objectDefinition =
				_objectDefinitionLocalService.fetchObjectDefinition(
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

			bulkActionPreviewItem.setAttributes(hashMapWrapper::build);

			bulkActionPreviewItem.setClassName(objectDefinition::getClassName);
			bulkActionPreviewItem.setClassPK(() -> classPK);
			bulkActionPreviewItem.setExternalReferenceCode(
				objectEntry::getExternalReferenceCode);
			bulkActionPreviewItem.setName(
				() -> objectEntry.getTitleValue(
					LocaleUtil.toLanguageId(contextUser.getLocale()), true));

			return bulkActionPreviewItem;
		}

		ObjectEntryFolder objectEntryFolder =
			_objectEntryFolderLocalService.fetchObjectEntryFolder(classPK);

		hashMapWrapper.put("type", "FOLDER");

		bulkActionPreviewItem.setAttributes(hashMapWrapper::build);

		bulkActionPreviewItem.setClassName(
			objectEntryFolder::getModelClassName);
		bulkActionPreviewItem.setClassPK(() -> classPK);
		bulkActionPreviewItem.setExternalReferenceCode(
			objectEntryFolder::getExternalReferenceCode);
		bulkActionPreviewItem.setName(objectEntryFolder::getName);

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
	private ObjectEntryFolderLocalService _objectEntryFolderLocalService;

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