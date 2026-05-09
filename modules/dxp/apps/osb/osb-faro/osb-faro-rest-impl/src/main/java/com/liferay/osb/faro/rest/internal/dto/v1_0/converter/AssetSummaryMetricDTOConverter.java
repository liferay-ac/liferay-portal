/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.dto.v1_0.converter;

import com.liferay.osb.faro.rest.dto.v1_0.AssetSummaryMetric;
import com.liferay.osb.faro.rest.internal.graphql.dto.GetSiteAssetSummariesPageResponse;
import com.liferay.portal.vulcan.dto.converter.DTOConverter;
import com.liferay.portal.vulcan.dto.converter.DTOConverterContext;

import org.osgi.service.component.annotations.Component;

/**
 * @author Leslie Wong
 */
@Component(
	property = "dto.class.name=com.liferay.osb.faro.rest.internal.graphql.dto.GetSiteAssetSummariesPageResponse$AssetSummaryMetric",
	service = DTOConverter.class
)
public class AssetSummaryMetricDTOConverter
	implements DTOConverter
		<GetSiteAssetSummariesPageResponse.AssetSummaryMetric,
		 AssetSummaryMetric> {

	@Override
	public String getContentType() {
		return AssetSummaryMetric.class.getSimpleName();
	}

	@Override
	public AssetSummaryMetric toDTO(
		DTOConverterContext dtoConverterContext,
		GetSiteAssetSummariesPageResponse.AssetSummaryMetric engineMetric) {

		if (engineMetric == null) {
			return null;
		}

		return new AssetSummaryMetric() {
			{
				setAssetId(engineMetric::getAssetId);
				setAssetTitle(engineMetric::getAssetTitle);
				setAssetType(engineMetric::getAssetType);
				setDownloads(() -> _value(engineMetric.getDownloadsMetric()));
				setDownloadsTrendPercentage(
					() -> _trendPercentage(engineMetric.getDownloadsMetric()));
				setImpressions(
					() -> _value(engineMetric.getImpressionsMetric()));
				setImpressionsTrendPercentage(
					() -> _trendPercentage(
						engineMetric.getImpressionsMetric()));
				setReads(() -> _value(engineMetric.getReadsMetric()));
				setReadsTrendPercentage(
					() -> _trendPercentage(engineMetric.getReadsMetric()));
				setViews(() -> _value(engineMetric.getViewsMetric()));
				setViewsTrendPercentage(
					() -> _trendPercentage(engineMetric.getViewsMetric()));
			}
		};
	}

	private Double _trendPercentage(
		GetSiteAssetSummariesPageResponse.Metric metric) {

		if ((metric == null) || (metric.getTrend() == null)) {
			return null;
		}

		return metric.getTrend(
		).getPercentage();
	}

	private Double _value(GetSiteAssetSummariesPageResponse.Metric metric) {
		if (metric == null) {
			return null;
		}

		return metric.getValue();
	}

}