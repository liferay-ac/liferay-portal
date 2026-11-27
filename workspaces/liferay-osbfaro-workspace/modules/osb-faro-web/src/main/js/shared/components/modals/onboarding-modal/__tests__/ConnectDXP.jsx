import * as API from 'shared/api';
import ConnectDXP from '../ConnectDXP';
import DataSourceQuery from 'shared/queries/DataSourceQuery';
import mockStore, {mockStoreDataLDP} from 'test/mock-store';
import React from 'react';
import {ChannelContext} from 'shared/context/channel';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import {DataSourceTypes, OrderByDirections} from 'shared/util/constants';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from '@apollo/client/testing';
import {Provider} from 'react-redux';

const mockGroupId = '23';

const dataSourceMock = {
	request: {
		query: DataSourceQuery,
		variables: {
			size: 1,
			sort: {column: 'createDate', type: OrderByDirections.Descending},
			type: DataSourceTypes.Liferay
		}
	},
	result: {
		data: {
			dataSources: [
				{
					contactsSyncDetails: {selected: true},
					id: '1',
					sitesSyncDetails: {selected: false}
				}
			]
		}
	}
};

const Wrapper = ({
	channelDispatch = jest.fn(),
	children,
	mocks = [],
	store = mockStore(),
}) => (
	<Provider store={store}>
		<MemoryRouter>
			<MockedProvider addTypename={false} mocks={mocks}>
				<ChannelContext.Provider
					value={{channelDispatch, selectedChannel: {id: '123'}}}
				>
					{children}
				</ChannelContext.Provider>
			</MockedProvider>
		</MemoryRouter>
	</Provider>
);

describe('ConnectDXP', () => {
	beforeEach(() => {
		API.dataSource.fetchToken.mockReturnValue(
			Promise.resolve('test-token')
		);
		API.channels.fetchAll.mockReturnValue(
			Promise.resolve({
				items: [{id: '123', name: 'Test Channel'}],
				total: 1
			})
		);
	});

	afterEach(cleanup);

	it('should render', async () => {
		const {container} = render(
			<Wrapper>
				<ConnectDXP
					dxpConnected={false}
					groupId={mockGroupId}
					onClose={jest.fn()}
					onDxpConnected={jest.fn()}
				/>
			</Wrapper>
		);

		await waitFor(() =>
			expect(screen.getByDisplayValue('test-token')).toBeInTheDocument()
		);

		expect(container).toMatchSnapshot();
	});

	it('should render connected state', async () => {
		const {container} = render(
			<Wrapper>
				<ConnectDXP
					dxpConnected
					groupId={mockGroupId}
					onClose={jest.fn()}
					onDxpConnected={jest.fn()}
				/>
			</Wrapper>
		);

		expect(
			screen.getByText(/Your DXP instance is connected/i)
		).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('names Liferay Data Platform in the connected heading for an LDP workspace', () => {
		render(
			<Wrapper store={mockStore(mockStoreDataLDP)}>
				<ConnectDXP
					dxpConnected
					groupId={mockGroupId}
					onClose={jest.fn()}
					onDxpConnected={jest.fn()}
				/>
			</Wrapper>
		);

		expect(
			screen.getByText(
				/^your dxp instance is connected to liferay data platform$/i
			)
		).toBeInTheDocument();
	});

	it('names Liferay Data Platform in the connection help for an LDP workspace', async () => {
		render(
			<Wrapper store={mockStore(mockStoreDataLDP)}>
				<ConnectDXP
					dxpConnected={false}
					groupId={mockGroupId}
					onClose={jest.fn()}
					onDxpConnected={jest.fn()}
				/>
			</Wrapper>
		);

		await waitFor(() =>
			expect(screen.getByDisplayValue('test-token')).toBeInTheDocument()
		);

		expect(
			screen.getByText(
				/to learn how to connect liferay dxp to liferay data platform\.?$/i
			)
		).toBeInTheDocument();
	});

	it('should query dataSources without credentialsType', async () => {
		const {container} = render(
			<Wrapper mocks={[dataSourceMock]}>
				<ConnectDXP
					dxpConnected
					groupId={mockGroupId}
					onClose={jest.fn()}
					onDxpConnected={jest.fn()}
				/>
			</Wrapper>
		);

		expect(container).toMatchSnapshot();
	});
});
