/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.helper;

import com.liferay.osb.faro.model.FaroPreferences;
import com.liferay.osb.faro.service.FaroPreferencesLocalService;
import com.liferay.osb.faro.web.internal.model.preferences.WorkspacePreferences;
import com.liferay.osb.faro.web.internal.util.JSONUtil;

import java.util.List;

import org.junit.Before;
import org.junit.Test;

import org.mockito.Mockito;

import org.springframework.test.util.ReflectionTestUtils;

/**
 * @author Caio Pinheiro
 */
public class NotificationPreferencesHelperTest {

	@Before
	public void setUp() {
		ReflectionTestUtils.setField(
			_notificationPreferencesHelper, "_faroPreferencesLocalService",
			_faroPreferencesLocalService);
	}

	@Test
	public void testRemoveSegmentNotificationPreferences() throws Exception {
		FaroPreferences faroPreferencesWithSegment = _mockFaroPreferences(
			11L, 10L, "123");
		FaroPreferences faroPreferencesWithoutSegment = _mockFaroPreferences(
			21L, 20L, "456");

		Mockito.when(
			_faroPreferencesLocalService.getFaroPreferencesByGroupId(2L)
		).thenReturn(
			List.of(faroPreferencesWithSegment, faroPreferencesWithoutSegment)
		);

		_notificationPreferencesHelper.removeSegmentNotificationPreferences(
			2L, List.of("123"));

		Mockito.verify(
			_faroPreferencesLocalService
		).savePreferences(
			Mockito.eq(10L), Mockito.eq(2L), Mockito.eq(11L),
			Mockito.argThat(preferences -> !preferences.contains("123"))
		);

		Mockito.verify(
			_faroPreferencesLocalService, Mockito.never()
		).savePreferences(
			Mockito.eq(20L), Mockito.anyLong(), Mockito.anyLong(),
			Mockito.anyString()
		);
	}

	private FaroPreferences _mockFaroPreferences(
			long ownerId, long userId, String segmentId)
		throws Exception {

		WorkspacePreferences workspacePreferences = new WorkspacePreferences();

		workspacePreferences.addSegmentNotificationPreference(
			"daily", true, segmentId);

		FaroPreferences faroPreferences = Mockito.mock(FaroPreferences.class);

		Mockito.when(
			faroPreferences.getOwnerId()
		).thenReturn(
			ownerId
		);

		Mockito.when(
			faroPreferences.getPreferences()
		).thenReturn(
			JSONUtil.writeValueAsString(workspacePreferences)
		);

		Mockito.when(
			faroPreferences.getUserId()
		).thenReturn(
			userId
		);

		return faroPreferences;
	}

	private final FaroPreferencesLocalService _faroPreferencesLocalService =
		Mockito.mock(FaroPreferencesLocalService.class);
	private final NotificationPreferencesHelper _notificationPreferencesHelper =
		new NotificationPreferencesHelper();

}