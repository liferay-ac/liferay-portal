/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.controller.contacts;

import com.liferay.osb.faro.engine.client.ContactsEngineClient;
import com.liferay.osb.faro.engine.client.model.AccountLifecycle;
import com.liferay.osb.faro.engine.client.model.Results;
import com.liferay.osb.faro.model.FaroProject;
import com.liferay.osb.faro.service.FaroProjectLocalService;
import com.liferay.osb.faro.web.internal.model.display.FaroFDSResultsDisplay;
import com.liferay.portal.kernel.test.util.RandomTestUtil;

import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.QueryParam;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;

import java.util.Arrays;
import java.util.Collections;
import java.util.Objects;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import org.mockito.Mockito;

import org.springframework.test.util.ReflectionTestUtils;

/**
 * @author Caio Pinheiro
 */
public class AccountLifecycleFaroControllerTest {

	@Before
	public void setUp() throws Exception {
		Mockito.when(
			_faroProjectLocalService.getFaroProjectByGroupId(Mockito.anyLong())
		).thenReturn(
			_faroProject
		);

		ReflectionTestUtils.setField(
			_accountLifecycleFaroController, "contactsEngineClient",
			_contactsEngineClient);
		ReflectionTestUtils.setField(
			_accountLifecycleFaroController, "faroProjectLocalService",
			_faroProjectLocalService);
	}

	@Test
	public void testAccountLifecycleFaroController() throws Exception {
		_testGetAccountLifecyclesFaroFDSResultsDisplay();
		_testGetAccountLifecyclesFaroFDSResultsDisplayDefaultsPageSize();
		_testGetAccountsFaroFDSResultsDisplayDefaultsPageSize();
	}

	private void _assertPageSizeDefaultValue(Method method) {
		Parameter pageSizeParameter = Arrays.stream(
			method.getParameters()
		).filter(
			parameter -> {
				QueryParam queryParam = parameter.getAnnotation(
					QueryParam.class);

				return (queryParam != null) &&
					   Objects.equals(queryParam.value(), "pageSize");
			}
		).findFirst(
		).get();

		DefaultValue defaultValue = pageSizeParameter.getAnnotation(
			DefaultValue.class);

		Assert.assertNotNull(defaultValue);
		Assert.assertEquals("20", defaultValue.value());
	}

	private void _testGetAccountLifecyclesFaroFDSResultsDisplay()
		throws Exception {

		long channelId = RandomTestUtil.randomLong();
		int page = RandomTestUtil.randomInt();
		int pageSize = RandomTestUtil.randomInt();
		String search = RandomTestUtil.randomString();
		String sortString = RandomTestUtil.randomString();
		int total = RandomTestUtil.randomInt();

		Mockito.when(
			_contactsEngineClient.getAccountLifecycles(
				_faroProject, channelId, search, page, pageSize, sortString)
		).thenReturn(
			new Results<>(Collections.emptyList(), total)
		);

		long groupId = RandomTestUtil.randomLong();

		FaroFDSResultsDisplay<AccountLifecycle> faroFDSResultsDisplay =
			_accountLifecycleFaroController.
				getAccountLifecyclesFaroFDSResultsDisplay(
					groupId, channelId, page, pageSize, search, sortString);

		Assert.assertEquals(total, faroFDSResultsDisplay.getTotalCount());

		Mockito.verify(
			_faroProjectLocalService
		).getFaroProjectByGroupId(
			groupId
		);
	}

	private void _testGetAccountLifecyclesFaroFDSResultsDisplayDefaultsPageSize()
		throws Exception {

		_assertPageSizeDefaultValue(
			AccountLifecycleFaroController.class.getMethod(
				"getAccountLifecyclesFaroFDSResultsDisplay", long.class,
				Long.class, int.class, int.class, String.class, String.class));
	}

	private void _testGetAccountsFaroFDSResultsDisplayDefaultsPageSize()
		throws Exception {

		_assertPageSizeDefaultValue(
			AccountLifecycleFaroController.class.getMethod(
				"getAccountsFaroFDSResultsDisplay", long.class, String.class,
				String.class, int.class, int.class, String.class,
				String.class));
	}

	private final AccountLifecycleFaroController
		_accountLifecycleFaroController = new AccountLifecycleFaroController();
	private final ContactsEngineClient _contactsEngineClient = Mockito.mock(
		ContactsEngineClient.class);
	private final FaroProject _faroProject = Mockito.mock(FaroProject.class);
	private final FaroProjectLocalService _faroProjectLocalService =
		Mockito.mock(FaroProjectLocalService.class);

}