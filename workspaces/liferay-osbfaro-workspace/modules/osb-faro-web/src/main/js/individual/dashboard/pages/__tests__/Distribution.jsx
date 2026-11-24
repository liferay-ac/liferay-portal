import {useDataSources} from 'shared/context/dataSources';
import * as data from 'test/data';
import React from 'react';
import {cleanup, render} from 'test/render';
import {IndividualsDistribution} from '../Distribution';
import {mockEmptyState, mockSuccessState} from 'test/__mocks__/mock-objects';
import {User} from 'shared/util/records';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		groupId: '123'
	})
}));

jest.mock('shared/context/dataSources', () => ({
	...jest.requireActual('shared/context/dataSources'),
	useDataSources: jest.fn(),
}));

const defaultProps = {
	currentUser: new User(data.mockUser()),
	groupId: '123'
};

describe('Individuals Dashboard Distribution', () => {
	afterEach(cleanup);

	it('renders', () => {
		useDataSources.mockReturnValue(mockSuccessState);

		const {container} = render(<IndividualsDistribution {...defaultProps} />);

		expect(
			container.querySelector('.individuals-dashboard-distribution-root')
		).toBeInTheDocument();
	});

	it('renders with data source empty state', () => {
		useDataSources.mockReturnValue(mockEmptyState);

		const {getByText} = render(<IndividualsDistribution {...defaultProps} />);

		expect(getByText(/^no data sources are connected$/i)).toBeInTheDocument();
	});
});
