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
import {act, render} from '@testing-library/react';
import React from 'react';

import PropertyStep from './PropertyStep';

const response = {
	actions: {},
	facets: [],
	items: [
		{
			channelId: '592681269881012387',
			commerceSyncEnabled: false,
			dataSources: [
				{
					commerceChannelIds: [],
					dataSourceId: '592681074330003545',
					siteIds: [],
				},
			],
			name: 'testbug',
		},
		{
			channelId: '592681074394883297',
			commerceSyncEnabled: false,
			dataSources: [
				{
					commerceChannelIds: [],
					dataSourceId: '592681074330003545',
					siteIds: [],
				},
			],
			name: 'Liferay',
		},
		{
			channelId: '507692450375472147',
			commerceSyncEnabled: false,
			dataSources: [
				{
					commerceChannelIds: [],
					dataSourceId: '507692450032087801',
					siteIds: [43811416, 82272606, 54804552, 10693199, 57390646],
				},
				{
					commerceChannelIds: [],
					dataSourceId: '592681074330003545',
					siteIds: [],
				},
			],
			name: 'Beryl Commerce',
		},
	],
	lastPage: 1,
	page: 1,
	pageSize: 20,
	totalCount: 3,
};

describe('Property Step', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('render PropertyStep without crashing', async () => {
		await act(async () => {
			fetch.mockResponse(JSON.stringify(response));

			const {container, getByRole, getByText} = render(
				<PropertyStep onCancel={() => {}} onChangeStep={() => {}} />
			);

			const newPropertyButton = getByRole('button', {
				name: /new-property/i,
			});

			const propertyStepTitle = getByText('property-assignment');

			const propertyStepDescription = getByText('property-description');

			expect(newPropertyButton).toBeInTheDocument();

			expect(propertyStepTitle).toBeInTheDocument();

			expect(propertyStepDescription).toBeInTheDocument();

			expect(container.firstChild).toHaveClass('sheet');
		});
	});
});
