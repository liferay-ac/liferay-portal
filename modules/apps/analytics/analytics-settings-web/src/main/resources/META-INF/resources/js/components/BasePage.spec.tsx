/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import '@testing-library/jest-dom/extend-expect';
import {render} from '@testing-library/react';
import React from 'react';

import BasePage from './BasePage';

describe('BasePage', () => {
	it('renders BasePage component without crashing', () => {
		const {container} = render(
			<BasePage description="test description" title="test title" />
		);

		const description = container.querySelector('div.sheet-text');

		const parentAndChild = document.querySelector(
			'div.sheet div h2.sheet-title'
		);

		expect(parentAndChild).toBeInTheDocument();

		expect(description).toBeInTheDocument();
	});

	it('renders BasePageFooter component without crashing', () => {
		const {container} = render(<BasePage.Footer />);

		const footer = container.querySelector('div.sheet-footer');

		expect(footer).toBeInTheDocument;
	});
});
