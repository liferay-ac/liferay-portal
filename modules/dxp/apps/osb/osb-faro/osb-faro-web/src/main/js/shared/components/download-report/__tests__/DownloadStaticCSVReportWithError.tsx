import * as API from 'shared/api';
import mockStore from 'test/mock-store';
import React from 'react';
import ReactDOM from 'react-dom';
import {addAlert} from 'shared/actions/alerts';
import {cleanup, fireEvent, render, waitFor} from '@testing-library/react';
import {CSVType} from '../utils';
import {DownloadStaticCSVReport} from '../DownloadStaticCSVReport';
import {Provider} from 'react-redux';
import {StaticRouter} from 'react-router';

jest.unmock('react-dom');

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		channelId: '123',
		groupId: '456'
	})
}));

jest.mock('shared/actions/alerts', () => ({
	actionTypes: {},
	addAlert: jest.fn(() => ({
		meta: {},
		payload: {},
		type: 'addAlert'
	}))
}));

const WrapperComponent = () => (
	<Provider store={mockStore()}>
		<StaticRouter>
			<DownloadStaticCSVReport
				disabled={false}
				type={CSVType.Individual}
				typeLang={Liferay.Language.get('individuals')}
			/>
		</StaticRouter>
	</Provider>
);

describe('DownloadStaticCSVReport', () => {
	afterEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
		cleanup();
	});

	beforeAll(() => {
		jest.useFakeTimers();

		// @ts-ignore

		ReactDOM.createPortal = jest.fn(element => element);
	});

	afterAll(() => {
		jest.useRealTimers();
	});
});

it('displays error alert when csv returns any type of errors', async () => {
	// @ts-ignore

	API.csv.fetchCount.mockReturnValueOnce(Promise.reject());

	const {getByRole, queryByTestId} = render(<WrapperComponent />);

	fireEvent.click(
		getByRole('button', {
			name: /download report/i
		})
	);

	jest.runAllTimers();

	fireEvent.click(queryByTestId('submit'));

	await waitFor(() => {
		expect(addAlert).toHaveBeenCalledTimes(2);
	});
});
