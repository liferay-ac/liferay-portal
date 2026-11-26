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

	it('describes the sync step with Analytics Cloud for a non-LDP workspace', () => {
		render(<ConnectSalesforce />);

		expect(
			screen.getByText(
				'Select which Salesforce data you would like to sync to Analytics Cloud.'
			)
		).toBeInTheDocument();
	});

	it('describes the sync step with Liferay Data Platform for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		render(<ConnectSalesforce />);

		expect(
			screen.getByText(
				'Select which Salesforce data you would like to sync to Liferay Data Platform.'
			)
		).toBeInTheDocument();
	});
});
