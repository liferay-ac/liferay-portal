import * as API from 'shared/api';
import FilterByAccount from '../FilterByAccount';
import React from 'react';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.unmock('react-dom');

const MOCK_ACCOUNT = (id: string, name: string) => ({
	id,
	name,
});

const Wrapper = ({children}: {children: React.ReactNode}) => (
	<MemoryRouter
		initialEntries={[
			'/workspace/123/456/sites/touchpoints/http%3A%2F%2Fliferay.com/Liferay%20DXP%20-%20Home',
		]}
	>
		<Route path="/workspace/:groupId/:channelId/sites/touchpoints/:touchpoint/:title">
			{children}
		</Route>
	</MemoryRouter>
);

const AssetWrapper = ({children}: {children: React.ReactNode}) => (
	<MemoryRouter
		initialEntries={[
			'/workspace/123/456/assets/blogs/999/page/http%3A%2F%2Fliferay.com/Liferay%20DXP%20-%20Home',
		]}
	>
		<Route path="/workspace/:groupId/:channelId/assets/blogs/:assetId/page/:touchpoint/:title">
			{children}
		</Route>
	</MemoryRouter>
);

describe('FilterByAccount', () => {
	afterEach(cleanup);

	it('should render', async () => {
		(API.accounts.searchAccounts as jest.Mock).mockReturnValue(
			Promise.resolve({
				items: [MOCK_ACCOUNT('100', 'Account 100')],
				total: 1,
			})
		);

		const {container} = render(
			<Wrapper>
				<FilterByAccount assetType="page" onFilterChange={jest.fn()} />
			</Wrapper>
		);

		await waitForLoadingToBeRemoved(container);

		expect(screen.getByText('Filter')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('should open dropdown w/ no accounts empty state', async () => {
		(API.accounts.searchAccounts as jest.Mock).mockReturnValue(
			Promise.resolve({
				items: [],
				total: 0,
			})
		);

		const {container} = render(
			<Wrapper>
				<FilterByAccount assetType="page" onFilterChange={jest.fn()} />
			</Wrapper>
		);

		await waitForLoadingToBeRemoved(container);

		fireEvent.click(screen.getByText('Filter'));

		expect(screen.getByText('Filter By Account')).toBeInTheDocument();
		expect(
			screen.getByText('There are no results found.')
		).toBeInTheDocument();
	});

	it('should open dropdown w/ a list of accounts', async () => {
		(API.accounts.searchAccounts as jest.Mock).mockReturnValue(
			Promise.resolve({
				items: [
					MOCK_ACCOUNT('100', 'Account 100'),
					MOCK_ACCOUNT('200', 'Account 200'),
					MOCK_ACCOUNT('999', 'Account 999'),
				],
				total: 3,
			})
		);

		const {container} = render(
			<Wrapper>
				<FilterByAccount assetType="page" onFilterChange={jest.fn()} />
			</Wrapper>
		);

		await waitForLoadingToBeRemoved(container);

		fireEvent.click(screen.getByText('Filter'));

		expect(screen.getByText('Account 100')).toBeInTheDocument();
		expect(screen.getByText('Account 200')).toBeInTheDocument();
		expect(screen.getByText('Account 999')).toBeInTheDocument();
	});

	it('should open dropdown w/ no accounts found empty state', async () => {
		(API.accounts.searchAccounts as jest.Mock).mockReturnValue(
			Promise.resolve({
				items: [MOCK_ACCOUNT('100', 'Account 100')],
				total: 1,
			})
		);

		const {container} = render(
			<Wrapper>
				<FilterByAccount assetType="page" onFilterChange={jest.fn()} />
			</Wrapper>
		);

		await waitForLoadingToBeRemoved(container);

		fireEvent.click(screen.getByText('Filter'));

		expect(screen.getByText('Account 100')).toBeInTheDocument();

		fireEvent.change(screen.getByRole('textbox'), {
			target: {value: 'Account 200'},
		});

		expect(
			screen.getByText('There are no results found.')
		).toBeInTheDocument();
	});

	it('should open dropdown w/ accounts and select one of them', async () => {
		const onFilterChange = jest.fn();

		(API.accounts.searchAccounts as jest.Mock).mockReturnValue(
			Promise.resolve({
				items: [MOCK_ACCOUNT('100', 'Account 100')],
				total: 1,
			})
		);

		const {container} = render(
			<Wrapper>
				<FilterByAccount
					assetType="page"
					onFilterChange={onFilterChange}
				/>
			</Wrapper>
		);

		await waitForLoadingToBeRemoved(container);

		fireEvent.click(screen.getByText('Filter'));

		fireEvent.click(screen.getByText('Account 100'));

		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({id: '100', name: 'Account 100'})
		);

		expect(container.querySelector('.label')).toBeInTheDocument();
	});

	it('should open dropdown w/ accounts, select one of them, and then, remove filter', async () => {
		const onFilterChange = jest.fn();

		(API.accounts.searchAccounts as jest.Mock).mockReturnValue(
			Promise.resolve({
				items: [MOCK_ACCOUNT('100', 'Account 100')],
				total: 1,
			})
		);

		const {container} = render(
			<Wrapper>
				<FilterByAccount
					assetType="page"
					onFilterChange={onFilterChange}
				/>
			</Wrapper>
		);

		await waitForLoadingToBeRemoved(container);

		fireEvent.click(screen.getByText('Filter'));

		fireEvent.click(screen.getByText('Account 100'));

		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({id: '100', name: 'Account 100'})
		);

		fireEvent.click(screen.getByTitle('Close'));

		expect(container.querySelector('.label')).not.toBeInTheDocument();

		expect(onFilterChange).toHaveBeenCalledWith(null);
	});

	it('should search accounts by the canonical URL for the page asset type', async () => {
		(API.accounts.searchAccounts as jest.Mock).mockReturnValue(
			Promise.resolve({items: [], total: 0})
		);

		const {container} = render(
			<Wrapper>
				<FilterByAccount assetType="page" onFilterChange={jest.fn()} />
			</Wrapper>
		);

		await waitForLoadingToBeRemoved(container);

		expect(API.accounts.searchAccounts).toHaveBeenCalledWith(
			expect.objectContaining({
				assetId: 'http://liferay.com',
				assetTitle: 'Liferay DXP - Home',
				assetType: 'page',
			})
		);
	});

	it('should search accounts by the assetId route param for non-page asset types', async () => {
		(API.accounts.searchAccounts as jest.Mock).mockReturnValue(
			Promise.resolve({items: [], total: 0})
		);

		const {container} = render(
			<AssetWrapper>
				<FilterByAccount assetType="blog" onFilterChange={jest.fn()} />
			</AssetWrapper>
		);

		await waitForLoadingToBeRemoved(container);

		expect(API.accounts.searchAccounts).toHaveBeenCalledWith(
			expect.objectContaining({
				assetId: '999',
				assetTitle: 'Liferay DXP - Home',
				assetType: 'blog',
			})
		);
	});
});
