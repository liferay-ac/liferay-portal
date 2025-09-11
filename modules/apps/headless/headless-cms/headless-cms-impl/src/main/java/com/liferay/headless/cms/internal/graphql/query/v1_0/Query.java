/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.headless.cms.internal.graphql.query.v1_0;

import com.liferay.headless.cms.dto.v1_0.BulkActionPreviewItem;
import com.liferay.headless.cms.resource.v1_0.BulkActionPreviewItemResource;
import com.liferay.petra.function.UnsafeConsumer;
import com.liferay.petra.function.UnsafeFunction;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.vulcan.accept.language.AcceptLanguage;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLField;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLName;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;

import jakarta.annotation.Generated;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import jakarta.ws.rs.core.UriInfo;

import java.util.Map;
import java.util.function.BiFunction;

import org.osgi.service.component.ComponentServiceObjects;

/**
 * @author Crescenzo Rega
 * @generated
 */
@Generated("")
public class Query {

	public static void setBulkActionPreviewItemResourceComponentServiceObjects(
		ComponentServiceObjects<BulkActionPreviewItemResource>
			bulkActionPreviewItemResourceComponentServiceObjects) {

		_bulkActionPreviewItemResourceComponentServiceObjects =
			bulkActionPreviewItemResourceComponentServiceObjects;
	}

	/**
	 * Invoke this method with the command line:
	 *
	 * curl -H 'Content-Type: text/plain; charset=utf-8' -X 'POST' 'http://localhost:8080/o/graphql' -d $'{"query": "query {bulkActionDeletePreview(assetIds: ___, filter: ___, page: ___, pageSize: ___, search: ___, selectAll: ___, sorts: ___){items {__}, page, pageSize, totalCount}}"}' -u 'test@liferay.com:test'
	 */
	@GraphQLField(
		description = "Creates a preview for each item based on the bulk action type"
	)
	public BulkActionPreviewItemPage bulkActionDeletePreview(
			@GraphQLName("assetIds") String assetIds,
			@GraphQLName("search") String search,
			@GraphQLName("selectAll") Boolean selectAll,
			@GraphQLName("filter") String filterString,
			@GraphQLName("pageSize") int pageSize,
			@GraphQLName("page") int page,
			@GraphQLName("sort") String sortsString)
		throws Exception {

		return _applyComponentServiceObjects(
			_bulkActionPreviewItemResourceComponentServiceObjects,
			this::_populateResourceContext,
			bulkActionPreviewItemResource -> new BulkActionPreviewItemPage(
				bulkActionPreviewItemResource.getBulkActionDeletePreviewPage(
					assetIds, search, selectAll,
					_filterBiFunction.apply(
						bulkActionPreviewItemResource, filterString),
					Pagination.of(page, pageSize),
					_sortsBiFunction.apply(
						bulkActionPreviewItemResource, sortsString))));
	}

	@GraphQLName("BulkActionPreviewItemPage")
	public class BulkActionPreviewItemPage {

		public BulkActionPreviewItemPage(Page bulkActionPreviewItemPage) {
			actions = bulkActionPreviewItemPage.getActions();

			items = bulkActionPreviewItemPage.getItems();
			lastPage = bulkActionPreviewItemPage.getLastPage();
			page = bulkActionPreviewItemPage.getPage();
			pageSize = bulkActionPreviewItemPage.getPageSize();
			totalCount = bulkActionPreviewItemPage.getTotalCount();
		}

		@GraphQLField
		protected Map<String, Map<String, String>> actions;

		@GraphQLField
		protected java.util.Collection<BulkActionPreviewItem> items;

		@GraphQLField
		protected long lastPage;

		@GraphQLField
		protected long page;

		@GraphQLField
		protected long pageSize;

		@GraphQLField
		protected long totalCount;

	}

	private <T, R, E1 extends Throwable, E2 extends Throwable> R
			_applyComponentServiceObjects(
				ComponentServiceObjects<T> componentServiceObjects,
				UnsafeConsumer<T, E1> unsafeConsumer,
				UnsafeFunction<T, R, E2> unsafeFunction)
		throws E1, E2 {

		T resource = componentServiceObjects.getService();

		try {
			unsafeConsumer.accept(resource);

			return unsafeFunction.apply(resource);
		}
		finally {
			componentServiceObjects.ungetService(resource);
		}
	}

	private void _populateResourceContext(
			BulkActionPreviewItemResource bulkActionPreviewItemResource)
		throws Exception {

		bulkActionPreviewItemResource.setContextAcceptLanguage(_acceptLanguage);
		bulkActionPreviewItemResource.setContextCompany(_company);
		bulkActionPreviewItemResource.setContextHttpServletRequest(
			_httpServletRequest);
		bulkActionPreviewItemResource.setContextHttpServletResponse(
			_httpServletResponse);
		bulkActionPreviewItemResource.setContextUriInfo(_uriInfo);
		bulkActionPreviewItemResource.setContextUser(_user);
		bulkActionPreviewItemResource.setGroupLocalService(_groupLocalService);
		bulkActionPreviewItemResource.setRoleLocalService(_roleLocalService);
	}

	private static ComponentServiceObjects<BulkActionPreviewItemResource>
		_bulkActionPreviewItemResourceComponentServiceObjects;

	private AcceptLanguage _acceptLanguage;
	private com.liferay.portal.kernel.model.Company _company;
	private BiFunction
		<Object, String, com.liferay.portal.kernel.search.filter.Filter>
			_filterBiFunction;
	private GroupLocalService _groupLocalService;
	private HttpServletRequest _httpServletRequest;
	private HttpServletResponse _httpServletResponse;
	private RoleLocalService _roleLocalService;
	private BiFunction<Object, String, com.liferay.portal.kernel.search.Sort[]>
		_sortsBiFunction;
	private UriInfo _uriInfo;
	private com.liferay.portal.kernel.model.User _user;

}