/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.dto.v1_0.converter;

import com.liferay.osb.faro.rest.dto.v1_0.Event;
import com.liferay.osb.faro.rest.dto.v1_0.UserSession;
import com.liferay.osb.faro.rest.internal.graphql.dto.GetWorkspaceGroupChannelEventsPageResponse;
import com.liferay.osb.faro.rest.internal.graphql.dto.GetWorkspaceGroupChannelUserSessionsPageResponse;

import java.lang.reflect.Field;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

/**
 * @author Leslie Wong
 */
public class UserSessionDTOConverterTest {

	@Before
	public void setUp() throws Exception {
		Field field = UserSessionDTOConverter.class.getDeclaredField(
			"_eventDTOConverter");

		field.setAccessible(true);

		field.set(_userSessionDTOConverter, new EventDTOConverter());
	}

	@Test
	public void testToDTO() {
		GetWorkspaceGroupChannelUserSessionsPageResponse.UserSession
			responseUserSession =
				new GetWorkspaceGroupChannelUserSessionsPageResponse.
					UserSession();

		responseUserSession.setBecameKnown(Boolean.TRUE);
		responseUserSession.setBrowserName("Firefox");

		Date completeDate = new Date(1720000900000L);
		Date createDate = new Date(1720000000000L);

		responseUserSession.setCompleteDate(completeDate);
		responseUserSession.setCreateDate(createDate);
		responseUserSession.setDeviceType("Desktop");

		GetWorkspaceGroupChannelEventsPageResponse.Event event =
			new GetWorkspaceGroupChannelEventsPageResponse.Event();

		event.setAssetTitle("Pricing");
		event.setCanonicalUrl("https://acme.example/pricing");
		event.setCreateDate(createDate);
		event.setName("pageViewed");

		responseUserSession.setEvents(Arrays.asList(event));

		UserSession userSession = _userSessionDTOConverter.toDTO(
			new FaroDTOConverterContext(false, "individual-1", null),
			responseUserSession);

		Assert.assertEquals(Boolean.TRUE, userSession.getBecameKnown());
		Assert.assertEquals("Firefox", userSession.getBrowserName());
		Assert.assertEquals(completeDate, userSession.getCompleteDate());
		Assert.assertEquals(createDate, userSession.getCreateDate());
		Assert.assertEquals("Desktop", userSession.getDeviceType());

		Event[] events = userSession.getEvents();

		Assert.assertEquals(Arrays.toString(events), 1, events.length);
		Assert.assertEquals("Pricing", events[0].getAssetTitle());
		Assert.assertEquals(
			"https://acme.example/pricing", events[0].getCanonicalUrl());
		Assert.assertEquals("pageViewed", events[0].getName());

		responseUserSession =
			new GetWorkspaceGroupChannelUserSessionsPageResponse.UserSession();

		userSession = _userSessionDTOConverter.toDTO(
			new FaroDTOConverterContext(false, "individual-1", null),
			responseUserSession);

		Assert.assertNull(userSession.getEvents());

		responseUserSession.setEvents(Collections.emptyList());

		userSession = _userSessionDTOConverter.toDTO(
			new FaroDTOConverterContext(false, "individual-1", null),
			responseUserSession);

		events = userSession.getEvents();

		Assert.assertEquals(Arrays.toString(events), 0, events.length);

		Assert.assertNull(
			_userSessionDTOConverter.toDTO(
				new FaroDTOConverterContext(false, null, null), null));
	}

	private final UserSessionDTOConverter _userSessionDTOConverter =
		new UserSessionDTOConverter();

}