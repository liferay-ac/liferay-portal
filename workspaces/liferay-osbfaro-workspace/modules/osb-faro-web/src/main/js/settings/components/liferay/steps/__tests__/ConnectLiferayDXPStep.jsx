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

	it.each`
		ldpEnabled | message
		${false}   | ${/^this action will stop syncing data from your liferay dxp instance to this analytics cloud workspace\./i}
		${true}    | ${/^this action will stop syncing data from this data source to this liferay data platform workspace\./i}
	`(
		'names the workspace product in the disconnect confirmation when ldpEnabled is $ldpEnabled',
		({ldpEnabled, message}) => {
			useLDPEnabled.mockReturnValue(ldpEnabled);

			renderStep();

			fireEvent.click(screen.getByText(/^disconnect data source$/i));

			expect(screen.getByText(message)).toBeInTheDocument();
		}
	);
});
