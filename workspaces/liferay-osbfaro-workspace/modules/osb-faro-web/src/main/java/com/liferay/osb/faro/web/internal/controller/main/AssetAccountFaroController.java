/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.controller.main;

import com.liferay.osb.faro.engine.client.model.AssetAccount;
import com.liferay.osb.faro.engine.client.model.Results;
import com.liferay.osb.faro.web.internal.controller.BaseFaroController;
import com.liferay.portal.kernel.model.RoleConstants;

import jakarta.annotation.security.RolesAllowed;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import org.osgi.service.component.annotations.Component;

/**
 * @author Marcos Martins
 */
@Component(service = AssetAccountFaroController.class)
@Path("/{groupId}/asset-accounts")
@Produces(MediaType.APPLICATION_JSON)
public class AssetAccountFaroController extends BaseFaroController {

	@GET
	@RolesAllowed(RoleConstants.SITE_MEMBER)
	public Results<AssetAccount> getAssetAccounts(
			@PathParam("groupId") long groupId,
			@QueryParam("assetId") String assetId,
			@QueryParam("assetTitle") String assetTitle,
			@QueryParam("assetType") String assetType,
			@QueryParam("channelId") Long channelId,
			@QueryParam("keywords") String keywords,
			@QueryParam("rangeEnd") String rangeEnd,
			@QueryParam("rangeKey") Integer rangeKey,
			@QueryParam("rangeStart") String rangeStart,
			@QueryParam("page") int page, @QueryParam("pageSize") int pageSize)
		throws Exception {

		return contactsEngineClient.getAssetAccounts(
			faroProjectLocalService.getFaroProjectByGroupId(groupId), assetId,
			assetTitle, assetType, channelId, keywords, rangeEnd, rangeKey,
			rangeStart, page, pageSize);
	}

}