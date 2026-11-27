import React from 'react';
import ReadyToGo from '../ReadyToGo';
import {BrowserRouter} from 'react-router-dom';
import {cleanup, fireEvent, render} from '@testing-library/react';
import {noop} from 'lodash';

describe('ReadyToGo', () => {
	afterEach(cleanup);

	it('renders', () => {
		const {container} = render(
			<BrowserRouter>
				<ReadyToGo onClose={noop} />
			</BrowserRouter>
		);

		expect(container).toMatchSnapshot();
	});

	it('calls onClose when "Done" is clicked', () => {
		const spy = jest.fn();

		const {queryByText} = render(
			<BrowserRouter>
				<ReadyToGo onClose={spy} />
			</BrowserRouter>
		);

		expect(spy).not.toBeCalled();

		fireEvent.click(queryByText(/^done$/i));

		expect(spy).toBeCalled();
	});
});
