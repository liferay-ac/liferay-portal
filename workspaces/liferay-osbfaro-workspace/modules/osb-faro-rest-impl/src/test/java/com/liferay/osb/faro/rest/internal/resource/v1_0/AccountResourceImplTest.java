/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.resource.v1_0;

import com.liferay.osb.faro.engine.client.ContactsEngineClient;
import com.liferay.osb.faro.engine.client.exception.NoSuchEntryException;
import com.liferay.osb.faro.engine.client.model.Account;
import com.liferay.osb.faro.engine.client.model.AccountLifecycle;
import com.liferay.osb.faro.engine.client.model.AccountLifecycleStage;
import com.liferay.osb.faro.service.FaroProjectLocalService;
import com.liferay.petra.function.transform.TransformUtil;
import com.liferay.portal.kernel.test.ReflectionTestUtil;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.vulcan.jaxrs.exception.mapper.Problem;
import com.liferay.portal.vulcan.pagination.Pagination;

import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;

import java.util.Arrays;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import org.mockito.Mockito;

/**
 * @author Marcos Martins
 */
public class AccountResourceImplTest {

	@Before
	public void setUp() {
		ReflectionTestUtil.setFieldValue(
			_accountResourceImpl, "_contactsEngineClient",
			_contactsEngineClient);
		ReflectionTestUtil.setFieldValue(
			_accountResourceImpl, "_faroProjectLocalService",
			_faroProjectLocalService);
	}

	@Test
	public void testGetWorkspaceGroupAccount() throws Exception {
		Mockito.when(
			_contactsEngineClient.getAccount(
				Mockito.any(), Mockito.eq("1"), Mockito.isNull())
		).thenThrow(
			new NoSuchEntryException(RandomTestUtil.randomString())
		);

		Mockito.when(
			_contactsEngineClient.getAccount(
				Mockito.any(), Mockito.eq("2"), Mockito.isNull())
		).thenReturn(
			new Account()
		);

		_assertGetWorkspaceGroupAccount(
			"1",
			"No account was found with ID 1. Call " +
				"getWorkspaceGroupChannelAccountsPage to find account IDs.");
		_assertGetWorkspaceGroupAccount(
			"2",
			"No account was found with ID 2. Call " +
				"getWorkspaceGroupChannelAccountsPage to find account IDs.");
	}

	@Test
	public void testGetWorkspaceGroupChannelAccountsPage() throws Exception {
		Mockito.when(
			_contactsEngineClient.getAccountLifecycle(
				Mockito.any(), Mockito.eq("1"))
		).thenReturn(
			_getAccountLifecycle("Lead", "Pipeline", "Customer")
		);

		Mockito.when(
			_contactsEngineClient.getAccountLifecycle(
				Mockito.any(), Mockito.eq("2"))
		).thenReturn(
			_getAccountLifecycle()
		);

		_assertGetWorkspaceGroupChannelAccountsPage(
			"1",
			"No account lifecycle stage was found with the name \"nope\". " +
				"Valid stages: Lead, Pipeline, Customer.");
		_assertGetWorkspaceGroupChannelAccountsPage(
			"2", "No account lifecycle stage was found with the name \"nope\"");
	}

	private void _assertGetWorkspaceGroupAccount(
			String accountId, String expectedMessage)
		throws Exception {

		try {
			_accountResourceImpl.getWorkspaceGroupAccount(
				RandomTestUtil.randomLong(), accountId);

			Assert.fail();
		}
		catch (NotFoundException notFoundException) {
			Assert.assertEquals(
				expectedMessage, notFoundException.getMessage());

			Response response = notFoundException.getResponse();

			Problem problem = (Problem)response.getEntity();

			Assert.assertEquals(Response.Status.NOT_FOUND, problem.getStatus());
			Assert.assertEquals(expectedMessage, problem.getTitle());
			Assert.assertNull(problem.getType());
		}
	}

	private void _assertGetWorkspaceGroupChannelAccountsPage(
			String accountLifecycleId, String expectedMessage)
		throws Exception {

		try {
			_accountResourceImpl.getWorkspaceGroupChannelAccountsPage(
				RandomTestUtil.randomLong(), "1", accountLifecycleId, "nope",
				null, null, null, null, Pagination.of(1, 20), null);

			Assert.fail();
		}
		catch (BadRequestException badRequestException) {
			Assert.assertEquals(
				expectedMessage, badRequestException.getMessage());
		}
	}

	private AccountLifecycle _getAccountLifecycle(
		String... accountLifecycleStageNames) {

		AccountLifecycle accountLifecycle = new AccountLifecycle();

		accountLifecycle.setAccountLifecycleStages(
			TransformUtil.transform(
				Arrays.asList(accountLifecycleStageNames),
				accountLifecycleStageName -> {
					AccountLifecycleStage accountLifecycleStage =
						new AccountLifecycleStage();

					accountLifecycleStage.setName(accountLifecycleStageName);

					return accountLifecycleStage;
				}));

		return accountLifecycle;
	}

	private final AccountResourceImpl _accountResourceImpl =
		new AccountResourceImpl();
	private final ContactsEngineClient _contactsEngineClient = Mockito.mock(
		ContactsEngineClient.class);
	private final FaroProjectLocalService _faroProjectLocalService =
		Mockito.mock(FaroProjectLocalService.class);

}