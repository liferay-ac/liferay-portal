/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.graphql.client;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.liferay.osb.faro.engine.client.ContactsEngineClient;
import com.liferay.osb.faro.engine.client.model.GraphQLRequest;
import com.liferay.osb.faro.model.FaroProject;
import com.liferay.osb.faro.rest.internal.graphql.model.GraphQLError;

import java.io.InputStream;

import java.nio.charset.StandardCharsets;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * Wraps {@link ContactsEngineClient#post} with classpath query loading,
 * Jackson typed deserialization of the GraphQL <code>data</code> envelope,
 * and centralized handling of the <code>errors</code> envelope.
 *
 * @author Leslie Wong
 */
@Component(service = FaroGraphQLClient.class)
public class FaroGraphQLClient {

	public <T> T execute(
			FaroProject faroProject, String operationName,
			Map<String, Object> variables, Class<T> dataType)
		throws Exception {

		GraphQLRequest graphQLRequest = new GraphQLRequest();

		graphQLRequest.setOperationName(operationName);
		graphQLRequest.setQuery(_loadQuery(operationName));
		graphQLRequest.setVariables(
			(variables == null) ? Collections.emptyMap() : variables);

		@SuppressWarnings("unchecked")
		Map<String, Object> envelope = _contactsEngineClient.post(
			faroProject, Collections.<String, String>emptyMap(), _GRAPHQL_PATH,
			Collections.<String, List<String>>emptyMap(), graphQLRequest,
			Map.class);

		@SuppressWarnings("unchecked")
		List<Map<String, Object>> rawErrors =
			(List<Map<String, Object>>)envelope.get("errors");

		if ((rawErrors != null) && !rawErrors.isEmpty()) {
			List<GraphQLError> graphQLErrors = _objectMapper.convertValue(
				rawErrors,
				new TypeReference<List<GraphQLError>>() {
				});

			throw new GraphQLException(operationName, graphQLErrors);
		}

		return _objectMapper.convertValue(envelope.get("data"), dataType);
	}

	private String _loadQuery(String operationName) throws Exception {
		String cached = _queryCache.get(operationName);

		if (cached != null) {
			return cached;
		}

		String resourcePath = "/graphql/" + operationName + ".graphql";

		try (InputStream inputStream =
				FaroGraphQLClient.class.getResourceAsStream(resourcePath)) {

			if (inputStream == null) {
				throw new Exception(
					"Missing GraphQL query resource: " + resourcePath);
			}

			byte[] bytes = inputStream.readAllBytes();

			String query = new String(bytes, StandardCharsets.UTF_8);

			if (query.isEmpty()) {
				throw new Exception(
					"Empty GraphQL query resource: " + resourcePath);
			}

			_queryCache.putIfAbsent(operationName, query);

			return query;
		}
	}

	private static final String _GRAPHQL_PATH = "/graphql";

	private static final ObjectMapper _objectMapper = new ObjectMapper();
	private static final ConcurrentMap<String, String> _queryCache =
		new ConcurrentHashMap<>();

	@Reference
	private ContactsEngineClient _contactsEngineClient;

}