/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.dto.v1_0.util;

import com.liferay.osb.faro.rest.dto.v1_0.AssetSummaryMetric;
import com.liferay.osb.faro.rest.dto.v1_0.Event;
import com.liferay.osb.faro.rest.dto.v1_0.PageMetric;
import com.liferay.osb.faro.rest.internal.graphql.dto.GetSiteAssetSummariesPageResponse;
import com.liferay.osb.faro.rest.internal.graphql.dto.GetSiteChannelEventsPageResponse;
import com.liferay.osb.faro.rest.internal.graphql.dto.GetSitePagesPageResponse;
import com.liferay.portal.kernel.util.ListUtil;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

	public static Event toEvent(
		GetSiteChannelEventsPageResponse.Event engineEvent) {

		if (engineEvent == null) {
			return null;
		}

		Event event = new Event();

		event.setApplicationId(engineEvent::getApplicationId);
		event.setAssetTitle(engineEvent::getAssetTitle);
		event.setAttributes(
			() -> _propertiesToMap(engineEvent.getProperties()));
		event.setCanonicalUrl(engineEvent::getCanonicalUrl);
		event.setCreateDate(engineEvent::getCreateDate);
		event.setEmailAddressHashed(engineEvent::getEmailAddressHashed);
		event.setName(engineEvent::getName);
		event.setPageDescription(engineEvent::getPageDescription);
		event.setPageKeywords(engineEvent::getPageKeywords);
		event.setPageTitle(engineEvent::getPageTitle);
		event.setReferrer(engineEvent::getReferrer);
		event.setUrl(engineEvent::getUrl);

		return event;
	}

	public static PageMetric toPageMetric(
		GetSitePagesPageResponse.PageMetric enginePageMetric) {

		if (enginePageMetric == null) {
			return null;
		}

		PageMetric pageMetric = new PageMetric();

		pageMetric.setAssetId(enginePageMetric::getAssetId);
		pageMetric.setAssetTitle(enginePageMetric::getAssetTitle);
		pageMetric.setAssetType(enginePageMetric::getAssetType);
		pageMetric.setAvgTimeOnPage(
			() -> _value(enginePageMetric.getAvgTimeOnPageMetric()));
		pageMetric.setBounceRate(
			() -> _value(enginePageMetric.getBounceRateMetric()));
		pageMetric.setDataSourceId(enginePageMetric::getDataSourceId);
		pageMetric.setDirectAccess(
			() -> _value(enginePageMetric.getDirectAccessMetric()));
		pageMetric.setEntrances(
			() -> _value(enginePageMetric.getEntrancesMetric()));
		pageMetric.setExitRate(
			() -> _value(enginePageMetric.getExitRateMetric()));
		pageMetric.setIndirectAccess(
			() -> _value(enginePageMetric.getIndirectAccessMetric()));
		pageMetric.setUrls(() -> _toUrlsArray(enginePageMetric.getUrls()));
		pageMetric.setViews(() -> _value(enginePageMetric.getViewsMetric()));
		pageMetric.setViewsTrendPercentage(
			() -> _trendPercentage(enginePageMetric.getViewsMetric()));
		pageMetric.setVisitors(
			() -> _value(enginePageMetric.getVisitorsMetric()));
		pageMetric.setVisitorsTrendPercentage(
			() -> _trendPercentage(enginePageMetric.getVisitorsMetric()));

		return pageMetric;
	}

	private static Map<String, String> _propertiesToMap(
		List<GetSiteChannelEventsPageResponse.Property> properties) {

		if (ListUtil.isEmpty(properties)) {
			return null;
		}

		Map<String, String> attributes = new LinkedHashMap<>(properties.size());

		for (GetSiteChannelEventsPageResponse.Property property : properties) {
			String name = property.getName();

			if (name != null) {
				attributes.put(name, property.getValue());
			}
		}

		return attributes;
	}

	private static String[] _toUrlsArray(List<String> urls) {
		if (ListUtil.isEmpty(urls)) {
			return null;
		}

		return urls.toArray(new String[0]);
	}

	private static Double _trendPercentage(
		GetSiteAssetSummariesPageResponse.Metric metric) {

		if ((metric == null) || (metric.getTrend() == null)) {
			return null;
		}

		return metric.getTrend(
		).getPercentage();
	}

	private static Double _trendPercentage(
		GetSitePagesPageResponse.Metric metric) {

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

	private static Double _value(GetSitePagesPageResponse.Metric metric) {
		if (metric == null) {
			return null;
		}

		return metric.getValue();
	}

}