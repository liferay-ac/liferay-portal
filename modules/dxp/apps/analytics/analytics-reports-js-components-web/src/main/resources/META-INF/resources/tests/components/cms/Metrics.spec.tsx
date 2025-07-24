/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, {useContext, useEffect} from 'react';

import {Context, ContextProvider} from '../../../js/Context';
import {MetricsContent} from '../../../js/components/cms/Metrics';
import {TableView} from '../../../js/components/cms/current-vs-previous/TableView';
import {
	Individuals,
	MetricType,
	RangeSelectors,
} from '../../../js/types/global';
import {TrendClassification} from '../../../js/utils/metrics';

type Metric = {
	metricType: MetricType;
	trend: {
		percentage: number;
		trendClassification: TrendClassification;
	};
	value: number;
};

const metricsMock: {
	defaultMetric: Metric;
	selectedMetrics: Metric[];
} = {
	defaultMetric: {
		metricType: MetricType.Impressions,
		trend: {
			percentage: 0,
			trendClassification: TrendClassification.Neutral,
		},
		value: 11,
	},
	selectedMetrics: [
		{
			metricType: MetricType.Impressions,
			trend: {
				percentage: 0,
				trendClassification: TrendClassification.Neutral,
			},
			value: 11,
		},
		{
			metricType: MetricType.Views,
			trend: {
				percentage: -12.3,
				trendClassification: TrendClassification.Negative,
			},
			value: 25321,
		},

		{
			metricType: MetricType.Downloads,
			trend: {
				percentage: 32.1,
				trendClassification: TrendClassification.Positive,
			},
			value: 220153310,
		},
	],
};

const MetricsWithData = () => {
	const {changeMetricFilter, filters} = useContext(Context);

	useEffect(() => {
		if (filters.metric === MetricType.Undefined) {
			changeMetricFilter(MetricType.Impressions);
		}
	}, [changeMetricFilter, filters.metric]);

	return <MetricsContent {...metricsMock} />;
};

const WrapperComponent = () => {
	return (
		<ContextProvider assetId="0" assetType={null} groupId="0">
			<MetricsWithData />
		</ContextProvider>
	);
};

describe('CMS Asset Type Info Panel Metrics Component', () => {
	it('renders all cards', async () => {
		const {container} = render(<WrapperComponent />);

		expect(container).toBeInTheDocument();

		const metricsCards = screen.getAllByRole('button');

		expect(metricsCards.length).toBe(3);

		const buttonTexts = metricsCards.map(
			(element) => element.children[0].textContent
		);

		expect(buttonTexts).toEqual([
			MetricType.Impressions,
			MetricType.Views,
			MetricType.Downloads,
		]);
	});

	it('formats the total numbers', () => {
		render(<WrapperComponent />);

		const impressionsCard = screen.getByRole('button', {
			name: /impressions/i,
		});
		const viewsCard = screen.getByRole('button', {name: /views/i});
		const downloadsCard = screen.getByRole('button', {
			name: /downloads/i,
		});

		within(impressionsCard).getByText('11', {selector: '.text-7'});

		within(viewsCard).getByText('25.32K', {selector: '.text-7'});

		within(downloadsCard).getByText('220.15M', {
			selector: '.text-7',
		});
	});

	it('formats the comparison numbers', () => {
		render(<WrapperComponent />);

		const impressionsCard = screen.getByRole('button', {
			name: /impressions/i,
		});
		const viewsCard = screen.getByRole('button', {name: /views/i});
		const downloadsCard = screen.getByRole('button', {
			name: /downloads/i,
		});

		const impressionsComparisonElement =
			within(impressionsCard).getByText(/0%/i);
		expect(impressionsComparisonElement.textContent).toBe('0%');

		const viewsComparisonElement = within(viewsCard).getByText(/12\.3%/i);
		expect(viewsComparisonElement.textContent).toBe('12.3%');

		const downloadsComparisonElement =
			within(downloadsCard).getByText(/32\.1%/i);
		expect(downloadsComparisonElement.textContent).toBe('32.1%');
	});

	it('uses the right colors to render the comparison numbers', () => {
		render(<WrapperComponent />);

		const impressionsComparisonText = screen.getByText(/0%/i);
		expect(impressionsComparisonText).toHaveClass('text-secondary');

		const viewsCardComparisonText = screen.getByText(/12.3%/i);
		expect(viewsCardComparisonText).toHaveClass('text-danger');

		const downloadsCardComparisonText = screen.getByText(/32.1%/i);
		expect(downloadsCardComparisonText).toHaveClass('text-success');
	});

	it('allows keyboard navigation and selection', async () => {
		render(<WrapperComponent />);

		const impressionsCard = screen.getByRole('button', {
			name: /impressions/i,
		});
		const viewsCard = screen.getByRole('button', {name: /views/i});
		const downloadsCard = screen.getByRole('button', {
			name: /downloads/i,
		});

		expect(impressionsCard).toHaveAttribute('aria-pressed', 'true');

		await userEvent.tab();
		expect(impressionsCard).toHaveFocus();

		await userEvent.tab();
		expect(viewsCard).toHaveFocus();

		await userEvent.tab();
		expect(downloadsCard).toHaveFocus();

		await userEvent.keyboard('{enter}');

		await waitFor(() => {
			expect(impressionsCard).toHaveAttribute('aria-pressed', 'false');
			expect(viewsCard).toHaveAttribute('aria-pressed', 'false');
			expect(downloadsCard).toHaveAttribute('aria-pressed', 'true');
		});

		await userEvent.tab({shift: true});

		expect(viewsCard).toHaveFocus();

		await userEvent.keyboard(' ');

		await waitFor(() => {
			expect(impressionsCard).toHaveAttribute('aria-pressed', 'false');
			expect(viewsCard).toHaveAttribute('aria-pressed', 'true');
			expect(downloadsCard).toHaveAttribute('aria-pressed', 'false');
		});
	});
});

const renderTableViewMetric = (metricType: MetricType) => {
	return render(
		<Context.Provider
			value={{
				assetId: '0',
				assetType: null,
				changeIndividualFilter: jest.fn(),
				changeMetricFilter: jest.fn(),
				changeRangeSelectorFilter: jest.fn(),
				filters: {
					individual: Individuals.AllIndividuals,
					metric: metricType,
					rangeSelector: RangeSelectors.Last24Hours,
				},
				groupId: '0',
			}}
		>
			<TableView />
		</Context.Provider>
	);
};

describe('TableView with different metrics', () => {
	it('renders table correctly with metric "Views" and displays data', () => {
		renderTableViewMetric(MetricType.Views);

		expect(screen.getByText(/views/i)).toBeInTheDocument();

		const rows = screen.getAllByRole('row');
		expect(rows.length).toBeGreaterThan(1);

		const firstDataRow = rows[1] as HTMLTableRowElement;

		const dateCellText = firstDataRow.cells[0].textContent || '';
		expect(dateCellText).toMatch(
			/(\d{2}\/\d{2}\/\d{4})|(\d{4}-\d{2}-\d{2})|([A-Za-z]{3} \d{1,2})/
		);

		const valueCellText = firstDataRow.cells[1].textContent || '';
		const previousCellText = firstDataRow.cells[2].textContent || '';

		expect(valueCellText).toMatch(/[\d,.]+/);
		expect(previousCellText).toMatch(/[\d,.]+/);
	});

	it('renders table correctly with metric "Impressions" and displays data', () => {
		renderTableViewMetric(MetricType.Impressions);

		expect(screen.getByText(/impressions/i)).toBeInTheDocument();

		const rows = screen.getAllByRole('row');
		expect(rows.length).toBeGreaterThan(1);

		const firstDataRow = rows[1] as HTMLTableRowElement;

		const dateCellText = firstDataRow.cells[0].textContent || '';
		expect(dateCellText).toMatch(
			/(\d{2}\/\d{2}\/\d{4})|(\d{4}-\d{2}-\d{2})|([A-Za-z]{3} \d{1,2})/
		);

		const valueCellText = firstDataRow.cells[1].textContent || '';
		const previousCellText = firstDataRow.cells[2].textContent || '';

		expect(valueCellText).toMatch(/[\d,.]+/);
		expect(previousCellText).toMatch(/[\d,.]+/);
	});

	it('renders table correctly with metric "Downloads" and displays data', () => {
		renderTableViewMetric(MetricType.Downloads);

		expect(screen.getByText(/downloads/i)).toBeInTheDocument();

		const rows = screen.getAllByRole('row');
		expect(rows.length).toBeGreaterThan(1);

		const firstDataRow = rows[1] as HTMLTableRowElement;

		const dateCellText = firstDataRow.cells[0].textContent || '';
		expect(dateCellText).toMatch(
			/(\d{2}\/\d{2}\/\d{4})|(\d{4}-\d{2}-\d{2})|([A-Za-z]{3} \d{1,2})/
		);

		const valueCellText = firstDataRow.cells[1].textContent || '';
		const previousCellText = firstDataRow.cells[2].textContent || '';

		expect(valueCellText).toMatch(/[\d,.]+/);
		expect(previousCellText).toMatch(/[\d,.]+/);
	});

	it('renders pagination component', () => {
		renderTableViewMetric(MetricType.Views);

		const paginationButton = screen.getByLabelText('Go to page, 1');

		expect(paginationButton).toBeInTheDocument();
	});

	it('changes number of items displayed when selecting items per page', async () => {
		renderTableViewMetric(MetricType.Views);

		const itemsPerPageButton = screen.getByRole('button', {
			name: /items per page/i,
		});
		expect(itemsPerPageButton).toBeInTheDocument();

		await userEvent.click(itemsPerPageButton);

		const menu = await screen.findByRole('menu');

		const option20 = within(menu).getByText(/20 items/i, {
			selector: 'button',
		});
		expect(option20).toBeInTheDocument();

		await userEvent.click(option20);

		const rows = screen.getAllByRole('row');
		expect(rows.length).toBeLessThanOrEqual(21);
	});
});
