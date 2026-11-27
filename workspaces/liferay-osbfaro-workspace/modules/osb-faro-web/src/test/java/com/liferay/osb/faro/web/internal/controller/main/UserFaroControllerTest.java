/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.controller.main;

import com.liferay.osb.faro.model.FaroUser;
import com.liferay.osb.faro.service.FaroUserLocalService;
import com.liferay.osb.faro.web.internal.exception.FaroException;
import com.liferay.osb.faro.web.internal.param.FaroParam;
import com.liferay.petra.function.UnsafeRunnable;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.RoleConstants;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.kernel.service.RoleLocalServiceUtil;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.test.util.RandomTestUtil;

import jakarta.ws.rs.core.Response;

import java.util.Arrays;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import org.mockito.MockedStatic;
import org.mockito.Mockito;

import org.springframework.test.util.ReflectionTestUtils;

/**
 * @author Tiago Campêlo
 */
public class UserFaroControllerTest {

	@Before
	public void setUp() {
		ReflectionTestUtils.setField(
			_userFaroController, "_faroUserLocalService",
			_faroUserLocalService);
		ReflectionTestUtils.setField(
			_userFaroController, "_groupLocalService", _groupLocalService);
		ReflectionTestUtils.setField(
			_userFaroController, "_roleLocalService", _roleLocalService);

		Mockito.when(
			_permissionChecker.getUserId()
		).thenReturn(
			_USER_ID
		);

		PermissionThreadLocal.setPermissionChecker(_permissionChecker);
	}

	@After
	public void tearDown() {
		PermissionThreadLocal.setPermissionChecker(null);
	}

	@Test
	public void testAcceptWithFaroUserFromAnotherGroup() throws Exception {
		long id = _setUpFaroUser(_GROUP_ID_OTHER, RandomTestUtil.randomLong());

		_assertFails(() -> _userFaroController.accept(_GROUP_ID, id));

		Mockito.verify(
			_groupLocalService, Mockito.never()
		).addUserGroup(
			Mockito.anyLong(), Mockito.anyLong()
		);
	}

	@Test
	public void testDelete() throws Exception {
		long id = _setUpFaroUser(_GROUP_ID, RandomTestUtil.randomLong());

		try (MockedStatic<RoleLocalServiceUtil>
				roleLocalServiceUtilMockedStatic = Mockito.mockStatic(
					RoleLocalServiceUtil.class);
			MockedStatic<UserLocalServiceUtil>
				userLocalServiceUtilMockedStatic = Mockito.mockStatic(
					UserLocalServiceUtil.class)) {

			Mockito.when(
				_faroUserLocalService.deleteFaroUser(id)
			).thenReturn(
				Mockito.mock(FaroUser.class)
			);

			_userFaroController.delete(_GROUP_ID, id);
		}

		Mockito.verify(
			_faroUserLocalService
		).deleteFaroUser(
			id
		);
	}

	@Test
	public void testDeleteWithCurrentFaroUser() throws Exception {
		long currentFaroUserId = _setUpFaroUser(_GROUP_ID, _USER_ID);

		_assertFails(
			() -> _userFaroController.delete(_GROUP_ID, currentFaroUserId));

		long id = _setUpFaroUser(_GROUP_ID, RandomTestUtil.randomLong());

		_assertFails(
			() -> _userFaroController.delete(
				_GROUP_ID,
				new FaroParam<>(Arrays.asList(id, currentFaroUserId))));
	}

	@Test
	public void testDeleteWithFaroUserFromAnotherGroup() throws Exception {
		long id = _setUpFaroUser(_GROUP_ID, RandomTestUtil.randomLong());
		long otherGroupFaroUserId = _setUpFaroUser(
			_GROUP_ID_OTHER, RandomTestUtil.randomLong());

		_assertFails(
			() -> _userFaroController.delete(
				_GROUP_ID,
				new FaroParam<>(Arrays.asList(id, otherGroupFaroUserId))));
		_assertFails(
			() -> _userFaroController.delete(_GROUP_ID, otherGroupFaroUserId));
	}

	@Test
	public void testGetFaroUserDisplayWithFaroUserFromAnotherGroup()
		throws Exception {

		long id = _setUpFaroUser(_GROUP_ID_OTHER, RandomTestUtil.randomLong());

		_assertFails(
			() -> _userFaroController.getFaroUserDisplay(_GROUP_ID, id));
	}

	@Test
	public void testUpdateWithFaroUserFromAnotherGroup() throws Exception {
		long id = _setUpFaroUser(_GROUP_ID, RandomTestUtil.randomLong());
		long otherGroupFaroUserId = _setUpFaroUser(
			_GROUP_ID_OTHER, RandomTestUtil.randomLong());

		_assertFails(
			() -> _userFaroController.update(
				_GROUP_ID,
				new FaroParam<>(Arrays.asList(id, otherGroupFaroUserId)),
				RoleConstants.SITE_MEMBER));
		_assertFails(
			() -> _userFaroController.update(
				_GROUP_ID, otherGroupFaroUserId, RoleConstants.SITE_MEMBER,
				RandomTestUtil.randomString() + "@liferay.com"));
	}

	private void _assertFails(UnsafeRunnable<Exception> unsafeRunnable)
		throws Exception {

		try {
			unsafeRunnable.run();

			Assert.fail();
		}
		catch (FaroException faroException) {
			Response response = faroException.getResponse();

			Assert.assertEquals(
				Response.Status.BAD_REQUEST.getStatusCode(),
				response.getStatus());
		}

		Mockito.verify(
			_faroUserLocalService, Mockito.never()
		).deleteFaroUser(
			Mockito.anyLong()
		);

		Mockito.verify(
			_faroUserLocalService, Mockito.never()
		).updateFaroUser(
			Mockito.any()
		);
	}

	private long _setUpFaroUser(long groupId, long liveUserId)
		throws Exception {

		long id = RandomTestUtil.randomLong();

		FaroUser faroUser = Mockito.mock(FaroUser.class);

		Mockito.when(
			faroUser.getGroupId()
		).thenReturn(
			groupId
		);

		Mockito.when(
			faroUser.getLiveUserId()
		).thenReturn(
			liveUserId
		);

		Mockito.when(
			faroUser.getRoleId()
		).thenReturn(
			_ROLE_ID
		);

		Mockito.when(
			_faroUserLocalService.fetchFaroUser(id)
		).thenReturn(
			faroUser
		);

		Mockito.when(
			_faroUserLocalService.getFaroUser(id)
		).thenReturn(
			faroUser
		);

		Role role = Mockito.mock(Role.class);

		Mockito.when(
			role.getName()
		).thenReturn(
			RoleConstants.SITE_MEMBER
		);

		Mockito.when(
			_roleLocalService.getRole(_ROLE_ID)
		).thenReturn(
			role
		);

		return id;
	}

	private static final long _GROUP_ID = RandomTestUtil.randomLong();

	private static final long _GROUP_ID_OTHER = RandomTestUtil.randomLong();

	private static final long _ROLE_ID = RandomTestUtil.randomLong();

	private static final long _USER_ID = RandomTestUtil.randomLong();

	private final FaroUserLocalService _faroUserLocalService = Mockito.mock(
		FaroUserLocalService.class);
	private final GroupLocalService _groupLocalService = Mockito.mock(
		GroupLocalService.class);
	private final PermissionChecker _permissionChecker = Mockito.mock(
		PermissionChecker.class);
	private final RoleLocalService _roleLocalService = Mockito.mock(
		RoleLocalService.class);
	private final UserFaroController _userFaroController =
		new UserFaroController();

}