/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useContext, useEffect, useState} from 'react';

import {
	AssetTypeInfoPanelContext,
	IAssetTypeInfoPanelContext,
} from '../context';
import {getEmptyState} from './performance/EmptyState';
import {Metrics} from './performance/Metrics';

export type Metric = {
	comparison: number;
	title: string;
	total: number;
};

const defaultSelectedMetric = Liferay.Language.get('impressions');
export type EmptyStateData = {
	analyticsSettingsPortletURL: string;
	connectedToAnalyticsCloud: boolean;
	connectedToSpace: boolean;
	isAdmin: boolean;
	siteEditDepotEntryDepotAdminPortletURL: string;
	siteSyncedToAnalyticsCloud: boolean;
};

const metricsMock: Metric[] = [
	{
		comparison: 0,
		title: 'Impressions',
		total: 11,
	},
	{
		comparison: -12.3,
		title: 'Views',
		total: 25321,
	},
	{
		comparison: 32.1,
		title: 'Downloads',
		total: 220153310,
	},
];

async function fetchComponentData(_fileId: number): Promise<Metric[]> {
	return metricsMock;
}

async function fetchEmptyStateData(
	_contentPerformanceDataFetchURL: string
): Promise<EmptyStateData> {

	// TO DO Endpoint

	// const response = await fetch(contentPerformanceDataFetchURL, {
	// 	method: 'GET',
	// });

	// return await response.json();

	// Mock

	return {
		analyticsSettingsPortletURL: '/mock-analytics',
		connectedToAnalyticsCloud: true,
		connectedToSpace: true,
		isAdmin: true,
		siteEditDepotEntryDepotAdminPortletURL: '/mock-depot',
		siteSyncedToAnalyticsCloud: true,
	};
}

const PerformanceTabContent = (contentPerformanceDataFetchURL: string) => {
	const [metrics, setMetrics] = useState<Metric[]>([]);
	const [emptyStateData, setEmptyStateData] = useState<EmptyStateData | null>(
		null
	);
	const [selectedMetric, setSelectedMetric] = useState<string>(
		defaultSelectedMetric
	);

	const fileContext = useContext<IAssetTypeInfoPanelContext>(
		AssetTypeInfoPanelContext
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const id = fileContext?.id || 0;
				const metricsData = await fetchComponentData(id);
				setMetrics(metricsData);

				if (!metricsData.length) {
					const emptyData = await fetchEmptyStateData(
						contentPerformanceDataFetchURL
					);
					setEmptyStateData(emptyData);
				}
			}
			catch (error) {
				console.error(error);
			}
		};

		if (fileContext?.id) {
			fetchData();
		}
	}, [fileContext?.id, contentPerformanceDataFetchURL]);

	if (!metrics.length && emptyStateData) {
		return getEmptyState(emptyStateData);
	}

	return (
		<div>
			{!!metrics.length && (
				<Metrics
					metrics={metrics}
					selectedMetric={selectedMetric}
					setSelectedMetric={setSelectedMetric}
				/>
			)}
		</div>
	);
};

export default PerformanceTabContent;
