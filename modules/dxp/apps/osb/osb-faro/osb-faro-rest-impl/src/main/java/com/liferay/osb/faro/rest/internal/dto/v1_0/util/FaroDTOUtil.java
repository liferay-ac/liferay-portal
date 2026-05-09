/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.dto.v1_0.util;

import com.liferay.osb.faro.rest.dto.v1_0.AssetSummaryMetric;
import com.liferay.osb.faro.rest.internal.graphql.dto.GetSiteAssetSummariesPageResponse;

/**
 * @author Leslie Wong
 */
public class FaroDTOUtil {

	public static AssetSummaryMetric toAssetSummaryMetric(
		GetSiteAssetSummariesPageResponse.AssetSummaryMetric engineMetric) {

		if (engineMetric == null) {
			return null;
		}

		AssetSummaryMetric assetSummaryMetric = new AssetSummaryMetric();

		assetSummaryMetric.setAssetId(engineMetric::getAssetId);
		assetSummaryMetric.setAssetTitle(engineMetric::getAssetTitle);
		assetSummaryMetric.setAssetType(engineMetric::getAssetType);
		assetSummaryMetric.setDownloads(
			() -> _value(engineMetric.getDownloadsMetric()));
		assetSummaryMetric.setDownloadsTrendPercentage(
			() -> _trendPercentage(engineMetric.getDownloadsMetric()));
		assetSummaryMetric.setImpressions(
			() -> _value(engineMetric.getImpressionsMetric()));
		assetSummaryMetric.setImpressionsTrendPercentage(
			() -> _trendPercentage(engineMetric.getImpressionsMetric()));
		assetSummaryMetric.setReads(
			() -> _value(engineMetric.getReadsMetric()));
		assetSummaryMetric.setReadsTrendPercentage(
			() -> _trendPercentage(engineMetric.getReadsMetric()));
		assetSummaryMetric.setViews(
			() -> _value(engineMetric.getViewsMetric()));
		assetSummaryMetric.setViewsTrendPercentage(
			() -> _trendPercentage(engineMetric.getViewsMetric()));

		return assetSummaryMetric;
	}

	private static Double _trendPercentage(
		GetSiteAssetSummariesPageResponse.Metric metric) {

		if ((metric == null) || (metric.getTrend() == null)) {
			return null;
		}

		return metric.getTrend(
		).getPercentage();
	}

	private static Double _value(
		GetSiteAssetSummariesPageResponse.Metric metric) {

		if (metric == null) {
			return null;
		}

		return metric.getValue();
	}

}