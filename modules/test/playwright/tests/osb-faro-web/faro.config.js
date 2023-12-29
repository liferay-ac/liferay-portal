/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { liferayConfig } from "../../liferay.config";

const faroConfig = {
	environment: {
		baseUrl: process.env.FARO_URL
			? process.env.FARO_URL
			: 'http://localhost:8080',
		enabled: process.env.FARO_ANALYTICS_CLOUD_ENABLED
			? process.env.FARO_ANALYTICS_CLOUD_ENABLED
			: false
	},
	user: {
		login: process.env.FARO_USER_LOGIN || liferayConfig.user.login,
		password: process.env.FARO_PASSWORD || liferayConfig.user.password,
	},
};

export { faroConfig };
