/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.analytics.reports.rest.client.serdes.v1_0;

import com.liferay.analytics.reports.rest.client.dto.v1_0.AssetPageHistogramMetric;
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
public class AssetPageHistogramMetricSerDes {

	public static AssetPageHistogramMetric toDTO(String json) {
		AssetPageHistogramMetricJSONParser assetPageHistogramMetricJSONParser =
			new AssetPageHistogramMetricJSONParser();

		return assetPageHistogramMetricJSONParser.parseToDTO(json);
	}

	public static AssetPageHistogramMetric[] toDTOs(String json) {
		AssetPageHistogramMetricJSONParser assetPageHistogramMetricJSONParser =
			new AssetPageHistogramMetricJSONParser();

		return assetPageHistogramMetricJSONParser.parseToDTOs(json);
	}

	public static String toJSON(
		AssetPageHistogramMetric assetPageHistogramMetric) {

		if (assetPageHistogramMetric == null) {
			return "null";
		}

		StringBuilder sb = new StringBuilder();

		sb.append("{");

		if (assetPageHistogramMetric.getPageHistograms() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"pageHistograms\": ");

			sb.append("[");

			for (int i = 0;
				 i < assetPageHistogramMetric.getPageHistograms().length; i++) {

				sb.append(
					String.valueOf(
						assetPageHistogramMetric.getPageHistograms()[i]));

				if ((i + 1) <
						assetPageHistogramMetric.getPageHistograms().length) {

					sb.append(", ");
				}
			}

			sb.append("]");
		}

		sb.append("}");

		return sb.toString();
	}

	public static Map<String, Object> toMap(String json) {
		AssetPageHistogramMetricJSONParser assetPageHistogramMetricJSONParser =
			new AssetPageHistogramMetricJSONParser();

		return assetPageHistogramMetricJSONParser.parseToMap(json);
	}

	public static Map<String, String> toMap(
		AssetPageHistogramMetric assetPageHistogramMetric) {

		if (assetPageHistogramMetric == null) {
			return null;
		}

		Map<String, String> map = new TreeMap<>();

		if (assetPageHistogramMetric.getPageHistograms() == null) {
			map.put("pageHistograms", null);
		}
		else {
			map.put(
				"pageHistograms",
				String.valueOf(assetPageHistogramMetric.getPageHistograms()));
		}

		return map;
	}

	public static class AssetPageHistogramMetricJSONParser
		extends BaseJSONParser<AssetPageHistogramMetric> {

		@Override
		protected AssetPageHistogramMetric createDTO() {
			return new AssetPageHistogramMetric();
		}

		@Override
		protected AssetPageHistogramMetric[] createDTOArray(int size) {
			return new AssetPageHistogramMetric[size];
		}

		@Override
		protected boolean parseMaps(String jsonParserFieldName) {
			if (Objects.equals(jsonParserFieldName, "pageHistograms")) {
				return false;
			}

			return false;
		}

		@Override
		protected void setField(
			AssetPageHistogramMetric assetPageHistogramMetric,
			String jsonParserFieldName, Object jsonParserFieldValue) {

			if (Objects.equals(jsonParserFieldName, "pageHistograms")) {
				if (jsonParserFieldValue != null) {
					Object[] jsonParserFieldValues =
						(Object[])jsonParserFieldValue;

					PageHistogram[] pageHistogramsArray =
						new PageHistogram[jsonParserFieldValues.length];

					for (int i = 0; i < pageHistogramsArray.length; i++) {
						pageHistogramsArray[i] = PageHistogramSerDes.toDTO(
							(String)jsonParserFieldValues[i]);
					}

					assetPageHistogramMetric.setPageHistograms(
						pageHistogramsArray);
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