/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.admin.web.internal.model;

import com.liferay.osb.faro.model.FaroUser;
import com.liferay.osb.faro.service.FaroUserLocalServiceUtil;
import com.liferay.portal.kernel.search.Document;

import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Test;

import org.mockito.MockedStatic;
import org.mockito.Mockito;

/**
 * @author Adriano Interaminense
 */
public class FaroProjectAdminDisplayTest {

	@AfterClass
	public static void tearDownClass() {
		_faroUserLocalServiceUtilMockedStatic.close();
	}

	@Test
	public void testGetOwnerWhenOwnerFaroUserIsNull() {
		_setUpOwnerFaroUser(null);

		FaroProjectAdminDisplay faroProjectAdminDisplay =
			new FaroProjectAdminDisplay(Mockito.mock(Document.class));

		Assert.assertNull(faroProjectAdminDisplay.getOwner());
	}

	@Test
	public void testGetOwnerWhenOwnerFaroUserLiveUserIdIsNotSet() {
		FaroUser faroUser = Mockito.mock(FaroUser.class);

		Mockito.when(
			faroUser.getEmailAddress()
		).thenReturn(
			"test@liferay.com"
		);

		_setUpOwnerFaroUser(faroUser);

		FaroProjectAdminDisplay faroProjectAdminDisplay =
			new FaroProjectAdminDisplay(Mockito.mock(Document.class));

		Assert.assertEquals(
			"test@liferay.com", faroProjectAdminDisplay.getOwner());
	}

	private void _setUpOwnerFaroUser(FaroUser faroUser) {
		_faroUserLocalServiceUtilMockedStatic.when(
			() -> FaroUserLocalServiceUtil.fetchOwnerFaroUser(Mockito.anyLong())
		).thenReturn(
			faroUser
		);
	}

	private static final MockedStatic<FaroUserLocalServiceUtil>
		_faroUserLocalServiceUtilMockedStatic = Mockito.mockStatic(
			FaroUserLocalServiceUtil.class);

}