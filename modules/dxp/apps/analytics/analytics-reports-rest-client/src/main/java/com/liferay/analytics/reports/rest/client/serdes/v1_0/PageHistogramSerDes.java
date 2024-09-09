/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.analytics.reports.rest.client.serdes.v1_0;

import com.liferay.analytics.reports.rest.client.dto.v1_0.AssetHistogramMetric;
import com.liferay.analytics.reports.rest.client.dto.v1_0.PageHistogram;
import com.liferay.analytics.reports.rest.client.json.BaseJSONParser;

import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeMap;

import javax.annotation.Generated;

/**
 * @author Marcos Martins
 * @generated
 */
@Generated("")
public class PageHistogramSerDes {

	public static PageHistogram toDTO(String json) {
		PageHistogramJSONParser pageHistogramJSONParser =
			new PageHistogramJSONParser();

		return pageHistogramJSONParser.parseToDTO(json);
	}

	public static PageHistogram[] toDTOs(String json) {
		PageHistogramJSONParser pageHistogramJSONParser =
			new PageHistogramJSONParser();

		return pageHistogramJSONParser.parseToDTOs(json);
	}

	public static String toJSON(PageHistogram pageHistogram) {
		if (pageHistogram == null) {
			return "null";
		}

		StringBuilder sb = new StringBuilder();

		sb.append("{");

		if (pageHistogram.getAssetHistogramMetrics() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"assetHistogramMetrics\": ");

			sb.append("[");

			for (int i = 0; i < pageHistogram.getAssetHistogramMetrics().length;
				 i++) {

				sb.append(
					String.valueOf(
						pageHistogram.getAssetHistogramMetrics()[i]));

				if ((i + 1) < pageHistogram.getAssetHistogramMetrics().length) {
					sb.append(", ");
				}
			}

			sb.append("]");
		}

		if (pageHistogram.getPageTitle() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"pageTitle\": ");

			sb.append("\"");

			sb.append(_escape(pageHistogram.getPageTitle()));

			sb.append("\"");
		}

		sb.append("}");

		return sb.toString();
	}

	public static Map<String, Object> toMap(String json) {
		PageHistogramJSONParser pageHistogramJSONParser =
			new PageHistogramJSONParser();

		return pageHistogramJSONParser.parseToMap(json);
	}

	public static Map<String, String> toMap(PageHistogram pageHistogram) {
		if (pageHistogram == null) {
			return null;
		}

		Map<String, String> map = new TreeMap<>();

		if (pageHistogram.getAssetHistogramMetrics() == null) {
			map.put("assetHistogramMetrics", null);
		}
		else {
			map.put(
				"assetHistogramMetrics",
				String.valueOf(pageHistogram.getAssetHistogramMetrics()));
		}

		if (pageHistogram.getPageTitle() == null) {
			map.put("pageTitle", null);
		}
		else {
			map.put("pageTitle", String.valueOf(pageHistogram.getPageTitle()));
		}

		return map;
	}

	public static class PageHistogramJSONParser
		extends BaseJSONParser<PageHistogram> {

		@Override
		protected PageHistogram createDTO() {
			return new PageHistogram();
		}

		@Override
		protected PageHistogram[] createDTOArray(int size) {
			return new PageHistogram[size];
		}

		@Override
		protected boolean parseMaps(String jsonParserFieldName) {
			if (Objects.equals(jsonParserFieldName, "assetHistogramMetrics")) {
				return false;
			}
			else if (Objects.equals(jsonParserFieldName, "pageTitle")) {
				return false;
			}

			return false;
		}

		@Override
		protected void setField(
			PageHistogram pageHistogram, String jsonParserFieldName,
			Object jsonParserFieldValue) {

			if (Objects.equals(jsonParserFieldName, "assetHistogramMetrics")) {
				if (jsonParserFieldValue != null) {
					Object[] jsonParserFieldValues =
						(Object[])jsonParserFieldValue;

					AssetHistogramMetric[] assetHistogramMetricsArray =
						new AssetHistogramMetric[jsonParserFieldValues.length];

					for (int i = 0; i < assetHistogramMetricsArray.length;
						 i++) {

						assetHistogramMetricsArray[i] =
							AssetHistogramMetricSerDes.toDTO(
								(String)jsonParserFieldValues[i]);
					}

					pageHistogram.setAssetHistogramMetrics(
						assetHistogramMetricsArray);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "pageTitle")) {
				if (jsonParserFieldValue != null) {
					pageHistogram.setPageTitle((String)jsonParserFieldValue);
				}
			}
		}

	}

	private static String _escape(Object object) {
		String string = String.valueOf(object);

		for (String[] strings : BaseJSONParser.JSON_ESCAPE_STRINGS) {
			string = string.replace(strings[0], strings[1]);
		}

		return string;
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
			sb.append(entry.getKey());
			sb.append("\": ");

			Object value = entry.getValue();

			sb.append(_toJSON(value));

			if (iterator.hasNext()) {
				sb.append(", ");
			}
		}

		sb.append("}");

		return sb.toString();
	}

	private static String _toJSON(Object value) {
		if (value instanceof Map) {
			return _toJSON((Map)value);
		}

		Class<?> clazz = value.getClass();

		if (clazz.isArray()) {
			StringBuilder sb = new StringBuilder("[");

			Object[] values = (Object[])value;

			for (int i = 0; i < values.length; i++) {
				sb.append(_toJSON(values[i]));

				if ((i + 1) < values.length) {
					sb.append(", ");
				}
			}

			sb.append("]");

			return sb.toString();
		}

		if (value instanceof String) {
			return "\"" + _escape(value) + "\"";
		}

		return String.valueOf(value);
	}

}