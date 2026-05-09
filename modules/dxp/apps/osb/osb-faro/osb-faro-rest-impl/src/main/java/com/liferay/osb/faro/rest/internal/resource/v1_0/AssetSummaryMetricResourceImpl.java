/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.resource.v1_0;

import com.liferay.osb.faro.model.FaroProject;
import com.liferay.osb.faro.rest.dto.v1_0.AssetSummaryMetric;
import com.liferay.osb.faro.rest.internal.dto.v1_0.converter.FaroDTOConverterContext;
import com.liferay.osb.faro.rest.internal.dto.v1_0.util.FaroPaginationUtil;
import com.liferay.osb.faro.rest.internal.graphql.client.FaroGraphQLClient;
import com.liferay.osb.faro.rest.internal.graphql.dto.GetSiteAssetSummariesPageResponse;
import com.liferay.osb.faro.rest.resource.v1_0.AssetSummaryMetricResource;
import com.liferay.osb.faro.service.FaroProjectLocalService;
import com.liferay.portal.kernel.search.Sort;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.vulcan.dto.converter.DTOConverter;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;

import java.util.Collections;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author Leslie Wong
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/asset-summary-metric.properties",
	scope = ServiceScope.PROTOTYPE, service = AssetSummaryMetricResource.class
)
public class AssetSummaryMetricResourceImpl
	extends BaseAssetSummaryMetricResourceImpl {

	@Override
	public Page<AssetSummaryMetric> getSiteAssetSummariesPage(
			Long siteId, String channelId, String search, Integer rangeKey,
			String rangeStart, String rangeEnd, Pagination pagination,
			Sort[] sorts)
		throws Exception {

		FaroProject faroProject =
			_faroProjectLocalService.getFaroProjectByGroupId(siteId);

		int cur = FaroPaginationUtil.getCur(pagination);
		int delta = FaroPaginationUtil.getDelta(pagination);

		GetSiteAssetSummariesPageResponse response = _faroGraphQLClient.execute(
			faroProject, "getSiteAssetSummariesPage",
			HashMapBuilder.<String, Object>put(
				"channelId", channelId
			).put(
				"keywords", search
			).put(
				"rangeEnd", rangeEnd
			).put(
				"rangeKey", rangeKey
			).put(
				"rangeStart", rangeStart
			).put(
				"size", delta
			).put(
				"sort", FaroPaginationUtil.toGraphQLSort(sorts)
			).put(
				"start", (cur - 1) * delta
			).build(),
			GetSiteAssetSummariesPageResponse.class);

		GetSiteAssetSummariesPageResponse.AssetSummaryMetricBag bag =
			response.getAssetSummaries();

		if (bag == null) {
			return Page.of(Collections.emptyList(), pagination, 0);
		}

		Integer total = bag.getTotal();

		if (total == null) {
			total = 0;
		}

		return Page.of(
			transform(
				bag.getAssetSummaryMetrics(),
				engineMetric -> _assetSummaryMetricDTOConverter.toDTO(
					new FaroDTOConverterContext(
						contextAcceptLanguage.isAcceptAllLanguages(),
						engineMetric.getAssetId(),
						contextAcceptLanguage.getPreferredLocale()),
					engineMetric)),
			pagination, total);
	}

	@Reference(
		target = "(component.name=com.liferay.osb.faro.rest.internal.dto.v1_0.converter.AssetSummaryMetricDTOConverter)"
	)
	private DTOConverter
		<GetSiteAssetSummariesPageResponse.AssetSummaryMetric,
		 AssetSummaryMetric> _assetSummaryMetricDTOConverter;

	@Reference
	private FaroGraphQLClient _faroGraphQLClient;

	@Reference
	private FaroProjectLocalService _faroProjectLocalService;

}