import ListComponent from '../ListComponent';
import React from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router';

describe('ListComponent', () => {
	it('renders', () => {
		const {container} = render(
			<MemoryRouter>
				<ListComponent items={[]} total={0} />
			</MemoryRouter>
		);

		expect(container).toMatchSnapshot();
	});
});
