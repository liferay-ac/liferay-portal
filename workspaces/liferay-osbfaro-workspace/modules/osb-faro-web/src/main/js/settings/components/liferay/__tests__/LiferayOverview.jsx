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

	it('names Liferay Data Platform in the authentication message for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		render(<WrappedComponent />);

		expect(
			screen.getByText(
				/^you have successfully authenticated your token with liferay data platform\. you can now select the data to sync\.$/i
			)
		).toBeInTheDocument();
	});

	it.each([
		{
			instructions:
				/between the liferay dxp instance and liferay analytics cloud, copy the token below and go to dxp instance settings > analytics cloud to/i,
			ldpEnabled: false,
			tokenLabel: /^analytics cloud token$/i
		},
		{
			instructions:
				/between the liferay dxp instance and liferay data platform, copy the token below and go to dxp instance settings > liferay data platform to/i,
			ldpEnabled: true,
			tokenLabel: /^liferay data platform token$/i
		}
	])(
		'names the product in the reconnection instructions when ldpEnabled is $ldpEnabled',
		({instructions, ldpEnabled, tokenLabel}) => {
			useLDPEnabled.mockReturnValue(ldpEnabled);

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

			expect(screen.getByText(instructions)).toBeInTheDocument();
			expect(screen.getByText(tokenLabel)).toBeInTheDocument();
		}
	);
});
