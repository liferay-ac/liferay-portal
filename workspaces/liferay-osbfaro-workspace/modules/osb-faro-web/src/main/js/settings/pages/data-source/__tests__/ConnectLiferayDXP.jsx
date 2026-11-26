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

	it('describes the connection step with Analytics Cloud for a non-LDP workspace', () => {
		render(<ConnectLiferayDXP />);

		expect(
			screen.getByText(
				'Connect your DXP instance to Analytics Cloud to start tracking users visits and interactions within your sites.'
			)
		).toBeInTheDocument();
	});

	it('describes the connection step with Liferay Data Platform for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		render(<ConnectLiferayDXP />);

		expect(
			screen.getByText(
				"Connect your DXP instance to Liferay Data Platform to start tracking users' visits and interactions within your sites."
			)
		).toBeInTheDocument();
	});
});
