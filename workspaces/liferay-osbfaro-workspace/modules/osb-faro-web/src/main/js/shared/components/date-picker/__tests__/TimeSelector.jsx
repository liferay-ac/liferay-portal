import React from 'react';
import TimeSelector from '../TimeSelector';
import {render} from '@testing-library/react';

describe('TimeSelector', () => {
	it('should render', () => {
		const {container} = render(
			<TimeSelector timeZoneId='UTC' value='2020-08-30T21:00:00Z' />
		);

		expect(container).toMatchSnapshot();
	});
});
