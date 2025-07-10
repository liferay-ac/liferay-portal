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

const defaultSelectedMetric = Liferay.Language.get('impressions');

export type EmptyStateData = {
	analyticsSettingsPortletURL: string;
	connectedToAnalyticsCloud: boolean;
	connectedToSpace: boolean;
	isAdmin: boolean;
	siteEditDepotEntryDepotAdminPortletURL: string;
	siteSyncedToAnalyticsCloud: boolean;
};

export type Metric = {
	comparison: number;
	title: string;
	total: number;
};

type MetricsApiResponse = {
	emptyStateData: EmptyStateData;
	metrics: Metric[];
};

const responseMock: MetricsApiResponse = {
	emptyStateData: {
		analyticsSettingsPortletURL: '/mock-analytics',
		connectedToAnalyticsCloud: true,
		connectedToSpace: true,
		isAdmin: true,
		siteEditDepotEntryDepotAdminPortletURL: '/mock-depot',
		siteSyncedToAnalyticsCloud: true,
	},
	metrics: [
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
	],
};

async function fetchComponentData(
	_fileId: number
): Promise<MetricsApiResponse> {

	// TODO fetch from API

	return responseMock;
}

const PerformanceTabContent = () => {
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
		const fetchData = async (fileId: number) => {
			try {
				const {emptyStateData, metrics} =
					await fetchComponentData(fileId);

				setMetrics(metrics || []);

				if (!metrics.length) {
					setEmptyStateData(emptyStateData);
				}
			}
			catch (error) {
				console.error(error);
			}
		};

		const fileId = fileContext?.id;

		if (fileId) {
			fetchData(fileId);
		}
	}, [fileContext?.id]);

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
