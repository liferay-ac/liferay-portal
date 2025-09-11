/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.headless.cms.client.serdes.v1_0;

import com.liferay.headless.cms.client.dto.v1_0.BulkActionPreviewItem;
import com.liferay.headless.cms.client.json.BaseJSONParser;

import jakarta.annotation.Generated;

import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeMap;

/**
 * @author Crescenzo Rega
 * @generated
 */
@Generated("")
public class BulkActionPreviewItemSerDes {

	public static BulkActionPreviewItem toDTO(String json) {
		BulkActionPreviewItemJSONParser bulkActionPreviewItemJSONParser =
			new BulkActionPreviewItemJSONParser();

		return bulkActionPreviewItemJSONParser.parseToDTO(json);
	}

	public static BulkActionPreviewItem[] toDTOs(String json) {
		BulkActionPreviewItemJSONParser bulkActionPreviewItemJSONParser =
			new BulkActionPreviewItemJSONParser();

		return bulkActionPreviewItemJSONParser.parseToDTOs(json);
	}

	public static String toJSON(BulkActionPreviewItem bulkActionPreviewItem) {
		if (bulkActionPreviewItem == null) {
			return "null";
		}

		StringBuilder sb = new StringBuilder();

		sb.append("{");

		if (bulkActionPreviewItem.getAttributes() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"attributes\": ");

			sb.append(_toJSON(bulkActionPreviewItem.getAttributes()));
		}

		if (bulkActionPreviewItem.getClassName() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"className\": ");

			sb.append("\"");

			sb.append(_escape(bulkActionPreviewItem.getClassName()));

			sb.append("\"");
		}

		if (bulkActionPreviewItem.getClassPK() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"classPK\": ");

			sb.append(bulkActionPreviewItem.getClassPK());
		}

		if (bulkActionPreviewItem.getExternalReferenceCode() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"externalReferenceCode\": ");

			sb.append("\"");

			sb.append(
				_escape(bulkActionPreviewItem.getExternalReferenceCode()));

			sb.append("\"");
		}

		if (bulkActionPreviewItem.getName() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"name\": ");

			sb.append("\"");

			sb.append(_escape(bulkActionPreviewItem.getName()));

			sb.append("\"");
		}

		sb.append("}");

		return sb.toString();
	}

	public static Map<String, Object> toMap(String json) {
		BulkActionPreviewItemJSONParser bulkActionPreviewItemJSONParser =
			new BulkActionPreviewItemJSONParser();

		return bulkActionPreviewItemJSONParser.parseToMap(json);
	}

	public static Map<String, String> toMap(
		BulkActionPreviewItem bulkActionPreviewItem) {

		if (bulkActionPreviewItem == null) {
			return null;
		}

		Map<String, String> map = new TreeMap<>();

		if (bulkActionPreviewItem.getAttributes() == null) {
			map.put("attributes", null);
		}
		else {
			map.put(
				"attributes",
				String.valueOf(bulkActionPreviewItem.getAttributes()));
		}

		if (bulkActionPreviewItem.getClassName() == null) {
			map.put("className", null);
		}
		else {
			map.put(
				"className",
				String.valueOf(bulkActionPreviewItem.getClassName()));
		}

		if (bulkActionPreviewItem.getClassPK() == null) {
			map.put("classPK", null);
		}
		else {
			map.put(
				"classPK", String.valueOf(bulkActionPreviewItem.getClassPK()));
		}

		if (bulkActionPreviewItem.getExternalReferenceCode() == null) {
			map.put("externalReferenceCode", null);
		}
		else {
			map.put(
				"externalReferenceCode",
				String.valueOf(
					bulkActionPreviewItem.getExternalReferenceCode()));
		}

		if (bulkActionPreviewItem.getName() == null) {
			map.put("name", null);
		}
		else {
			map.put("name", String.valueOf(bulkActionPreviewItem.getName()));
		}

		return map;
	}

	public static class BulkActionPreviewItemJSONParser
		extends BaseJSONParser<BulkActionPreviewItem> {

		@Override
		protected BulkActionPreviewItem createDTO() {
			return new BulkActionPreviewItem();
		}

		@Override
		protected BulkActionPreviewItem[] createDTOArray(int size) {
			return new BulkActionPreviewItem[size];
		}

		@Override
		protected boolean parseMaps(String jsonParserFieldName) {
			if (Objects.equals(jsonParserFieldName, "attributes")) {
				return true;
			}
			else if (Objects.equals(jsonParserFieldName, "className")) {
				return false;
			}
			else if (Objects.equals(jsonParserFieldName, "classPK")) {
				return false;
			}
			else if (Objects.equals(
						jsonParserFieldName, "externalReferenceCode")) {

				return false;
			}
			else if (Objects.equals(jsonParserFieldName, "name")) {
				return false;
			}

			return false;
		}

		@Override
		protected void setField(
			BulkActionPreviewItem bulkActionPreviewItem,
			String jsonParserFieldName, Object jsonParserFieldValue) {

			if (Objects.equals(jsonParserFieldName, "attributes")) {
				if (jsonParserFieldValue != null) {
					bulkActionPreviewItem.setAttributes(
						(Map<String, Object>)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "className")) {
				if (jsonParserFieldValue != null) {
					bulkActionPreviewItem.setClassName(
						(String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "classPK")) {
				if (jsonParserFieldValue != null) {
					bulkActionPreviewItem.setClassPK(
						Long.valueOf((String)jsonParserFieldValue));
				}
			}
			else if (Objects.equals(
						jsonParserFieldName, "externalReferenceCode")) {

				if (jsonParserFieldValue != null) {
					bulkActionPreviewItem.setExternalReferenceCode(
						(String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "name")) {
				if (jsonParserFieldValue != null) {
					bulkActionPreviewItem.setName((String)jsonParserFieldValue);
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
		if (value == null) {
			return "null";
		}

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