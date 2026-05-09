/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.dto.v1_0.converter;

import com.liferay.osb.faro.rest.dto.v1_0.PageMetric;
import com.liferay.osb.faro.rest.internal.graphql.dto.GetSitePagesPageResponse;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.vulcan.dto.converter.DTOConverter;
import com.liferay.portal.vulcan.dto.converter.DTOConverterContext;

import java.util.List;

import org.osgi.service.component.annotations.Component;

/**
 * @author Leslie Wong
 */
@Component(
	property = "dto.class.name=com.liferay.osb.faro.rest.internal.graphql.dto.GetSitePagesPageResponse$PageMetric",
	service = DTOConverter.class
)
public class PageMetricDTOConverter
	implements DTOConverter<GetSitePagesPageResponse.PageMetric, PageMetric> {

	@Override
	public String getContentType() {
		return PageMetric.class.getSimpleName();
	}

	@Override
	public PageMetric toDTO(
		DTOConverterContext dtoConverterContext,
		GetSitePagesPageResponse.PageMetric enginePageMetric) {

		if (enginePageMetric == null) {
			return null;
		}

		return new PageMetric() {
			{
				setAssetId(enginePageMetric::getAssetId);
				setAssetTitle(enginePageMetric::getAssetTitle);
				setAssetType(enginePageMetric::getAssetType);
				setAvgTimeOnPage(
					() -> _value(enginePageMetric.getAvgTimeOnPageMetric()));
				setBounceRate(
					() -> _value(enginePageMetric.getBounceRateMetric()));
				setDataSourceId(enginePageMetric::getDataSourceId);
				setDirectAccess(
					() -> _value(enginePageMetric.getDirectAccessMetric()));
				setEntrances(
					() -> _value(enginePageMetric.getEntrancesMetric()));
				setExitRate(() -> _value(enginePageMetric.getExitRateMetric()));
				setIndirectAccess(
					() -> _value(enginePageMetric.getIndirectAccessMetric()));
				setUrls(() -> _toUrlsArray(enginePageMetric.getUrls()));
				setViews(() -> _value(enginePageMetric.getViewsMetric()));
				setViewsTrendPercentage(
					() -> _trendPercentage(enginePageMetric.getViewsMetric()));
				setVisitors(() -> _value(enginePageMetric.getVisitorsMetric()));
				setVisitorsTrendPercentage(
					() -> _trendPercentage(
						enginePageMetric.getVisitorsMetric()));
			}
		};
	}

	private String[] _toUrlsArray(List<String> urls) {
		if (ListUtil.isEmpty(urls)) {
			return null;
		}

		return urls.toArray(new String[0]);
	}

	private Double _trendPercentage(GetSitePagesPageResponse.Metric metric) {
		if ((metric == null) || (metric.getTrend() == null)) {
			return null;
		}

		return metric.getTrend(
		).getPercentage();
	}

	private Double _value(GetSitePagesPageResponse.Metric metric) {
		if (metric == null) {
			return null;
		}

		return metric.getValue();
	}

}