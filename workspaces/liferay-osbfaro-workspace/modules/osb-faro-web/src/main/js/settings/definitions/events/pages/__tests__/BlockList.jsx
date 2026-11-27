import BlockList from '../BlockList';
import client from 'shared/apollo/client';
import mockStore from 'test/mock-store';
import React from 'react';
import {ApolloProvider} from '@apollo/client';
import {Provider} from 'react-redux';
import {render, screen} from '@testing-library/react';
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
	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

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

	it('shows the Liferay Data Platform description for an LDP workspace', () => {
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

		expect(screen.getByText(/^blocked events are not processed by liferay data platform\.$/i)).toBeInTheDocument();
	});
});
