import PopoverBase from '../PopoverBase';
import React from 'react';
import {render} from '@testing-library/react';

describe('PopoverBase', () => {
	it('should render', () => {
		const {container} = render(<PopoverBase placement='bottom' visible />);

		expect(container).toMatchSnapshot();
	});

	it('should render hidden', () => {
		const {container} = render(<PopoverBase visible={false} />);

		expect(container.querySelector('.hide')).toBeTruthy();
	});
});

describe('PopoverBase.Header', () => {
	it('should render', () => {
		const {container} = render(<PopoverBase.Header children='Header' />);

		expect(container).toMatchSnapshot();
	});
});

describe('PopoverBase.Body', () => {
	it('should render', () => {
		const {container} = render(<PopoverBase.Body children='Body' />);

		expect(container).toMatchSnapshot();
	});
});

describe('PopoverBase.Footer', () => {
	it('should render', () => {
		const {container} = render(<PopoverBase.Footer children='Footer' />);

		expect(container).toMatchSnapshot();
	});
});
