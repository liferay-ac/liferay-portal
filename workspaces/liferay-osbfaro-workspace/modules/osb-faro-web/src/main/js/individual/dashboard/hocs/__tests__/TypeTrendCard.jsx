import React from 'react';
import ReactDOM from 'react-dom';
import TypeTrendCard from '../TypeTrendCard';
import {render} from 'test/render';
import {mockIndividualMetricsReq} from 'test/graphql-data';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		channelId: '123123'
	})
}));

ReactDOM.createPortal = jest.fn();

describe('TypeTrendCard', () => {
	xit('should render', () => {
		const {container} = render(<TypeTrendCard channelId='123123' />, {
			apolloMocks: [mockIndividualMetricsReq()]
		});

		jest.runAllTimers();

		expect(container).toMatchSnapshot();
	});
});
