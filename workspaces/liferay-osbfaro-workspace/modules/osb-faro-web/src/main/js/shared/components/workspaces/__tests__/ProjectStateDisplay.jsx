jest.mock(
	'shared/components/workspaces/ErrorDisplay',
	() =>
		({errorType, ldpEnabled}) =>
			`WorkspacesErrorDisplay ${errorType} ${ldpEnabled}`
);

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn(),
}));

import ProjectStateDisplay from '../ProjectStateDisplay';
import React from 'react';
import {ProjectStates} from 'shared/util/constants';
import {render, screen} from '@testing-library/react';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

const renderDisplay = (state) =>
	render(<ProjectStateDisplay project={{groupId: '23', state}} />);

describe('ProjectStateDisplay', () => {
	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('reads the plan of the project being displayed', () => {
		renderDisplay(ProjectStates.Maintenance);

		expect(useLDPEnabled).toHaveBeenCalledWith({groupId: '23'});
	});

	it.each([ProjectStates.Maintenance, ProjectStates.Unavailable])(
		'tells the %s screen that the workspace is not on an LDP plan',
		(state) => {
			renderDisplay(state);

			expect(
				screen.getByText(`WorkspacesErrorDisplay ${state} false`)
			).toBeInTheDocument();
		}
	);

	it.each([ProjectStates.Maintenance, ProjectStates.Unavailable])(
		'tells the %s screen that the workspace is on an LDP plan',
		(state) => {
			useLDPEnabled.mockReturnValue(true);

			renderDisplay(state);

			expect(
				screen.getByText(`WorkspacesErrorDisplay ${state} true`)
			).toBeInTheDocument();
		}
	);
});
