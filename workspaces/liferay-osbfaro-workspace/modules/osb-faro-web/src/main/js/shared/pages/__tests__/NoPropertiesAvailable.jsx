jest.mock('shared/components/modals/onboarding-modal', () => () => (
	<div data-testid="onboarding-modal" />
));

import * as API from 'shared/api';
import mockStore, {mockStoreDataLDP} from 'test/mock-store';
import NoPropertiesAvailable from '../NoPropertiesAvailable';
import React from 'react';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {getImmutableMock, mockMemberUser, mockUser} from 'test/data';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router';
import {User} from 'shared/util/records';
import {waitForLoadingToBeRemoved} from 'test/helpers';

const DefaultComponent = ({store = mockStore(), ...props}) => (
	<Provider store={store}>
		<MemoryRouter>
			<NoPropertiesAvailable
				currentUser={getImmutableMock(User, mockUser)}
				groupId='123123'
				{...props}
			/>
		</MemoryRouter>
	</Provider>
);

describe('NoPropertiesAvailable', () => {
	afterEach(cleanup);

	it('should render', async () => {
		API.dataSource.search.mockReturnValueOnce(Promise.resolve({total: 0}));

		const {container} = render(<DefaultComponent />);

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});

	it('should not display the "Start" button to trigger onboarding if the user is not an AC admin', () => {
		const {queryByRole} = render(
			<DefaultComponent
				currentUser={getImmutableMock(User, mockMemberUser)}
			/>
		);

		jest.runAllTimers();

		expect(queryByRole('button')).toBeNull();
	});

	it.each`
		plan                       | storeData           | text
		${'Analytics Cloud'}       | ${undefined}        | ${/^you have not been added to any properties\. please contact your analytics cloud administrator\.$/i}
		${'Liferay Data Platform'} | ${mockStoreDataLDP} | ${/^you have not been added to any properties\. please contact your liferay data platform administrator\.$/i}
	`(
		'asks a member to contact the $plan administrator',
		async ({storeData, text}) => {
			API.dataSource.search.mockReturnValueOnce(
				Promise.resolve({total: 1})
			);

			const {container, queryByText} = render(
				<DefaultComponent
					currentUser={getImmutableMock(User, mockMemberUser)}
					groupId='23'
					store={mockStore(storeData)}
				/>
			);

			jest.runAllTimers();

			await waitForLoadingToBeRemoved(container);

			expect(queryByText(text)).toBeInTheDocument();
		}
	);

	it('should open the onboarding modal on "Start" click', async () => {
		API.dataSource.search.mockReturnValueOnce(Promise.resolve({total: 0}));

		const {container, queryByText} = render(<DefaultComponent />);

		expect(screen.queryByTestId('onboarding-modal')).toBeNull();

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		fireEvent.click(queryByText(/^start$/i));

		expect(await screen.findByTestId('onboarding-modal')).toBeInTheDocument();
	});
});
