import Radio from '../Radio';
import React from 'react';
import {render} from '@testing-library/react';

describe('Radio', () => {
	it('should render', () => {
		const {container} = render(<Radio />);
		expect(container).toMatchSnapshot();
	});

	it('should render with a label', () => {
		const {queryByText} = render(<Radio label='foo' />);
		expect(queryByText('foo')).toBeTruthy();
	});
});
