import React from 'react';
import Row from '../Row';
import {render} from '@testing-library/react';

describe('BasePage.Row', () => {
	it('renders Row', () => {
		const {container} = render(<Row>{'Test Test'}</Row>);

		expect(container).toMatchSnapshot();
	});
});
