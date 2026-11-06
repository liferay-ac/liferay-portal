import * as API from 'shared/api';
import CampaignUtmParameters, {toCardProps} from '../CampaignUtmParameters';
import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

jest.unmock('react-dom');

const fetchCampaignAcquisitionProperties = API.campaigns
	.fetchCampaignAcquisitionProperties as jest.Mock;

const renderComponent = (initialEntry = '/') =>
	render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<CampaignUtmParameters
				campaignId="7"
				channelId="123"
				groupId="23"
			/>
		</MemoryRouter>
	);

describe('CampaignUtmParameters', () => {
	beforeEach(() => {
		fetchCampaignAcquisitionProperties.mockReset();
		fetchCampaignAcquisitionProperties.mockResolvedValue([]);
	});

	it('should ask for the campaign it names, within the selected range', async () => {
		renderComponent('/?rangeKey=7');

		await waitFor(() =>
			expect(fetchCampaignAcquisitionProperties).toHaveBeenCalledWith({
				channelId: '123',
				groupId: '23',
				id: '7',
				rangeQueryValues: {rangeKey: '7'},
			})
		);
	});

	it('should send a custom range as its bounds alone', async () => {
		renderComponent(
			'/?rangeEnd=2026-10-31&rangeKey=CUSTOM&rangeStart=2026-10-01'
		);

		await waitFor(() =>
			expect(fetchCampaignAcquisitionProperties).toHaveBeenCalledWith(
				expect.objectContaining({
					rangeQueryValues: {
						rangeEnd: '2026-10-31',
						rangeStart: '2026-10-01',
					},
				})
			)
		);
	});

	it('should render the fetched parameters in the card', async () => {
		fetchCampaignAcquisitionProperties.mockResolvedValue([
			{custom: true, name: 'utm_region', values: ['emea']},
			{custom: false, name: 'utm_source', values: ['google']},
		]);

		renderComponent();

		fireEvent.click(
			await screen.findByRole('button', {name: /UTM Parameters/})
		);

		expect(screen.getByText('google')).toBeInTheDocument();
		expect(screen.getByText('utm_region')).toBeInTheDocument();
		expect(screen.getByText('emea')).toBeInTheDocument();
	});
});

describe('toCardProps', () => {
	it('should key the standard parameters in camel case and keep the rest as custom', () => {
		expect(
			toCardProps([
				{custom: false, name: 'utm_campaign', values: ['q3']},
				{custom: true, name: 'utm_region', values: ['emea']},
				{custom: false, name: 'utm_source', values: ['google', 'bing']},
			])
		).toEqual({
			customParameters: [{name: 'utm_region', values: ['emea']}],
			utmParameters: {
				utmCampaign: ['q3'],
				utmSource: ['google', 'bing'],
			},
		});
	});
});
