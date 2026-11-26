import BlockList from '../BlockList';
import client from 'shared/apollo/client';
import mockStore from 'test/mock-store';
import React from 'react';
import {ApolloProvider} from '@apollo/client';
import {Provider} from 'react-redux';
import {cleanup, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn(() => false),
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		channelId: '456',
		groupId: '2000'
	})
}));

describe('BlockList', () => {
	it('should render', () => {
		const {container} = render(
			<ApolloProvider client={client}>
				<Provider store={mockStore()}>
					<MemoryRouter>
						<BlockList groupId='23' />
					</MemoryRouter>
				</Provider>
			</ApolloProvider>
		);

		expect(container).toMatchSnapshot();
	});
});

describe('BlockList product naming', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('shows the Analytics Cloud text for a non-LDP workspace', () => {
		render(
			<ApolloProvider client={client}>
				<Provider store={mockStore()}>
					<MemoryRouter>
						<BlockList groupId='23' />
					</MemoryRouter>
				</Provider>
			</ApolloProvider>
		);

		expect(screen.getByText('Blocked events are not processed by Analytics Cloud.')).toBeInTheDocument();
	});

	it('shows the Liferay Data Platform text for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		render(
			<ApolloProvider client={client}>
				<Provider store={mockStore()}>
					<MemoryRouter>
						<BlockList groupId='23' />
					</MemoryRouter>
				</Provider>
			</ApolloProvider>
		);

		expect(screen.getByText('Blocked events are not processed by Liferay Data Platform.')).toBeInTheDocument();
	});
});
