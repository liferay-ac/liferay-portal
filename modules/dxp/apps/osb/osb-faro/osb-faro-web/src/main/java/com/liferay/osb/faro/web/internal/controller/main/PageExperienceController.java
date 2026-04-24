/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.controller.main;

import com.liferay.osb.faro.engine.client.model.PageExperience;
import com.liferay.osb.faro.web.internal.controller.BaseFaroController;
import com.liferay.portal.kernel.model.RoleConstants;

import javax.annotation.security.RolesAllowed;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import java.util.List;

import org.osgi.service.component.annotations.Component;

/**
 * @author Thiago Buarque
 */
@Component(service = PageExperienceController.class)
@Path("/{groupId}/page-experiences")
@Produces(MediaType.APPLICATION_JSON)
public class PageExperienceController extends BaseFaroController {

	@GET
	@RolesAllowed(RoleConstants.SITE_MEMBER)
	public List<PageExperience> getPageExperiences(
			@PathParam("groupId") long groupId,
			@QueryParam("canonicalUrl") String canonicalUrl,
			@QueryParam("channelId") String channelId,
			@QueryParam("pageTitle") String pageTitle)
		throws Exception {

		return contactsEngineClient.getPageExperiences(
			faroProjectLocalService.getFaroProjectByGroupId(groupId),
			canonicalUrl, channelId, pageTitle);
	}

}