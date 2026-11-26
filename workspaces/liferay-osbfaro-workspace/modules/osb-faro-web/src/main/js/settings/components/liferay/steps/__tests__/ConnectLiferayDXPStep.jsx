import React from 'react';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {ConnectLiferayDXPStep} from '../ConnectLiferayDXPStep';
import {MemoryRouter} from 'react-router-dom';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

jest.mock('shared/api/data-source', () => ({
	...jest.requireActual('shared/api/data-source'),
	fetchToken: jest.fn(() => Promise.resolve('token'))
}));

jest.mock('settings/components/base-page/WizardPageContext', () => {
	const {Map} = jest.requireActual('immutable');

	return {
		useWizardPage: () => ({
			dataSource: Map({status: 'ACTIVE'}),
			refetchDataSource: jest.fn()
		})
	};
});

jest.mock('shared/components/modals/DisconnectDataSourceModal', () => ({
	__esModule: true,
	default: ({message}) => <div>{message}</div>
}));

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn()
}));

const renderStep = () =>
	render(
		<MemoryRouter>
			<ConnectLiferayDXPStep
				addAlert={jest.fn()}
				groupId='23'
				onNext={jest.fn()}
			/>
		</MemoryRouter>
	);

describe('ConnectLiferayDXPStep', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('names the Analytics Cloud workspace in the disconnect confirmation for a non-LDP workspace', () => {
		renderStep();

		fireEvent.click(screen.getByText('Disconnect Data Source'));

		expect(
			screen.getByText(
				'This action will stop syncing data from your Liferay DXP instance to this Analytics Cloud workspace. The data that was already synced will remain available in the properties the data source was connected to. Are you sure you want to continue?'
			)
		).toBeInTheDocument();
	});

	it('names the Liferay Data Platform workspace in the disconnect confirmation for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		renderStep();

		fireEvent.click(screen.getByText('Disconnect Data Source'));

		expect(
			screen.getByText(
				'This action will stop syncing data from this data source to this Liferay Data Platform workspace. The data that was already synced will remain available in the properties the data source was connected to. Are you sure you want to continue?'
			)
		).toBeInTheDocument();
	});
});
