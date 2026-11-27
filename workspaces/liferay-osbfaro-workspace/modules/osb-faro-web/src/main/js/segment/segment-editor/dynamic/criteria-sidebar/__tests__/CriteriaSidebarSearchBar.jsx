import CriteriaSidebarSearchBar from '../CriteriaSidebarSearchBar';
import React from 'react';
import {render} from '@testing-library/react';

describe('CriteriaSidebarSearchBar', () => {
	it('should render', () => {
		const {container} = render(
			<CriteriaSidebarSearchBar onChange={jest.fn()} />
		);

		expect(container).toMatchSnapshot();
	});

	it('should render w/ searchValue', () => {
		const searchValue = 'Page Views';

		const {getByDisplayValue} = render(
			<CriteriaSidebarSearchBar
				onChange={jest.fn()}
				searchValue={searchValue}
			/>
		);

		expect(getByDisplayValue(searchValue)).toBeTruthy();
	});
});
