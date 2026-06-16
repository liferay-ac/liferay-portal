/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.model.display.contacts;

/**
 * @author Marcos Martins
 */
public class UsageMetric {

	public UsageMetric(
		long addonEventsCount, long apiRequestsCount, long batchSegmentsCount,
		long connectedDataSourcesCount, String dateString, long eventsCount,
		long knownIndividualsCount,
		long knownIndividualsCountSinceLastAnniversary, long pageViewsCount,
		long pageViewsCountSinceLastAnniversary, long realTimeSegmentsCount) {

		_addonEventsCount = addonEventsCount;
		_apiRequestsCount = apiRequestsCount;
		_batchSegmentsCount = batchSegmentsCount;
		_connectedDataSourcesCount = connectedDataSourcesCount;
		_dateString = dateString;
		_eventsCount = eventsCount;
		_knownIndividualsCount = knownIndividualsCount;
		_knownIndividualsCountSinceLastAnniversary =
			knownIndividualsCountSinceLastAnniversary;
		_pageViewsCount = pageViewsCount;
		_pageViewsCountSinceLastAnniversary =
			pageViewsCountSinceLastAnniversary;
		_realTimeSegmentsCount = realTimeSegmentsCount;
	}

	public long getAddonEventsCount() {
		return _addonEventsCount;
	}

	public long getApiRequestsCount() {
		return _apiRequestsCount;
	}

	public long getBatchSegmentsCount() {
		return _batchSegmentsCount;
	}

	public long getConnectedDataSourcesCount() {
		return _connectedDataSourcesCount;
	}

	public String getDateString() {
		return _dateString;
	}

	public long getEventsCount() {
		return _eventsCount;
	}

	public long getKnownIndividualsCount() {
		return _knownIndividualsCount;
	}

	public long getKnownIndividualsCountSinceLastAnniversary() {
		return _knownIndividualsCountSinceLastAnniversary;
	}

	public long getPageViewsCount() {
		return _pageViewsCount;
	}

	public long getPageViewsCountSinceLastAnniversary() {
		return _pageViewsCountSinceLastAnniversary;
	}

	public long getRealTimeSegmentsCount() {
		return _realTimeSegmentsCount;
	}

	private final long _addonEventsCount;
	private final long _apiRequestsCount;
	private final long _batchSegmentsCount;
	private final long _connectedDataSourcesCount;
	private final String _dateString;
	private final long _eventsCount;
	private final long _knownIndividualsCount;
	private final long _knownIndividualsCountSinceLastAnniversary;
	private final long _pageViewsCount;
	private final long _pageViewsCountSinceLastAnniversary;
	private final long _realTimeSegmentsCount;

}
