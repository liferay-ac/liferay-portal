import * as data from 'test/data';
import LiferayOverview from '../LiferayOverview';
import mockStore from 'test/mock-store';
import React from 'react';
import {DataSource} from 'shared/util/records';
import {MemoryRouter, Route, Routes as RouterRoutes} from 'react-router-dom';
import {MockedProvider} from '@apollo/client/testing';
import {Provider} from 'react-redux';
import {DataSourceStatuses} from 'shared/util/constants';
import {render, screen} from '@testing-library/react';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

jest.mock('shared/api/data-source', () => ({
	...jest.requireActual('shared/api/data-source'),
	fetchToken: jest.fn(() => new Promise(() => {}))
}));

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn()
}));

jest.mock('shared/hooks/useCurrentUser', () => ({
	useCurrentUser: () => ({
		isAdmin: () => true
	})
}));

jest.mock('shared/hooks/useRequest', () => ({
	useRequest: () => ({
		data: {
			channelsCount: 5,
			groupsCount: 10,
			individualsCount: 100
		},
		loading: false
	})
}));

const defaultProps = {
	dataSource: new DataSource(data.mockLiferayDataSource())
};

const WrappedComponent = props => (
	<Provider store={mockStore()}>
		<MemoryRouter
			initialEntries={['/workspace/23/settings/data-source/test']}
		>
			<RouterRoutes>
				<Route
					element={
						<MockedProvider>
							<LiferayOverview {...defaultProps} {...props} />
						</MockedProvider>
					}
					path='/workspace/:groupId/settings/data-source/:id/*'
				/>
			</RouterRoutes>
		</MemoryRouter>
	</Provider>
);

describe('LiferayOverview', () => {
	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('should render', async () => {
		const {container} = render(<WrappedComponent />);

		expect(container).toMatchSnapshot();
	});

	it('names Analytics Cloud in the authentication message for a non-LDP workspace', () => {
		render(<WrappedComponent />);

		expect(
			screen.getByText(
				'You have successfully authenticated your token with Liferay Analytics Cloud. You can now select the data to sync.'
			)
		).toBeInTheDocument();
	});

	it('names Liferay Data Platform in the authentication message for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		render(<WrappedComponent />);

		expect(
			screen.getByText(
				'You have successfully authenticated your token with Liferay Data Platform. You can now select the data to sync.'
			)
		).toBeInTheDocument();
	});

	it('names Analytics Cloud in the reconnection instructions for a non-LDP workspace', () => {
		render(
			<WrappedComponent
				dataSource={
					new DataSource(
						data.mockLiferayDataSource(1, {
							status: DataSourceStatuses.Inactive
						})
					)
				}
			/>
		);

		expect(
			screen.getByText(
				'To reestablish the connection between the Liferay DXP instance and Liferay Analytics Cloud, copy the token below and go to DXP instance settings > Analytics Cloud to continue the data source configuration.'
			)
		).toBeInTheDocument();
		expect(screen.getByText('Analytics Cloud Token')).toBeInTheDocument();
	});

	it('names Liferay Data Platform in the reconnection instructions for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		render(
			<WrappedComponent
				dataSource={
					new DataSource(
						data.mockLiferayDataSource(1, {
							status: DataSourceStatuses.Inactive
						})
					)
				}
			/>
		);

		expect(
			screen.getByText(
				'To reestablish the connection between the Liferay DXP instance and Liferay Data Platform, copy the token below and go to DXP Instance Settings > Liferay Data Platform to continue the data source configuration.'
			)
		).toBeInTheDocument();
		expect(screen.getByText('Liferay Data Platform Token')).toBeInTheDocument();
	});
});
