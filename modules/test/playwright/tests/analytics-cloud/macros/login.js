/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {liferayConfig} from '../../../liferay.config';

export async function login({page}) {
	await page.goto(liferayConfig.environment.baseUrl);

	await page
		.getByRole('textbox', {
			name: /email address/i,
		})
		.fill(liferayConfig.user.login);

	await page
		.getByRole('textbox', {
			name: /password/i,
		})
		.fill(liferayConfig.user.password);

	await page
		.getByRole('button', {
			name: /sign in/i,
		})
		.click();
}
