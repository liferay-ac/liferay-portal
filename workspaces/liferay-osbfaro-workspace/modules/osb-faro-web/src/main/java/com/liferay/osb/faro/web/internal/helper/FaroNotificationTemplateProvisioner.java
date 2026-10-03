/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.helper;

import com.liferay.notification.constants.NotificationConstants;
import com.liferay.notification.constants.NotificationRecipientConstants;
import com.liferay.notification.constants.NotificationRecipientSettingConstants;
import com.liferay.notification.constants.NotificationTemplateConstants;
import com.liferay.notification.context.NotificationContext;
import com.liferay.notification.context.NotificationContextBuilder;
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
import com.liferay.portal.kernel.util.MapUtil;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Caio Pinheiro
 */
@Component(service = FaroNotificationTemplateProvisioner.class)
public class FaroNotificationTemplateProvisioner {

	public NotificationTemplate verifyNotificationTemplate(
			String externalReferenceCode, long companyId)
		throws Exception {

		NotificationTemplate existingNotificationTemplate =
			_notificationTemplateLocalService.
				fetchNotificationTemplateByExternalReferenceCode(
					externalReferenceCode, companyId);

		if (existingNotificationTemplate != null) {
			return existingNotificationTemplate;
		}

		Map<String, Map<String, String>> defaultNotificationTemplates =
			FaroNotificationTemplateConstants.getDefaultNotificationTemplates();

		Map<String, String> defaultNotificationTemplate =
			defaultNotificationTemplates.get(externalReferenceCode);

		User user = _getAdminUser(companyId);

		NotificationTemplate notificationTemplate =
			_notificationTemplateLocalService.createNotificationTemplate(0);

		notificationTemplate.setExternalReferenceCode(externalReferenceCode);
		notificationTemplate.setCompanyId(companyId);
		notificationTemplate.setUserId(user.getUserId());
		notificationTemplate.setBodyMap(
			FaroNotificationTemplateConstants.getDefaultLocalizedMap(
				externalReferenceCode, "body"));
		notificationTemplate.setDescription(
			MapUtil.getString(defaultNotificationTemplate, "name"));
		notificationTemplate.setEditorType(
			NotificationTemplateConstants.EDITOR_TYPE_RICH_TEXT);
		notificationTemplate.setNameMap(
			FaroNotificationTemplateConstants.getDefaultLocalizedMap(
				externalReferenceCode, "name"));
		notificationTemplate.setSubjectMap(
			FaroNotificationTemplateConstants.getDefaultLocalizedMap(
				externalReferenceCode, "subject"));
		notificationTemplate.setSystem(false);
		notificationTemplate.setType(NotificationConstants.TYPE_EMAIL);

		NotificationContext notificationContext =
			new NotificationContextBuilder(
			).companyId(
				companyId
			).notificationTemplate(
				notificationTemplate
			).userId(
				user.getUserId()
			).build();

		notificationContext.setNotificationRecipient(
			_notificationRecipientLocalService.createNotificationRecipient(0));

		notificationContext.setNotificationRecipientSettings(
			_createNotificationRecipientSettings());

		notificationContext.setType(NotificationConstants.TYPE_EMAIL);

		return _notificationTemplateLocalService.addNotificationTemplate(
			notificationContext);
	}

	private List<NotificationRecipientSetting>
		_createNotificationRecipientSettings() {

		NotificationRecipientSetting fromNotificationRecipientSetting =
			_notificationRecipientSettingLocalService.
				createNotificationRecipientSetting(0);

		fromNotificationRecipientSetting.setName(
			NotificationRecipientSettingConstants.NAME_FROM);
		fromNotificationRecipientSetting.setValue("noreply@liferay.com");

		NotificationRecipientSetting fromNameNotificationRecipientSetting =
			_notificationRecipientSettingLocalService.
				createNotificationRecipientSetting(0);

		fromNameNotificationRecipientSetting.setName(
			NotificationRecipientSettingConstants.NAME_FROM_NAME);
		fromNameNotificationRecipientSetting.setValue(
			"Liferay Analytics Cloud");

		NotificationRecipientSetting toTypeNotificationRecipientSetting =
			_notificationRecipientSettingLocalService.
				createNotificationRecipientSetting(0);

		toTypeNotificationRecipientSetting.setName(
			NotificationRecipientSettingConstants.NAME_TO_TYPE);
		toTypeNotificationRecipientSetting.setValue(
			NotificationRecipientConstants.TYPE_SUBSCRIBERS);

		return Arrays.asList(
			fromNotificationRecipientSetting,
			fromNameNotificationRecipientSetting,
			toTypeNotificationRecipientSetting);
	}

	private User _getAdminUser(long companyId) throws Exception {
		List<User> users = _userLocalService.getUsersByRoleName(
			companyId, RoleConstants.ADMINISTRATOR, 0, 1);

		if (users.isEmpty()) {
			throw new NoSuchUserException(
				"No user exists in company " + companyId + " with role " +
					RoleConstants.ADMINISTRATOR);
		}

		return users.get(0);
	}

	@Reference
	private NotificationRecipientLocalService
		_notificationRecipientLocalService;

	@Reference
	private NotificationRecipientSettingLocalService
		_notificationRecipientSettingLocalService;

	@Reference
	private NotificationTemplateLocalService _notificationTemplateLocalService;

	@Reference
	private UserLocalService _userLocalService;

}