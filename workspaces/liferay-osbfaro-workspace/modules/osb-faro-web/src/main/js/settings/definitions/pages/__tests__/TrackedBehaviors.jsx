import mockStore from 'test/mock-store';
import React from 'react';
import {render} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router';
import {TrackedBehaviors} from '../TrackedBehaviors';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		groupId: '23'
	})
}));

describe('TrackedBehaviorsList', () => {
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
