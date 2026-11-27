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

describe('ProjectStateDisplay', () => {
	it.each`
		state                        | ldpEnabled
		${ProjectStates.Maintenance} | ${false}
		${ProjectStates.Unavailable} | ${true}
	`(
		'passes the project plan through to the $state screen',
		({ldpEnabled, state}) => {
			useLDPEnabled.mockReturnValue(ldpEnabled);

			render(<ProjectStateDisplay project={{groupId: '23', state}} />);

			expect(useLDPEnabled).toHaveBeenCalledWith({groupId: '23'});

			expect(
				screen.getByText(`WorkspacesErrorDisplay ${state} ${ldpEnabled}`)
			).toBeInTheDocument();
		}
	);
});
