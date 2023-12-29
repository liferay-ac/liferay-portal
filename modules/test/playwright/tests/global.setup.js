/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { test as setup } from '@playwright/test';

import { faroConfig } from './osb-faro-web/faro.config';
import { loginAnalyticsCloud, loginDXP } from '../utils/login';

setup('do login', async ({ page }) => {
	await loginDXP(page);

	if (faroConfig.environment.enabled) {
		await loginAnalyticsCloud(page);
	}
});
