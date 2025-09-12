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
import com.liferay.headless.cms.client.dto.v1_0.BulkAction;
import com.liferay.headless.cms.client.dto.v1_0.BulkActionItem;
import com.liferay.headless.cms.client.dto.v1_0.BulkActionPreviewItem;
import com.liferay.headless.cms.client.dto.v1_0.DeleteBulkAction;
import com.liferay.headless.cms.client.pagination.Page;
import com.liferay.headless.cms.client.pagination.Pagination;
import com.liferay.layout.service.LayoutClassedModelUsageLocalService;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectEntry;
import com.liferay.object.model.ObjectEntryFolder;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectEntryFolderLocalService;
import com.liferay.object.service.ObjectEntryLocalService;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.model.GroupConstants;
import com.liferay.portal.kernel.search.IndexWriterHelper;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceContextThreadLocal;
import com.liferay.portal.kernel.test.rule.DeleteAfterTestRun;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.test.util.ServiceContextTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.test.rule.FeatureFlag;
import com.liferay.portal.test.rule.FeatureFlags;
import com.liferay.portal.test.rule.Inject;

import java.io.File;
import java.io.Serializable;

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

	@Test
	public void testPostBulkActionPreviewPage() throws Exception {
		_setUpCMSContext();

		_serviceContext.setAttribute(
			"friendlyUrlMap", new HashMap<String, String>());

		ObjectEntryFolder objectEntryFolder1 =
			_objectEntryFolderLocalService.addObjectEntryFolder(
				null, _depotEntry.getGroupId(), _depotEntry.getUserId(),
				_contentObjectEntryFolder.getObjectEntryFolderId(), null,
				HashMapBuilder.put(
					LocaleUtil.US, RandomTestUtil.randomString()
				).build(),
				RandomTestUtil.randomString(), _serviceContext);

		String objectEntryFolderName = "objectEntryFolder1";

		ObjectEntryFolder objectEntryFolder2 =
			_objectEntryFolderLocalService.addObjectEntryFolder(
				null, _depotEntry.getGroupId(), _depotEntry.getUserId(),
				objectEntryFolder1.getObjectEntryFolderId(), null,
				HashMapBuilder.put(
					LocaleUtil.US, RandomTestUtil.randomString()
				).build(),
				objectEntryFolderName, _serviceContext);

		String objectEntryName = "objectEntry";

		ObjectEntry objectEntry = _objectEntryLocalService.addObjectEntry(
			_depotEntry.getGroupId(), _depotEntry.getUserId(),
			_objectDefinition.getObjectDefinitionId(),
			objectEntryFolder1.getObjectEntryFolderId(), _LANGUAGE_ID,
			HashMapBuilder.<String, Serializable>put(
				"title_i18n",
				HashMapBuilder.<String, Serializable>put(
					"en_US", objectEntryName
				).build()
			).build(),
			_serviceContext);

		_layoutClassedModelUsageLocalService.addLayoutClassedModelUsage(
			testGroup.getGroupId(), StringPool.BLANK,
			_portal.getClassNameId(_objectDefinition.getClassName()),
			objectEntry.getObjectEntryId(), RandomTestUtil.randomString(),
			RandomTestUtil.randomInt(), RandomTestUtil.randomInt(),
			_serviceContext);

		BulkAction bulkAction = new DeleteBulkAction();

		bulkAction.setType(BulkAction.Type.DELETE_BULK_ACTION);
		bulkAction.setSelectAll(false);

		BulkActionItem bulkActionItem = new BulkActionItem();

		bulkActionItem.setClassName(_objectDefinition.getClassName());
		bulkActionItem.setClassPK(objectEntry.getObjectEntryId());
		bulkActionItem.setName(objectEntryName);

		bulkAction.setBulkActionItems(new BulkActionItem[] {bulkActionItem});

		Page<BulkActionPreviewItem> assetDeletionOverviewsPage =
			bulkActionPreviewItemResource.postBulkActionPreviewPage(
				null, null, Pagination.of(1, 1), "name:asc", bulkAction);

		List<BulkActionPreviewItem> items = ListUtil.fromCollection(
			assetDeletionOverviewsPage.getItems());

		Assert.assertEquals(items.toString(), 1, items.size());
		Assert.assertEquals(
			items.toString(), 1, assetDeletionOverviewsPage.getTotalCount());

		_assertBulkActionPreviewItem(
			items.get(0), objectEntry.getObjectEntryId(), "basic-web-content",
			objectEntryName, "ASSET", 1L);

		bulkAction.setBulkActionItems(() -> null);
		bulkAction.setSelectAll(true);

		assetDeletionOverviewsPage =
			bulkActionPreviewItemResource.postBulkActionPreviewPage(
				objectEntryFolderName,
				"folderId eq " + objectEntryFolder1.getObjectEntryFolderId(),
				Pagination.of(1, 1), null, bulkAction);

		items = ListUtil.fromCollection(assetDeletionOverviewsPage.getItems());

		Assert.assertEquals(items.toString(), 1, items.size());
		Assert.assertEquals(
			items.toString(), 1, assetDeletionOverviewsPage.getTotalCount());

		_assertBulkActionPreviewItem(
			items.get(0), objectEntryFolder2.getObjectEntryFolderId(), null,
			objectEntryFolderName, "FOLDER", null);
	}

	private void _assertBulkActionPreviewItem(
		BulkActionPreviewItem bulkActionPreviewItem, long expectedClassPK,
		String expectedMimeType, String expectedName, String expectedType,
		Long usages) {

		Assert.assertEquals(expectedName, bulkActionPreviewItem.getName());

		Assert.assertEquals(
			expectedClassPK, (long)bulkActionPreviewItem.getClassPK());

		Map<String, Object> attributes = bulkActionPreviewItem.getAttributes();

		Assert.assertEquals(
			"PERMANENT_DELETION", attributes.get("deletionType"));

		if (Validator.isNotNull(expectedMimeType)) {
			Assert.assertEquals(expectedMimeType, attributes.get("mimeType"));
		}

		if (usages != null) {
			Assert.assertEquals(
				(long)usages, GetterUtil.getLong(attributes.get("usages")));
		}

		Assert.assertEquals(expectedType, attributes.get("type"));
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

		_serviceContext.setAttribute("staging", Boolean.TRUE);

		ServiceContextThreadLocal.pushServiceContext(_serviceContext);

		_depotEntry = _depotEntryLocalService.addDepotEntry(
			testGroup, _serviceContext);

		_objectDefinition =
			_objectDefinitionLocalService.
				getObjectDefinitionByExternalReferenceCode(
					"L_BASIC_WEB_CONTENT", testCompany.getCompanyId());

		_contentObjectEntryFolder =
			_objectEntryFolderLocalService.
				getObjectEntryFolderByExternalReferenceCode(
					"L_CONTENTS", testGroup.getGroupId(),
					testCompany.getCompanyId());
	}

	private static final String _LANGUAGE_ID = "en_US";

	@Inject
	private static GroupLocalService _groupLocalService;

	@Inject
	private BatchEngineUnitProcessor _batchEngineUnitProcessor;

	@Inject
	private BatchEngineUnitReader _batchEngineUnitReader;

	private ObjectEntryFolder _contentObjectEntryFolder;

	@DeleteAfterTestRun
	private DepotEntry _depotEntry;

	@Inject
	private DepotEntryLocalService _depotEntryLocalService;

	@Inject
	private IndexWriterHelper _indexWriterHelper;

	@Inject
	private LayoutClassedModelUsageLocalService
		_layoutClassedModelUsageLocalService;

	private ObjectDefinition _objectDefinition;

	@Inject
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@Inject
	private ObjectEntryFolderLocalService _objectEntryFolderLocalService;

	@Inject
	private ObjectEntryLocalService _objectEntryLocalService;

	@Inject
	private Portal _portal;

	private ServiceContext _serviceContext;

}