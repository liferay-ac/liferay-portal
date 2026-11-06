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
			{
				fieldName: null,
				name: 'utm_region',
				standard: false,
				value: 'emea',
			},
			{
				fieldName: null,
				name: 'utm_source',
				standard: true,
				value: 'google',
			},
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
	const property = (name: string, standard: boolean, value: string) => ({
		fieldName: null,
		name,
		standard,
		value,
	});

	it('should group the values by name in the order the API sends them', () => {
		expect(
			toCardProps([
				property('utm_campaign', true, 'q3'),
				property('utm_region', false, 'emea'),
				property('utm_source', true, 'google'),
				property('utm_source', true, 'bing'),
			])
		).toEqual({
			customParameters: [{name: 'utm_region', values: ['emea']}],
			utmParameters: {
				utmCampaign: ['q3'],
				utmSource: ['google', 'bing'],
			},
		});
	});

	it('should group the values of a custom parameter under its own name', () => {
		expect(
			toCardProps([
				property('utm_partner', false, 'acme'),
				property('utm_partner', false, 'globex'),
				property('utm_region', false, 'emea'),
			]).customParameters
		).toEqual([
			{name: 'utm_partner', values: ['acme', 'globex']},
			{name: 'utm_region', values: ['emea']},
		]);
	});

	it('should return nothing to list for an empty response', () => {
		expect(toCardProps([])).toEqual({
			customParameters: [],
			utmParameters: {},
		});
	});
});
