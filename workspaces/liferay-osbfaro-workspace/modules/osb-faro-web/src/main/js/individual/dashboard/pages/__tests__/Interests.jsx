import {useDataSources} from 'shared/context/dataSources';
import Interests from '../Interests';
import React from 'react';
import {cleanup, render} from 'test/render';
import {mockEmptyState, mockSuccessState} from 'test/__mocks__/mock-objects';
import {mockIndividualInterestsReq} from 'test/graphql-data';
import {Routes} from 'shared/util/router';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.mock('shared/context/dataSources', () => ({
	...jest.requireActual('shared/context/dataSources'),
	useDataSources: jest.fn(),
}));

const renderInterests = () =>
	render(<Interests />, {
		apolloMocks: [
			mockIndividualInterestsReq(defaultVars => ({
				...defaultVars,
				id: undefined,
				keywords: '',
				size: 2
			}))
		],
		path: `${Routes.CONTACTS_INDIVIDUALS_INTERESTS}/*`,
		route: '/workspace/123/456/contacts/individuals/interests'
	});

describe('Individuals Dashboard Individuals Interests', () => {
	afterEach(cleanup);

	it('renders', async () => {
		useDataSources.mockReturnValue(mockSuccessState);

		const {getByText} = renderInterests();

		await waitForLoadingToBeRemoved(document.body);

		jest.runAllTimers();

		expect(getByText(/^interest topics$/i)).toBeInTheDocument();
	});

	it('renders with data source empty state', () => {
		useDataSources.mockReturnValue(mockEmptyState);

		const {getByText} = renderInterests();

		expect(
			getByText(/^no sites have been synced from data sources$/i)
		).toBeInTheDocument();
	});
});
