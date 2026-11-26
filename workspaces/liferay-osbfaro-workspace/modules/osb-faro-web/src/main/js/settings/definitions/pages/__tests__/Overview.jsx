import * as Constants from 'shared/util/constants';
import mockStore from 'test/mock-store';
import React from 'react';
import {ENABLE_BLOCKLIST_KEYWORDS} from 'shared/util/feature-flags';
import {Overview} from '../Overview';
import {Provider} from 'react-redux';
import {cleanup, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
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

describe('Definitions Overview', () => {
	it('should render a list of definitions that includes individuals, accounts, behaviors, events, search and interests', () => {
		// TODO: LRAC-4511 Remove DEVELOPER_MODE
		Constants.DEVELOPER_MODE = true;

		const {container} = render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<Overview groupId='23' />
				</MemoryRouter>
			</Provider>
		);

		jest.runAllTimers();

		expect(
			container.querySelectorAll('.list-group-title a')[0]
		).toHaveTextContent(/individuals/i);

		expect(
			container.querySelectorAll('.list-group-title a')[1]
		).toHaveTextContent(/accounts/i);

		expect(
			container.querySelectorAll('.list-group-title a')[2]
		).toHaveTextContent(/behaviors/i);

		expect(
			container.querySelectorAll('.list-group-title a')[3]
		).toHaveTextContent(/events/i);

		expect(
			container.querySelectorAll('.list-group-title a')[4]
		).toHaveTextContent(/event attributes/i);

		expect(
			container.querySelectorAll('.list-group-title a')[5]
		).toHaveTextContent(/search/i);

		if (ENABLE_BLOCKLIST_KEYWORDS) {
			expect(
				container.querySelectorAll('.list-group-title a')[6]
			).toHaveTextContent(/interests/i);
		}
	});
});

describe('Definitions Overview product naming', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('shows the Analytics Cloud text for a non-LDP workspace', () => {
		Constants.DEVELOPER_MODE = true;

		render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<Overview groupId='23' />
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByText(/^View and manage the tracked behaviors in Analytics Cloud\./)).toBeInTheDocument();
	});

	it('shows the Liferay Data Platform text for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		Constants.DEVELOPER_MODE = true;

		render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<Overview groupId='23' />
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByText(/^View and manage the tracked behaviors in Liferay Data Platform\./)).toBeInTheDocument();
	});
});
