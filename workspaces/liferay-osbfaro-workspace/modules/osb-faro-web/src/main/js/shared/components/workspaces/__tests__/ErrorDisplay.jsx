import mockStore from 'test/mock-store';
import React from 'react';
import WorkspacesErrorDisplay from '../ErrorDisplay';
import {BrowserRouter} from 'react-router-dom';
import {ProjectStates} from 'shared/util/constants';
import {Provider} from 'react-redux';
import {render, screen} from '@testing-library/react';
import {User} from 'shared/util/records';

const renderErrorDisplay = (props) =>
	render(
		<Provider store={mockStore()}>
			<BrowserRouter>
				<WorkspacesErrorDisplay {...props} />
			</BrowserRouter>
		</Provider>
	);

describe('WorkspacesErrorDisplay', () => {
	it.each`
		errorType                    | ldpEnabled | text
		${ProjectStates.Maintenance} | ${false}   | ${/^analytics cloud is undergoing scheduled maintenance\./i}
		${ProjectStates.Unavailable} | ${false}   | ${/^analytics cloud is temporarily unavailable\./i}
		${ProjectStates.Maintenance} | ${true}    | ${/^liferay data platform is undergoing scheduled maintenance\./i}
		${ProjectStates.Unavailable} | ${true}    | ${/^liferay data platform is temporarily unavailable\./i}
	`(
		'names the product of the plan in the $errorType message (ldpEnabled: $ldpEnabled)',
		({errorType, ldpEnabled, text}) => {
			renderErrorDisplay({errorType, ldpEnabled});

			expect(screen.getByText(text)).toBeInTheDocument();
		}
	);

	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<WorkspacesErrorDisplay
						currentUser={
							new User({emailAddress: 'test@liferay.com'})
						}
					/>
				</BrowserRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
