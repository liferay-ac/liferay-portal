/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useContext, useMemo, useState} from 'react';
import {Line} from 'recharts';

import {Context} from '../../../Context';
import {Colors, MetricName, MetricType} from '../../../types/global';
import {formatTooltipDate, toUnix} from '../../../utils/date';
import {
	CircleDot,
	CurrentVsPreviousDot,
	DashedDotIcon,
} from '../../metrics/Dots';
import MetricsChart from '../../metrics/MetricsChart';
import {formatter, getFillOpacity} from '../../metrics/utils';
import CurrentVsPreviousTooltip from './CurrentVsPreviousTooltip';

export const mockedChartData = {
	histograms: [
		{
			metricName: MetricName.Impressions,
			metrics: [
				{
					previousValue: 8360000,
					previousValueKey: '2025-07-19T17:00',
					value: 9700000,
					valueKey: '2025-07-20T17:00',
				},
				{
					previousValue: 6880000,
					previousValueKey: '2025-07-19T18:00',
					value: 150000,
					valueKey: '2025-07-20T18:00',
				},
				{
					previousValue: 1160000,
					previousValueKey: '2025-07-19T19:00',
					value: 3180000,
					valueKey: '2025-07-20T19:00',
				},
				{
					previousValue: 7990000,
					previousValueKey: '2025-07-19T20:00',
					value: 590000,
					valueKey: '2025-07-20T20:00',
				},
				{
					previousValue: 9740000,
					previousValueKey: '2025-07-19T21:00',
					value: 180000,
					valueKey: '2025-07-20T21:00',
				},
				{
					previousValue: 4360000,
					previousValueKey: '2025-07-19T22:00',
					value: 2310000,
					valueKey: '2025-07-20T22:00',
				},
				{
					previousValue: 8240000,
					previousValueKey: '2025-07-19T23:00',
					value: 5060000,
					valueKey: '2025-07-20T23:00',
				},
				{
					previousValue: 130000,
					previousValueKey: '2025-07-20T00:00',
					value: 7490000,
					valueKey: '2025-07-21T00:00',
				},
				{
					previousValue: 5520000,
					previousValueKey: '2025-07-20T01:00',
					value: 5560000,
					valueKey: '2025-07-21T01:00',
				},
				{
					previousValue: 2900000,
					previousValueKey: '2025-07-20T02:00',
					value: 9670000,
					valueKey: '2025-07-21T02:00',
				},
				{
					previousValue: 8540000,
					previousValueKey: '2025-07-20T03:00',
					value: 7300000,
					valueKey: '2025-07-21T03:00',
				},
				{
					previousValue: 760000,
					previousValueKey: '2025-07-20T04:00',
					value: 720000,
					valueKey: '2025-07-21T04:00',
				},
				{
					previousValue: 9710000,
					previousValueKey: '2025-07-20T05:00',
					value: 8380000,
					valueKey: '2025-07-21T05:00',
				},
				{
					previousValue: 2360000,
					previousValueKey: '2025-07-20T06:00',
					value: 7540000,
					valueKey: '2025-07-21T06:00',
				},
				{
					previousValue: 4880000,
					previousValueKey: '2025-07-20T07:00',
					value: 6430000,
					valueKey: '2025-07-21T07:00',
				},
				{
					previousValue: 3110000,
					previousValueKey: '2025-07-20T08:00',
					value: 2510000,
					valueKey: '2025-07-21T08:00',
				},
			],
			total: 1231,
			totalValue: 3000,
		},
		{
			metricName: MetricName.Downloads,
			metrics: [
				{
					previousValue: 171,
					previousValueKey: '2025-07-19T17:00',
					value: 37,
					valueKey: '2025-07-20T17:00',
				},
				{
					previousValue: 29,
					previousValueKey: '2025-07-19T18:00',
					value: 965,
					valueKey: '2025-07-20T18:00',
				},
				{
					previousValue: 24,
					previousValueKey: '2025-07-19T19:00',
					value: 500,
					valueKey: '2025-07-20T19:00',
				},
				{
					previousValue: 234,
					previousValueKey: '2025-07-19T20:00',
					value: 399,
					valueKey: '2025-07-20T20:00',
				},
				{
					previousValue: 576,
					previousValueKey: '2025-07-19T21:00',
					value: 97,
					valueKey: '2025-07-20T21:00',
				},
				{
					previousValue: 296,
					previousValueKey: '2025-07-19T22:00',
					value: 416,
					valueKey: '2025-07-20T22:00',
				},
				{
					previousValue: 11,
					previousValueKey: '2025-07-19T23:00',
					value: 303,
					valueKey: '2025-07-20T23:00',
				},
				{
					previousValue: 338,
					previousValueKey: '2025-07-20T00:00',
					value: 580,
					valueKey: '2025-07-21T00:00',
				},
				{
					previousValue: 636,
					previousValueKey: '2025-07-20T01:00',
					value: 264,
					valueKey: '2025-07-21T01:00',
				},
				{
					previousValue: 885,
					previousValueKey: '2025-07-20T02:00',
					value: 113,
					valueKey: '2025-07-21T02:00',
				},
				{
					previousValue: 374,
					previousValueKey: '2025-07-20T03:00',
					value: 981,
					valueKey: '2025-07-21T03:00',
				},
				{
					previousValue: 843,
					previousValueKey: '2025-07-20T04:00',
					value: 859,
					valueKey: '2025-07-21T04:00',
				},
				{
					previousValue: 762,
					previousValueKey: '2025-07-20T05:00',
					value: 982,
					valueKey: '2025-07-21T05:00',
				},
				{
					previousValue: 152,
					previousValueKey: '2025-07-20T06:00',
					value: 598,
					valueKey: '2025-07-21T06:00',
				},
				{
					previousValue: 966,
					previousValueKey: '2025-07-20T07:00',
					value: 324,
					valueKey: '2025-07-21T07:00',
				},
				{
					previousValue: 494,
					previousValueKey: '2025-07-20T08:00',
					value: 387,
					valueKey: '2025-07-21T08:00',
				},
				{
					previousValue: 894,
					previousValueKey: '2025-07-20T09:00',
					value: 13,
					valueKey: '2025-07-21T09:00',
				},
				{
					previousValue: 846,
					previousValueKey: '2025-07-20T10:00',
					value: 478,
					valueKey: '2025-07-21T10:00',
				},
				{
					previousValue: 399,
					previousValueKey: '2025-07-20T11:00',
					value: 130,
					valueKey: '2025-07-21T11:00',
				},
				{
					previousValue: 824,
					previousValueKey: '2025-07-20T12:00',
					value: 833,
					valueKey: '2025-07-21T12:00',
				},
				{
					previousValue: 737,
					previousValueKey: '2025-07-20T13:00',
					value: 801,
					valueKey: '2025-07-21T13:00',
				},
				{
					previousValue: 462,
					previousValueKey: '2025-07-20T14:00',
					value: 401,
					valueKey: '2025-07-21T14:00',
				},
				{
					previousValue: 483,
					previousValueKey: '2025-07-20T15:00',
					value: 805,
					valueKey: '2025-07-21T15:00',
				},
				{
					previousValue: 878,
					previousValueKey: '2025-07-20T16:00',
					value: 595,
					valueKey: '2025-07-21T16:00',
				},
			],
			total: 1231,
			totalValue: 3000,
		},
		{
			metricName: MetricName.Views,
			metrics: [
				{
					previousValue: 103,
					previousValueKey: '2025-07-19T17:00',
					value: 48,
					valueKey: '2025-07-20T17:00',
				},
				{
					previousValue: 25,
					previousValueKey: '2025-07-19T18:00',
					value: 566,
					valueKey: '2025-07-20T18:00',
				},
				{
					previousValue: 382,
					previousValueKey: '2025-07-19T19:00',
					value: 684,
					valueKey: '2025-07-20T19:00',
				},
				{
					previousValue: 525,
					previousValueKey: '2025-07-19T20:00',
					value: 990,
					valueKey: '2025-07-20T20:00',
				},
				{
					previousValue: 663,
					previousValueKey: '2025-07-19T21:00',
					value: 256,
					valueKey: '2025-07-20T21:00',
				},
				{
					previousValue: 372,
					previousValueKey: '2025-07-19T22:00',
					value: 353,
					valueKey: '2025-07-20T22:00',
				},
				{
					previousValue: 217,
					previousValueKey: '2025-07-19T23:00',
					value: 124,
					valueKey: '2025-07-20T23:00',
				},
				{
					previousValue: 37,
					previousValueKey: '2025-07-20T00:00',
					value: 738,
					valueKey: '2025-07-21T00:00',
				},
				{
					previousValue: 623,
					previousValueKey: '2025-07-20T01:00',
					value: 164,
					valueKey: '2025-07-21T01:00',
				},
				{
					previousValue: 396,
					previousValueKey: '2025-07-20T02:00',
					value: 659,
					valueKey: '2025-07-21T02:00',
				},
				{
					previousValue: 637,
					previousValueKey: '2025-07-20T03:00',
					value: 614,
					valueKey: '2025-07-21T03:00',
				},
				{
					previousValue: 157,
					previousValueKey: '2025-07-20T04:00',
					value: 327,
					valueKey: '2025-07-21T04:00',
				},
				{
					previousValue: 22,
					previousValueKey: '2025-07-20T05:00',
					value: 249,
					valueKey: '2025-07-21T05:00',
				},
				{
					previousValue: 445,
					previousValueKey: '2025-07-20T06:00',
					value: 335,
					valueKey: '2025-07-21T06:00',
				},
				{
					previousValue: 651,
					previousValueKey: '2025-07-20T07:00',
					value: 169,
					valueKey: '2025-07-21T07:00',
				},
				{
					previousValue: 275,
					previousValueKey: '2025-07-20T08:00',
					value: 84,
					valueKey: '2025-07-21T08:00',
				},
				{
					previousValue: 482,
					previousValueKey: '2025-07-20T09:00',
					value: 358,
					valueKey: '2025-07-21T09:00',
				},
				{
					previousValue: 681,
					previousValueKey: '2025-07-20T10:00',
					value: 63,
					valueKey: '2025-07-21T10:00',
				},
				{
					previousValue: 386,
					previousValueKey: '2025-07-20T11:00',
					value: 670,
					valueKey: '2025-07-21T11:00',
				},
				{
					previousValue: 808,
					previousValueKey: '2025-07-20T12:00',
					value: 944,
					valueKey: '2025-07-21T12:00',
				},
				{
					previousValue: 96,
					previousValueKey: '2025-07-20T13:00',
					value: 699,
					valueKey: '2025-07-21T13:00',
				},
				{
					previousValue: 973,
					previousValueKey: '2025-07-20T14:00',
					value: 466,
					valueKey: '2025-07-21T14:00',
				},
				{
					previousValue: 596,
					previousValueKey: '2025-07-20T15:00',
					value: 884,
					valueKey: '2025-07-21T15:00',
				},
				{
					previousValue: 634,
					previousValueKey: '2025-07-20T16:00',
					value: 259,
					valueKey: '2025-07-21T16:00',
				},
			],
			total: 1231,
			totalValue: 3000,
		},
	],
};

export enum MetricDataKey {
	Current = 'METRIC_DATA_KEY',
	Previous = 'PREV_METRIC_DATA_KEY',
}

type Data = {
	histograms: {
		metricName: string;
		metrics: {
			previousValue: number;
			previousValueKey: string;
			value: number;
			valueKey: string;
		}[];
		total: number;
		totalValue: number;
	}[];
};

type FormattedData = {
	combinedData: {[key in string]: number | string | null}[];
	data: {
		[key in string]: {
			color?: Colors;
			format?: (value: any) => any;
			title: string;
			total: string | number;
			url?: string;
		};
	};
	intervals: (number | null)[];
};

export function getSelectedHistogram(data: Data, metricType: MetricType) {
	const currentMetricName: Partial<{
		[key in MetricType]: MetricName;
	}> = {
		[MetricType.Views]: MetricName.Views,
		[MetricType.Impressions]: MetricName.Impressions,
		[MetricType.Downloads]: MetricName.Downloads,
	};

	return data.histograms.find(
		({metricName}) => currentMetricName[metricType] === metricName
	);
}

function getTitle(metricType: MetricType) {
	const title: Partial<{
		[key in MetricType]: string;
	}> = {
		[MetricType.Views]: Liferay.Language.get('views'),
		[MetricType.Impressions]: Liferay.Language.get('impressions'),
		[MetricType.Downloads]: Liferay.Language.get('downloads'),
	};

	return title[metricType];
}

export function formatData({
	data: initialData,
	metricType,
}: {
	data: Data;
	metricType: MetricType;
}): FormattedData {
	const selectedHistogram = getSelectedHistogram(initialData, metricType);
	const title = getTitle(metricType) as string;

	const data = {
		METRIC_DATA_KEY: {
			color: Colors.Blue,
			title,
			total: formatter('number')(selectedHistogram?.totalValue ?? 0),
		},
		PREV_METRIC_DATA_KEY: {
			color: Colors.LightGray,
			title,
			total: formatter('number')(selectedHistogram?.totalValue ?? 0),
		},
		x: {
			title: Liferay.Language.get('x'),
			total: 0,
		},
		y: {
			title: Liferay.Language.get('y'),
			total: 0,
		},
	};

	if (selectedHistogram?.metrics.length) {
		const axisXData = selectedHistogram.metrics.map(({valueKey}) =>
			toUnix(valueKey)
		);

		const combinedData = [];

		const metricData = selectedHistogram.metrics.map(({value}) => value);
		const prevMetricData = selectedHistogram.metrics.map(
			({previousValue}) => previousValue
		);

		for (let i = 0; i < axisXData.length; i++) {
			combinedData.push({
				METRIC_DATA_KEY: metricData[i],
				PREV_METRIC_DATA_KEY: prevMetricData[i],
				x: axisXData[i],
				y: null,
			});
		}

		return {
			combinedData,
			data,
			intervals: axisXData,
		};
	}

	return {
		combinedData: [],
		data,
		intervals: [],
	};
}

export type DotProps = {
	cx?: number;
	cy?: number;
	displayOutsideOfRecharts?: boolean;
	size?: number;
	stroke: string;
	strokeOpacity?: string;
	value?: number | null;
};

export interface IMetricsChartLegendProps {
	activeTabIndex: boolean;
	legendItems: {
		Dot: React.JSXElementConstructor<DotProps>;
		block?: boolean;
		dataKey: string;
		dotColor: string;
		title: string;
		total?: string | number;
		url?: string;
	}[];
	onDatakeyChange: (dataKey: string | null) => void;
}

const CurrentVsPreviousChart = () => {
	const {filters} = useContext(Context);
	const [activeTabIndex, setActiveTabIndex] = useState(false);

	const [activeLegendItem, setActiveLegendItem] = useState<string | null>(
		null
	);

	const formattedData = useMemo(
		() =>
			formatData({
				data: mockedChartData,
				metricType: filters.metric,
			}),
		[filters.metric]
	);

	const metricsChartData = formattedData.data[MetricDataKey.Current];
	const prevMetricsChartData = formattedData.data[MetricDataKey.Previous];

	const legendItems: IMetricsChartLegendProps['legendItems'] = [
		{
			Dot: DashedDotIcon,
			dataKey: MetricDataKey.Previous,
			dotColor: prevMetricsChartData?.color ?? 'none',
			title: Liferay.Language.get('previous-period'),
		},
		{
			Dot: CircleDot,
			dataKey: MetricDataKey.Current,
			dotColor: metricsChartData?.color ?? 'none',
			title: Liferay.Language.get('current-period'),
		},
	];

	return (
		<>
			<MetricsChart
				MetricsChartTooltip={CurrentVsPreviousTooltip}
				activeTabIndex={activeTabIndex}
				emptyChartProps={{
					description: Liferay.Language.get(
						'check-back-later-to-see-if-your-data-sources-are-populated-with-data'
					),
					link: {
						title: Liferay.Language.get(
							'learn-more-about-visitors-behavior'
						),
						url: 'https://learn.liferay.com/w/dxp/content-authoring-and-management/content-dashboard/content-dashboard-interface',
					},
					show: !formattedData.combinedData.length,
					title: Liferay.Language.get(
						'there-is-no-data-for-visitors-behavior'
					),
				}}
				formattedData={formattedData}
				legendAlign="text-right"
				legendItems={legendItems}
				onChartBlur={() => setActiveTabIndex(false)}
				onChartFocus={() => setActiveTabIndex(true)}
				onDatakeyChange={(dataKey) => setActiveLegendItem(dataKey)}
				rangeSelector={30 as any}
				tooltipTitle={getTitle(filters.metric) as string}
				xAxisDataKey="METRIC_DATA_KEY"
			>
				<Line
					activeDot={
						<CurrentVsPreviousDot
							fill="white"
							stroke={metricsChartData.color ?? 'none'}
						/>
					}
					animationDuration={100}
					dataKey="METRIC_DATA_KEY"
					dot={
						<CurrentVsPreviousDot
							fill={metricsChartData.color ?? 'none'}
							stroke={metricsChartData.color ?? 'none'}
						/>
					}
					fill={Colors.Blue}
					fillOpacity={getFillOpacity(
						MetricDataKey.Current,
						activeLegendItem
					)}
					legendType="plainline"
					stroke={metricsChartData.color ?? 'none'}
					strokeOpacity={getFillOpacity(
						MetricDataKey.Current,
						activeLegendItem
					)}
					strokeWidth={2}
					type="linear"
				/>

				<Line
					activeDot={
						<CurrentVsPreviousDot
							fill="none"
							stroke={prevMetricsChartData.color ?? 'none'}
						/>
					}
					animationDuration={100}
					dataKey="PREV_METRIC_DATA_KEY"
					dot={false}
					fill={Colors.LightGray}
					fillOpacity={getFillOpacity(
						MetricDataKey.Previous,
						activeLegendItem
					)}
					legendType="plainline"
					stroke={prevMetricsChartData.color ?? 'none'}
					strokeDasharray="5 5"
					strokeOpacity={getFillOpacity(
						MetricDataKey.Previous,
						activeLegendItem
					)}
					strokeWidth={2}
					type="linear"
				/>
			</MetricsChart>

			{/* Used on playwright to test data */}

			<div
				data-qa-cur-chart-data={JSON.stringify(
					formattedData.combinedData.map(
						(dataKey) => dataKey[MetricDataKey.Current]
					)
				)}
				data-qa-prev-chart-data={JSON.stringify(
					formattedData.combinedData.map(
						(dataKey) => dataKey[MetricDataKey.Previous]
					)
				)}
				data-qa-tooltip-formatted-date={JSON.stringify(
					formatTooltipDate(
						formattedData.combinedData[0]?.['x'] as number,
						30 as any
					)
				)}
				data-testid="metrics-chart-data"
			/>
		</>
	);
};

export default CurrentVsPreviousChart;
