/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom/extend-expect';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {Metrics} from '../../../../../src/main/resources/META-INF/resources/js/main/components/Metrics';
import {Metric} from '../../../../../src/main/resources/META-INF/resources/js/main/components/info_panel/tab_content/PerformanceTabContent';

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

describe('CMS Asset Type Info Panel Metrics Component', () => {
	it('renders all cards', async () => {
		const {container} = render(
			<Metrics
				metrics={metricsMock}
				selectedMetric="Impressions"
				setSelectedMetric={() => {}}
			/>
		);

		expect(container).toBeInTheDocument();

		const metricsCards = screen.getAllByRole('button');

		expect(metricsCards.length).toBe(3);

		const buttonTexts = metricsCards.map(
			(element) => element.children[0].textContent
		);

		expect(buttonTexts).toEqual(['IMPRESSIONS', 'VIEWS', 'DOWNLOADS']);
	});

	it('formats the total numbers', () => {
		render(
			<Metrics
				metrics={metricsMock}
				selectedMetric="Impressions"
				setSelectedMetric={() => {}}
			/>
		);

		const impressionsCard = screen.getByRole('button', {
			name: /impressions/i,
		});
		const viewsCard = screen.getByRole('button', {name: /views/i});
		const downloadsCard = screen.getByRole('button', {
			name: /downloads/i,
		});

		within(impressionsCard).getByText('11', {selector: '.body > .text-7'});

		within(viewsCard).getByText('25.32K', {selector: '.body > .text-7'});

		within(downloadsCard).getByText('220.15M', {
			selector: '.body > .text-7',
		});
	});

	it('formats the comparison numbers', () => {
		render(
			<Metrics
				metrics={metricsMock}
				selectedMetric="Impressions"
				setSelectedMetric={() => {}}
			/>
		);

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
		render(
			<Metrics
				metrics={metricsMock}
				selectedMetric="Impressions"
				setSelectedMetric={() => {}}
			/>
		);

		const impressionsComparisonText = screen.getByText(/0%/i);
		expect(impressionsComparisonText).toHaveClass('text-secondary');

		const viewsCardComparisonText = screen.getByText(/12.3%/i);
		expect(viewsCardComparisonText).toHaveClass('text-danger');

		const downloadsCardComparisonText = screen.getByText(/32.1%/i);
		expect(downloadsCardComparisonText).toHaveClass('text-success');
	});

	it('allows keyboard navigation and selection', async () => {
		const setSelectedMetricMock = jest.fn();
		render(
			<Metrics
				metrics={metricsMock}
				selectedMetric="Impressions"
				setSelectedMetric={setSelectedMetricMock}
			/>
		);

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
		expect(setSelectedMetricMock).toHaveBeenCalledWith('Downloads');

		await userEvent.tab({shift: true});
		expect(viewsCard).toHaveFocus();
		await userEvent.keyboard(' ');
		expect(setSelectedMetricMock).toHaveBeenCalledWith('Views');
	});
});
