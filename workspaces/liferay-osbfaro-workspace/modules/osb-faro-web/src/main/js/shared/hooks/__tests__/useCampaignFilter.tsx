import React from 'react';
import {act, renderHook} from '@testing-library/react';
import {
	CampaignFilterProvider,
	CampaignFilterCampaign,
} from 'shared/context/campaignFilter';
import {MemoryRouter} from 'react-router-dom';
import {useCampaignFilter} from '../useCampaignFilter';

jest.unmock('react-dom');

const SPRING = {id: '7', name: 'Spring'};

const createWrapper =
	(
		initialEntry = '/',
		initialCampaign: CampaignFilterCampaign | null = null
	) =>
	({children}: {children?: React.ReactNode}) => (
		<MemoryRouter initialEntries={[initialEntry]}>
			<CampaignFilterProvider initialCampaign={initialCampaign}>
				{children}
			</CampaignFilterProvider>
		</MemoryRouter>
	);

describe('useCampaignFilter', () => {
	it('should start with no campaign selected', () => {
		const {result} = renderHook(() => useCampaignFilter(), {
			wrapper: createWrapper(),
		});

		expect(result.current.campaignId).toBeUndefined();
		expect(result.current.campaignName).toBeUndefined();
	});

	it('should start with the initial campaign when one is given', () => {
		const {result} = renderHook(() => useCampaignFilter(), {
			wrapper: createWrapper('/', SPRING),
		});

		expect(result.current.campaignId).toBe('7');
		expect(result.current.campaignName).toBe('Spring');
	});

	it('should not read the campaign from the URL', () => {
		const {result} = renderHook(() => useCampaignFilter(), {
			wrapper: createWrapper('/?campaignId=7&campaignName=Spring'),
		});

		expect(result.current.campaignId).toBeUndefined();
		expect(result.current.campaignName).toBeUndefined();
	});

	it('should hold the campaign picked', () => {
		const {result} = renderHook(() => useCampaignFilter(), {
			wrapper: createWrapper(),
		});

		act(() => result.current.setCampaign(SPRING));

		expect(result.current.campaignId).toBe('7');
		expect(result.current.campaignName).toBe('Spring');
	});

	it('should clear the campaign when null is picked', () => {
		const {result} = renderHook(() => useCampaignFilter(), {
			wrapper: createWrapper('/', SPRING),
		});

		act(() => result.current.setCampaign(null));

		expect(result.current.campaignId).toBeUndefined();
		expect(result.current.campaignName).toBeUndefined();
	});

	it('should share the campaign between the consumers of one provider', () => {
		const {result} = renderHook(
			() => ({
				first: useCampaignFilter(),
				second: useCampaignFilter(),
			}),
			{wrapper: createWrapper()}
		);

		act(() => result.current.first.setCampaign(SPRING));

		expect(result.current.second.campaignId).toBe('7');
	});

	it('should keep the campaign picked out of the URL', () => {
		window.history.pushState({}, '', '/');

		const {result} = renderHook(() => useCampaignFilter(), {
			wrapper: createWrapper(),
		});

		act(() => result.current.setCampaign(SPRING));

		expect(window.location.search).toBe('');
	});

	it('should throw when used outside the provider', () => {
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		expect(() => renderHook(() => useCampaignFilter())).toThrow(
			'useCampaignFilter must be used within a CampaignFilterProvider'
		);

		consoleSpy.mockRestore();
	});
});
