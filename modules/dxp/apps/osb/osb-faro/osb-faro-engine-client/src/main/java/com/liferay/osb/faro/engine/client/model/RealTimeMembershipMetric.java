/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.engine.client.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Nilton Vieira
 */
public class RealTimeMembershipMetric {

	@JsonProperty("averageSegmentMembershipDuration")
	public Metric getAverageSegmentMembershipDurationMetric() {
		return _averageSegmentMembershipDurationMetric;
	}

	@JsonProperty("entryRate")
	public Metric getEntryRateMetric() {
		return _entryRateMetric;
	}

	@JsonProperty("exitRate")
	public Metric getExitRateMetric() {
		return _exitRateMetric;
	}

	@JsonProperty("totalMembers")
	public TotalMemberMetric getTotalMemberMetric() {
		return _totalMemberMetric;
	}

	public void setAverageSegmentMembershipDurationMetric(
		Metric averageSegmentMembershipDurationMetric) {

		_averageSegmentMembershipDurationMetric =
			averageSegmentMembershipDurationMetric;
	}

	public void setEntryRateMetric(Metric entryRateMetric) {
		_entryRateMetric = entryRateMetric;
	}

	public void setExitRateMetric(Metric exitRateMetric) {
		_exitRateMetric = exitRateMetric;
	}

	public void setTotalMemberMetric(TotalMemberMetric totalMemberMetric) {
		_totalMemberMetric = totalMemberMetric;
	}

	private Metric _averageSegmentMembershipDurationMetric;
	private Metric _entryRateMetric;
	private Metric _exitRateMetric;
	private TotalMemberMetric _totalMemberMetric;

}