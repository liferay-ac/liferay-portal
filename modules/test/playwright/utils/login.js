/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { expect } from '@playwright/test';
import { faroConfig } from '../tests/osb-faro-web/faro.config';
import { liferayConfig } from '../liferay.config';

export async function loginAnalyticsCloud(page) {
	await page.goto(faroConfig.environment.baseUrl);

	await page
		.getByRole('textbox', {
			name: /email address/i,
		})
		.fill(faroConfig.user.login);

	await page
		.getByRole('textbox', {
			name: /password/i,
		})
		.fill(faroConfig.user.password);

	await page
		.getByRole('button', {
			name: /sign in/i,
		})
		.click();

	await expect(page.getByText(/your workspaces/i)).toBeVisible({
		timeout: 100 * 1000,
	});

	await page.context().storageState({ path: 'tmp/osb-faro-web/.auth/user.json' });
}

export async function loginDXP(page) {
	await page.goto(liferayConfig.environment.baseUrl);

	await page.getByRole('button', { name: 'Sign In' }).click();

	await page.getByLabel('Email Address').fill(liferayConfig.user.login);
	await page.getByLabel('Password').fill(liferayConfig.user.password);
	await page.getByLabel('Remember Me').check();

	await page
		.getByLabel('Sign In- Loading')
		.getByRole('button', { name: 'Sign In' })
		.click();

	await expect(page.getByLabel('Open Applications MenuCtrl+')).toBeVisible({
		timeout: 100 * 1000,
	});

	await page.context().storageState({ path: 'tmp/.auth/user.json' });
}
