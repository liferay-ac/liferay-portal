import DatePicker from '../index';
import mockCurrentDate from 'test/mock-date';
import moment from 'moment';
import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';

describe('DatePicker', () => {
	let currentDate;

	afterEach(() => {
		currentDate.mockReset();
		currentDate.mockRestore();
	});

	beforeEach(() => {
		currentDate = mockCurrentDate();
	});

	it('should open on the month and year of the given date', () => {
		render(<DatePicker date={moment('1970-01-15')} minDate={moment(0)} />);

		jest.runAllTimers();

		expect(screen.getByDisplayValue('January')).toBeInTheDocument();
		expect(screen.getByDisplayValue('1970')).toBeInTheDocument();
	});

	it('should render the next month', () => {
		render(<DatePicker date={moment('1970-01-15')} minDate={moment(0)} />);

		fireEvent.click(screen.getByRole('button', {name: /next month/i}));

		jest.runAllTimers();

		expect(screen.getByDisplayValue('February')).toBeInTheDocument();
	});

	it('should render label when a range is passed', () => {
		render(
			<DatePicker
				date={{
					end: null,
					start: moment(0)
				}}
				minDate={moment(0)}
			/>
		);

		jest.runAllTimers();

		expect(screen.getByText(/^end date$/i)).toBeInTheDocument();
	});

	it('should render max range error when range > maxRange', () => {
		render(
			<DatePicker
				date={{
					end: moment().add(13, 'months'),
					start: moment(0)
				}}
				maxRange={365}
			/>
		);

		jest.runAllTimers();

		expect(
			screen.getByText('This exceeds the maximum range of 365 days.')
		).toBeInTheDocument();
	});
});
