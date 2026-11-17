import React from 'react';
import {
	CampaignAccountFilterProvider,
	useCampaignAccountFilter,
} from '../CampaignAccountFilterContext';
import {act, renderHook} from '@testing-library/react';

jest.unmock('react-dom');

const ACME = {id: '9', name: 'Acme'};

const wrapper = ({children}: {children: React.ReactNode}) => (
	<CampaignAccountFilterProvider>{children}</CampaignAccountFilterProvider>
);

describe('CampaignAccountFilterContext', () => {
	it('should start with no account selected', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper,
		});

		expect(result.current.accountId).toBeUndefined();
		expect(result.current.accountName).toBeUndefined();
	});

	it('should start with the initial account when one is given', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper: ({children}) => (
				<CampaignAccountFilterProvider initialAccount={ACME}>
					{children}
				</CampaignAccountFilterProvider>
			),
		});

		expect(result.current.accountId).toBe('9');
		expect(result.current.accountName).toBe('Acme');
	});

	it('should hold the account picked', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper,
		});

		act(() => result.current.setAccount(ACME));

		expect(result.current.accountId).toBe('9');
		expect(result.current.accountName).toBe('Acme');
	});

	it('should clear the account when null is picked', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper,
		});

		act(() => result.current.setAccount(ACME));
		act(() => result.current.setAccount(null));

		expect(result.current.accountId).toBeUndefined();
		expect(result.current.accountName).toBeUndefined();
	});

	it('should share the account between the consumers of one provider', () => {
		const {result} = renderHook(
			() => ({
				first: useCampaignAccountFilter(),
				second: useCampaignAccountFilter(),
			}),
			{wrapper}
		);

		act(() => result.current.first.setAccount(ACME));

		expect(result.current.second.accountId).toBe('9');
	});

	it('should keep the account out of the URL', () => {
		window.history.pushState({}, '', '/');

		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper,
		});

		act(() => result.current.setAccount(ACME));

		expect(window.location.search).toBe('');
	});

	it('should throw when used outside the provider', () => {
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		expect(() => renderHook(() => useCampaignAccountFilter())).toThrow(
			'useCampaignAccountFilter must be used within a CampaignAccountFilterProvider'
		);

		consoleSpy.mockRestore();
	});
});
