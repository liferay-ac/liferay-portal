import Checkbox from '../Checkbox';
import React from 'react';
import {render} from '@testing-library/react';

describe('Checkbox', () => {
	it('should render', () => {
		const {container} = render(<Checkbox />);
		expect(container).toMatchSnapshot();
	});

	it('should render with a label', () => {
		const {queryByText} = render(<Checkbox label='foo' />);
		expect(queryByText('foo')).toBeTruthy();
	});
});
