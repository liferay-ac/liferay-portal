import InterestsCard from '../InterestsCard';
import React from 'react';
import {act, cleanup, render, waitFor} from 'test/render';
import {
	mockCompositionBag,
	mockIndividualInterestsReq
} from 'test/graphql-data';
import {omit} from 'lodash';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		channelId: '456',
		groupId: '123'
	})
}));

describe('InterestsCard', () => {
	afterEach(cleanup);

	it('renders', async () => {
		const {getByText} = render(
			<InterestsCard />, {
			apolloMocks: [
				mockIndividualInterestsReq(variables =>
					omit(variables, 'keywords')
				)
			]
		}
		);

		await act(async () => {
			await jest.advanceTimersByTimeAsync(0);
		});

		await waitFor(() =>
			expect(
				getByText(/^top interests as of yesterday$/i)
			).toBeInTheDocument()
		);
	});

	it('renders with empty data', async () => {
		const {getByText} = render(
			<InterestsCard />, {
			apolloMocks: [
				mockIndividualInterestsReq(
					variables => omit(variables, 'keywords'),
					{
						data: mockCompositionBag({
							compositionBagName: 'individualInterests',
							compositions: []
						})
					}
				)
			]
		}
		);

		await act(async () => {
			await jest.advanceTimersByTimeAsync(0);
		});

		await waitFor(() =>
			expect(
				getByText(/^no interests were found\.$/i)
			).toBeInTheDocument()
		);
	});
});
