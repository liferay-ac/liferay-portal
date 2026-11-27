import React from 'react';
import SubHeader from '../SubHeader';
import {render} from '@testing-library/react';

describe('BasePage.SubHeader', () => {
	it('renders SubHeader', () => {
		const {container} = render(<SubHeader>{'Test Test'}</SubHeader>);

		expect(container).toMatchSnapshot();
	});
});
