import Events from '../Events';
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
		groupId: '23'
	})
}));

describe('Events', () => {
	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<Events groupId='23' />
				</MemoryRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});

	it('shows the Liferay Data Platform description for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		render(
			<ApolloProvider client={client}>
				<Provider store={mockStore()}>
					<MemoryRouter>
						<Events groupId='23' />
					</MemoryRouter>
				</Provider>
			</ApolloProvider>
		);

		expect(screen.getByText(/^this is the data model of events sent to liferay data platform\.$/i)).toBeInTheDocument();
	});
});
