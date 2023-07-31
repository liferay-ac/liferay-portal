/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.analytics.message.storage.internal.upgrade.v1_4_0.util;

import com.liferay.portal.kernel.upgrade.UpgradeProcess;

/**
 * @author Rachael Koestartyo
 */
public class AnalyticsMessageTable {

	public static UpgradeProcess drop() {
		return new UpgradeProcess() {

			@Override
			protected void doUpgrade() throws Exception {
				if (hasTable(_TABLE_NAME)) {
					runSQL(_TABLE_SQL_DROP);
				}
			}

		};
	}

	private static final String _TABLE_NAME = "AnalyticsMessage";

	private static final String _TABLE_SQL_DROP = "drop table AnalyticsMessage";

}