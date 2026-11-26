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
		errorType                    | text
		${ProjectStates.Maintenance} | ${/^analytics cloud is undergoing scheduled maintenance\./i}
		${ProjectStates.Unavailable} | ${/^analytics cloud is temporarily unavailable\./i}
	`(
		'shows the Analytics Cloud $errorType message for a non-LDP workspace',
		({errorType, text}) => {
			renderErrorDisplay({errorType});

			expect(screen.getByText(text)).toBeInTheDocument();
		}
	);

	it.each`
		errorType                    | text
		${ProjectStates.Maintenance} | ${/^liferay data platform is undergoing scheduled maintenance\./i}
		${ProjectStates.Unavailable} | ${/^liferay data platform is temporarily unavailable\./i}
	`(
		'shows the Liferay Data Platform $errorType message for an LDP workspace',
		({errorType, text}) => {
			renderErrorDisplay({errorType, ldpEnabled: true});

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
