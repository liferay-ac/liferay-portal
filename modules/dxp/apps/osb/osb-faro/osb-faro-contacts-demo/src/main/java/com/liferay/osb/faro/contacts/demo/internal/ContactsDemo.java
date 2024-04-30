/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.contacts.demo.internal;

import com.liferay.osb.faro.service.FaroProjectLocalService;
import com.liferay.osb.faro.util.FaroPropsValues;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Portlet;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Shinn Lok
 */
@Component(service = {})
public class ContactsDemo {

	@Activate
	protected void activate() {
		if (Validator.isBlank(FaroPropsValues.FARO_DEMO_CREATOR_METHOD) ||
			StringUtil.equals(
				FaroPropsValues.FARO_DEMO_CREATOR_METHOD, "none")) {

			if (_log.isDebugEnabled()) {
				_log.debug("Skip demo data creation");
			}

			return;
		}

		try {
			if (StringUtil.equals(
					FaroPropsValues.FARO_DEMO_CREATOR_METHOD, "nanite")) {

				_naniteDemoCreatorService.createDemo();
			}
			else {
				_snapshotDemoCreatorService.createDemo();
			}

			if (_log.isInfoEnabled()) {
				_log.info("Completed demo data creation");
			}
		}
		catch (Exception exception) {
			_log.info("Unable to create demo data", exception);
		}
	}

	private static final Log _log = LogFactoryUtil.getLog(ContactsDemo.class);

	@Reference
	private FaroProjectLocalService _faroProjectLocalService;

	@Reference
	private NaniteDemoCreatorService _naniteDemoCreatorService;

	@Reference(target = "(javax.portlet.name=faro_portlet)")
	private Portlet _portlet;

	@Reference
	private SnapshotDemoCreatorService _snapshotDemoCreatorService;

}