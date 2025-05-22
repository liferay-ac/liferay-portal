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
import com.liferay.portal.kernel.test.util.GroupTestUtil;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.test.util.ServiceContextTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.test.rule.FeatureFlag;
import com.liferay.portal.test.rule.FeatureFlags;
import com.liferay.portal.test.rule.Inject;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;

import java.util.Collections;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
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

	@ClassRule
	@Rule
	public static final LiferayIntegrationTestRule liferayIntegrationTestRule =
		new LiferayIntegrationTestRule();

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
			ServiceContextTestUtil.getServiceContext());
	}

	@After
	@Override
	public void tearDown() throws Exception {
		GroupTestUtil.deleteGroup(testGroup);
	}

	@Test
	public void testGetOverviewContent() throws Exception {
		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.
				getObjectDefinitionByExternalReferenceCode(
					"L_BASIC_WEB_CONTENT", testCompany.getCompanyId());

		_objectEntry = ObjectEntryTestUtil.addObjectEntry(
			_depotEntry.getGroupId(), objectDefinition, Collections.emptyMap());

		Integer rangeKey = 7;

		Overview overviewContent = overviewResource.getContentOverview(
			"en_US", rangeKey, null);

		Trend trend = new Trend();

		trend.setClassification(Trend.Classification.POSITIVE);
		trend.setPercentage(100.0);

		long categoriesCount = 0;
		long tagsCount = 0;
		long totalCount = 1;
		long vocabularyCount = 0;

		Overview expectedResult = new Overview();

		expectedResult.setCategoriesCount(categoriesCount);
		expectedResult.setTagsCount(tagsCount);
		expectedResult.setTotalCount(totalCount);
		expectedResult.setVocabulariesCount(vocabularyCount);
		expectedResult.setTrend(trend);

		Assert.assertEquals(expectedResult, overviewContent);
	}

	@Test
	public void testGetOverviewContentWithAssetCategory() throws Exception {
		_assetVocabulary = _assetVocabularyLocalService.addVocabulary(
			TestPropsValues.getUserId(), _depotEntry.getGroupId(), "novo",
			_serviceContext);

		String assetCategoryTitle = "Titulo";

		_assetCategory = _assetCategoryLocalService.addCategory(
			TestPropsValues.getUserId(), _depotEntry.getGroupId(),
			assetCategoryTitle, _assetVocabulary.getVocabularyId(),
			_serviceContext);

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

		Integer rangeKey = 7;

		Overview overviewContent = overviewResource.getContentOverview(
			"en_US", rangeKey, null);

		Trend trend = new Trend();

		trend.setClassification(Trend.Classification.POSITIVE);
		trend.setPercentage(100.0);

		long categoriesCount = 1;
		long tagsCount = 0;
		long totalCount = 1;
		long vocabularyCount = 1;

		Overview expectedResult = new Overview();

		expectedResult.setCategoriesCount(categoriesCount);
		expectedResult.setTagsCount(tagsCount);
		expectedResult.setTotalCount(totalCount);
		expectedResult.setVocabulariesCount(vocabularyCount);
		expectedResult.setTrend(trend);

		Assert.assertEquals(expectedResult, overviewContent);
	}

	@Test
	public void testGetOverviewContentWithAssetTag() throws Exception {
		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.
				getObjectDefinitionByExternalReferenceCode(
					"L_BASIC_WEB_CONTENT", testCompany.getCompanyId());

		_objectEntry = ObjectEntryTestUtil.addObjectEntry(
			_depotEntry.getGroupId(), objectDefinition, Collections.emptyMap(),
			RandomTestUtil.randomString());

		Integer rangeKey = 7;

		Overview overviewContent = overviewResource.getContentOverview(
			"en_US", rangeKey, null);

		Trend trend = new Trend();

		trend.setClassification(Trend.Classification.POSITIVE);
		trend.setPercentage(100.0);

		long categoriesCount = 0;
		long tagsCount = 1;
		long totalCount = 1;
		long vocabularyCount = 0;

		Overview expectedResult = new Overview();

		expectedResult.setCategoriesCount(categoriesCount);
		expectedResult.setTagsCount(tagsCount);
		expectedResult.setTotalCount(totalCount);
		expectedResult.setTrend(trend);
		expectedResult.setVocabulariesCount(vocabularyCount);

		Assert.assertEquals(expectedResult, overviewContent);
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