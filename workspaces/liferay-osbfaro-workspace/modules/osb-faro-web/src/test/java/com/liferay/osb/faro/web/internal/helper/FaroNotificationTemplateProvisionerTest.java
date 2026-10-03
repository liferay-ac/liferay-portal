/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.helper;

import com.liferay.notification.constants.NotificationConstants;
import com.liferay.notification.constants.NotificationRecipientConstants;
import com.liferay.notification.constants.NotificationRecipientSettingConstants;
import com.liferay.notification.context.NotificationContext;
import com.liferay.notification.model.NotificationRecipient;
import com.liferay.notification.model.NotificationRecipientSetting;
import com.liferay.notification.model.NotificationTemplate;
import com.liferay.notification.service.NotificationRecipientLocalService;
import com.liferay.notification.service.NotificationRecipientSettingLocalService;
import com.liferay.notification.service.NotificationTemplateLocalService;
import com.liferay.osb.faro.web.internal.constants.FaroNotificationTemplateConstants;
import com.liferay.portal.kernel.exception.NoSuchUserException;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.model.role.RoleConstants;
import com.liferay.portal.kernel.service.UserLocalService;

import java.util.Collections;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import org.springframework.test.util.ReflectionTestUtils;

/**
 * @author Caio Pinheiro
 */
public class FaroNotificationTemplateProvisionerTest {

	@Before
	public void setUp() throws Exception {
		ReflectionTestUtils.setField(
			_provisioner, "_notificationRecipientLocalService",
			_notificationRecipientLocalService);
		ReflectionTestUtils.setField(
			_provisioner, "_notificationRecipientSettingLocalService",
			_notificationRecipientSettingLocalService);
		ReflectionTestUtils.setField(
			_provisioner, "_notificationTemplateLocalService",
			_notificationTemplateLocalService);
		ReflectionTestUtils.setField(
			_provisioner, "_userLocalService", _userLocalService);

		_mockDefaults();
	}

	@Test
	public void testVerifyNotificationTemplate() throws Exception {
		_testVerifyNotificationTemplateWhenNoAdminUserExists();
		_testVerifyNotificationTemplateWhenNotificationTemplateDoesNotExist();
		_testVerifyNotificationTemplateWhenNotificationTemplateExists();
		_testVerifyNotificationTemplateWritesFromAndToTypeSettings();
	}

	private void _mockDefaults() throws Exception {
		Mockito.when(
			_user.getUserId()
		).thenReturn(
			10L
		);

		Mockito.when(
			_userLocalService.getUsersByRoleName(
				1L, RoleConstants.ADMINISTRATOR, 0, 1)
		).thenReturn(
			Collections.singletonList(_user)
		);

		Mockito.when(
			_notificationRecipientLocalService.createNotificationRecipient(0)
		).thenReturn(
			Mockito.mock(NotificationRecipient.class)
		);

		Mockito.when(
			_notificationRecipientSettingLocalService.
				createNotificationRecipientSetting(0)
		).thenAnswer(
			invocation -> Mockito.mock(NotificationRecipientSetting.class)
		);
	}

	private void _resetMocks() throws Exception {
		Mockito.reset(
			_notificationRecipientLocalService,
			_notificationRecipientSettingLocalService,
			_notificationTemplateLocalService, _user, _userLocalService);

		_mockDefaults();
	}

	private void _testVerifyNotificationTemplateWhenNoAdminUserExists()
		throws Exception {

		_resetMocks();

		Mockito.when(
			_userLocalService.getUsersByRoleName(
				1L, RoleConstants.ADMINISTRATOR, 0, 1)
		).thenReturn(
			Collections.emptyList()
		);

		Assert.assertThrows(
			NoSuchUserException.class,
			() -> _provisioner.verifyNotificationTemplate(
				FaroNotificationTemplateConstants.
					EXTERNAL_REFERENCE_CODE_SEGMENT_NOTIFICATION,
				1L));

		Mockito.verify(
			_notificationTemplateLocalService, Mockito.never()
		).addNotificationTemplate(
			Mockito.any(NotificationContext.class)
		);
	}

	private void _testVerifyNotificationTemplateWhenNotificationTemplateDoesNotExist()
		throws Exception {

		_resetMocks();

		NotificationTemplate createdNotificationTemplate = Mockito.mock(
			NotificationTemplate.class);

		Mockito.when(
			_notificationTemplateLocalService.createNotificationTemplate(0)
		).thenReturn(
			Mockito.mock(NotificationTemplate.class)
		);

		Mockito.when(
			_notificationTemplateLocalService.addNotificationTemplate(
				Mockito.any(NotificationContext.class))
		).thenReturn(
			createdNotificationTemplate
		);

		NotificationTemplate notificationTemplate =
			_provisioner.verifyNotificationTemplate(
				FaroNotificationTemplateConstants.
					EXTERNAL_REFERENCE_CODE_SEGMENT_NOTIFICATION,
				1L);

		Assert.assertEquals(createdNotificationTemplate, notificationTemplate);

		ArgumentCaptor<NotificationContext> notificationContextArgumentCaptor =
			ArgumentCaptor.forClass(NotificationContext.class);

		Mockito.verify(
			_notificationTemplateLocalService
		).addNotificationTemplate(
			notificationContextArgumentCaptor.capture()
		);

		NotificationContext notificationContext =
			notificationContextArgumentCaptor.getValue();

		Assert.assertEquals(
			NotificationConstants.TYPE_EMAIL, notificationContext.getType());
		Assert.assertNotNull(notificationContext.getNotificationRecipient());
		Assert.assertEquals(
			3,
			notificationContext.getNotificationRecipientSettings(
			).size());
	}

	private void _testVerifyNotificationTemplateWhenNotificationTemplateExists()
		throws Exception {

		_resetMocks();

		NotificationTemplate existingNotificationTemplate = Mockito.mock(
			NotificationTemplate.class);

		Mockito.when(
			_notificationTemplateLocalService.
				fetchNotificationTemplateByExternalReferenceCode(
					FaroNotificationTemplateConstants.
						EXTERNAL_REFERENCE_CODE_SEGMENT_NOTIFICATION,
					1L)
		).thenReturn(
			existingNotificationTemplate
		);

		NotificationTemplate notificationTemplate =
			_provisioner.verifyNotificationTemplate(
				FaroNotificationTemplateConstants.
					EXTERNAL_REFERENCE_CODE_SEGMENT_NOTIFICATION,
				1L);

		Assert.assertEquals(existingNotificationTemplate, notificationTemplate);

		Mockito.verify(
			_notificationTemplateLocalService, Mockito.never()
		).addNotificationTemplate(
			Mockito.any(NotificationContext.class)
		);
	}

	private void _testVerifyNotificationTemplateWritesFromAndToTypeSettings()
		throws Exception {

		_resetMocks();

		Mockito.when(
			_notificationTemplateLocalService.createNotificationTemplate(0)
		).thenReturn(
			Mockito.mock(NotificationTemplate.class)
		);

		NotificationRecipientSetting fromNotificationRecipientSetting =
			Mockito.mock(NotificationRecipientSetting.class);
		NotificationRecipientSetting fromNameNotificationRecipientSetting =
			Mockito.mock(NotificationRecipientSetting.class);
		NotificationRecipientSetting toTypeNotificationRecipientSetting =
			Mockito.mock(NotificationRecipientSetting.class);

		Mockito.when(
			_notificationRecipientSettingLocalService.
				createNotificationRecipientSetting(0)
		).thenReturn(
			fromNotificationRecipientSetting,
			fromNameNotificationRecipientSetting,
			toTypeNotificationRecipientSetting
		);

		_provisioner.verifyNotificationTemplate(
			FaroNotificationTemplateConstants.
				EXTERNAL_REFERENCE_CODE_SEGMENT_NOTIFICATION,
			1L);

		Mockito.verify(
			fromNotificationRecipientSetting
		).setName(
			NotificationRecipientSettingConstants.NAME_FROM
		);

		Mockito.verify(
			fromNameNotificationRecipientSetting
		).setName(
			NotificationRecipientSettingConstants.NAME_FROM_NAME
		);

		Mockito.verify(
			toTypeNotificationRecipientSetting
		).setName(
			NotificationRecipientSettingConstants.NAME_TO_TYPE
		);

		Mockito.verify(
			toTypeNotificationRecipientSetting
		).setValue(
			NotificationRecipientConstants.TYPE_SUBSCRIBERS
		);
	}

	private final NotificationRecipientLocalService
		_notificationRecipientLocalService = Mockito.mock(
			NotificationRecipientLocalService.class);
	private final NotificationRecipientSettingLocalService
		_notificationRecipientSettingLocalService = Mockito.mock(
			NotificationRecipientSettingLocalService.class);
	private final NotificationTemplateLocalService
		_notificationTemplateLocalService = Mockito.mock(
			NotificationTemplateLocalService.class);
	private final FaroNotificationTemplateProvisioner _provisioner =
		new FaroNotificationTemplateProvisioner();
	private final User _user = Mockito.mock(User.class);
	private final UserLocalService _userLocalService = Mockito.mock(
		UserLocalService.class);

}