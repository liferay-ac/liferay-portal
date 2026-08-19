/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.exception;

import com.liferay.osb.faro.engine.client.model.ErrorResponse;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Collections;
import java.util.Map;

/**
 * @author Matthew Kong
 */
public class FaroException extends WebApplicationException {

	public FaroException() {
	}

	public FaroException(String message) {
		this(message, Response.Status.BAD_REQUEST);
	}

	public FaroException(String message, Response.StatusType statusType) {
		this(message, statusType, Collections.emptyMap());
	}

	public FaroException(
		String message, Response.StatusType statusType,
		Map<String, Object> headers) {

		super(getResponse(message, statusType, headers));
	}

	protected static Response getResponse(
		String message, Response.StatusType statusType,
		Map<String, Object> headers) {

		Response.ResponseBuilder responseBuilder = Response.status(statusType);

		for (Map.Entry<String, Object> entry : headers.entrySet()) {
			responseBuilder.header(entry.getKey(), entry.getValue());
		}

		ErrorResponse errorResponse = new ErrorResponse();

		errorResponse.setError(statusType.getReasonPhrase());
		errorResponse.setStatus(statusType.getStatusCode());
		errorResponse.setMessage(message);

		responseBuilder.entity(errorResponse);

		responseBuilder.type(MediaType.APPLICATION_JSON_TYPE);

		return responseBuilder.build();
	}

}