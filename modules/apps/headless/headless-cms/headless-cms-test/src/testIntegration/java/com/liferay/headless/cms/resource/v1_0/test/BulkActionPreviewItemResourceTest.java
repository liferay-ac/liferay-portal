/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.headless.cms.resource.v1_0.test;

import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.batch.engine.unit.BatchEngineUnitProcessor;
import com.liferay.batch.engine.unit.BatchEngineUnitReader;
import com.liferay.depot.model.DepotEntry;
import com.liferay.depot.service.DepotEntryLocalService;
import com.liferay.headless.cms.client.dto.v1_0.BulkActionPreviewItem;
import com.liferay.headless.cms.client.pagination.Page;
import com.liferay.headless.cms.client.pagination.Pagination;
import com.liferay.layout.service.LayoutClassedModelUsageLocalService;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectEntry;
import com.liferay.object.model.ObjectEntryFolder;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectEntryFolderLocalService;
import com.liferay.object.service.ObjectEntryLocalService;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.model.GroupConstants;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceContextThreadLocal;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.test.util.ServiceContextTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.odata.entity.EntityField;
import com.liferay.portal.test.rule.FeatureFlag;
import com.liferay.portal.test.rule.FeatureFlags;
import com.liferay.portal.test.rule.Inject;

import java.io.File;
import java.io.Serializable;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;

/**
 * @author Thiago Buarque
 */
@FeatureFlags(
	featureFlags = {
		@FeatureFlag("LPD-17564"), @FeatureFlag("LPD-21926"),
		@FeatureFlag("LPD-31149"), @FeatureFlag("LPD-34594"),
		@FeatureFlag("LPS-179669")
	}
)
@RunWith(Arquillian.class)
public class BulkActionPreviewItemResourceTest
	extends BaseBulkActionPreviewItemResourceTestCase {

	@Override
	@Test
	public void testGetBulkActionDeletePreviewPage() throws Exception {
		_setUpCMSContext();

		ObjectEntry objectEntry = _objectEntryLocalService.addObjectEntry(
			_depotEntry.getGroupId(), _depotEntry.getUserId(),
			_objectDefinition.getObjectDefinitionId(),
			_objectEntryFolder.getObjectEntryFolderId(), _LANGUAGE_ID,
			HashMapBuilder.<String, Serializable>put(
				"title_i18n",
				HashMapBuilder.<String, Serializable>put(
					"en_US", "objectEntry"
				).build()
			).build(),
			_serviceContext);

		_layoutClassedModelUsageLocalService.addLayoutClassedModelUsage(
			testGroup.getGroupId(), StringPool.BLANK,
			_portal.getClassNameId(_objectDefinition.getClassName()),
			objectEntry.getObjectEntryId(), RandomTestUtil.randomString(),
			RandomTestUtil.randomInt(), RandomTestUtil.randomInt(),
			_serviceContext);

		ObjectEntryFolder objectEntryFolder =
			_objectEntryFolderLocalService.addObjectEntryFolder(
				null, _depotEntry.getGroupId(), _depotEntry.getUserId(),
				_objectEntryFolder.getObjectEntryFolderId(), null,
				HashMapBuilder.put(
					LocaleUtil.US, "objectEntryFolder"
				).build(),
				"objectEntryFolder", _serviceContext);

		Page<BulkActionPreviewItem> page =
			bulkActionPreviewItemResource.getBulkActionDeletePreviewPage(
				StringBundler.concat(
					objectEntry.getObjectEntryId(), StringPool.COMMA,
					objectEntryFolder.getObjectEntryFolderId()),
				null, false, null, Pagination.of(1, 2), "name:desc");

		Assert.assertEquals(2, page.getTotalCount());

		List<BulkActionPreviewItem> items = ListUtil.fromCollection(
			page.getItems());

		Assert.assertEquals(items.toString(), 2, items.size());

		_assertBulkActionPreviewItem(
			items.get(0), objectEntryFolder.getObjectEntryFolderId(), null,
			objectEntryFolder.getName(), "FOLDER", null);

		_assertBulkActionPreviewItem(
			items.get(1), objectEntry.getObjectEntryId(), "basic-web-content",
			objectEntry.getTitleValue(_LANGUAGE_ID), "ASSET", "1");

		page = bulkActionPreviewItemResource.getBulkActionDeletePreviewPage(
			null, objectEntryFolder.getName(), true,
			"folderId eq " + _objectEntryFolder.getObjectEntryFolderId(),
			Pagination.of(1, 2), null);

		items = ListUtil.fromCollection(page.getItems());

		Assert.assertEquals(items.toString(), 1, items.size());
		Assert.assertEquals(items.toString(), 1, page.getTotalCount());

		_assertBulkActionPreviewItem(
			items.get(0), objectEntryFolder.getObjectEntryFolderId(), null,
			objectEntryFolder.getName(), "FOLDER", null);
	}

	@Override
	@Test
	public void testGetBulkActionDeletePreviewPageWithPagination()
		throws Exception {

		_setUpCMSContext();

		BulkActionPreviewItem bulkActionPreviewItem1 =
			testGetBulkActionDeletePreviewPage_addBulkActionPreviewItem(
				randomBulkActionPreviewItem());

		BulkActionPreviewItem bulkActionPreviewItem2 =
			testGetBulkActionDeletePreviewPage_addBulkActionPreviewItem(
				randomBulkActionPreviewItem());

		BulkActionPreviewItem bulkActionPreviewItem3 =
			testGetBulkActionDeletePreviewPage_addBulkActionPreviewItem(
				randomBulkActionPreviewItem());

		String assetIds = StringBundler.concat(
			bulkActionPreviewItem1.getClassPK(), StringPool.COMMA,
			bulkActionPreviewItem2.getClassPK(), StringPool.COMMA,
			bulkActionPreviewItem3.getClassPK());

		Page<BulkActionPreviewItem> page1 =
			bulkActionPreviewItemResource.getBulkActionDeletePreviewPage(
				assetIds, null, false, null, Pagination.of(1, 2), null);

		List<BulkActionPreviewItem> bulkActionPreviewItems1 =
			(List<BulkActionPreviewItem>)page1.getItems();

		Assert.assertEquals(
			bulkActionPreviewItems1.toString(), 2,
			bulkActionPreviewItems1.size());

		Page<BulkActionPreviewItem> page2 =
			bulkActionPreviewItemResource.getBulkActionDeletePreviewPage(
				assetIds, null, false, null, Pagination.of(2, 2), null);

		Assert.assertEquals(3, page2.getTotalCount());

		List<BulkActionPreviewItem> bulkActionPreviewItems2 =
			(List<BulkActionPreviewItem>)page2.getItems();

		Assert.assertEquals(
			bulkActionPreviewItems2.toString(), 1,
			bulkActionPreviewItems2.size());

		Page<BulkActionPreviewItem> page3 =
			bulkActionPreviewItemResource.getBulkActionDeletePreviewPage(
				assetIds, null, false, null, Pagination.of(1, 3), null);

		assertContains(
			bulkActionPreviewItem1,
			(List<BulkActionPreviewItem>)page3.getItems());
		assertContains(
			bulkActionPreviewItem2,
			(List<BulkActionPreviewItem>)page3.getItems());
		assertContains(
			bulkActionPreviewItem3,
			(List<BulkActionPreviewItem>)page3.getItems());
	}

	@Override
	protected String[] getAdditionalAssertFieldNames() {
		return new String[] {
			"attributes", "className", "classPK", "externalReferenceCode",
			"name"
		};
	}

	@Override
	protected Collection<EntityField> getEntityFields() {
		return Collections.emptyList();
	}

	@Override
	protected BulkActionPreviewItem randomBulkActionPreviewItem()
		throws Exception {

		return new BulkActionPreviewItem() {
			{
				attributes = new HashMap<>();
				className = StringUtil.toLowerCase(
					RandomTestUtil.randomString());
				classPK = RandomTestUtil.randomLong();
				externalReferenceCode = StringUtil.toLowerCase(
					RandomTestUtil.randomString());
				name = StringUtil.toLowerCase(RandomTestUtil.randomString());
			}
		};
	}

	@Override
	protected BulkActionPreviewItem
			testGetBulkActionDeletePreviewPage_addBulkActionPreviewItem(
				BulkActionPreviewItem bulkActionPreviewItem)
		throws Exception {

		ObjectEntry objectEntry = _objectEntryLocalService.addObjectEntry(
			_depotEntry.getGroupId(), _depotEntry.getUserId(),
			_objectDefinition.getObjectDefinitionId(),
			_objectEntryFolder.getObjectEntryFolderId(), _LANGUAGE_ID,
			HashMapBuilder.<String, Serializable>put(
				"title_i18n",
				HashMapBuilder.<String, Serializable>put(
					"en_US", RandomTestUtil.randomString()
				).build()
			).build(),
			_serviceContext);

		_layoutClassedModelUsageLocalService.addLayoutClassedModelUsage(
			testGroup.getGroupId(), StringPool.BLANK,
			_portal.getClassNameId(_objectDefinition.getClassName()),
			objectEntry.getObjectEntryId(), RandomTestUtil.randomString(),
			RandomTestUtil.randomInt(), RandomTestUtil.randomInt(),
			_serviceContext);

		bulkActionPreviewItem.setAttributes(
			HashMapBuilder.<String, Object>put(
				"deletionType", "PERMANENT_DELETION"
			).put(
				"mimeType", "basic-web-content"
			).put(
				"type", "ASSET"
			).put(
				"usages", "1"
			).build());
		bulkActionPreviewItem.setExternalReferenceCode(
			objectEntry::getExternalReferenceCode);
		bulkActionPreviewItem.setClassName(_objectDefinition::getClassName);
		bulkActionPreviewItem.setClassPK(objectEntry::getObjectEntryId);
		bulkActionPreviewItem.setName(
			() -> objectEntry.getTitleValue(_LANGUAGE_ID));

		return bulkActionPreviewItem;
	}

	private void _assertBulkActionPreviewItem(
		BulkActionPreviewItem bulkActionPreviewItem, long expectedClassPK,
		String expectedMimeType, String expectedName, String expectedType,
		String usages) {

		Map<String, Object> attributes = bulkActionPreviewItem.getAttributes();

		Assert.assertEquals(
			"PERMANENT_DELETION", attributes.get("deletionType"));

		if (Validator.isNotNull(expectedMimeType)) {
			Assert.assertEquals(expectedMimeType, attributes.get("mimeType"));
		}

		if (usages != null) {
			Assert.assertEquals(
				usages, GetterUtil.getString(attributes.get("usages")));
		}

		Assert.assertEquals(expectedType, attributes.get("type"));

		Assert.assertEquals(
			expectedClassPK, (long)bulkActionPreviewItem.getClassPK());

		Assert.assertEquals(expectedName, bulkActionPreviewItem.getName());
	}

	private void _deleteFile(Bundle bundle, String fileName) {
		File file = bundle.getDataFile(
			".com.liferay.site.initializer.cms.internal.batch." + fileName +
				".batch.engine.data.json.0.processed");

		if ((file != null) && file.exists()) {
			file.delete();
		}
	}

	private void _setUpCMSContext() throws Exception {
		Bundle testBundle = FrameworkUtil.getBundle(
			BulkActionPreviewItemResourceTest.class);

		BundleContext bundleContext = testBundle.getBundleContext();

		for (Bundle bundle : bundleContext.getBundles()) {
			if (Objects.equals(
					bundle.getSymbolicName(),
					"com.liferay.site.initializer.cms")) {

				_deleteFile(bundle, "01.object.folder");
				_deleteFile(bundle, "02.object.definition");

				CompletableFuture<Void> completableFuture =
					_batchEngineUnitProcessor.processBatchEngineUnits(
						_batchEngineUnitReader.getBatchEngineUnits(bundle));

				completableFuture.join();

				break;
			}
		}

		testGroup.setType(GroupConstants.TYPE_DEPOT);

		testGroup = _groupLocalService.updateGroup(testGroup);

		_serviceContext = ServiceContextTestUtil.getServiceContext(
			testGroup.getGroupId(), TestPropsValues.getUserId());

		_serviceContext.setAttribute(
			"friendlyUrlMap", new HashMap<String, String>());
		_serviceContext.setAttribute("staging", Boolean.TRUE);

		ServiceContextThreadLocal.pushServiceContext(_serviceContext);

		_depotEntry = _depotEntryLocalService.addDepotEntry(
			testGroup, _serviceContext);

		_objectDefinition =
			_objectDefinitionLocalService.
				getObjectDefinitionByExternalReferenceCode(
					"L_BASIC_WEB_CONTENT", testCompany.getCompanyId());

		ObjectEntryFolder objectEntryFolder =
			_objectEntryFolderLocalService.
				getObjectEntryFolderByExternalReferenceCode(
					"L_CONTENTS", testGroup.getGroupId(),
					testCompany.getCompanyId());

		_objectEntryFolder =
			_objectEntryFolderLocalService.addObjectEntryFolder(
				null, _depotEntry.getGroupId(), _depotEntry.getUserId(),
				objectEntryFolder.getObjectEntryFolderId(), null,
				HashMapBuilder.put(
					LocaleUtil.US, RandomTestUtil.randomString()
				).build(),
				RandomTestUtil.randomString(), _serviceContext);
	}

	private static final String _LANGUAGE_ID = "en_US";

	@Inject
	private BatchEngineUnitProcessor _batchEngineUnitProcessor;

	@Inject
	private BatchEngineUnitReader _batchEngineUnitReader;

	private DepotEntry _depotEntry;

	@Inject
	private DepotEntryLocalService _depotEntryLocalService;

	@Inject
	private GroupLocalService _groupLocalService;

	@Inject
	private LayoutClassedModelUsageLocalService
		_layoutClassedModelUsageLocalService;

	private ObjectDefinition _objectDefinition;

	@Inject
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	private ObjectEntryFolder _objectEntryFolder;

	@Inject
	private ObjectEntryFolderLocalService _objectEntryFolderLocalService;

	@Inject
	private ObjectEntryLocalService _objectEntryLocalService;

	@Inject
	private Portal _portal;

	private ServiceContext _serviceContext;

}