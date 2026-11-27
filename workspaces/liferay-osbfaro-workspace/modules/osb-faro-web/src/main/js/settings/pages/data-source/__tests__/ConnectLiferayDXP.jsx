import ConnectLiferayDXP from '../ConnectLiferayDXP';
import React from 'react';
import {cleanup, render, screen} from '@testing-library/react';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

jest.mock('settings/components/base-page/WizardPage', () => ({
	__esModule: true,
	default: ({steps}) => (
		<ul>
			{steps.map(({description}) => (
				<li key={description}>{description}</li>
			))}
		</ul>
	)
}));

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn()
}));

describe('ConnectLiferayDXP', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it.each`
		ldpEnabled | description
		${false}   | ${/^connect your dxp instance to analytics cloud to start tracking users visits and interactions within your sites\.$/i}
		${true}    | ${/^connect your dxp instance to liferay data platform to start tracking users' visits and interactions within your sites\.$/i}
	`(
		'describes the connection step for the plan when ldpEnabled is $ldpEnabled',
		({description, ldpEnabled}) => {
			useLDPEnabled.mockReturnValue(ldpEnabled);

			render(<ConnectLiferayDXP />);

			expect(screen.getByText(description)).toBeInTheDocument();
		}
	);
});
