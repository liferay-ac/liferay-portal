import ConnectSalesforce from '../ConnectSalesforce';
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

describe('ConnectSalesforce', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it.each`
		ldpEnabled | description
		${false}   | ${/^select which salesforce data you would like to sync to analytics cloud\.$/i}
		${true}    | ${/^select which salesforce data you would like to sync to liferay data platform\.$/i}
	`(
		'describes the sync step for the plan when ldpEnabled is $ldpEnabled',
		({description, ldpEnabled}) => {
			useLDPEnabled.mockReturnValue(ldpEnabled);

			render(<ConnectSalesforce />);

			expect(screen.getByText(description)).toBeInTheDocument();
		}
	);
});
