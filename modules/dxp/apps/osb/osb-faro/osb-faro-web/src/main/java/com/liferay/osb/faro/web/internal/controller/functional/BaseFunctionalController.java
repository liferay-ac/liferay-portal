/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.controller.functional;

import com.liferay.osb.faro.model.FaroProject;
import com.liferay.osb.faro.web.internal.controller.BaseFaroController;
import com.liferay.osb.faro.web.internal.util.JSONUtil;
import com.liferay.portal.kernel.model.RoleConstants;
import com.liferay.portal.kernel.util.HashMapBuilder;

import java.net.URI;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.annotation.security.RolesAllowed;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
import javax.ws.rs.core.UriInfo;

/**
 * @author Marcos Martins
 */
public abstract class BaseFunctionalController extends BaseFaroController {

	@Consumes(MediaType.APPLICATION_JSON)
	@POST
	@RolesAllowed(RoleConstants.SITE_ADMINISTRATOR)
	public void post(
			@PathParam("groupId") long groupId, String requestBody,
			@Context UriInfo uriInfo)
		throws Exception {

		FaroProject faroProject =
			faroProjectLocalService.fetchFaroProjectByGroupId(groupId);

		contactsEngineClient.post(
			faroProject, _createHeaders(uriInfo.getBaseUri()),
			"/functional/" + getPath(), Collections.emptyMap(),
			JSONUtil.readValue(requestBody, List.class), null);
	}

	protected abstract String getPath();

	private Map<String, String> _createHeaders(URI baseURI) {
		return HashMapBuilder.put(
			"X-Liferay-Origin-Forwarded-Host", baseURI.getHost()
		).put(
			"X-Liferay-Origin-Forwarded-Port", String.valueOf(baseURI.getPort())
		).put(
			"X-Liferay-Origin-Forwarded-Proto", baseURI.getScheme()
		).build();
	}

}