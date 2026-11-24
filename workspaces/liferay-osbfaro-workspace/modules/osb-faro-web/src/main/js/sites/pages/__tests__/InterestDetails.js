import InterestDetails from '../InterestDetails';
import React from 'react';
import {render} from 'test/render';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useLocation: () => ({
		search: '?rangeKey=30',
	}),
	useParams: () => ({
		channelId: '456',
		groupId: '123',
		query: {
			rangeKey: '30',
		},
	}),
}));

describe('Sites Dashboard InterestDetails', () => {
	it('render', () => {
		const {container} = render(
			<InterestDetails
				channelName="Test Channel"
				router={{
					params: {channelId: '456', groupId: '123'},
					query: {rangeKey: '30'},
				}}
			/>
		);

		expect(container).toMatchSnapshot();
	});
});
