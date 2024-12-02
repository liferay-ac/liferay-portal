/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.analytics.settings.web.internal.notifications;

/**
 * @author Marcos Martins
 */
public enum AnalyticsSettingsNotificationType {

	CONTENT_RECOMMENDER_MOST_POPULAR_ITEMS_ENABLED(
		"most-popular-content-recommnedations-was-enabled-successfully-and-" +
			"is-now-available-in-the-collection-display",
		0),
	CONTENT_RECOMMENDER_MOST_POPULAR_ITEMS_FAILED(
		"most-popular-content-recommendations-could-not-be-enabled.-go-to-" +
			"instance-settings-analytics-cloud-and-try-again",
		1),
	CONTENT_RECOMMENDER_USER_PERSONALIZATION_ENABLED(
		"user's-personalized-content-recommendations-was-enabled-" +
			"successfully-and-is-now-available-in-the-collection-display",
		2),
	CONTENT_RECOMMENDER_USER_PERSONALIZATION_FAILED(
		"user's-personalized-content-recommendations-could-not-be-enabled.-" +
			"go-to-instance-settings-analytics-cloud-and-try-again",
		3);

	public static AnalyticsSettingsNotificationType fromNotificationTypeCode(
		int notificationTypeCode) {

		for (AnalyticsSettingsNotificationType
				analyticsSettingsNotificationType :
					AnalyticsSettingsNotificationType.values()) {

			if (notificationTypeCode ==
					analyticsSettingsNotificationType.
						getNotificationTypeCode()) {

				return analyticsSettingsNotificationType;
			}
		}

		return null;
	}

	public String getKey() {
		return _key;
	}

	public int getNotificationTypeCode() {
		return _notificationTypeCode;
	}

	private AnalyticsSettingsNotificationType(
		String key, int notificationTypeCode) {

		_key = key;
		_notificationTypeCode = notificationTypeCode;
	}

	private final String _key;
	private final int _notificationTypeCode;

}