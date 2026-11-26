import mockStore from 'test/mock-store';
import React from 'react';
import {cleanup, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router';
import {TrackedBehaviors} from '../TrackedBehaviors';
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

describe('TrackedBehaviorsList', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<TrackedBehaviors groupId='23' />
				</MemoryRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});

describe('TrackedBehaviors product naming', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('shows the Analytics Cloud text for a non-LDP workspace', () => {
		render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<TrackedBehaviors groupId='23' />
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByText(/behaviors tracked within Analytics Cloud\./)).toBeInTheDocument();
	});

	it('shows the Liferay Data Platform text for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<TrackedBehaviors groupId='23' />
				</MemoryRouter>
			</Provider>
		);

		expect(
			screen.getByText(
				/behaviors tracked within Liferay Data Platform\. Instructions for tracking third party assets in Liferay Data Platform/
			)
		).toBeInTheDocument();
	});
});
