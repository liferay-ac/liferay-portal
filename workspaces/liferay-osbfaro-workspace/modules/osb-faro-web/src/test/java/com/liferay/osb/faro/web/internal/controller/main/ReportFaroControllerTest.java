/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.controller.main;

import com.liferay.osb.faro.engine.client.ContactsEngineClient;
import com.liferay.osb.faro.model.FaroProject;
import com.liferay.osb.faro.service.FaroProjectLocalService;
import com.liferay.portal.test.rule.LiferayUnitTestRule;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;

import java.io.ByteArrayOutputStream;

import java.util.List;
import java.util.Map;

import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;

import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import org.springframework.test.util.ReflectionTestUtils;

/**
 * @author Rafaella Jordao
 */
public class ReportFaroControllerTest {

	@ClassRule
	@Rule
	public static final LiferayUnitTestRule liferayUnitTestRule =
		LiferayUnitTestRule.INSTANCE;

	@Before
	public void setUp() throws Exception {
		Mockito.when(
			_faroProjectLocalService.getFaroProjectByGroupId(Mockito.anyLong())
		).thenReturn(
			_faroProject
		);

		ReflectionTestUtils.setField(
			_reportFaroController, "contactsEngineClient",
			_contactsEngineClient);
		ReflectionTestUtils.setField(
			_reportFaroController, "faroProjectLocalService",
			_faroProjectLocalService);
	}

	@Test
	public void testGetCSVCountWithInvalidType() throws Exception {
		Response response = (Response)_reportFaroController.getCSVCount(
			null, null, null, null, null, 1L, null, null, null, null, null,
			null, "accounts");

		Assert.assertEquals(
			Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());

		Map<String, String> entityMap =
			(Map<String, String>)response.getEntity();

		Assert.assertEquals(
			"The \"type\" query parameter must be either \"asset\", " +
				"\"blog\", \"document\", \"event\", \"form\", " +
					"\"individual\", \"journal\", \"membership\", or \"page\".",
			entityMap.get("message"));
		Assert.assertEquals("ERROR", entityMap.get("status"));
	}

	@Test
	public void testGetCSVForwardsFilterAndObjectTypeForAssetType()
		throws Exception {

		Response response = (Response)_reportFaroController.getCSV(
			null, null, null, "1", "(assetType eq 'blog')", null, 1L, null,
			"ObjectType1", null, null, "30", null, null, "asset");

		Assert.assertEquals(
			Response.Status.OK.getStatusCode(), response.getStatus());

		StreamingOutput streamingOutput = (StreamingOutput)response.getEntity();

		streamingOutput.write(new ByteArrayOutputStream());

		ArgumentCaptor<Map<String, List<String>>> argumentCaptor =
			ArgumentCaptor.forClass(Map.class);

		Mockito.verify(
			_contactsEngineClient
		).getToOutputStream(
			Mockito.eq(_faroProject), Mockito.anyMap(),
			Mockito.eq("/reports/export/csv/asset"), argumentCaptor.capture(),
			Mockito.any()
		);

		Map<String, List<String>> queryParameters = argumentCaptor.getValue();

		Assert.assertEquals(
			List.of("(assetType eq 'blog')"), queryParameters.get("filter"));
		Assert.assertEquals(
			List.of("ObjectType1"), queryParameters.get("objectType"));
	}

	private final ContactsEngineClient _contactsEngineClient = Mockito.mock(
		ContactsEngineClient.class);
	private final FaroProject _faroProject = Mockito.mock(FaroProject.class);
	private final FaroProjectLocalService _faroProjectLocalService =
		Mockito.mock(FaroProjectLocalService.class);
	private final ReportFaroController _reportFaroController =
		new ReportFaroController();

}