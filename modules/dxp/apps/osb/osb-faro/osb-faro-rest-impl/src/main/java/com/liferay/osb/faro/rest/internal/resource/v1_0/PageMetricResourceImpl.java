/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.resource.v1_0;

import com.liferay.osb.faro.model.FaroProject;
import com.liferay.osb.faro.rest.dto.v1_0.PageMetric;
import com.liferay.osb.faro.rest.internal.dto.v1_0.util.FaroDTOUtil;
import com.liferay.osb.faro.rest.internal.dto.v1_0.util.FaroPaginationUtil;
import com.liferay.osb.faro.rest.internal.graphql.client.FaroGraphQLClient;
import com.liferay.osb.faro.rest.internal.graphql.dto.GetSitePagesPageResponse;
import com.liferay.osb.faro.rest.resource.v1_0.PageMetricResource;
import com.liferay.osb.faro.service.FaroProjectLocalService;
import com.liferay.portal.kernel.search.Sort;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author Leslie Wong
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/page-metric.properties",
	scope = ServiceScope.PROTOTYPE, service = PageMetricResource.class
)
public class PageMetricResourceImpl extends BasePageMetricResourceImpl {

	@Override
	public Page<PageMetric> getSitePagesPage(
			Long siteId, String channelId, String dataSourceId, String search,
			Integer rangeKey, String rangeStart, String rangeEnd,
			Pagination pagination, Sort[] sorts)
		throws Exception {

		FaroProject faroProject =
			_faroProjectLocalService.getFaroProjectByGroupId(siteId);

		int cur = FaroPaginationUtil.getCur(pagination);
		int delta = FaroPaginationUtil.getDelta(pagination);

		GetSitePagesPageResponse response = _faroGraphQLClient.execute(
			faroProject, "getSitePagesPage",
			HashMapBuilder.<String, Object>put(
				"channelId", channelId
			).put(
				"dataSourceId", dataSourceId
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
			GetSitePagesPageResponse.class);

		GetSitePagesPageResponse.PageMetricBag bag = response.getPages();

		if (bag == null) {
			return Page.of(Collections.emptyList(), pagination, 0);
		}

		List<GetSitePagesPageResponse.PageMetric> pageMetrics =
			bag.getAssetMetrics();

		if (pageMetrics == null) {
			pageMetrics = Collections.emptyList();
		}

		List<PageMetric> mapped = new ArrayList<>(pageMetrics.size());

		for (GetSitePagesPageResponse.PageMetric pageMetric : pageMetrics) {
			mapped.add(FaroDTOUtil.toPageMetric(pageMetric));
		}

		Integer total = bag.getTotal();

		if (total != null) {
			total = 0;
		}

		return Page.of(mapped, pagination, total);
	}

	@Reference
	private FaroGraphQLClient _faroGraphQLClient;

	@Reference
	private FaroProjectLocalService _faroProjectLocalService;

}