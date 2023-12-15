/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, test} from '@playwright/test';

import {liferayConfig} from '../../liferay.config';

test('renders login screen', async ({page}) => {
	await page.goto(liferayConfig.environment.baseUrl);

	await expect(
		page.getByRole('textbox', {
			name: /email address/i,
		})
	).toBeVisible();

	await expect(
		page.getByRole('textbox', {
			name: /password/i,
		})
	).toBeVisible();

	await expect(page.getByText(/remember me/i)).toBeVisible();

	await expect(
		page.getByRole('button', {
			name: /sign in/i,
		})
	).toBeVisible();

	await expect(
		page.getByRole('menuitem', {
			name: /create account/i,
		})
	).toBeVisible();

	await expect(
		page.getByRole('menuitem', {
			name: /forgot password/i,
		})
	).toBeVisible();
});
