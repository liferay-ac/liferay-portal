/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.segments.internal.search.spi.model.index.contributor;

import com.liferay.petra.function.transform.TransformUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.search.Document;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.kernel.util.ArrayUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.search.spi.model.index.contributor.ModelDocumentContributor;
import com.liferay.segments.model.SegmentsEntryRel;
import com.liferay.segments.service.SegmentsEntryRelLocalService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Eduardo García
 */
@Component(
	property = "indexer.class.name=com.liferay.portal.kernel.model.User",
	service = ModelDocumentContributor.class
)
public class UserModelDocumentContributor
	implements ModelDocumentContributor<User> {

	@Override
	public void contribute(Document document, User user) {
		try {
			List<Group> inheritedGroups = user.getInheritedGroups();

			if (!inheritedGroups.isEmpty()) {
				long[] roleIds = _getUserUserGroupRoleIds(inheritedGroups);

				if (ArrayUtil.isNotEmpty(roleIds)) {
					document.addKeyword("inheritedUserGroupRoleIds", roleIds);
				}
			}

			long[] segmentsEntryIds = _getSegmentsEntryIds(user);

			if (ArrayUtil.isNotEmpty(segmentsEntryIds)) {
				document.addKeyword("segmentsEntryIds", segmentsEntryIds);
			}
		}
		catch (Exception exception) {
			if (_log.isWarnEnabled()) {
				_log.warn(
					"Unable to index user " + user.getUserId(), exception);
			}
		}
	}

	private long[] _getSegmentsEntryIds(User user) throws Exception {
		return TransformUtil.transformToLongArray(
			_segmentsEntryRelLocalService.getSegmentsEntryRels(
				_portal.getClassNameId(User.class), user.getUserId()),
			SegmentsEntryRel::getSegmentsEntryId);
	}

	private long[] _getUserUserGroupRoleIds(List<Group> groups) {
		Set<Role> roles = new HashSet<>();

		for (Group group : groups) {
			if (!_roleLocalService.hasGroupRoles(group.getGroupId())) {
				continue;
			}

			roles.addAll(_roleLocalService.getGroupRoles(group.getGroupId()));
		}

		return TransformUtil.transformToLongArray(roles, Role::getRoleId);
	}

	private static final Log _log = LogFactoryUtil.getLog(
		UserModelDocumentContributor.class);

	@Reference
	private Portal _portal;

	@Reference
	private RoleLocalService _roleLocalService;

	@Reference
	private SegmentsEntryRelLocalService _segmentsEntryRelLocalService;

}