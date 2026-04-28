/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.engine.client.web.client;

import com.liferay.osb.faro.engine.client.exception.DuplicateEntryException;
import com.liferay.osb.faro.engine.client.exception.FaroEngineClientException;
import com.liferay.osb.faro.engine.client.exception.InvalidFilterException;
import com.liferay.osb.faro.engine.client.exception.NoSuchEntryException;
import com.liferay.portal.kernel.util.FileUtil;

import java.io.IOException;

import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.DefaultResponseErrorHandler;

/**
 * @author Shinn Lok
 */
public class ResponseErrorHandler extends DefaultResponseErrorHandler {

	@Override
	public void handleError(ClientHttpResponse clientHttpResponse)
		throws IOException {

		int statusCode = clientHttpResponse.getStatusCode().value();

		if (statusCode < 400) {
			super.handleError(clientHttpResponse);

			return;
		}

		String response = new String(
			FileUtil.getBytes(clientHttpResponse.getBody()));

		if (statusCode == 409) {
			throw new DuplicateEntryException(response);
		}

		if (statusCode == 404) {
			throw new NoSuchEntryException(response);
		}

		if (statusCode == 422) {
			throw new InvalidFilterException(response);
		}

		throw new FaroEngineClientException(response);
	}

}