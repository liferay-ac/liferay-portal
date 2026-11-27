import React from 'react';
import RouteNotFound from '../RouteNotFound';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router';

describe('RouteNotFound', () => {
	it('should render', () => {
		const {container} = render(
			<MemoryRouter>
				<RouteNotFound />
			</MemoryRouter>
		);
		expect(container).toBeTruthy();
	});
});
