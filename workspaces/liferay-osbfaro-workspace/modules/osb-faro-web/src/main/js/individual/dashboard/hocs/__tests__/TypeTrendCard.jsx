import React from 'react';
import TypeTrendCard from '../TypeTrendCard';
import {MockedProvider} from '@apollo/client/testing';
import {mockIndividualMetricsReq} from 'test/graphql-data';
import {render, screen} from '@testing-library/react';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		channelId: '123123',
	}),
}));

describe('TypeTrendCard', () => {
	it('should show the total, known and anonymous individuals of the channel', async () => {
		render(
			<MockedProvider mocks={[mockIndividualMetricsReq()]}>
				<TypeTrendCard />
			</MockedProvider>
		);

		expect(await screen.findByText(/^total individuals$/i)).toBeInTheDocument();
		expect(screen.getByText(/^known$/i)).toBeInTheDocument();
		expect(screen.getByText(/^anonymous$/i)).toBeInTheDocument();
	});
});
