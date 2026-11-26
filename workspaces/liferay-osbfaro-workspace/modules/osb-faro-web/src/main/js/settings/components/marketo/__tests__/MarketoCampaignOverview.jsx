import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import MarketoCampaignOverview from '../MarketoCampaignOverview';
import {cleanup, render, screen} from '@testing-library/react';
import {DataSource} from 'shared/util/records';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {MockedProvider} from '@apollo/client/testing';
import {Provider} from 'react-redux';
import {useRequest} from 'shared/hooks/useRequest';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn()
}));

jest.mock('shared/hooks/useRequest', () => ({
	useRequest: jest.fn()
}));

jest.mock('shared/hooks/useCurrentUser', () => ({
	useCurrentUser: () => ({isAdmin: () => true})
}));

const WrappedComponent = props => (
	<Provider store={mockStore()}>
		<MemoryRouter
			initialEntries={['/workspace/23/settings/data-source/test']}
		>
			<Routes>
				<Route
					element={
						<MockedProvider addTypename={false}>
							<MarketoCampaignOverview {...props} />
						</MockedProvider>
					}
					path='/workspace/:groupId/settings/data-source/:id'
				/>
			</Routes>
		</MemoryRouter>
	</Provider>
);

describe('MarketoCampaignOverview', () => {
	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	afterEach(cleanup);

	it('should render the connected data source with the synced leads and companies count', async () => {
		useRequest.mockReturnValue({
			data: 10,
			loading: false
		});

		const {container} = render(
			<WrappedComponent
				dataSource={data.getImmutableMock(
					DataSource,
					data.mockMarketoCampaignDataSource
				)}
			/>
		);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});

	it('should render the reconnect view when the data source is disconnected', async () => {
		useRequest.mockReturnValue({
			data: 10,
			loading: false
		});

		const {container} = render(
			<WrappedComponent
				dataSource={data.getImmutableMock(
					DataSource,
					data.mockMarketoCampaignDataSource,
					1,
					{
						state: 'DISCONNECTED',
						status: 'INACTIVE'
					}
				)}
			/>
		);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});

	it('should render an error when the count requests fail', async () => {
		useRequest.mockReturnValue({
			error: true,
			loading: false
		});

		const {container} = render(
			<WrappedComponent
				dataSource={data.getImmutableMock(
					DataSource,
					data.mockMarketoCampaignDataSource
				)}
			/>
		);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});

	it.each`
		ldpEnabled | productName
		${false}   | ${'Liferay Analytics Cloud'}
		${true}    | ${'Liferay Data Platform'}
	`(
		'names $productName in the authentication message when ldpEnabled is $ldpEnabled',
		({ldpEnabled, productName}) => {
			useLDPEnabled.mockReturnValue(ldpEnabled);
			useRequest.mockReturnValue({data: 10, loading: false});

			render(
				<WrappedComponent
					dataSource={data.getImmutableMock(
						DataSource,
						data.mockMarketoCampaignDataSource
					)}
				/>
			);

			expect(
				screen.getByText(
					`You have successfully authenticated your credentials with ${productName}. You can now select the data to sync.`
				)
			).toBeInTheDocument();
		}
	);

	it.each`
		ldpEnabled | message
		${false}   | ${'To reestablish the connection between Marketo and Liferay Analytics Cloud, check your credentials and paste on the input below.'}
		${true}    | ${'To reestablish the connection between Marketo and Liferay Data Platform, check your credentials and paste them in the field below.'}
	`(
		'shows the reconnection instructions for the plan when ldpEnabled is $ldpEnabled',
		({ldpEnabled, message}) => {
			useLDPEnabled.mockReturnValue(ldpEnabled);
			useRequest.mockReturnValue({data: 10, loading: false});

			render(
				<WrappedComponent
					dataSource={data.getImmutableMock(
						DataSource,
						data.mockMarketoCampaignDataSource,
						1,
						{state: 'DISCONNECTED', status: 'INACTIVE'}
					)}
				/>
			);

			expect(screen.getByText(message)).toBeInTheDocument();
		}
	);
});
