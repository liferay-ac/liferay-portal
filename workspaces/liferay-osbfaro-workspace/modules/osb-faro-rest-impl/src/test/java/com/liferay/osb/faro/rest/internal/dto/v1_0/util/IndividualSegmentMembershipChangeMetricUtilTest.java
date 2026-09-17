/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.dto.v1_0.util;

import com.liferay.osb.faro.engine.client.model.IndividualSegmentMembershipChangeAggregation;
import com.liferay.osb.faro.rest.dto.v1_0.HistogramBucket;
import com.liferay.osb.faro.rest.dto.v1_0.IndividualSegmentMembershipChangeMetric;
import com.liferay.osb.faro.rest.dto.v1_0.Metric;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;

/**
 * @author Leslie Wong
 */
public class IndividualSegmentMembershipChangeMetricUtilTest {

	@Test
	public void testToIndividualSegmentMembershipChangeMetric() {
		IndividualSegmentMembershipChangeMetric
			individualSegmentMembershipChangeMetric =
				IndividualSegmentMembershipChangeMetricUtil.
					toIndividualSegmentMembershipChangeMetric(
						_aggregations(), 3);

		Metric individuals =
			individualSegmentMembershipChangeMetric.getIndividuals();

		Assert.assertEquals(Double.valueOf(13), individuals.getValue());
		Assert.assertEquals(Double.valueOf(11), individuals.getPreviousValue());
		Assert.assertEquals("POSITIVE", individuals.getTrendClassification());

		Metric knownIndividuals =
			individualSegmentMembershipChangeMetric.getKnownIndividuals();

		Assert.assertEquals(Double.valueOf(10), knownIndividuals.getValue());
		Assert.assertEquals(
			Double.valueOf(9), knownIndividuals.getPreviousValue());

		Metric addedIndividuals =
			individualSegmentMembershipChangeMetric.getAddedIndividuals();

		Assert.assertEquals(Double.valueOf(4), addedIndividuals.getValue());
		Assert.assertEquals(
			Double.valueOf(2), addedIndividuals.getPreviousValue());
		Assert.assertEquals(
			Double.valueOf(100), addedIndividuals.getTrendPercentage());

		Metric removedIndividuals =
			individualSegmentMembershipChangeMetric.getRemovedIndividuals();

		Assert.assertEquals(Double.valueOf(2), removedIndividuals.getValue());
		Assert.assertEquals(
			Double.valueOf(1), removedIndividuals.getPreviousValue());
		Assert.assertEquals(
			"POSITIVE", removedIndividuals.getTrendClassification());

		HistogramBucket[] histogramBuckets = individuals.getHistogramBuckets();

		Assert.assertEquals(
			Arrays.toString(histogramBuckets), 3, histogramBuckets.length);

		Assert.assertEquals(
			"2026-09-14T00:00:00Z", histogramBuckets[0].getKey());
		Assert.assertEquals(Double.valueOf(15), histogramBuckets[0].getValue());
		Assert.assertEquals(
			"2026-09-16T00:00:00Z", histogramBuckets[2].getKey());
		Assert.assertEquals(Double.valueOf(13), histogramBuckets[2].getValue());

		individualSegmentMembershipChangeMetric =
			IndividualSegmentMembershipChangeMetricUtil.
				toIndividualSegmentMembershipChangeMetric(_aggregations(), 30);

		individuals = individualSegmentMembershipChangeMetric.getIndividuals();

		Assert.assertEquals(Double.valueOf(13), individuals.getValue());
		Assert.assertNull(individuals.getPreviousValue());
		Assert.assertNull(individuals.getTrendClassification());
		Assert.assertNull(individuals.getTrendPercentage());
		Assert.assertEquals(6, individuals.getHistogramBuckets().length);

		individualSegmentMembershipChangeMetric =
			IndividualSegmentMembershipChangeMetricUtil.
				toIndividualSegmentMembershipChangeMetric(
					Collections.emptyList(), 30);

		individuals = individualSegmentMembershipChangeMetric.getIndividuals();

		Assert.assertNull(individuals.getValue());
		Assert.assertNull(individuals.getPreviousValue());
		Assert.assertNull(individuals.getTrendClassification());
		Assert.assertNull(individuals.getTrendPercentage());
		Assert.assertEquals(0, individuals.getHistogramBuckets().length);
	}

	private IndividualSegmentMembershipChangeAggregation _aggregation(
		long addedIndividualsCount, long individualsCount,
		long intervalInitDate, long knownIndividualsCount,
		long removedIndividualsCount) {

		IndividualSegmentMembershipChangeAggregation
			individualSegmentMembershipChangeAggregation =
				new IndividualSegmentMembershipChangeAggregation();

		individualSegmentMembershipChangeAggregation.setAddedIndividualsCount(
			addedIndividualsCount);
		individualSegmentMembershipChangeAggregation.setIndividualsCount(
			individualsCount);
		individualSegmentMembershipChangeAggregation.setIntervalInitDate(
			new Date(intervalInitDate));
		individualSegmentMembershipChangeAggregation.setKnownIndividualsCount(
			knownIndividualsCount);
		individualSegmentMembershipChangeAggregation.setRemovedIndividualsCount(
			removedIndividualsCount);

		return individualSegmentMembershipChangeAggregation;
	}

	private List<IndividualSegmentMembershipChangeAggregation> _aggregations() {
		return Arrays.asList(
			_aggregation(0, 10, 1789084800000L, 8, 0),
			_aggregation(2, 12, 1789171200000L, 9, 0),
			_aggregation(0, 11, 1789257600000L, 9, 1),
			_aggregation(4, 15, 1789344000000L, 12, 0),
			_aggregation(0, 15, 1789430400000L, 12, 0),
			_aggregation(0, 13, 1789516800000L, 10, 2));
	}

}