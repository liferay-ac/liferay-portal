import React from 'react';
import {
	buildCampaignAccountState,
	CampaignAccountFilterProvider,
	useCampaignAccountFilter,
} from '../CampaignAccountFilterContext';
import {MemoryRouter, useLocation, useNavigate} from 'react-router-dom';
import {act, renderHook} from '@testing-library/react';

jest.unmock('react-dom');

const ACME = {id: '9', name: 'Acme'};

const createWrapper =
	(initialEntry: any = '/', initialAccount = null) =>
	({children}: {children: React.ReactNode}) => (
		<MemoryRouter initialEntries={[initialEntry]}>
			<CampaignAccountFilterProvider initialAccount={initialAccount}>
				{children}
			</CampaignAccountFilterProvider>
		</MemoryRouter>
	);

const entryWith = (state: unknown, search = '') => ({
	pathname: '/campaigns',
	search,
	state,
});

describe('CampaignAccountFilterContext', () => {
	it('should start with no account selected', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper: createWrapper(),
		});

		expect(result.current.accountId).toBeUndefined();
		expect(result.current.accountName).toBeUndefined();
	});

	it('should start with the initial account when one is given', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper: createWrapper('/', ACME as any),
		});

		expect(result.current.accountId).toBe('9');
		expect(result.current.accountName).toBe('Acme');
	});

	it('should start with the account a link carries in the router state', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper: createWrapper(entryWith(buildCampaignAccountState(ACME))),
		});

		expect(result.current.accountId).toBe('9');
		expect(result.current.accountName).toBe('Acme');
	});

	it('should name the account by its id when the state carries no name', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper: createWrapper(entryWith({campaignAccount: {id: '9'}})),
		});

		expect(result.current.accountId).toBe('9');
		expect(result.current.accountName).toBe('9');
	});

	it('should prefer the account in the router state over the initial one', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper: createWrapper(
				entryWith(buildCampaignAccountState({id: '1', name: 'Other'})),
				ACME as any
			),
		});

		expect(result.current.accountId).toBe('1');
		expect(result.current.accountName).toBe('Other');
	});

	it('should ignore a router state that does not carry an account', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper: createWrapper(entryWith({campaignAccount: {id: 7}})),
		});

		expect(result.current.accountId).toBeUndefined();
	});

	it('should not read the account from the URL', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper: createWrapper('/?accountId=9&accountName=Acme'),
		});

		expect(result.current.accountId).toBeUndefined();
		expect(result.current.accountName).toBeUndefined();
	});

	it('should clear the state from the history entry, keeping the address', () => {
		const {result} = renderHook(
			() => ({
				filter: useCampaignAccountFilter(),
				location: useLocation(),
			}),
			{
				wrapper: createWrapper(
					entryWith(buildCampaignAccountState(ACME), '?rangeKey=7')
				),
			}
		);

		expect(result.current.location.state).toBeNull();
		expect(result.current.location.pathname).toBe('/campaigns');
		expect(result.current.location.search).toBe('?rangeKey=7');
		expect(result.current.filter.accountId).toBe('9');
	});

	it('should take an account that a link carries after the first render', () => {
		const {result} = renderHook(
			() => ({
				filter: useCampaignAccountFilter(),
				navigate: useNavigate(),
			}),
			{wrapper: createWrapper()}
		);

		act(() =>
			result.current.navigate('/campaigns', {
				state: buildCampaignAccountState(ACME),
			})
		);

		expect(result.current.filter.accountId).toBe('9');
	});

	it('should hold the account picked', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper: createWrapper(),
		});

		act(() => result.current.setAccount(ACME));

		expect(result.current.accountId).toBe('9');
		expect(result.current.accountName).toBe('Acme');
	});

	it('should clear the account when null is picked', () => {
		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper: createWrapper(entryWith(buildCampaignAccountState(ACME))),
		});

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
			{wrapper: createWrapper()}
		);

		act(() => result.current.first.setAccount(ACME));

		expect(result.current.second.accountId).toBe('9');
	});

	it('should keep the account picked out of the URL', () => {
		window.history.pushState({}, '', '/');

		const {result} = renderHook(() => useCampaignAccountFilter(), {
			wrapper: createWrapper(),
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
