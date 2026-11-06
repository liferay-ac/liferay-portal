/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.jaxrs.container.request.filter;

import com.liferay.osb.faro.constants.FaroChannelConstants;
import com.liferay.osb.faro.constants.FaroUserConstants;
import com.liferay.osb.faro.model.FaroChannel;
import com.liferay.osb.faro.model.FaroProject;
import com.liferay.osb.faro.model.FaroUser;
import com.liferay.osb.faro.rest.internal.security.permission.WorkspacePermission;
import com.liferay.osb.faro.service.FaroChannelLocalService;
import com.liferay.osb.faro.service.FaroProjectLocalService;
import com.liferay.osb.faro.service.FaroUserLocalService;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.model.UserGroupRole;
import com.liferay.portal.kernel.model.role.RoleConstants;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.kernel.service.UserGroupRoleLocalService;
import com.liferay.portal.kernel.test.ReflectionTestUtil;
import com.liferay.portal.vulcan.jaxrs.exception.mapper.Problem;

import jakarta.servlet.http.HttpServletRequest;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.MultivaluedHashMap;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;

import java.util.Collections;
import java.util.List;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

/**
 * @author Nilton Vieira
 */
public class WorkspaceContainerRequestFilterTest {

	@Before
	public void setUp() {
		_permissionChecker = PermissionThreadLocal.getPermissionChecker();

		FaroChannel allUsersFaroChannel = _mockFaroChannel(
			FaroChannelConstants.PERMISSION_ALL_USERS);
		FaroChannel selectUsersFaroChannel = _mockFaroChannel(
			FaroChannelConstants.PERMISSION_SELECT_USERS);

		Mockito.when(
			_faroChannelLocalService.fetchFaroChannel(
				_ALL_USERS_CHANNEL_ID, _GROUP_ID)
		).thenReturn(
			allUsersFaroChannel
		);

		Mockito.when(
			_faroChannelLocalService.fetchFaroChannel(
				_SELECT_USERS_CHANNEL_ID, _GROUP_ID)
		).thenReturn(
			selectUsersFaroChannel
		);

		Mockito.when(
			_faroProject.getGroupId()
		).thenReturn(
			_GROUP_ID
		);

		Mockito.when(
			_faroProject.isAllowedIPAddress(Mockito.any())
		).thenReturn(
			true
		);

		Mockito.when(
			_faroProjectLocalService.fetchFaroProjectByGroupId(_GROUP_ID)
		).thenReturn(
			_faroProject
		);

		_mockFaroUser(RoleConstants.SITE_ADMINISTRATOR, _ADMINISTRATOR_USER_ID);
		_mockFaroUser(RoleConstants.SITE_MEMBER, _MEMBER_USER_ID);
		_mockFaroUser(RoleConstants.SITE_OWNER, _OWNER_USER_ID);

		Mockito.when(
			_userGroupRoleLocalService.getUserGroupRoles(
				Mockito.anyLong(), Mockito.eq(_CHANNEL_GROUP_ID))
		).thenReturn(
			Collections.emptyList()
		);

		WorkspacePermission workspacePermission = new WorkspacePermission();

		ReflectionTestUtil.setFieldValue(
			workspacePermission, "_faroUserLocalService",
			_faroUserLocalService);
		ReflectionTestUtil.setFieldValue(
			workspacePermission, "_roleLocalService", _roleLocalService);
		ReflectionTestUtil.setFieldValue(
			workspacePermission, "_userGroupRoleLocalService",
			_userGroupRoleLocalService);

		ReflectionTestUtil.setFieldValue(
			_workspaceContainerRequestFilter, "_faroChannelLocalService",
			_faroChannelLocalService);
		ReflectionTestUtil.setFieldValue(
			_workspaceContainerRequestFilter, "_faroProjectLocalService",
			_faroProjectLocalService);
		ReflectionTestUtil.setFieldValue(
			_workspaceContainerRequestFilter, "_httpServletRequest",
			Mockito.mock(HttpServletRequest.class));
		ReflectionTestUtil.setFieldValue(
			_workspaceContainerRequestFilter, "_workspacePermission",
			workspacePermission);
	}

	@After
	public void tearDown() {
		PermissionThreadLocal.setPermissionChecker(_permissionChecker);
	}

	@Test
	public void testFilter() {
		Assert.assertNull(_filter(null, null, _MEMBER_USER_ID));
		Assert.assertNull(_filter(null, _GROUP_ID, _MEMBER_USER_ID));
		Assert.assertNull(
			_filter(_ALL_USERS_CHANNEL_ID, _GROUP_ID, _MEMBER_USER_ID));
		Assert.assertNull(_filter(null, _GROUP_ID, _OMNIADMIN_USER_ID));

		_assertResponseStatus(
			_filter(null, 999L, _MEMBER_USER_ID), Response.Status.NOT_FOUND);
		_assertResponseStatus(
			_filter(null, _GROUP_ID, _GUEST_USER_ID),
			Response.Status.UNAUTHORIZED);
		_assertResponseStatus(
			_filter(null, _GROUP_ID, _OUTSIDER_USER_ID),
			Response.Status.FORBIDDEN);
		_assertResponseStatus(
			_filter("unknown", _GROUP_ID, _MEMBER_USER_ID),
			Response.Status.NOT_FOUND);
		_assertResponseStatus(
			_filter(_SELECT_USERS_CHANNEL_ID, _GROUP_ID, _MEMBER_USER_ID),
			Response.Status.FORBIDDEN);

		Mockito.when(
			_userGroupRoleLocalService.getUserGroupRoles(
				_MEMBER_USER_ID, _CHANNEL_GROUP_ID)
		).thenReturn(
			List.of(Mockito.mock(UserGroupRole.class))
		);

		Assert.assertNull(
			_filter(_SELECT_USERS_CHANNEL_ID, _GROUP_ID, _MEMBER_USER_ID));

		Mockito.when(
			_faroProject.isAllowedIPAddress(Mockito.any())
		).thenReturn(
			false
		);

		_assertResponseStatus(
			_filter(null, _GROUP_ID, _MEMBER_USER_ID),
			Response.Status.FORBIDDEN);
		Assert.assertNull(_filter(null, _GROUP_ID, _OMNIADMIN_USER_ID));
	}

	@Test
	public void testFilterWithAllUsersChannelId() {
		Assert.assertNull(
			_filter(_ALL_USERS_CHANNEL_ID, _GROUP_ID, _ADMINISTRATOR_USER_ID));
		Assert.assertNull(
			_filter(_ALL_USERS_CHANNEL_ID, _GROUP_ID, _MEMBER_USER_ID));
		Assert.assertNull(
			_filter(_ALL_USERS_CHANNEL_ID, _GROUP_ID, _OMNIADMIN_USER_ID));
		Assert.assertNull(
			_filter(_ALL_USERS_CHANNEL_ID, _GROUP_ID, _OWNER_USER_ID));
	}

	@Test
	public void testFilterWithOutsiderUser() {
		_assertResponse(
			"Unable to access the workspace with group ID " + _GROUP_ID +
				". Call getWorkspacesPage to list the workspaces you can use.",
			_filter(null, _GROUP_ID, _OUTSIDER_USER_ID),
			Response.Status.FORBIDDEN);
	}

	@Test
	public void testFilterWithSelectUsersChannelId() {
		Assert.assertNull(
			_filter(
				_SELECT_USERS_CHANNEL_ID, _GROUP_ID, _ADMINISTRATOR_USER_ID));
		Assert.assertNull(
			_filter(_SELECT_USERS_CHANNEL_ID, _GROUP_ID, _OMNIADMIN_USER_ID));
		Assert.assertNull(
			_filter(_SELECT_USERS_CHANNEL_ID, _GROUP_ID, _OWNER_USER_ID));

		_assertResponse(
			StringBundler.concat(
				"Unable to access the property with channel ID ",
				_SELECT_USERS_CHANNEL_ID,
				". Call getWorkspaceGroupChannelsPage to list the properties ",
				"you can use."),
			_filter(_SELECT_USERS_CHANNEL_ID, _GROUP_ID, _MEMBER_USER_ID),
			Response.Status.FORBIDDEN);

		Mockito.when(
			_userGroupRoleLocalService.getUserGroupRoles(
				_MEMBER_USER_ID, _CHANNEL_GROUP_ID)
		).thenReturn(
			List.of(Mockito.mock(UserGroupRole.class))
		);

		Assert.assertNull(
			_filter(_SELECT_USERS_CHANNEL_ID, _GROUP_ID, _MEMBER_USER_ID));
	}

	private void _assertResponse(
		String expectedTitle, Response response, Response.Status status) {

		_assertResponseStatus(response, status);

		Problem problem = (Problem)response.getEntity();

		Assert.assertEquals(expectedTitle, problem.getTitle());
		Assert.assertNull(problem.getType());
	}

	private void _assertResponseStatus(
		Response response, Response.Status status) {

		Assert.assertEquals(status.getStatusCode(), response.getStatus());
	}

	private Response _filter(String channelId, Long groupId, long userId) {
		User user = Mockito.mock(User.class);

		Mockito.when(
			user.isGuestUser()
		).thenReturn(
			userId == _GUEST_USER_ID
		);

		PermissionChecker permissionChecker = Mockito.mock(
			PermissionChecker.class);

		Mockito.when(
			permissionChecker.getUser()
		).thenReturn(
			user
		);

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

		PermissionThreadLocal.setPermissionChecker(permissionChecker);

		MultivaluedMap<String, String> pathParameters =
			new MultivaluedHashMap<>();

		if (groupId != null) {
			pathParameters.putSingle("groupId", String.valueOf(groupId));
		}

		if (channelId != null) {
			pathParameters.putSingle("channelId", channelId);
		}

		UriInfo uriInfo = Mockito.mock(UriInfo.class);

		Mockito.when(
			uriInfo.getPathParameters()
		).thenReturn(
			pathParameters
		);

		Mockito.when(
			uriInfo.getQueryParameters()
		).thenReturn(
			new MultivaluedHashMap<>()
		);

		ContainerRequestContext containerRequestContext = Mockito.mock(
			ContainerRequestContext.class);

		Mockito.when(
			containerRequestContext.getUriInfo()
		).thenReturn(
			uriInfo
		);

		_workspaceContainerRequestFilter.filter(containerRequestContext);

		ArgumentCaptor<Response> argumentCaptor = ArgumentCaptor.forClass(
			Response.class);

		Mockito.verify(
			containerRequestContext, Mockito.atMost(1)
		).abortWith(
			argumentCaptor.capture()
		);

		List<Response> responses = argumentCaptor.getAllValues();

		if (responses.isEmpty()) {
			return null;
		}

		return responses.get(0);
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

	private void _mockFaroUser(String roleName, long userId) {
		FaroUser faroUser = Mockito.mock(FaroUser.class);

		Mockito.when(
			faroUser.getRoleId()
		).thenReturn(
			userId
		);

		Mockito.when(
			faroUser.getStatus()
		).thenReturn(
			FaroUserConstants.STATUS_APPROVED
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

	private static final long _ADMINISTRATOR_USER_ID = 5L;

	private static final String _ALL_USERS_CHANNEL_ID = "100";

	private static final long _CHANNEL_GROUP_ID = 200L;

	private static final long _GROUP_ID = 300L;

	private static final long _GUEST_USER_ID = 1L;

	private static final long _MEMBER_USER_ID = 2L;

	private static final long _OMNIADMIN_USER_ID = 4L;

	private static final long _OUTSIDER_USER_ID = 3L;

	private static final long _OWNER_USER_ID = 6L;

	private static final String _SELECT_USERS_CHANNEL_ID = "500";

	private final FaroChannelLocalService _faroChannelLocalService =
		Mockito.mock(FaroChannelLocalService.class);
	private final FaroProject _faroProject = Mockito.mock(FaroProject.class);
	private final FaroProjectLocalService _faroProjectLocalService =
		Mockito.mock(FaroProjectLocalService.class);
	private final FaroUserLocalService _faroUserLocalService = Mockito.mock(
		FaroUserLocalService.class);
	private PermissionChecker _permissionChecker;
	private final RoleLocalService _roleLocalService = Mockito.mock(
		RoleLocalService.class);
	private final UserGroupRoleLocalService _userGroupRoleLocalService =
		Mockito.mock(UserGroupRoleLocalService.class);
	private final WorkspaceContainerRequestFilter
		_workspaceContainerRequestFilter =
			new WorkspaceContainerRequestFilter();

}