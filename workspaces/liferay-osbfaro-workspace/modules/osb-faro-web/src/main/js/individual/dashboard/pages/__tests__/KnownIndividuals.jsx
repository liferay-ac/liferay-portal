import {useDataSources} from 'shared/context/dataSources';
import * as API from 'shared/api';
import KnownIndividuals from '../KnownIndividuals';
import React from 'react';
import {render} from 'test/render';
import {mockEmptyState, mockSuccessState} from 'test/__mocks__/mock-objects';
import {RangeKeyTimeRanges} from 'shared/util/constants';
import {Routes} from 'shared/util/router';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.mock('shared/context/dataSources', () => ({
	...jest.requireActual('shared/context/dataSources'),
	useDataSources: jest.fn(),
}));

const renderKnownIndividuals = () =>
	render(<KnownIndividuals />, {
		path: `${Routes.CONTACTS_INDIVIDUALS_KNOWN_INDIVIDUALS}/*`,
		route: '/workspace/23/321321/contacts/individuals/known-individuals'
	});

describe('Individuals Dashboard KnownIndividuals List', () => {
	it('renders', async () => {
		useDataSources.mockReturnValue(mockSuccessState);

		const {container} = renderKnownIndividuals();

		await waitForLoadingToBeRemoved(container);

		jest.runAllTimers();

		expect(
			container.querySelector(
				'.individuals-dashboard-known-individuals-root'
			)
		).toBeInTheDocument();
	});

	it('renders with data source empty state', () => {
		useDataSources.mockReturnValue(mockEmptyState);

		const {getByText} = renderKnownIndividuals();

		expect(getByText(/^no data sources are connected$/i)).toBeInTheDocument();
	});

	it('searches with the last year range key', async () => {
		useDataSources.mockReturnValue(mockSuccessState);

		const {container} = renderKnownIndividuals();

		await waitForLoadingToBeRemoved(container);

		jest.runAllTimers();

		expect(API.individuals.search).toHaveBeenCalledWith(
			expect.objectContaining({
				rangeKey: RangeKeyTimeRanges.LastYear,
			})
		);
	});
});
