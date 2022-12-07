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

import {EmptyStateComponent, ErrorStateComponent} from './StateRenderer';

describe('State Renderer', () => {
	it('renders ErrorStateComponent', () => {
		const {container} = render(
			<ErrorStateComponent onClickRefetch={() => {}} />
		);

		const emptyStateDiv = container.querySelector('div.c-empty-state');

		const errorMessage = container.querySelector('span.text-truncate');

		const button = container.querySelector('button[type="button"]');

		expect(emptyStateDiv).toBeInTheDocument();

		expect(errorMessage).toBeInTheDocument();

		expect(errorMessage).toHaveTextContent(
			'an-unexpected-system-error-occurred'
		);

		expect(button).toBeInTheDocument();

		expect(button).toHaveTextContent('try-again');
	});

	it('renders EmptyStateComponent', () => {
		const {container} = render(
			<EmptyStateComponent
				description="this is a test description"
				imgSrc="test"
			/>
		);

		const emptyStateDiv = container.querySelector('div.c-empty-state');

		const noResultsElement = container.querySelector('span.text-truncate');

		const image = container.querySelector('img');

		const emptyStateText = container.querySelector(
			'div.c-empty-state-text'
		);

		expect(emptyStateDiv).toBeInTheDocument();

		expect(noResultsElement).toHaveTextContent('No results found');

		expect(emptyStateText).toHaveTextContent('this is a test description');

		expect(image).toHaveAttribute('src', 'test');
	});
});
