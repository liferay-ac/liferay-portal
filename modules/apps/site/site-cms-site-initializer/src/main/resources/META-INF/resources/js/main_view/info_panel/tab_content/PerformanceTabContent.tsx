/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useEffect, useState} from 'react';

import {
	AssetTypeInfoPanelContext,
	IAssetTypeInfoPanelContext,
} from '../context';
import {Metrics} from './performance/Metrics';

export type Metric = {
	comparison: number;
	title: string;
	total: number;
};

const defaultSelectedMetric = Liferay.Language.get('impressions');

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

const PerformanceTabContent = () => {
	const [metrics, setMetrics] = useState<Metric[]>([]);
	const [selectedMetric, setSelectedMetric] = useState<string>(
		defaultSelectedMetric
	);

	const fileContext = React.useContext<IAssetTypeInfoPanelContext>(
		AssetTypeInfoPanelContext
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchComponentData(fileContext.id || 0);

				if (data) {
					setMetrics(data);
				}
			}
			catch (error) {
				console.error(error);
			}
		};

		fetchData();
	});

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
