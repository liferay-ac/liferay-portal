import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import SalesforceOverview from '../SalesforceOverview';
import {cleanup, render, screen} from '@testing-library/react';
import {DataSource} from 'shared/util/records';
import {fetchChannelDatasources} from 'shared/api/data-source';
import {MemoryRouter, Route, Routes as RouterRoutes} from 'react-router-dom';
import {MockedProvider} from '@apollo/client/testing';
import {Provider} from 'react-redux';
import {useRequest} from 'shared/hooks/useRequest';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.mock('shared/api/connector', () => ({
	fetchConnectorEntityCount: entity => entity
}));

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn()
}));

jest.mock('shared/hooks/useRequest', () => ({
	useRequest: jest.fn()
}));

const mockCountResponses = countResponses => {
	useRequest.mockImplementation(({dataSourceFn, variables}) => {
		if (dataSourceFn === fetchChannelDatasources) {
			return {data: 10, loading: false};
		}

		return countResponses[dataSourceFn(variables)];
	});
};

jest.mock('shared/hooks/useCurrentUser', () => ({
	useCurrentUser: () => ({isAdmin: () => true})
}));

const defaultProps = {
	dataSource: data.getImmutableMock(DataSource, data.mockSalesforceDataSource)
};

const WrappedComponent = props => (
	<Provider store={mockStore()}>
		<MemoryRouter
			initialEntries={['/workspace/23/settings/data-source/test']}
		>
			<RouterRoutes>
				<Route
					element={
						<MockedProvider addTypename={false}>
							<SalesforceOverview {...defaultProps} {...props} />
						</MockedProvider>
					}
					path='/workspace/:groupId/settings/data-source/:id/*'
				/>
			</RouterRoutes>
		</MemoryRouter>
	</Provider>
);

describe('SalesforceOverview', () => {
	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);

		useRequest.mockReturnValue({
			data: 10,
			loading: false
		});
	});

	afterEach(cleanup);

	it('should render', async () => {
		const {container} = render(<WrappedComponent />);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});

	it('should render the campaigns synced count', async () => {
		mockCountResponses({
			accounts: {data: 120, loading: false},
			campaigns: {data: 1204, loading: false},
			users: {data: 340, loading: false}
		});

		const {container, getByText} = render(<WrappedComponent />);

		await waitForLoadingToBeRemoved(container);

		expect(getByText(/^campaigns$/i)).toBeTruthy();
		expect(getByText('1,204 Items Synced')).toBeTruthy();
	});

	it('should render the error display when the campaigns count fails', async () => {
		mockCountResponses({
			accounts: {data: 120, loading: false},
			campaigns: {error: true, loading: false},
			users: {data: 340, loading: false}
		});

		const {getByText, queryByText} = render(<WrappedComponent />);

		expect(getByText(/^an unexpected error occurred\.$/i)).toBeTruthy();
		expect(queryByText(/items synced/i)).toBeNull();
	});

	it('names Liferay Data Platform in the authentication message for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		render(<WrappedComponent />);

		expect(
			screen.getByText(
				/^you have successfully authenticated your token with liferay data platform\. you can now select the data to sync\.$/i
			)
		).toBeInTheDocument();
	});

	it.each`
		ldpEnabled | message
		${false}   | ${/^to reestablish the connection between salesforce and liferay analytics cloud, check your credentials and paste on the input below\.$/i}
		${true}    | ${/^to reestablish the connection between salesforce and liferay data platform, check your credentials and paste them in the field below\.$/i}
	`(
		'shows the reconnection instructions for the plan when ldpEnabled is $ldpEnabled',
		({ldpEnabled, message}) => {
			useLDPEnabled.mockReturnValue(ldpEnabled);

			render(
				<WrappedComponent
					dataSource={data.getImmutableMock(
						DataSource,
						data.mockSalesforceDataSource,
						1,
						{state: 'DISCONNECTED', status: 'INACTIVE'}
					)}
				/>
			);

			expect(screen.getByText(message)).toBeInTheDocument();
		}
	);
});
