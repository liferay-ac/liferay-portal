import {useDataSources} from 'shared/context/dataSources';
import * as data from 'test/data';
import BasePage from 'shared/components/base-page';
import React from 'react';
import {Dashboard} from '../index';
import {mockEmptyState, mockSuccessState} from 'test/__mocks__/mock-objects';
import {cleanup, render} from 'test/render';
import {Routes} from 'shared/util/router';
import {User} from 'shared/util/records';
import {UserRoleNames} from 'shared/util/constants';

jest.mock('../Overview', () => () => null);

const MEMBER_USER = new User(
	data.mockUser(23, {roleName: UserRoleNames.Member})
);

const MOCK_CONTEXT = {
	rangeKey: {defaultValue: '30'},
	router: {
		params: {
			channelId: '123',
			groupId: '2000'
		},
		query: {
			rangeKey: '30'
		}
	}
};

jest.mock('shared/context/dataSources', () => ({
	...jest.requireActual('shared/context/dataSources'),
	useDataSources: jest.fn(),
}));

const BasePageContext = ({children}) => (
	<BasePage.Context.Provider value={MOCK_CONTEXT}>
		{children}
	</BasePage.Context.Provider>
);

const renderDashboard = options =>
	render(
		<Dashboard currentUser={MEMBER_USER} router={MOCK_CONTEXT.router} />,
		{
			path: `${Routes.SITES}/*`,
			route: '/workspace/2000/123/sites',
			wrapper: BasePageContext,
			...options
		}
	);

describe('Sites Dashboard Index', () => {
	afterEach(cleanup);
	useDataSources.mockReturnValue(mockSuccessState);

	beforeAll(() => {
		delete window.location;
	});

	it('renders w/ "No Sites Are Connected" as title', () => {
		window.location = {
			pathname: '/workspace/2000/123/sites'
		};

		const CHANNEL_CONTEXT_MOCK = {
			channelDispatch: () => {},
			channels: [],
			selectedChannel: null
		};

		const {container} = renderDashboard({channel: CHANNEL_CONTEXT_MOCK});

		expect(container.querySelector('.title-section')).toHaveTextContent(
			/no sites are connected/i
		);
	});
});

describe('sites with no Data Source', () => {
	it('should render EmptyState', () => {
		window.location = {
			pathname: '/workspace/2000/123/sites'
		};
		useDataSources.mockReturnValue(mockEmptyState);

		const {getByText} = renderDashboard();

		expect(
			getByText(/^no sites have been synced from data sources$/i)
		).toBeInTheDocument();
		expect(
			getByText(/^connect a data source with sites data\.$/i)
		).toBeInTheDocument();
		expect(
			getByText(/^access our documentation to learn more\.$/i)
		).toBeInTheDocument();
	});
});
