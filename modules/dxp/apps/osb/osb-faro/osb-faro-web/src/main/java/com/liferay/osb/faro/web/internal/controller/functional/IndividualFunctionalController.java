/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.controller.functional;

import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.osgi.service.component.annotations.Component;

/**
 * @author Marcos Martins
 */
@Component(service = IndividualFunctionalController.class)
@Path("/{groupId}/individuals")
@Produces(MediaType.APPLICATION_JSON)
public class IndividualFunctionalController extends BaseFunctionalController {

	@Override
	protected String getPath() {
		return "individuals";
	}

}