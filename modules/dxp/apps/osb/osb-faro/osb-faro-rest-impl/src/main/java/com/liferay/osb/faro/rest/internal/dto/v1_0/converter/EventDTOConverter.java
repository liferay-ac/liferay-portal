/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.dto.v1_0.converter;

import com.liferay.osb.faro.rest.dto.v1_0.Event;
import com.liferay.osb.faro.rest.internal.graphql.dto.GetSiteChannelEventsPageResponse;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.vulcan.dto.converter.DTOConverter;
import com.liferay.portal.vulcan.dto.converter.DTOConverterContext;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.osgi.service.component.annotations.Component;

/**
 * @author Leslie Wong
 */
@Component(
	property = "dto.class.name=com.liferay.osb.faro.rest.internal.graphql.dto.GetSiteChannelEventsPageResponse$Event",
	service = DTOConverter.class
)
public class EventDTOConverter
	implements DTOConverter<GetSiteChannelEventsPageResponse.Event, Event> {

	@Override
	public String getContentType() {
		return Event.class.getSimpleName();
	}

	@Override
	public Event toDTO(
		DTOConverterContext dtoConverterContext,
		GetSiteChannelEventsPageResponse.Event engineEvent) {

		if (engineEvent == null) {
			return null;
		}

		return new Event() {
			{
				setApplicationId(engineEvent::getApplicationId);
				setAssetTitle(engineEvent::getAssetTitle);
				setAttributes(
					() -> _propertiesToMap(engineEvent.getProperties()));
				setCanonicalUrl(engineEvent::getCanonicalUrl);
				setCreateDate(engineEvent::getCreateDate);
				setName(engineEvent::getName);
				setPageDescription(engineEvent::getPageDescription);
				setPageKeywords(engineEvent::getPageKeywords);
				setPageTitle(engineEvent::getPageTitle);
				setReferrer(engineEvent::getReferrer);
				setUrl(engineEvent::getUrl);
			}
		};
	}

	private Map<String, String> _propertiesToMap(
		List<GetSiteChannelEventsPageResponse.Property> properties) {

		if (ListUtil.isEmpty(properties)) {
			return null;
		}

		Map<String, String> attributes = new LinkedHashMap<>(properties.size());

		for (GetSiteChannelEventsPageResponse.Property property : properties) {
			String name = property.getName();

			if (name != null) {
				attributes.put(name, property.getValue());
			}
		}

		return attributes;
	}

}