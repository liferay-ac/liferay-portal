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

import fetch from 'jest-fetch-mock';

import '@testing-library/jest-dom/extend-expect';
import {render, screen} from '@testing-library/react';
import React from 'react';

import {loadingElement} from '../../utils/tests/helpers';
import {fetchPropertiesResponse} from '../../utils/tests/mocks';
import Properties from './Properties';

describe('Properties', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('renders without crashing', async () => {
		fetch.mockResponseOnce(JSON.stringify(fetchPropertiesResponse));

		render(<Properties />);

		await loadingElement();
	});

	it('renders properties table content', async () => {
		fetch.mockResponseOnce(JSON.stringify(fetchPropertiesResponse));

		render(<Properties />);

		await loadingElement();

		expect(screen.getByTestId(/Liferay DXP/i)).toBeInTheDocument();
		expect(screen.getByText(/Liferay DXP/i)).toBeInTheDocument();

		const firstTableColumn = screen.getAllByRole('591043793166298694');

		expect(firstTableColumn).toHaveLength(5);
		expect(firstTableColumn[0]).toHaveTextContent(/Liferay DXP/i);
		expect(firstTableColumn[1]).toHaveTextContent(/-/i);
		expect(firstTableColumn[2]).toHaveTextContent(/0/i);
		expect(firstTableColumn[3].firstChild).toHaveClass(
			'toggle-switch simple-toggle-switch'
		);
		expect(firstTableColumn[4]).toHaveTextContent(/assign/i);

		const secondTableColumn = screen.getAllByRole('507692450375472147');

		expect(secondTableColumn).toHaveLength(5);
		expect(secondTableColumn[0]).toHaveTextContent(/Beryl Commerce/i);
		expect(secondTableColumn[1]).toHaveTextContent(/-/i);
		expect(secondTableColumn[2]).toHaveTextContent(/5/i);
		expect(secondTableColumn[3].firstChild).toHaveClass(
			'toggle-switch simple-toggle-switch'
		);
		expect(secondTableColumn[4]).toHaveTextContent(/assign/i);
	});

	it('renders filter options', async () => {
		fetch.mockResponseOnce(JSON.stringify(fetchPropertiesResponse));

		render(<Properties />);

		await loadingElement();

		expect(screen.getAllByText('available-properties')).toHaveLength(2);
		expect(screen.getByText('create-date')).toBeInTheDocument();
	});
});
