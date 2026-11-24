import ActiveIndividualsCard from '../ActiveIndividualsCard';
import React from 'react';
import {cleanup, render} from 'test/render';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useLocation: () => ({
		search: '?rangeKey=30'
	}),
	useParams: () => ({
		channelId: '456'
	})
}));

describe('ActiveIndividualsCard', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<ActiveIndividualsCard />
		);
		expect(container).toMatchSnapshot();
	});
});
