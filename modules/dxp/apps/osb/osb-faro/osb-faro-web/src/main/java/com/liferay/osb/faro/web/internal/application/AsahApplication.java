/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.application;

import com.liferay.osb.faro.web.internal.constants.FaroConstants;

import java.util.Collections;
import java.util.Set;

import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;

/**
 * @author Geyson Silva
 */
@Component(
	property = {
		"jaxrs.application=true",
		"osgi.jaxrs.application.base=/" + FaroConstants.APPLICATION_ASAH,
		"osgi.jaxrs.name=Liferay.Osb.Faro.Web.Asah"
	},
	service = Application.class
)
public class AsahApplication extends BaseApplication {

	@Override
	public Set<Object> getControllers() {
		return Collections.emptySet();
	}

}