import OperatorSelect from '../OperatorSelect';
import React from 'react';
import {DataTypes} from 'shared/types/DataTypes';
import {fireEvent, render} from '@testing-library/react';

describe('OperatorSelect', () => {
	it('should render', () => {
		const {container, getByText} = render(
			<OperatorSelect
				dataType={DataTypes.Number}
				onChange={jest.fn()}
			/>
		);
		fireEvent.click(getByText('Select an option'));

		expect(getByText('greater than')).toBeTruthy();
		expect(getByText('less than')).toBeTruthy();
		expect(getByText('is equal to')).toBeTruthy();
		expect(getByText('is not equal to')).toBeTruthy();

		expect(container).toMatchSnapshot();
	});

	it('should apply the form-control-sm class when small is true', () => {
		const {container} = render(
			<OperatorSelect
				dataType={DataTypes.Number}
				onChange={jest.fn()}
				small
			/>
		);

		expect(
			container.querySelector('.operator-input.form-control-sm')
		).toBeTruthy();
	});

	it('should not apply the form-control-sm class when small is not set', () => {
		const {container} = render(
			<OperatorSelect
				dataType={DataTypes.Number}
				onChange={jest.fn()}
			/>
		);

		expect(
			container.querySelector('.form-control-sm')
		).toBeNull();
	});
});
