/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.engine.client.model;

import java.util.List;

/**
 * @author Drew Hoffer
 */
public class CampaignAcquisitionProperty {

	public String getName() {
		return _name;
	}

	public List<String> getValues() {
		return _values;
	}

	public boolean isCustom() {
		return _custom;
	}

	public void setCustom(boolean custom) {
		_custom = custom;
	}

	public void setName(String name) {
		_name = name;
	}

	public void setValues(List<String> values) {
		_values = values;
	}

	private boolean _custom;
	private String _name;
	private List<String> _values;

}