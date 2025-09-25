/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import {openModal} from 'frontend-js-components-web';

import {DetailedAssetUsageModal} from '../../../../src/main/resources/META-INF/resources/js/common/components/asset_usage/DetailedAssetUsageModal';
import formatActionURL from '../../../../src/main/resources/META-INF/resources/js/common/utils/formatActionURL';

jest.mock('frontend-js-components-web', () => ({
	openModal: jest.fn(),
}));

jest.mock(
	'../../../../src/main/resources/META-INF/resources/js/common/utils/formatActionURL',
	() => jest.fn((name, url) => `${name}-${url}`)
);

jest.mock('@liferay/frontend-data-set-web', () => ({
	FrontendDataSet: ({customRenderers}: any) => {
		const ViewButton = customRenderers.tableCell[0].component;

		return (
			<div data-testid="mock-fds">
				<ViewButton
					item={{name: 'Test Item'}}
					itemData={{
						type: 'object',
						url: 'http://localhost?objectEntryId=1',
					}}
				/>

				<ViewButton
					item={{name: 'Test Item'}}
					itemData={{type: 'object', url: 'http://localhost'}}
				/>

				<ViewButton
					item={{name: 'Test Item'}}
					itemData={{type: 'object'}}
				/>
			</div>
		);
	},
}));

describe('DetailedAssetUsageModal', () => {
	const item = {classPK: '123', name: 'My Asset'} as any;

	it('render modal open button when URL contains objectEntryId', () => {
		render(<DetailedAssetUsageModal item={item} />);

		const button = screen.getByTestId('view-asset-button');

		expect(button).toBeInTheDocument();

		fireEvent.click(button);

		expect(formatActionURL).toHaveBeenCalledWith(
			'My Asset',
			'http://localhost?objectEntryId=1'
		);
		expect(openModal).toHaveBeenCalledWith(
			expect.objectContaining({
				size: 'full-screen',
				title: 'My Asset',
			})
		);
	});

	it('render external link when URL does not contain objectEntryId', () => {
		render(<DetailedAssetUsageModal item={item} />);

		const link = screen.getByRole('link');

		expect(link).toHaveAttribute('href', 'http://localhost');
		expect(link).toHaveAttribute('target', '_blank');
	});

	it('does not render anything if there is no URL', () => {
		render(<DetailedAssetUsageModal item={item} />);

		const buttons = screen.getAllByRole('button');
		const links = screen.getAllByRole('link');

		expect(buttons.length).toBe(2);
		expect(links.length).toBe(1);

		expect(buttons.length + links.length).toBe(3);
	});
});
