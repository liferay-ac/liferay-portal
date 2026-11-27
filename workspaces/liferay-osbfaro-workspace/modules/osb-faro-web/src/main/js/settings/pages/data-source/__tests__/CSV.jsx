import * as API from 'shared/api';
import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import {CSV} from '../CSV';
import {DataSource, User} from 'shared/util/records';
import {Provider} from 'react-redux';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {UserRoleNames} from 'shared/util/constants';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		groupId: '23'
	})
}));

const DefaultComponent = props => (
	<Provider store={mockStore()}>
		<MemoryRouter>
			<CSV
				currentUser={new User(data.mockUser())}
				dataSource={new DataSource(data.mockCSVDataSource())}
				groupId='23'
				id='test'
				{...props}
			/>
		</MemoryRouter>
	</Provider>
);

describe('CSV', () => {
	it('should render', () => {
		const {container, queryByText} = render(<DefaultComponent />);

		expect(queryByText(/Edit CSV/)).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it('should not render an Edit CSV Configuration button if the user role is member', () => {
		const {queryByText} = render(
			<DefaultComponent
				currentUser={
					new User(data.mockUser(0, {roleName: UserRoleNames.Member}))
				}
			/>
		);

		expect(queryByText(/Edit CSV/)).toBeNull();
	});

	it.each`
		ldpEnabled | columnTitle
		${false}   | ${/^analytics cloud field$/i}
		${true}    | ${/^liferay data platform field$/i}
	`(
		'titles the mapped field column with the product when ldpEnabled is $ldpEnabled',
		async ({columnTitle, ldpEnabled}) => {
			API.dataSource.fetchMappingsLite.mockReturnValue(
				Promise.resolve([data.mockMapping(0, {values: ['value']})])
			);

			render(<DefaultComponent ldpEnabled={ldpEnabled} />);

			expect(await screen.findByText(columnTitle)).toBeInTheDocument();
		}
	);
});
