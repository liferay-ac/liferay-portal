/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.analytics.reports.rest.dto.v1_0;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.liferay.petra.function.UnsafeSupplier;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLField;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLName;
import com.liferay.portal.vulcan.util.ObjectMapperUtil;

import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serializable;

import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Supplier;

import javax.annotation.Generated;

import javax.validation.Valid;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author Marcos Martins
 * @generated
 */
@Generated("")
@GraphQLName("PageHistogram")
@JsonFilter("Liferay.Vulcan")
@XmlRootElement(name = "PageHistogram")
public class PageHistogram implements Serializable {

	public static PageHistogram toDTO(String json) {
		return ObjectMapperUtil.readValue(PageHistogram.class, json);
	}

	public static PageHistogram unsafeToDTO(String json) {
		return ObjectMapperUtil.unsafeReadValue(PageHistogram.class, json);
	}

	@Schema
	@Valid
	public AssetHistogramMetric[] getAssetHistogramMetrics() {
		if (_assetHistogramMetricsSupplier != null) {
			assetHistogramMetrics = _assetHistogramMetricsSupplier.get();

			_assetHistogramMetricsSupplier = null;
		}

		return assetHistogramMetrics;
	}

	public void setAssetHistogramMetrics(
		AssetHistogramMetric[] assetHistogramMetrics) {

		this.assetHistogramMetrics = assetHistogramMetrics;

		_assetHistogramMetricsSupplier = null;
	}

	@JsonIgnore
	public void setAssetHistogramMetrics(
		UnsafeSupplier<AssetHistogramMetric[], Exception>
			assetHistogramMetricsUnsafeSupplier) {

		_assetHistogramMetricsSupplier = () -> {
			try {
				return assetHistogramMetricsUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	protected AssetHistogramMetric[] assetHistogramMetrics;

	@JsonIgnore
	private Supplier<AssetHistogramMetric[]> _assetHistogramMetricsSupplier;

	@Schema
	public String getPageTitle() {
		if (_pageTitleSupplier != null) {
			pageTitle = _pageTitleSupplier.get();

			_pageTitleSupplier = null;
		}

		return pageTitle;
	}

	public void setPageTitle(String pageTitle) {
		this.pageTitle = pageTitle;

		_pageTitleSupplier = null;
	}

	@JsonIgnore
	public void setPageTitle(
		UnsafeSupplier<String, Exception> pageTitleUnsafeSupplier) {

		_pageTitleSupplier = () -> {
			try {
				return pageTitleUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	protected String pageTitle;

	@JsonIgnore
	private Supplier<String> _pageTitleSupplier;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof PageHistogram)) {
			return false;
		}

		PageHistogram pageHistogram = (PageHistogram)object;

		return Objects.equals(toString(), pageHistogram.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		StringBundler sb = new StringBundler();

		sb.append("{");

		AssetHistogramMetric[] assetHistogramMetrics =
			getAssetHistogramMetrics();

		if (assetHistogramMetrics != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"assetHistogramMetrics\": ");

			sb.append("[");

			for (int i = 0; i < assetHistogramMetrics.length; i++) {
				sb.append(String.valueOf(assetHistogramMetrics[i]));

				if ((i + 1) < assetHistogramMetrics.length) {
					sb.append(", ");
				}
			}

			sb.append("]");
		}

		String pageTitle = getPageTitle();

		if (pageTitle != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"pageTitle\": ");

			sb.append("\"");

			sb.append(_escape(pageTitle));

			sb.append("\"");
		}

		sb.append("}");

		return sb.toString();
	}

	@Schema(
		accessMode = Schema.AccessMode.READ_ONLY,
		defaultValue = "com.liferay.analytics.reports.rest.dto.v1_0.PageHistogram",
		name = "x-class-name"
	)
	public String xClassName;

	private static String _escape(Object object) {
		return StringUtil.replace(
			String.valueOf(object), _JSON_ESCAPE_STRINGS[0],
			_JSON_ESCAPE_STRINGS[1]);
	}

	private static boolean _isArray(Object value) {
		if (value == null) {
			return false;
		}

		Class<?> clazz = value.getClass();

		return clazz.isArray();
	}

	private static String _toJSON(Map<String, ?> map) {
		StringBuilder sb = new StringBuilder("{");

		@SuppressWarnings("unchecked")
		Set set = map.entrySet();

		@SuppressWarnings("unchecked")
		Iterator<Map.Entry<String, ?>> iterator = set.iterator();

		while (iterator.hasNext()) {
			Map.Entry<String, ?> entry = iterator.next();

			sb.append("\"");
			sb.append(_escape(entry.getKey()));
			sb.append("\": ");

			Object value = entry.getValue();

			if (_isArray(value)) {
				sb.append("[");

				Object[] valueArray = (Object[])value;

				for (int i = 0; i < valueArray.length; i++) {
					if (valueArray[i] instanceof Map) {
						sb.append(_toJSON((Map<String, ?>)valueArray[i]));
					}
					else if (valueArray[i] instanceof String) {
						sb.append("\"");
						sb.append(valueArray[i]);
						sb.append("\"");
					}
					else {
						sb.append(valueArray[i]);
					}

					if ((i + 1) < valueArray.length) {
						sb.append(", ");
					}
				}

				sb.append("]");
			}
			else if (value instanceof Map) {
				sb.append(_toJSON((Map<String, ?>)value));
			}
			else if (value instanceof String) {
				sb.append("\"");
				sb.append(_escape(value));
				sb.append("\"");
			}
			else {
				sb.append(value);
			}

			if (iterator.hasNext()) {
				sb.append(", ");
			}
		}

		sb.append("}");

		return sb.toString();
	}

	private static final String[][] _JSON_ESCAPE_STRINGS = {
		{"\\", "\"", "\b", "\f", "\n", "\r", "\t"},
		{"\\\\", "\\\"", "\\b", "\\f", "\\n", "\\r", "\\t"}
	};

	private Map<String, Serializable> _extendedProperties;

}