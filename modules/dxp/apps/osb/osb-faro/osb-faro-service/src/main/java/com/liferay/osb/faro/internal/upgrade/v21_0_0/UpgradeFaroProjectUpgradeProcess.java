/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.internal.upgrade.v21_0_0;

import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.upgrade.UpgradeProcess;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * @author Marcos Martins
 */
public class UpgradeFaroProjectUpgradeProcess extends UpgradeProcess {

	@Override
	protected void doUpgrade() throws Exception {
		StringBundler sb1 = new StringBundler(2);

		sb1.append("select faroProjectId, subscription from ");
		sb1.append("OSBFaro_FaroProject");

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				sb1.toString())) {

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				StringBundler sb2 = new StringBundler(2);

				sb2.append("update OSBFaro_FaroProject set subscription = ? ");
				sb2.append("where faroProjectId = ?");

				while (resultSet.next()) {
					try (PreparedStatement updatePreparedStatement =
							connection.prepareStatement(sb2.toString())) {

						updatePreparedStatement.setLong(
							1, resultSet.getLong(1));

						JSONObject jsonObject =
							JSONFactoryUtil.createJSONObject(
								resultSet.getString(2));

						long individualsCountSinceLastAnniversary =
							jsonObject.getLong(
								"individualsCountSinceLastAnniversary");

						jsonObject.put(
							"individualsCounts",
							JSONUtil.put(
								"total", individualsCountSinceLastAnniversary
							).put(
								"totalSinceLastAnniversary",
								individualsCountSinceLastAnniversary
							));

						long pageViewsCountSinceLastAnniversary =
							jsonObject.getLong(
								"pageViewsCountSinceLastAnniversary");

						jsonObject.put(
							"pageViewsCounts",
							JSONUtil.put(
								"total", pageViewsCountSinceLastAnniversary
							).put(
								"totalSinceLastAnniversary",
								pageViewsCountSinceLastAnniversary
							));

						updatePreparedStatement.setString(
							2, jsonObject.toString());

						updatePreparedStatement.executeUpdate();
					}
				}
			}
		}
	}

}