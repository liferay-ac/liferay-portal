/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, test} from '@playwright/test';

import {login} from './macros/login';

test('renders workspace list', async ({page}) => {
	await login({page});

	await expect(page.getByText(/your workspaces/i)).toBeVisible();
	await expect(page.getByText(/workspaces you have joined/i)).toBeVisible();

	const workspaceList = await page.locator(
		'.workspace-list-root > ul.list-group li'
	);

	await expect(await workspaceList.count()).toBe(1);

	expect(
		await page.getByRole('link', {
			name: /faro-dev-liferay/i,
		})
	).toBeVisible();
});

test('renders workspace buttons', async ({page}) => {
	await login({page});

	const buildPayTierButton = page.getByRole('button', {
		name: /buy paid tier/i,
	});

	await expect(buildPayTierButton).toBeVisible();
	await expect(buildPayTierButton).toHaveClass(/btn-primary/);

	const startFreeTrialLink = page.getByRole('link', {
		name: /start free trial/i,
	});

	await expect(startFreeTrialLink).toBeVisible();
	await expect(startFreeTrialLink).toHaveClass(/btn-secondary/);
});
