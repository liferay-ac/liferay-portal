/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.dto.v1_0.converter;

import com.liferay.osb.faro.rest.dto.v1_0.IndividualSegmentMembershipChange;

import java.util.Date;

import org.junit.Assert;
import org.junit.Test;

/**
 * @author Leslie Wong
 */
public class IndividualSegmentMembershipChangeDTOConverterTest {

	@Test
	public void testToDTO() {
		com.liferay.osb.faro.engine.client.model.
			IndividualSegmentMembershipChange
				engineClientIndividualSegmentMembershipChange =
					new com.liferay.osb.faro.engine.client.model.
						IndividualSegmentMembershipChange();

		Date dateChanged = new Date(1725000000000L);
		Date dateFirst = new Date(1700000000000L);

		engineClientIndividualSegmentMembershipChange.setDateChanged(
			dateChanged);
		engineClientIndividualSegmentMembershipChange.setDateFirst(dateFirst);
		engineClientIndividualSegmentMembershipChange.setId("change-1");
		engineClientIndividualSegmentMembershipChange.setIndividualEmail(
			"jane.doe@acme.example");
		engineClientIndividualSegmentMembershipChange.setIndividualId(
			"individual-1");
		engineClientIndividualSegmentMembershipChange.setIndividualName(
			"Jane Doe");
		engineClientIndividualSegmentMembershipChange.setIndividualSegmentId(
			"segment-1");
		engineClientIndividualSegmentMembershipChange.setOperation("REMOVED");

		IndividualSegmentMembershipChange individualSegmentMembershipChange =
			_individualSegmentMembershipChangeDTOConverter.toDTO(
				new FaroDTOConverterContext(false, "change-1", null),
				engineClientIndividualSegmentMembershipChange);

		Assert.assertEquals(
			dateChanged, individualSegmentMembershipChange.getDateChanged());
		Assert.assertEquals(
			dateFirst, individualSegmentMembershipChange.getDateFirst());
		Assert.assertEquals(
			"change-1", individualSegmentMembershipChange.getId());
		Assert.assertEquals(
			"jane.doe@acme.example",
			individualSegmentMembershipChange.getIndividualEmail());
		Assert.assertEquals(
			"individual-1",
			individualSegmentMembershipChange.getIndividualId());
		Assert.assertEquals(
			"Jane Doe", individualSegmentMembershipChange.getIndividualName());
		Assert.assertEquals(
			"segment-1",
			individualSegmentMembershipChange.getIndividualSegmentId());
		Assert.assertEquals(
			"REMOVED", individualSegmentMembershipChange.getOperation());

		Assert.assertNull(
			_individualSegmentMembershipChangeDTOConverter.toDTO(
				new FaroDTOConverterContext(false, null, null), null));
	}

	private final IndividualSegmentMembershipChangeDTOConverter
		_individualSegmentMembershipChangeDTOConverter =
			new IndividualSegmentMembershipChangeDTOConverter();

}