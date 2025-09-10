/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.analytics.cms.rest.resource.v1_0.test;

import com.liferay.analytics.cms.rest.client.dto.v1_0.AssetDeletionUsage;
import com.liferay.analytics.cms.rest.client.pagination.Page;
import com.liferay.analytics.cms.rest.client.pagination.Pagination;
import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.batch.engine.unit.BatchEngineUnitProcessor;
import com.liferay.batch.engine.unit.BatchEngineUnitReader;
import com.liferay.depot.model.DepotEntry;
import com.liferay.depot.service.DepotEntryLocalService;
import com.liferay.layout.page.template.constants.LayoutPageTemplateEntryTypeConstants;
import com.liferay.layout.page.template.model.LayoutPageTemplateEntry;
import com.liferay.layout.page.template.service.LayoutPageTemplateEntryLocalService;
import com.liferay.layout.service.LayoutClassedModelUsageLocalService;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectEntry;
import com.liferay.object.model.ObjectEntryFolder;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectEntryFolderLocalService;
import com.liferay.object.service.ObjectEntryLocalService;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.GroupConstants;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceContextThreadLocal;
import com.liferay.portal.kernel.test.rule.AggregateTestRule;
import com.liferay.portal.kernel.test.rule.DeleteAfterTestRun;
import com.liferay.portal.kernel.test.util.GroupTestUtil;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.test.util.ServiceContextTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.workflow.WorkflowConstants;
import com.liferay.portal.test.rule.Inject;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;
import com.liferay.portal.test.rule.PermissionCheckerMethodTestRule;

import java.io.File;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;

import org.junit.Assert;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;

/**
 * @author Thiago Buarque
 */
@RunWith(Arquillian.class)
public class AssetDeletionUsageResourceTest
	extends BaseAssetDeletionUsageResourceTestCase {

	@ClassRule
	@Rule
	public static final AggregateTestRule aggregateTestRule =
		new AggregateTestRule(
			new LiferayIntegrationTestRule(),
			PermissionCheckerMethodTestRule.INSTANCE);

	@Override
	@Test
	public void testGetAssetDeletionUsagesAssetPage() throws Exception {
		_setUpCMSContext();

		long assetId = testGetAssetDeletionUsagesAssetPage_getAssetId();

		AssetDeletionUsage assetDeletionUsage1 = _addAssetDeletionUsage(
			randomAssetDeletionUsage(), assetId,
			LayoutPageTemplateEntryTypeConstants.DISPLAY_PAGE);

		AssetDeletionUsage assetDeletionUsage2 = _addAssetDeletionUsage(
			randomAssetDeletionUsage(), assetId,
			LayoutPageTemplateEntryTypeConstants.MASTER_LAYOUT);

		Page<AssetDeletionUsage> assetDeletionUsagesPage =
			assetDeletionUsageResource.getAssetDeletionUsagesAssetPage(
				assetId, null, _LANGUAGE_ID, Pagination.of(1, 10), null);

		List<AssetDeletionUsage> items = ListUtil.fromCollection(
			assetDeletionUsagesPage.getItems());

		Assert.assertEquals(items.toString(), 2, items.size());

		String name = assetDeletionUsage1.getName();

		if (name.compareTo(assetDeletionUsage2.getName()) < 0) {
			equals(assetDeletionUsage1, items.get(0));
			equals(assetDeletionUsage2, items.get(1));
		}
		else {
			equals(assetDeletionUsage1, items.get(1));
			equals(assetDeletionUsage2, items.get(0));
		}

		assetDeletionUsagesPage =
			assetDeletionUsageResource.getAssetDeletionUsagesAssetPage(
				assetId, null, _LANGUAGE_ID, Pagination.of(1, 10), "name:desc");

		items = ListUtil.fromCollection(assetDeletionUsagesPage.getItems());

		Assert.assertEquals(items.toString(), 2, items.size());

		if (name.compareTo(assetDeletionUsage2.getName()) < 0) {
			Assert.assertTrue(equals(assetDeletionUsage1, items.get(1)));
			Assert.assertTrue(equals(assetDeletionUsage2, items.get(0)));
		}
		else {
			Assert.assertTrue(equals(assetDeletionUsage1, items.get(0)));
			Assert.assertTrue(equals(assetDeletionUsage2, items.get(1)));
		}
	}

	@Override
	@Test
	public void testGetAssetDeletionUsagesAssetPageWithPagination()
		throws Exception {

		_setUpCMSContext();

		Long assetId = testGetAssetDeletionUsagesAssetPage_getAssetId();

		AssetDeletionUsage assetDeletionUsage1 =
			testGetAssetDeletionUsagesAssetPage_addAssetDeletionUsage(
				assetId, randomAssetDeletionUsage());

		AssetDeletionUsage assetDeletionUsage2 =
			testGetAssetDeletionUsagesAssetPage_addAssetDeletionUsage(
				assetId, randomAssetDeletionUsage());

		AssetDeletionUsage assetDeletionUsage3 =
			testGetAssetDeletionUsagesAssetPage_addAssetDeletionUsage(
				assetId, randomAssetDeletionUsage());

		Page<AssetDeletionUsage> page1 =
			assetDeletionUsageResource.getAssetDeletionUsagesAssetPage(
				assetId, null, _LANGUAGE_ID, Pagination.of(1, 2), null);

		List<AssetDeletionUsage> assetDeletionUsages1 =
			(List<AssetDeletionUsage>)page1.getItems();

		Assert.assertEquals(
			assetDeletionUsages1.toString(), 2, assetDeletionUsages1.size());

		Page<AssetDeletionUsage> page2 =
			assetDeletionUsageResource.getAssetDeletionUsagesAssetPage(
				assetId, null, _LANGUAGE_ID, Pagination.of(2, 2), null);

		Assert.assertEquals(3, page2.getTotalCount());

		List<AssetDeletionUsage> assetDeletionUsages2 =
			(List<AssetDeletionUsage>)page2.getItems();

		Assert.assertEquals(
			assetDeletionUsages2.toString(), 1, assetDeletionUsages2.size());

		Page<AssetDeletionUsage> page3 =
			assetDeletionUsageResource.getAssetDeletionUsagesAssetPage(
				assetId, null, _LANGUAGE_ID, Pagination.of(1, 3), null);

		assertContains(
			assetDeletionUsage1, (List<AssetDeletionUsage>)page3.getItems());
		assertContains(
			assetDeletionUsage2, (List<AssetDeletionUsage>)page3.getItems());
		assertContains(
			assetDeletionUsage3, (List<AssetDeletionUsage>)page3.getItems());
	}

	@Override
	protected String[] getAdditionalAssertFieldNames() {
		return new String[] {"name", "type"};
	}

	@Override
	protected AssetDeletionUsage
			testGetAssetDeletionUsagesAssetPage_addAssetDeletionUsage(
				Long assetId, AssetDeletionUsage assetDeletionUsage)
		throws Exception {

		return _addAssetDeletionUsage(
			assetDeletionUsage, assetId,
			LayoutPageTemplateEntryTypeConstants.DISPLAY_PAGE);
	}

	@Override
	protected Long testGetAssetDeletionUsagesAssetPage_getAssetId()
		throws Exception {

		_serviceContext.setAttribute(
			"friendlyUrlMap", new HashMap<String, String>());

		ObjectEntryFolder objectEntryFolder =
			_objectEntryFolderLocalService.
				getObjectEntryFolderByExternalReferenceCode(
					"L_CONTENTS", _depotEntry.getGroupId(),
					testCompany.getCompanyId());

		ObjectEntry objectEntry = _objectEntryLocalService.addObjectEntry(
			_depotEntry.getGroupId(), _depotEntry.getUserId(),
			_objectDefinition.getObjectDefinitionId(),
			objectEntryFolder.getObjectEntryFolderId(), _LANGUAGE_ID,
			Collections.emptyMap(), _serviceContext);

		return objectEntry.getObjectEntryId();
	}

	private AssetDeletionUsage _addAssetDeletionUsage(
			AssetDeletionUsage assetDeletionUsage, Long assetId, int type)
		throws Exception {

		String layoutName1 = RandomTestUtil.randomString();

		_addLayoutClassedModelUsage(layoutName1, assetId, type);

		assetDeletionUsage.setName(layoutName1);

		if (type == LayoutPageTemplateEntryTypeConstants.DISPLAY_PAGE) {
			assetDeletionUsage.setType("Display Page Template");
		}
		else if (type == LayoutPageTemplateEntryTypeConstants.MASTER_LAYOUT) {
			assetDeletionUsage.setType("Page Template");
		}

		return assetDeletionUsage;
	}

	private void _addLayoutClassedModelUsage(
			String name, long objectEntryId, int type)
		throws Exception {

		LayoutPageTemplateEntry layoutPageTemplateEntry =
			_layoutPageTemplateEntryLocalService.addLayoutPageTemplateEntry(
				null, TestPropsValues.getUserId(), testGroup.getGroupId(), 0,
				null, 0, 0, name, type, 0, true, 0, 0, 0,
				WorkflowConstants.STATUS_APPROVED, _serviceContext);

		_layoutClassedModelUsageLocalService.addLayoutClassedModelUsage(
			testGroup.getGroupId(), StringPool.BLANK,
			_portal.getClassNameId(_objectDefinition.getClassName()),
			objectEntryId, RandomTestUtil.randomString(),
			RandomTestUtil.randomInt(), layoutPageTemplateEntry.getPlid(),
			_serviceContext);
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
		Bundle testBundle = FrameworkUtil.getBundle(OverviewResourceTest.class);

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

		_objectDefinition =
			_objectDefinitionLocalService.
				getObjectDefinitionByExternalReferenceCode(
					"L_BASIC_WEB_CONTENT", testCompany.getCompanyId());

		Group group = GroupTestUtil.addGroup();

		group.setType(GroupConstants.TYPE_DEPOT);

		group = _groupLocalService.updateGroup(group);

		_serviceContext = ServiceContextTestUtil.getServiceContext(
			group.getGroupId(), TestPropsValues.getUserId());

		_serviceContext.setAttribute("staging", Boolean.TRUE);

		ServiceContextThreadLocal.pushServiceContext(_serviceContext);

		_depotEntry = _depotEntryLocalService.addDepotEntry(
			group, _serviceContext);
	}

	private static final String _LANGUAGE_ID = "en_US";

	@Inject
	private BatchEngineUnitProcessor _batchEngineUnitProcessor;

	@Inject
	private BatchEngineUnitReader _batchEngineUnitReader;

	@DeleteAfterTestRun
	private DepotEntry _depotEntry;

	@Inject
	private DepotEntryLocalService _depotEntryLocalService;

	@Inject
	private GroupLocalService _groupLocalService;

	@Inject
	private LayoutClassedModelUsageLocalService
		_layoutClassedModelUsageLocalService;

	@Inject
	private LayoutPageTemplateEntryLocalService
		_layoutPageTemplateEntryLocalService;

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