import React from 'react';
import TopCampaigns from '../TopCampaigns';
import {ClayLinkContext} from '@clayui/link';
import {render, screen} from '@testing-library/react';
import {useParams} from 'react-router-dom';

jest.unmock('react-dom');

jest.mock('@liferay/frontend-data-set-web', () => ({
	...jest.requireActual('@liferay/frontend-data-set-web'),
	FrontendDataSet: () => <div data-testid="fds-component" />,
}));

jest.mock('shared/components/dropdown-range-key/DropdownRangeKey', () => ({
	DropdownRangeKey: () => <div data-testid="dropdown-range-key" />,
}));

jest.mock('shared/hooks/useHistoryAdapter', () => ({
	useHistoryAdapter: () => ({push: jest.fn()}),
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useLocation: () => ({search: ''}),
	useParams: jest.fn(),
}));

const mockedUseParams = useParams as jest.Mock;

// Stands in for the router link, so the state a link carries shows up in the
// markup.

const StateLink = React.forwardRef<HTMLAnchorElement, any>(
	({children, href, state, ...otherProps}, ref) => (
		<a
			{...otherProps}
			data-state={JSON.stringify(state ?? null)}
			href={href}
			ref={ref}
		>
			{children}
		</a>
	)
);

const renderTopCampaigns = (props = {}) =>
	render(
		<ClayLinkContext.Provider value={StateLink}>
			<TopCampaigns {...props} />
		</ClayLinkContext.Provider>
	);

const getViewAll = () => screen.getByRole('link', {name: 'View All'});

const getViewAllHref = () => getViewAll().getAttribute('href')!;

const getViewAllState = () =>
	JSON.parse(getViewAll().getAttribute('data-state')!);

describe('TopCampaigns', () => {
	beforeEach(() => {
		mockedUseParams.mockReturnValue({
			channelId: '456',
			groupId: '23',
			id: 'acc-1',
		});
	});

	it('should render the card title', () => {
		renderTopCampaigns({accountName: 'IQVIA'});

		expect(screen.getByText('TOP CAMPAIGNS')).toBeInTheDocument();
	});

	it('should link to the campaigns without the account in the URL', () => {
		renderTopCampaigns({accountName: 'IQVIA'});

		const href = getViewAllHref();

		expect(href).toContain('/campaigns');
		expect(href).not.toContain('/campaigns/');
		expect(href).not.toContain('accountId');
		expect(href).not.toContain('accountName');
	});

	it('should carry the account to the campaigns in the router state', () => {
		renderTopCampaigns({accountName: 'IQVIA'});

		expect(getViewAllState()).toEqual({
			campaignAccount: {id: 'acc-1', name: 'IQVIA'},
		});
	});

	it('should name the account by its id while its name is loading', () => {
		renderTopCampaigns();

		expect(getViewAllState()).toEqual({
			campaignAccount: {id: 'acc-1', name: 'acc-1'},
		});
	});

	it('should render neither the list nor the link while the account id is missing', () => {
		mockedUseParams.mockReturnValue({channelId: '456', groupId: '23'});

		renderTopCampaigns({accountName: 'IQVIA'});

		expect(screen.queryByTestId('fds-component')).not.toBeInTheDocument();
		expect(
			screen.queryByRole('link', {name: 'View All'})
		).not.toBeInTheDocument();
	});
});
