/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.helper;

import com.liferay.notification.model.NotificationTemplate;
import com.liferay.notification.service.NotificationTemplateLocalService;
import com.liferay.osb.faro.constants.FaroUserConstants;
import com.liferay.osb.faro.engine.client.ContactsEngineClient;
import com.liferay.osb.faro.engine.client.exception.FaroEngineClientException;
import com.liferay.osb.faro.engine.client.exception.NoSuchEntryException;
import com.liferay.osb.faro.engine.client.model.AccountLifecycle;
import com.liferay.osb.faro.engine.client.model.IndividualSegment;
import com.liferay.osb.faro.engine.client.model.LifecycleTriggerResult;
import com.liferay.osb.faro.model.FaroProject;
import com.liferay.osb.faro.model.FaroUser;
import com.liferay.osb.faro.service.FaroProjectLocalService;
import com.liferay.osb.faro.service.FaroUserLocalService;
import com.liferay.osb.faro.web.internal.constants.FaroNotificationTemplateConstants;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.util.LocaleUtil;

import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import org.mockito.Mockito;

import org.springframework.test.util.ReflectionTestUtils;

/**
 * @author Caio Pinheiro
 */
public class NotificationHelperTest {

	@Before
	public void setUp() {
		ReflectionTestUtils.setField(
			_notificationHelper, "_contactsEngineClient",
			_contactsEngineClient);
		ReflectionTestUtils.setField(
			_notificationHelper, "_emailReportHelper", _emailReportHelper);
		ReflectionTestUtils.setField(
			_notificationHelper, "_faroNotificationTemplateProvisioner",
			_faroNotificationTemplateProvisioner);
		ReflectionTestUtils.setField(
			_notificationHelper, "_faroProjectLocalService",
			_faroProjectLocalService);
		ReflectionTestUtils.setField(
			_notificationHelper, "_faroUserLocalService",
			_faroUserLocalService);
		ReflectionTestUtils.setField(
			_notificationHelper, "_groupLocalService", _groupLocalService);
		ReflectionTestUtils.setField(
			_notificationHelper, "_notificationPreferencesHelper",
			_notificationPreferencesHelper);
		ReflectionTestUtils.setField(
			_notificationHelper, "_notificationTemplateLocalService",
			_notificationTemplateLocalService);
		ReflectionTestUtils.setField(
			_notificationHelper, "_userLocalService", _userLocalService);

		_mockDefaults();
	}

	@Test
	public void testGetNotificationContext() throws Exception {
		_testGetNotificationContextWhenGroupDoesNotExist();
		_testGetNotificationContextWhenProjectDoesNotExist();
	}

	@Test
	public void testReplaceTokens() throws Exception {
		_testReplaceTokensEscapesValuesInBody();
		_testReplaceTokensLeavesSubjectValuesUnescaped();
	}

	@Test
	public void testSendLifecycleNotifications() throws Exception {
		_testSendLifecycleNotificationsResolvesSharedDataOnce();
	}

	@Test
	public void testSendSegmentNotifications() throws Exception {
		_testSendSegmentNotificationsFetchesTheCountOnceForAllUsers();
		_testSendSegmentNotificationsKeepsPreferencesWhenCountFails();
		_testSendSegmentNotificationsKeepsPreferencesWhenSegmentCheckFails();
		_testSendSegmentNotificationsKeepsPreferencesWhenSegmentStillExists();
		_testSendSegmentNotificationsRemovesPreferencesWhenEngineReportsNoSuchSegment();
		_testSendSegmentNotificationsRemovesPreferencesWhenSegmentDoesNotExist();
		_testSendSegmentNotificationsResolvesTheWorkspaceOnce();
		_testSendSegmentNotificationsWhenCountIsZero();
		_testSendSegmentNotificationsWhenUserIsInactive();
		_testSendSegmentNotificationsWhenUserIsNotAnApprovedMember();
	}

	private String _getErrorBody(String messageKey, int status) {
		return StringBundler.concat(
			"{\"errorAttributes\":{\"messageKey\":\"", messageKey,
			"\",\"status\":", status, "}}");
	}

	private void _mockDefaults() {
		Mockito.when(
			_group.getCompanyId()
		).thenReturn(
			1L
		);

		Mockito.when(
			_group.getGroupId()
		).thenReturn(
			2L
		);

		Mockito.when(
			_groupLocalService.fetchGroup(2L)
		).thenReturn(
			_group
		);

		Mockito.when(
			_faroProjectLocalService.fetchFaroProjectByGroupId(2L)
		).thenReturn(
			_faroProject
		);

		Mockito.when(
			_faroUser.getStatus()
		).thenReturn(
			FaroUserConstants.STATUS_APPROVED
		);

		Mockito.when(
			_faroUserLocalService.fetchFaroUser(2L, 3L)
		).thenReturn(
			_faroUser
		);

		Mockito.when(
			_secondFaroUser.getStatus()
		).thenReturn(
			FaroUserConstants.STATUS_APPROVED
		);

		Mockito.when(
			_faroUserLocalService.fetchFaroUser(2L, 4L)
		).thenReturn(
			_secondFaroUser
		);

		Mockito.when(
			_secondUser.getEmailAddress()
		).thenReturn(
			"test2@liferay.com"
		);

		Mockito.when(
			_secondUser.getUserId()
		).thenReturn(
			4L
		);

		Mockito.when(
			_secondUser.isActive()
		).thenReturn(
			true
		);

		Mockito.when(
			_userLocalService.fetchUser(4L)
		).thenReturn(
			_secondUser
		);

		Mockito.when(
			_user.getEmailAddress()
		).thenReturn(
			"test@liferay.com"
		);

		Mockito.when(
			_user.getUserId()
		).thenReturn(
			3L
		);

		Mockito.when(
			_user.isActive()
		).thenReturn(
			true
		);

		Mockito.when(
			_userLocalService.fetchUser(3L)
		).thenReturn(
			_user
		);

		Mockito.when(
			_emailReportHelper.getRangeKey("daily")
		).thenReturn(
			1
		);
	}

	private Map<Locale, String> _replaceTokens(
		Map<Locale, String> templateMap, Map<String, String> tokens,
		boolean escape) {

		return ReflectionTestUtils.invokeMethod(
			_notificationHelper, "_replaceTokens", templateMap, tokens, escape);
	}

	private void _resetMocks() {
		Mockito.reset(
			_contactsEngineClient, _emailReportHelper,
			_faroNotificationTemplateProvisioner, _faroProject,
			_faroProjectLocalService, _faroUser, _faroUserLocalService, _group,
			_groupLocalService, _notificationPreferencesHelper,
			_notificationTemplateLocalService, _secondFaroUser, _secondUser,
			_user, _userLocalService);

		_mockDefaults();
	}

	private void _testGetNotificationContextWhenGroupDoesNotExist() {
		_resetMocks();

		Assert.assertNull(_notificationHelper.getNotificationContext(9L));
	}

	private void _testGetNotificationContextWhenProjectDoesNotExist() {
		_resetMocks();

		Assert.assertNull(_notificationHelper.getNotificationContext(9L));
	}

	private void _testReplaceTokensEscapesValuesInBody() {
		_resetMocks();

		Map<Locale, String> bodyMap = _replaceTokens(
			Collections.singletonMap(
				LocaleUtil.getDefault(),
				"<p>[%SEGMENT_NEW_MEMBERS_COUNT%]</p>"),
			Collections.singletonMap(
				"[%SEGMENT_NEW_MEMBERS_COUNT%]", "<b>5</b>"),
			true);

		Assert.assertEquals(
			"<p>&lt;b&gt;5&lt;/b&gt;</p>",
			bodyMap.get(LocaleUtil.getDefault()));
	}

	private void _testReplaceTokensLeavesSubjectValuesUnescaped() {
		_resetMocks();

		Map<Locale, String> subjectMap = _replaceTokens(
			Collections.singletonMap(
				LocaleUtil.getDefault(), "[%LIFECYCLE_NAME%] updated"),
			Collections.singletonMap("[%LIFECYCLE_NAME%]", "Sales & Marketing"),
			false);

		Assert.assertEquals(
			"Sales & Marketing updated",
			subjectMap.get(LocaleUtil.getDefault()));
	}

	private void _testSendLifecycleNotificationsResolvesSharedDataOnce()
		throws Exception {

		_resetMocks();

		LifecycleTriggerResult lifecycleTriggerResult = Mockito.mock(
			LifecycleTriggerResult.class);

		Mockito.when(
			lifecycleTriggerResult.getCount()
		).thenReturn(
			5L
		);

		Mockito.when(
			_contactsEngineClient.getNewAccountsLifecycleTriggerResult(
				_faroProject, "L1", 1)
		).thenReturn(
			lifecycleTriggerResult
		);

		Mockito.when(
			_contactsEngineClient.getStalledAccountsLifecycleTriggerResult(
				_faroProject, "L1", 1)
		).thenReturn(
			lifecycleTriggerResult
		);

		Mockito.when(
			_contactsEngineClient.getAccountLifecycle(_faroProject, "L1")
		).thenReturn(
			Mockito.mock(AccountLifecycle.class)
		);

		Mockito.when(
			_notificationTemplateLocalService.
				fetchNotificationTemplateByExternalReferenceCode(
					FaroNotificationTemplateConstants.
						EXTERNAL_REFERENCE_CODE_LIFECYCLE_NOTIFICATION,
					1L)
		).thenReturn(
			Mockito.mock(NotificationTemplate.class)
		);

		_notificationHelper.sendLifecycleNotifications(
			_notificationHelper.getNotificationContext(2L), "L1",
			Map.of(
				3L,
				List.of(
					LifecycleTriggerType.NEW_ACCOUNTS,
					LifecycleTriggerType.NEW_STALLED_ACCOUNTS),
				4L, List.of(LifecycleTriggerType.NEW_ACCOUNTS)),
			"daily");

		Mockito.verify(
			_faroProjectLocalService
		).fetchFaroProjectByGroupId(
			2L
		);

		Mockito.verify(
			_contactsEngineClient
		).getNewAccountsLifecycleTriggerResult(
			_faroProject, "L1", 1
		);

		Mockito.verify(
			_contactsEngineClient
		).getStalledAccountsLifecycleTriggerResult(
			_faroProject, "L1", 1
		);

		Mockito.verify(
			_contactsEngineClient
		).getAccountLifecycle(
			_faroProject, "L1"
		);

		Mockito.verify(
			_notificationTemplateLocalService
		).fetchNotificationTemplateByExternalReferenceCode(
			FaroNotificationTemplateConstants.
				EXTERNAL_REFERENCE_CODE_LIFECYCLE_NOTIFICATION,
			1L
		);
	}

	private void _testSendSegmentNotificationsFetchesTheCountOnceForAllUsers()
		throws Exception {

		_resetMocks();

		Mockito.when(
			_contactsEngineClient.getSegmentNewMembersCount(
				_faroProject, "123", 1)
		).thenReturn(
			5L
		);

		Mockito.when(
			_notificationTemplateLocalService.
				fetchNotificationTemplateByExternalReferenceCode(
					FaroNotificationTemplateConstants.
						EXTERNAL_REFERENCE_CODE_SEGMENT_NOTIFICATION,
					1L)
		).thenReturn(
			Mockito.mock(NotificationTemplate.class)
		);

		_notificationHelper.sendSegmentNotifications(
			_notificationHelper.getNotificationContext(2L), "123", "daily",
			List.of(3L, 4L));

		Mockito.verify(
			_contactsEngineClient
		).getSegmentNewMembersCount(
			_faroProject, "123", 1
		);

		Mockito.verify(
			_notificationTemplateLocalService
		).fetchNotificationTemplateByExternalReferenceCode(
			FaroNotificationTemplateConstants.
				EXTERNAL_REFERENCE_CODE_SEGMENT_NOTIFICATION,
			1L
		);
	}

	private void _testSendSegmentNotificationsKeepsPreferencesWhenCountFails()
		throws Exception {

		_resetMocks();

		Mockito.when(
			_contactsEngineClient.getSegmentNewMembersCount(
				_faroProject, "123", 1)
		).thenThrow(
			new FaroEngineClientException("Internal Server Error")
		);

		Assert.assertThrows(
			FaroEngineClientException.class,
			() -> _notificationHelper.sendSegmentNotifications(
				_notificationHelper.getNotificationContext(2L), "123", "daily",
				List.of(3L)));

		Mockito.verify(
			_notificationPreferencesHelper, Mockito.never()
		).removeSegmentNotificationPreferences(
			Mockito.anyLong(), Mockito.anyCollection()
		);
	}

	private void _testSendSegmentNotificationsKeepsPreferencesWhenSegmentCheckFails()
		throws Exception {

		_resetMocks();

		Mockito.when(
			_contactsEngineClient.getSegmentNewMembersCount(
				_faroProject, "123", 1)
		).thenThrow(
			new NoSuchEntryException("No route was found")
		);

		Mockito.when(
			_contactsEngineClient.getIndividualSegment(
				_faroProject, "123", false)
		).thenThrow(
			new FaroEngineClientException(
				_getErrorBody("internal-server-error", 500))
		);

		_notificationHelper.sendSegmentNotifications(
			_notificationHelper.getNotificationContext(2L), "123", "daily",
			List.of(3L, 4L));

		Mockito.verify(
			_notificationPreferencesHelper, Mockito.never()
		).removeSegmentNotificationPreferences(
			Mockito.anyLong(), Mockito.anyCollection()
		);
	}

	private void _testSendSegmentNotificationsKeepsPreferencesWhenSegmentStillExists()
		throws Exception {

		_resetMocks();

		Mockito.when(
			_contactsEngineClient.getSegmentNewMembersCount(
				_faroProject, "123", 1)
		).thenThrow(
			new NoSuchEntryException("No route was found")
		);

		Mockito.when(
			_contactsEngineClient.getIndividualSegment(
				_faroProject, "123", false)
		).thenReturn(
			Mockito.mock(IndividualSegment.class)
		);

		_notificationHelper.sendSegmentNotifications(
			_notificationHelper.getNotificationContext(2L), "123", "daily",
			List.of(3L, 4L));

		Mockito.verify(
			_notificationPreferencesHelper, Mockito.never()
		).removeSegmentNotificationPreferences(
			Mockito.anyLong(), Mockito.anyCollection()
		);
	}

	private void _testSendSegmentNotificationsRemovesPreferencesWhenEngineReportsNoSuchSegment()
		throws Exception {

		_resetMocks();

		Mockito.when(
			_contactsEngineClient.getSegmentNewMembersCount(
				_faroProject, "123", 1)
		).thenThrow(
			new NoSuchEntryException("No route was found")
		);

		Mockito.when(
			_contactsEngineClient.getIndividualSegment(
				_faroProject, "123", false)
		).thenThrow(
			new FaroEngineClientException(
				_getErrorBody("there-is-no-segment-with-segment-id-123", 400))
		);

		_notificationHelper.sendSegmentNotifications(
			_notificationHelper.getNotificationContext(2L), "123", "daily",
			List.of(3L, 4L));

		Mockito.verify(
			_notificationPreferencesHelper
		).removeSegmentNotificationPreferences(
			2L, Collections.singleton("123")
		);

		Mockito.verify(
			_notificationTemplateLocalService, Mockito.never()
		).fetchNotificationTemplateByExternalReferenceCode(
			Mockito.anyString(), Mockito.anyLong()
		);
	}

	private void _testSendSegmentNotificationsRemovesPreferencesWhenSegmentDoesNotExist()
		throws Exception {

		_resetMocks();

		Mockito.when(
			_contactsEngineClient.getSegmentNewMembersCount(
				_faroProject, "123", 1)
		).thenThrow(
			new NoSuchEntryException("No route was found")
		);

		Mockito.when(
			_contactsEngineClient.getIndividualSegment(
				_faroProject, "123", false)
		).thenThrow(
			new NoSuchEntryException("No segment was found")
		);

		_notificationHelper.sendSegmentNotifications(
			_notificationHelper.getNotificationContext(2L), "123", "daily",
			List.of(3L, 4L));

		Mockito.verify(
			_notificationPreferencesHelper
		).removeSegmentNotificationPreferences(
			2L, Collections.singleton("123")
		);

		Mockito.verify(
			_notificationTemplateLocalService, Mockito.never()
		).fetchNotificationTemplateByExternalReferenceCode(
			Mockito.anyString(), Mockito.anyLong()
		);
	}

	private void _testSendSegmentNotificationsResolvesTheWorkspaceOnce()
		throws Exception {

		_resetMocks();

		Mockito.when(
			_contactsEngineClient.getSegmentNewMembersCount(
				Mockito.eq(_faroProject), Mockito.anyString(), Mockito.eq(1))
		).thenReturn(
			5L
		);

		Mockito.when(
			_notificationTemplateLocalService.
				fetchNotificationTemplateByExternalReferenceCode(
					FaroNotificationTemplateConstants.
						EXTERNAL_REFERENCE_CODE_SEGMENT_NOTIFICATION,
					1L)
		).thenReturn(
			Mockito.mock(NotificationTemplate.class)
		);

		NotificationHelper.NotificationContext notificationContext =
			_notificationHelper.getNotificationContext(2L);

		_notificationHelper.sendSegmentNotifications(
			notificationContext, "123", "daily", List.of(3L));
		_notificationHelper.sendSegmentNotifications(
			notificationContext, "456", "daily", List.of(3L));

		Mockito.verify(
			_faroProjectLocalService
		).fetchFaroProjectByGroupId(
			2L
		);

		Mockito.verify(
			_groupLocalService
		).fetchGroup(
			2L
		);

		Mockito.verify(
			_notificationTemplateLocalService
		).fetchNotificationTemplateByExternalReferenceCode(
			FaroNotificationTemplateConstants.
				EXTERNAL_REFERENCE_CODE_SEGMENT_NOTIFICATION,
			1L
		);
	}

	private void _testSendSegmentNotificationsWhenCountIsZero()
		throws Exception {

		_resetMocks();

		Mockito.when(
			_contactsEngineClient.getSegmentNewMembersCount(
				_faroProject, "123", 1)
		).thenReturn(
			0L
		);

		_notificationHelper.sendSegmentNotifications(
			_notificationHelper.getNotificationContext(2L), "123", "daily",
			List.of(3L));

		Mockito.verify(
			_notificationTemplateLocalService, Mockito.never()
		).fetchNotificationTemplateByExternalReferenceCode(
			Mockito.anyString(), Mockito.anyLong()
		);
	}

	private void _testSendSegmentNotificationsWhenUserIsInactive()
		throws Exception {

		_resetMocks();

		Mockito.when(
			_user.isActive()
		).thenReturn(
			false
		);

		_notificationHelper.sendSegmentNotifications(
			_notificationHelper.getNotificationContext(2L), "123", "daily",
			List.of(3L));

		Mockito.verify(
			_contactsEngineClient, Mockito.never()
		).getSegmentNewMembersCount(
			Mockito.any(), Mockito.anyString(), Mockito.anyInt()
		);
	}

	private void _testSendSegmentNotificationsWhenUserIsNotAnApprovedMember()
		throws Exception {

		_resetMocks();

		Mockito.when(
			_faroUser.getStatus()
		).thenReturn(
			FaroUserConstants.STATUS_PENDING
		);

		_notificationHelper.sendSegmentNotifications(
			_notificationHelper.getNotificationContext(2L), "123", "daily",
			List.of(3L));

		Mockito.verify(
			_contactsEngineClient, Mockito.never()
		).getSegmentNewMembersCount(
			Mockito.any(), Mockito.anyString(), Mockito.anyInt()
		);
	}

	private final ContactsEngineClient _contactsEngineClient = Mockito.mock(
		ContactsEngineClient.class);
	private final EmailReportHelper _emailReportHelper = Mockito.mock(
		EmailReportHelper.class);
	private final FaroNotificationTemplateProvisioner
		_faroNotificationTemplateProvisioner = Mockito.mock(
			FaroNotificationTemplateProvisioner.class);
	private final FaroProject _faroProject = Mockito.mock(FaroProject.class);
	private final FaroProjectLocalService _faroProjectLocalService =
		Mockito.mock(FaroProjectLocalService.class);
	private final FaroUser _faroUser = Mockito.mock(FaroUser.class);
	private final FaroUserLocalService _faroUserLocalService = Mockito.mock(
		FaroUserLocalService.class);
	private final Group _group = Mockito.mock(Group.class);
	private final GroupLocalService _groupLocalService = Mockito.mock(
		GroupLocalService.class);
	private final NotificationHelper _notificationHelper =
		new NotificationHelper();
	private final NotificationPreferencesHelper _notificationPreferencesHelper =
		Mockito.mock(NotificationPreferencesHelper.class);
	private final NotificationTemplateLocalService
		_notificationTemplateLocalService = Mockito.mock(
			NotificationTemplateLocalService.class);
	private final FaroUser _secondFaroUser = Mockito.mock(FaroUser.class);
	private final User _secondUser = Mockito.mock(User.class);
	private final User _user = Mockito.mock(User.class);
	private final UserLocalService _userLocalService = Mockito.mock(
		UserLocalService.class);

}