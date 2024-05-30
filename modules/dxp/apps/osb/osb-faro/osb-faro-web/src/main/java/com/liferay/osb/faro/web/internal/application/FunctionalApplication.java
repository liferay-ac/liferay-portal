/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.application;

import com.liferay.osb.faro.web.internal.constants.FaroConstants;
import com.liferay.osb.faro.web.internal.controller.functional.EventFunctionalController;
import com.liferay.osb.faro.web.internal.controller.functional.IdentityFunctionalController;
import com.liferay.osb.faro.web.internal.controller.functional.IndividualFunctionalController;
import com.liferay.osb.faro.web.internal.controller.functional.PageDailyFunctionalController;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Marcos Martins
 */
@ApplicationPath("/" + FaroConstants.APPLICATION_FUNCTIONAL)
@Component(property = "jaxrs.application=true", service = Application.class)
public class FunctionalApplication extends BaseApplication {

	@Override
	public Set<Object> getControllers() {
		Set<Object> controllers = new HashSet<>();

		controllers.add(_eventFunctionalController);
		controllers.add(_identityFunctionalController);
		controllers.add(_individualFunctionalController);
		controllers.add(_pageDailyFunctionalController);

		return controllers;
	}

	@Reference
	private EventFunctionalController _eventFunctionalController;

	@Reference
	private IdentityFunctionalController _identityFunctionalController;

	@Reference
	private IndividualFunctionalController _individualFunctionalController;

	@Reference
	private PageDailyFunctionalController _pageDailyFunctionalController;

}