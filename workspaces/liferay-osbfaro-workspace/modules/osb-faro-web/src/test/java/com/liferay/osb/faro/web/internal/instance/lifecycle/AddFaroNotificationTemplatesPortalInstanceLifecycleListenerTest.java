/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.instance.lifecycle;

import com.liferay.osb.faro.web.internal.constants.FaroNotificationTemplateConstants;
import com.liferay.osb.faro.web.internal.helper.FaroNotificationTemplateProvisioner;
import com.liferay.portal.kernel.model.Company;

import org.junit.Before;
import org.junit.Test;

import org.mockito.Mockito;

import org.springframework.test.util.ReflectionTestUtils;

/**
 * @author Caio Pinheiro
 */
public class AddFaroNotificationTemplatesPortalInstanceLifecycleListenerTest {

	@Before
	public void setUp() {
		Mockito.when(
			_company.getCompanyId()
		).thenReturn(
			1L
		);

		ReflectionTestUtils.setField(
			_listener, "_faroNotificationTemplateProvisioner",
			_faroNotificationTemplateProvisioner);
	}

	@Test
	public void testPortalInstanceRegistered() throws Exception {
		_testPortalInstanceRegisteredCallsProvisionerForEachTemplate();
		_testPortalInstanceRegisteredSwallowsProvisioningFailures();
	}

	private void _testPortalInstanceRegisteredCallsProvisionerForEachTemplate()
		throws Exception {

		Mockito.reset(_faroNotificationTemplateProvisioner);

		_listener.portalInstanceRegistered(_company);

		Mockito.verify(
			_faroNotificationTemplateProvisioner
		).verifyNotificationTemplate(
			FaroNotificationTemplateConstants.
				EXTERNAL_REFERENCE_CODE_LIFECYCLE_NOTIFICATION,
			1L
		);

		Mockito.verify(
			_faroNotificationTemplateProvisioner
		).verifyNotificationTemplate(
			FaroNotificationTemplateConstants.
				EXTERNAL_REFERENCE_CODE_SEGMENT_NOTIFICATION,
			1L
		);
	}

	private void _testPortalInstanceRegisteredSwallowsProvisioningFailures()
		throws Exception {

		Mockito.reset(_faroNotificationTemplateProvisioner);

		Mockito.when(
			_faroNotificationTemplateProvisioner.verifyNotificationTemplate(
				Mockito.anyString(), Mockito.anyLong())
		).thenThrow(
			new RuntimeException("provisioning failed")
		);

		_listener.portalInstanceRegistered(_company);
	}

	private final Company _company = Mockito.mock(Company.class);
	private final FaroNotificationTemplateProvisioner
		_faroNotificationTemplateProvisioner = Mockito.mock(
			FaroNotificationTemplateProvisioner.class);
	private final AddFaroNotificationTemplatesPortalInstanceLifecycleListener
		_listener =
			new AddFaroNotificationTemplatesPortalInstanceLifecycleListener();

}