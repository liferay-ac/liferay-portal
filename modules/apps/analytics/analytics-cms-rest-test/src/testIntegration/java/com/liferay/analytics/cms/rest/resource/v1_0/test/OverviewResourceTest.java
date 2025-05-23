/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.analytics.cms.rest.resource.v1_0.test;

import com.liferay.analytics.cms.rest.client.dto.v1_0.Overview;
import com.liferay.analytics.cms.rest.client.dto.v1_0.Trend;
import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.asset.entry.rel.model.AssetEntryAssetCategoryRel;
import com.liferay.asset.entry.rel.service.AssetEntryAssetCategoryRelLocalService;
import com.liferay.asset.kernel.model.AssetCategory;
import com.liferay.asset.kernel.model.AssetEntry;
import com.liferay.asset.kernel.model.AssetVocabulary;
import com.liferay.asset.kernel.service.AssetCategoryLocalService;
import com.liferay.asset.kernel.service.AssetEntryLocalService;
import com.liferay.asset.kernel.service.AssetVocabularyLocalService;
import com.liferay.depot.model.DepotEntry;
import com.liferay.depot.service.DepotEntryLocalService;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectEntry;
import com.liferay.object.rest.test.util.ObjectEntryTestUtil;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.test.rule.DeleteAfterTestRun;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.test.util.ServiceContextTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.test.rule.FeatureFlag;
import com.liferay.portal.test.rule.FeatureFlags;
import com.liferay.portal.test.rule.Inject;

import java.util.Collections;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author Rachael Koestartyo
 */
@FeatureFlags(
	featureFlags = {
		@FeatureFlag(value = "LPD-31149"), @FeatureFlag(value = "LPD-34594"),
		@FeatureFlag(value = "LPS-179669"), @FeatureFlag(value = "LPD-17564"),
		@FeatureFlag(value = "LPD-21926"), @FeatureFlag(value = "LPD-11232")
	}
)
@RunWith(Arquillian.class)
public class OverviewResourceTest extends BaseOverviewResourceTestCase {

	@Before
	@Override
	public void setUp() throws Exception {
		super.setUp();

		_serviceContext = ServiceContextTestUtil.getServiceContext(
			testGroup.getGroupId(), TestPropsValues.getUserId());

		_depotEntry = _depotEntryLocalService.addDepotEntry(
			HashMapBuilder.put(
				LocaleUtil.getDefault(), RandomTestUtil.randomString()
			).build(),
			HashMapBuilder.put(
				LocaleUtil.getDefault(), RandomTestUtil.randomString()
			).build(),
			_serviceContext);
	}

	@Override
	@Test
	public void testGetContentOverview() throws Exception {
		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.
				getObjectDefinitionByExternalReferenceCode(
					"L_BASIC_WEB_CONTENT", testCompany.getCompanyId());

		_objectEntry = ObjectEntryTestUtil.addObjectEntry(
			_depotEntry.getGroupId(), objectDefinition, Collections.emptyMap());

		Overview contentOverview = overviewResource.getContentOverview(
			"en_US", 7, null);

		Trend trend = new Trend();

		trend.setClassification(Trend.Classification.POSITIVE);
		trend.setPercentage(100.0);

		Overview expectedContentOverview = new Overview();

		expectedContentOverview.setCategoriesCount(0L);
		expectedContentOverview.setTagsCount(0L);
		expectedContentOverview.setTotalCount(1L);
		expectedContentOverview.setVocabulariesCount(0L);
		expectedContentOverview.setTrend(trend);

		Assert.assertEquals(expectedContentOverview, contentOverview);
	}

	@Test
	public void testGetContentOverviewWithAssetCategory() throws Exception {
		_assetVocabulary = _assetVocabularyLocalService.addVocabulary(
			TestPropsValues.getUserId(), _depotEntry.getGroupId(), "novo",
			_serviceContext);

		_assetCategory = _assetCategoryLocalService.addCategory(
			TestPropsValues.getUserId(), _depotEntry.getGroupId(), "Titulo",
			_assetVocabulary.getVocabularyId(), _serviceContext);

		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.
				getObjectDefinitionByExternalReferenceCode(
					"L_BASIC_WEB_CONTENT", testCompany.getCompanyId());

		_objectEntry = ObjectEntryTestUtil.addObjectEntry(
			_depotEntry.getGroupId(), objectDefinition, Collections.emptyMap());

		AssetEntry assetEntry = _assetEntryLocalService.getEntry(
			objectDefinition.getClassName(), _objectEntry.getObjectEntryId());

		_assetEntryAssetCategoryRel =
			_assetEntryAssetCategoryRelLocalService.
				addAssetEntryAssetCategoryRel(
					assetEntry.getEntryId(), _assetCategory.getCategoryId());

		Overview contentOverview = overviewResource.getContentOverview(
			"en_US", 7, null);

		Trend trend = new Trend();

		trend.setClassification(Trend.Classification.POSITIVE);
		trend.setPercentage(100.0);

		Overview expectedContentOverview = new Overview();

		expectedContentOverview.setCategoriesCount(1L);
		expectedContentOverview.setTagsCount(0L);
		expectedContentOverview.setTotalCount(1L);
		expectedContentOverview.setVocabulariesCount(1L);
		expectedContentOverview.setTrend(trend);

		Assert.assertEquals(expectedContentOverview, contentOverview);
	}

	@Test
	public void testGetContentOverviewWithAssetTag() throws Exception {
		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.
				getObjectDefinitionByExternalReferenceCode(
					"L_BASIC_WEB_CONTENT", testCompany.getCompanyId());

		_objectEntry = ObjectEntryTestUtil.addObjectEntry(
			_depotEntry.getGroupId(), objectDefinition, Collections.emptyMap(),
			RandomTestUtil.randomString());

		Overview contentOverview = overviewResource.getContentOverview(
			"en_US", 7, null);

		Trend trend = new Trend();

		trend.setClassification(Trend.Classification.POSITIVE);
		trend.setPercentage(100.0);

		Overview expectedContentOverview = new Overview();

		expectedContentOverview.setCategoriesCount(0L);
		expectedContentOverview.setTagsCount(1L);
		expectedContentOverview.setTotalCount(1L);
		expectedContentOverview.setTrend(trend);
		expectedContentOverview.setVocabulariesCount(0L);

		Assert.assertEquals(expectedContentOverview, contentOverview);
	}

	@DeleteAfterTestRun
	private AssetCategory _assetCategory;

	@Inject
	private AssetCategoryLocalService _assetCategoryLocalService;

	@DeleteAfterTestRun
	private AssetEntryAssetCategoryRel _assetEntryAssetCategoryRel;

	@Inject
	private AssetEntryAssetCategoryRelLocalService
		_assetEntryAssetCategoryRelLocalService;

	@Inject
	private AssetEntryLocalService _assetEntryLocalService;

	@DeleteAfterTestRun
	private AssetVocabulary _assetVocabulary;

	@Inject
	private AssetVocabularyLocalService _assetVocabularyLocalService;

	@DeleteAfterTestRun
	private DepotEntry _depotEntry;

	@Inject
	private DepotEntryLocalService _depotEntryLocalService;

	@Inject
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@DeleteAfterTestRun
	private ObjectEntry _objectEntry;

	private ServiceContext _serviceContext;

}