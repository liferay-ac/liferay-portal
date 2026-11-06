/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.helper;

import com.liferay.osb.faro.constants.FaroChannelConstants;
import com.liferay.osb.faro.constants.FaroUserConstants;
import com.liferay.osb.faro.engine.client.ContactsEngineClient;
import com.liferay.osb.faro.engine.client.exception.FaroEngineClientException;
import com.liferay.osb.faro.engine.client.exception.NoSuchEntryException;
import com.liferay.osb.faro.engine.client.model.IndividualSegment;
import com.liferay.osb.faro.model.FaroChannel;
import com.liferay.osb.faro.model.FaroProject;
import com.liferay.osb.faro.model.FaroUser;
import com.liferay.osb.faro.rest.internal.security.permission.WorkspacePermission;
import com.liferay.osb.faro.service.FaroChannelLocalService;
import com.liferay.osb.faro.service.FaroUserLocalService;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.UserGroupRole;
import com.liferay.portal.kernel.model.role.RoleConstants;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.kernel.service.UserGroupRoleLocalService;
import com.liferay.portal.kernel.test.ReflectionTestUtil;
import com.liferay.portal.vulcan.jaxrs.exception.mapper.Problem;

import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Collections;
import java.util.List;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import org.mockito.Mockito;

/**
 * @author Marcos Martins
 */
public class IndividualSegmentHelperTest {

	@Before
	public void setUp() {
		_permissionChecker = PermissionThreadLocal.getPermissionChecker();

		_mockFaroChannel(
			_ALL_USERS_CHANNEL_ID, FaroChannelConstants.PERMISSION_ALL_USERS);
		_mockFaroChannel(
			_SELECT_USERS_CHANNEL_ID,
			FaroChannelConstants.PERMISSION_SELECT_USERS);

		_mockFaroUser(RoleConstants.SITE_ADMINISTRATOR, _ADMINISTRATOR_USER_ID);
		_mockFaroUser(RoleConstants.SITE_MEMBER, _MEMBER_USER_ID);

		Mockito.when(
			_faroProject.getGroupId()
		).thenReturn(
			_GROUP_ID
		);

		_mockIndividualSegment(
			_ALL_USERS_CHANNEL_ID, _ALL_USERS_INDIVIDUAL_SEGMENT_ID);
		_mockIndividualSegment(null, _NO_CHANNEL_INDIVIDUAL_SEGMENT_ID);
		_mockIndividualSegment(
			_SELECT_USERS_CHANNEL_ID, _SELECT_USERS_INDIVIDUAL_SEGMENT_ID);
		_mockIndividualSegment(
			"unknown", _UNKNOWN_CHANNEL_INDIVIDUAL_SEGMENT_ID);

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
			_individualSegmentHelper, "_contactsEngineClient",
			_contactsEngineClient);
		ReflectionTestUtil.setFieldValue(
			_individualSegmentHelper, "_faroChannelLocalService",
			_faroChannelLocalService);
		ReflectionTestUtil.setFieldValue(
			_individualSegmentHelper, "_workspacePermission",
			workspacePermission);
	}

	@After
	public void tearDown() {
		PermissionThreadLocal.setPermissionChecker(_permissionChecker);
	}

	@Test
	public void testGetIndividualSegment() {
		_setPermissionChecker(_MEMBER_USER_ID);

		_assertGetIndividualSegment(_ALL_USERS_INDIVIDUAL_SEGMENT_ID);
		_assertGetIndividualSegment(_NO_CHANNEL_INDIVIDUAL_SEGMENT_ID);
	}

	@Test
	public void testGetIndividualSegmentWithEngineException() {
		Mockito.when(
			_contactsEngineClient.getIndividualSegment(
				_faroProject, _BAD_REQUEST_INDIVIDUAL_SEGMENT_ID, false)
		).thenThrow(
			new FaroEngineClientException("Bad Request", 400)
		);

		_assertNotFoundException(_BAD_REQUEST_INDIVIDUAL_SEGMENT_ID);

		Mockito.when(
			_contactsEngineClient.getIndividualSegment(
				_faroProject, _NOT_FOUND_INDIVIDUAL_SEGMENT_ID, false)
		).thenThrow(
			new NoSuchEntryException("Not Found")
		);

		_assertNotFoundException(_NOT_FOUND_INDIVIDUAL_SEGMENT_ID);

		FaroEngineClientException faroEngineClientException1 =
			new FaroEngineClientException("Internal Server Error", 500);

		Mockito.when(
			_contactsEngineClient.getIndividualSegment(
				_faroProject, _SERVER_ERROR_INDIVIDUAL_SEGMENT_ID, false)
		).thenThrow(
			faroEngineClientException1
		);

		try {
			_individualSegmentHelper.getIndividualSegment(
				_faroProject, _SERVER_ERROR_INDIVIDUAL_SEGMENT_ID);

			Assert.fail();
		}
		catch (FaroEngineClientException faroEngineClientException2) {
			Assert.assertSame(
				faroEngineClientException1, faroEngineClientException2);
		}
	}

	@Test
	public void testGetIndividualSegmentWithSelectUsersChannel() {
		_setPermissionChecker(_ADMINISTRATOR_USER_ID);

		_assertGetIndividualSegment(_SELECT_USERS_INDIVIDUAL_SEGMENT_ID);

		_setPermissionChecker(_OMNIADMIN_USER_ID);

		_assertGetIndividualSegment(_SELECT_USERS_INDIVIDUAL_SEGMENT_ID);

		_setPermissionChecker(_MEMBER_USER_ID);

		try {
			_individualSegmentHelper.getIndividualSegment(
				_faroProject, _SELECT_USERS_INDIVIDUAL_SEGMENT_ID);

			Assert.fail();
		}
		catch (ForbiddenException forbiddenException) {
			String expectedTitle = StringBundler.concat(
				"Unable to access the individual segment with ID ",
				_SELECT_USERS_INDIVIDUAL_SEGMENT_ID,
				". Call getWorkspaceGroupChannelIndividualSegmentsPage to ",
				"list the individual segments you can use.");

			Assert.assertEquals(expectedTitle, forbiddenException.getMessage());

			Response response = forbiddenException.getResponse();

			Assert.assertEquals(
				MediaType.APPLICATION_JSON_TYPE, response.getMediaType());
			Assert.assertEquals(
				Response.Status.FORBIDDEN.getStatusCode(),
				response.getStatus());

			Problem problem = (Problem)response.getEntity();

			Assert.assertEquals(Response.Status.FORBIDDEN, problem.getStatus());
			Assert.assertEquals(expectedTitle, problem.getTitle());
			Assert.assertNull(problem.getType());
		}

		Mockito.when(
			_userGroupRoleLocalService.getUserGroupRoles(
				_MEMBER_USER_ID, _CHANNEL_GROUP_ID)
		).thenReturn(
			List.of(Mockito.mock(UserGroupRole.class))
		);

		_assertGetIndividualSegment(_SELECT_USERS_INDIVIDUAL_SEGMENT_ID);
	}

	@Test
	public void testGetIndividualSegmentWithUnknownChannel() {
		_setPermissionChecker(_OMNIADMIN_USER_ID);

		_assertNotFoundException(_UNKNOWN_CHANNEL_INDIVIDUAL_SEGMENT_ID);
	}

	private void _assertGetIndividualSegment(String individualSegmentId) {
		IndividualSegment individualSegment =
			_individualSegmentHelper.getIndividualSegment(
				_faroProject, individualSegmentId);

		Assert.assertEquals(individualSegmentId, individualSegment.getId());
	}

	private void _assertNotFoundException(String individualSegmentId) {
		String expectedTitle =
			"No individual segment was found with ID " + individualSegmentId +
				". Call getWorkspaceGroupChannelIndividualSegmentsPage to " +
					"find individual segment IDs.";

		try {
			_individualSegmentHelper.getIndividualSegment(
				_faroProject, individualSegmentId);

			Assert.fail();
		}
		catch (NotFoundException notFoundException) {
			Assert.assertEquals(expectedTitle, notFoundException.getMessage());

			Response response = notFoundException.getResponse();

			Problem problem = (Problem)response.getEntity();

			Assert.assertEquals(Response.Status.NOT_FOUND, problem.getStatus());
			Assert.assertEquals(expectedTitle, problem.getTitle());
			Assert.assertNull(problem.getType());
		}
	}

	private void _mockFaroChannel(String channelId, int permissionType) {
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

		Mockito.when(
			_faroChannelLocalService.fetchFaroChannel(channelId, _GROUP_ID)
		).thenReturn(
			faroChannel
		);
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

	private void _mockIndividualSegment(
		String channelId, String individualSegmentId) {

		IndividualSegment individualSegment = new IndividualSegment();

		individualSegment.setChannelId(channelId);
		individualSegment.setId(individualSegmentId);

		Mockito.when(
			_contactsEngineClient.getIndividualSegment(
				_faroProject, individualSegmentId, false)
		).thenReturn(
			individualSegment
		);
	}

	private void _setPermissionChecker(long userId) {
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

		PermissionThreadLocal.setPermissionChecker(permissionChecker);
	}

	private static final long _ADMINISTRATOR_USER_ID = 1L;

	private static final String _ALL_USERS_CHANNEL_ID = "100";

	private static final String _ALL_USERS_INDIVIDUAL_SEGMENT_ID = "1000";

	private static final String _BAD_REQUEST_INDIVIDUAL_SEGMENT_ID = "2000";

	private static final long _CHANNEL_GROUP_ID = 200L;

	private static final long _GROUP_ID = 300L;

	private static final long _MEMBER_USER_ID = 2L;

	private static final String _NO_CHANNEL_INDIVIDUAL_SEGMENT_ID = "3000";

	private static final String _NOT_FOUND_INDIVIDUAL_SEGMENT_ID = "4000";

	private static final long _OMNIADMIN_USER_ID = 3L;

	private static final String _SELECT_USERS_CHANNEL_ID = "500";

	private static final String _SELECT_USERS_INDIVIDUAL_SEGMENT_ID = "5000";

	private static final String _SERVER_ERROR_INDIVIDUAL_SEGMENT_ID = "6000";

	private static final String _UNKNOWN_CHANNEL_INDIVIDUAL_SEGMENT_ID = "7000";

	private final ContactsEngineClient _contactsEngineClient = Mockito.mock(
		ContactsEngineClient.class);
	private final FaroChannelLocalService _faroChannelLocalService =
		Mockito.mock(FaroChannelLocalService.class);
	private final FaroProject _faroProject = Mockito.mock(FaroProject.class);
	private final FaroUserLocalService _faroUserLocalService = Mockito.mock(
		FaroUserLocalService.class);
	private final IndividualSegmentHelper _individualSegmentHelper =
		new IndividualSegmentHelper();
	private PermissionChecker _permissionChecker;
	private final RoleLocalService _roleLocalService = Mockito.mock(
		RoleLocalService.class);
	private final UserGroupRoleLocalService _userGroupRoleLocalService =
		Mockito.mock(UserGroupRoleLocalService.class);

}