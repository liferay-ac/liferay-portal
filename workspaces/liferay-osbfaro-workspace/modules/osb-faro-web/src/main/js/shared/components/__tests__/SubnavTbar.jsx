import React from 'react';
import SubnavTbar from '../SubnavTbar';
import {render} from '@testing-library/react';

describe('SubnavTbar', () => {
	it('should render', () => {
		const {container} = render(<SubnavTbar />);
		expect(container).toMatchSnapshot();
	});
});

describe('SubnavTbar.Item', () => {
	it('should render', () => {
		const {container} = render(<SubnavTbar.Item />);
		expect(container).toMatchSnapshot();
	});
});

describe('SubnavTbar.Section', () => {
	it('should render', () => {
		const {container} = render(<SubnavTbar.Section />);
		expect(container).toMatchSnapshot();
	});
});
