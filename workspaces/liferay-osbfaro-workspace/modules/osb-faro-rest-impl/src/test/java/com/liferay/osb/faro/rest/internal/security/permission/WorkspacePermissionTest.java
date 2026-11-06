/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.security.permission;

import com.liferay.osb.faro.constants.FaroChannelConstants;
import com.liferay.osb.faro.constants.FaroUserConstants;
import com.liferay.osb.faro.model.FaroChannel;
import com.liferay.osb.faro.model.FaroUser;
import com.liferay.osb.faro.service.FaroChannelLocalService;
import com.liferay.osb.faro.service.FaroUserLocalService;
import com.liferay.petra.sql.dsl.query.DSLQuery;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.UserGroupRole;
import com.liferay.portal.kernel.model.role.RoleConstants;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.kernel.service.UserGroupRoleLocalService;
import com.liferay.portal.kernel.test.ReflectionTestUtil;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import org.mockito.Mockito;

/**
 * @author Marcos Martins
 */
public class WorkspacePermissionTest {

	@Before
	public void setUp() {
		_mockFaroUser(
			RoleConstants.SITE_ADMINISTRATOR, FaroUserConstants.STATUS_APPROVED,
			_ADMINISTRATOR_USER_ID);
		_mockFaroUser(
			RoleConstants.SITE_MEMBER, FaroUserConstants.STATUS_APPROVED,
			_MEMBER_USER_ID);
		_mockFaroUser(
			RoleConstants.SITE_OWNER, FaroUserConstants.STATUS_APPROVED,
			_OWNER_USER_ID);
		_mockFaroUser(
			RoleConstants.SITE_ADMINISTRATOR, FaroUserConstants.STATUS_PENDING,
			_PENDING_ADMINISTRATOR_USER_ID);

		Mockito.when(
			_userGroupRoleLocalService.getUserGroupRoles(
				Mockito.anyLong(), Mockito.eq(_CHANNEL_GROUP_ID))
		).thenReturn(
			Collections.emptyList()
		);

		ReflectionTestUtil.setFieldValue(
			_workspacePermission, "_faroChannelLocalService",
			_faroChannelLocalService);
		ReflectionTestUtil.setFieldValue(
			_workspacePermission, "_faroUserLocalService",
			_faroUserLocalService);
		ReflectionTestUtil.setFieldValue(
			_workspacePermission, "_roleLocalService", _roleLocalService);
		ReflectionTestUtil.setFieldValue(
			_workspacePermission, "_userGroupRoleLocalService",
			_userGroupRoleLocalService);
	}

	@Test
	public void testGetInaccessibleChannelIds() {
		FaroChannel invitedFaroChannel = _mockFaroChannel(
			FaroChannelConstants.PERMISSION_SELECT_USERS);

		Mockito.when(
			invitedFaroChannel.getChannelId()
		).thenReturn(
			"1001"
		);

		Mockito.when(
			invitedFaroChannel.getGroupId()
		).thenReturn(
			_INVITED_CHANNEL_GROUP_ID
		);

		Mockito.when(
			_userGroupRoleLocalService.getUserGroupRoles(
				_MEMBER_USER_ID, _INVITED_CHANNEL_GROUP_ID)
		).thenReturn(
			Collections.singletonList(Mockito.mock(UserGroupRole.class))
		);

		FaroChannel uninvitedFaroChannel = _mockFaroChannel(
			FaroChannelConstants.PERMISSION_SELECT_USERS);

		Mockito.when(
			uninvitedFaroChannel.getChannelId()
		).thenReturn(
			"1002"
		);

		Mockito.doReturn(
			Arrays.asList(invitedFaroChannel, uninvitedFaroChannel)
		).when(
			_faroChannelLocalService
		).dslQuery(
			Mockito.any(DSLQuery.class)
		);

		Assert.assertEquals(
			Collections.emptyList(),
			_workspacePermission.getInaccessibleChannelIds(
				_GROUP_ID, _mockPermissionChecker(_ADMINISTRATOR_USER_ID)));
		Assert.assertEquals(
			Collections.singletonList("1002"),
			_workspacePermission.getInaccessibleChannelIds(
				_GROUP_ID, _mockPermissionChecker(_MEMBER_USER_ID)));
		Assert.assertEquals(
			Collections.emptyList(),
			_workspacePermission.getInaccessibleChannelIds(
				_GROUP_ID, _mockPermissionChecker(_OMNIADMIN_USER_ID)));
		Assert.assertEquals(
			Collections.emptyList(),
			_workspacePermission.getInaccessibleChannelIds(
				_GROUP_ID, _mockPermissionChecker(_OWNER_USER_ID)));
	}

	@Test
	public void testHasChannelPermissionWithAllUsersFaroChannel() {
		FaroChannel faroChannel = _mockFaroChannel(
			FaroChannelConstants.PERMISSION_ALL_USERS);

		Assert.assertTrue(
			_workspacePermission.hasChannelPermission(
				faroChannel, _mockPermissionChecker(_MEMBER_USER_ID)));
		Assert.assertTrue(
			_workspacePermission.hasChannelPermission(
				faroChannel, _mockPermissionChecker(_OUTSIDER_USER_ID)));
	}

	@Test
	public void testHasChannelPermissionWithSelectUsersFaroChannel() {
		FaroChannel faroChannel = _mockFaroChannel(
			FaroChannelConstants.PERMISSION_SELECT_USERS);

		Assert.assertFalse(
			_workspacePermission.hasChannelPermission(
				faroChannel, _mockPermissionChecker(_MEMBER_USER_ID)));
		Assert.assertFalse(
			_workspacePermission.hasChannelPermission(
				faroChannel, _mockPermissionChecker(_OUTSIDER_USER_ID)));
		Assert.assertFalse(
			_workspacePermission.hasChannelPermission(
				faroChannel,
				_mockPermissionChecker(_PENDING_ADMINISTRATOR_USER_ID)));
		Assert.assertTrue(
			_workspacePermission.hasChannelPermission(
				faroChannel, _mockPermissionChecker(_ADMINISTRATOR_USER_ID)));
		Assert.assertTrue(
			_workspacePermission.hasChannelPermission(
				faroChannel, _mockPermissionChecker(_OMNIADMIN_USER_ID)));
		Assert.assertTrue(
			_workspacePermission.hasChannelPermission(
				faroChannel, _mockPermissionChecker(_OWNER_USER_ID)));

		Mockito.when(
			_userGroupRoleLocalService.getUserGroupRoles(
				_MEMBER_USER_ID, _CHANNEL_GROUP_ID)
		).thenReturn(
			List.of(Mockito.mock(UserGroupRole.class))
		);

		Assert.assertTrue(
			_workspacePermission.hasChannelPermission(
				faroChannel, _mockPermissionChecker(_MEMBER_USER_ID)));
	}

	@Test
	public void testIsWorkspaceMember() {
		Assert.assertFalse(
			_workspacePermission.isWorkspaceMember(
				_GROUP_ID, _mockPermissionChecker(_OUTSIDER_USER_ID)));
		Assert.assertFalse(
			_workspacePermission.isWorkspaceMember(
				_GROUP_ID,
				_mockPermissionChecker(_PENDING_ADMINISTRATOR_USER_ID)));
		Assert.assertTrue(
			_workspacePermission.isWorkspaceMember(
				_GROUP_ID, _mockPermissionChecker(_ADMINISTRATOR_USER_ID)));
		Assert.assertTrue(
			_workspacePermission.isWorkspaceMember(
				_GROUP_ID, _mockPermissionChecker(_MEMBER_USER_ID)));
		Assert.assertTrue(
			_workspacePermission.isWorkspaceMember(
				_GROUP_ID, _mockPermissionChecker(_OWNER_USER_ID)));
	}

	private FaroChannel _mockFaroChannel(int permissionType) {
		FaroChannel faroChannel = Mockito.mock(FaroChannel.class);

		Mockito.when(
			faroChannel.getGroupId()
		).thenReturn(
			_CHANNEL_GROUP_ID
		);

		Mockito.when(
			faroChannel.getPermissionType()
		).thenReturn(
			permissionType
		);

		Mockito.when(
			faroChannel.getWorkspaceGroupId()
		).thenReturn(
			_GROUP_ID
		);

		return faroChannel;
	}

	private void _mockFaroUser(String roleName, int status, long userId) {
		FaroUser faroUser = Mockito.mock(FaroUser.class);

		Mockito.when(
			faroUser.getRoleId()
		).thenReturn(
			userId
		);

		Mockito.when(
			faroUser.getStatus()
		).thenReturn(
			status
		);

		Mockito.when(
			_faroUserLocalService.fetchFaroUser(_GROUP_ID, userId)
		).thenReturn(
			faroUser
		);

		Role role = Mockito.mock(Role.class);

		Mockito.when(
			role.getName()
		).thenReturn(
			roleName
		);

		Mockito.when(
			_roleLocalService.fetchRole(userId)
		).thenReturn(
			role
		);
	}

	private PermissionChecker _mockPermissionChecker(long userId) {
		PermissionChecker permissionChecker = Mockito.mock(
			PermissionChecker.class);

		Mockito.when(
			permissionChecker.getUserId()
		).thenReturn(
			userId
		);

		Mockito.when(
			permissionChecker.isOmniadmin()
		).thenReturn(
			userId == _OMNIADMIN_USER_ID
		);

		return permissionChecker;
	}

	private static final long _ADMINISTRATOR_USER_ID = 1L;

	private static final long _CHANNEL_GROUP_ID = 100L;

	private static final long _GROUP_ID = 200L;

	private static final long _INVITED_CHANNEL_GROUP_ID = 300L;

	private static final long _MEMBER_USER_ID = 2L;

	private static final long _OMNIADMIN_USER_ID = 3L;

	private static final long _OUTSIDER_USER_ID = 4L;

	private static final long _OWNER_USER_ID = 5L;

	private static final long _PENDING_ADMINISTRATOR_USER_ID = 6L;

	private final FaroChannelLocalService _faroChannelLocalService =
		Mockito.mock(FaroChannelLocalService.class);
	private final FaroUserLocalService _faroUserLocalService = Mockito.mock(
		FaroUserLocalService.class);
	private final RoleLocalService _roleLocalService = Mockito.mock(
		RoleLocalService.class);
	private final UserGroupRoleLocalService _userGroupRoleLocalService =
		Mockito.mock(UserGroupRoleLocalService.class);
	private final WorkspacePermission _workspacePermission =
		new WorkspacePermission();

}