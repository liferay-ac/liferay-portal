import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {cleanup, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {User} from 'shared/util/records';
import {User as UserRoutes} from '../index';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn(() => false),
}));

jest.mock('shared/hooks/useCurrentUser', () => ({
	useCurrentUser: jest.fn()
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		groupId: '23'
	})
}));

const DefaultComponent = props => (
	<Provider store={mockStore()}>
		<BrowserRouter>
			<UserRoutes {...props} />
		</BrowserRouter>
	</Provider>
);

describe('UserRoutes', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('should render', () => {
		useCurrentUser.mockImplementation(() => ({
			isAdmin: () => true
		}));

		const {container} = render(<DefaultComponent />);

		expect(container).toMatchSnapshot();
	});

	it('if the user is AC Admin, then the tabs for toggling between users and user requests should render', () => {
		useCurrentUser.mockImplementation(() => ({
			isAdmin: () => true
		}));

		const {getByRole} = render(<DefaultComponent />);

		expect(
			getByRole('link', {name: /^manage users$/i})
		).toBeInTheDocument();
		expect(getByRole('link', {name: /^requests$/i})).toBeInTheDocument();
	});

	it('if the user is NOT an AC Admin, then the tabs for toggling between users and user requests should NOT render', () => {
		useCurrentUser.mockImplementation(() => ({
			isAdmin: () => false
		}));

		const {queryByRole} = render(
			<DefaultComponent
				currentUser={data.getImmutableMock(User, data.mockMemberUser)}
			/>
		);

		expect(
			queryByRole('link', {name: /^manage users$/i})
		).not.toBeInTheDocument();
		expect(
			queryByRole('link', {name: /^requests$/i})
		).not.toBeInTheDocument();
	});

	it('asks to invite users to Liferay Data Platform in an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		useCurrentUser.mockImplementation(() => ({
			isAdmin: () => true
		}));

		render(<DefaultComponent />);

		expect(
			screen.getByText(/^invite new users to liferay data platform/i)
		).toBeInTheDocument();
	});
});
