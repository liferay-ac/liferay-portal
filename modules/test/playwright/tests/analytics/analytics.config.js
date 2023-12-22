/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const analyticsConfig = {
	environment: {
		baseUrl: process.env.FARO_URL
			? process.env.FARO_URL
			: 'http://localhost:8080',
		enabled: process.env.ANALYTICS_CLOUD_ENABLED
		? process.env.ANALYTICS_CLOUD_ENABLED
		: true
	},
};

export {analyticsConfig};
