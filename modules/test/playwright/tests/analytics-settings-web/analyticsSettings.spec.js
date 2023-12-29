/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { test } from '@playwright/test';
import { createDataSource } from '../osb-faro-web/utils/dataSource';
import {
    connectToAnalyticsCloud,
    disconnectFromAnalyticsCloud,
    goToAnalyticsCloudInstanceSettings,
    syncAllContacts, syncSite
} from './utils/analyticsSettings';


test('creates a new data source and connects to DXP', async ({ page }) => {
    await createDataSource(page);

    await goToAnalyticsCloudInstanceSettings(page);

    await disconnectFromAnalyticsCloud(page);

    await connectToAnalyticsCloud(page);

    await syncSite(0, page, 0);

    await syncAllContacts(page);

    await page.getByRole('button', { name: 'Finish' }).click();
});
