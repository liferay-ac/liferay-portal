import * as data from 'test/data';
import OverviewRealTime from '../OverviewRealTime';
import React from 'react';
import {render, screen} from 'test/render';
import {Segment} from 'shared/util/records';

jest.mock('shared/hooks/useTimeZone', () => ({
	useTimeZone: () => ({
		timeZoneId: 'UTC',
	}),
}));

const renderOverviewRealTime = () =>
	render(
		<OverviewRealTime
			channelId="123"
			groupId="23"
			segment={
				new Segment(
					data.mockSegment(0, {
						criteriaString:
							"(demographics/middleName/value eq 'additionalName')",
					})
				)
			}
		/>
	);

describe('OverviewRealTime', () => {
	it('should display the segment criteria', () => {
		renderOverviewRealTime();

		expect(screen.getByText(/^segment criteria$/i)).toBeTruthy();
	});

	it('should not display the membership of the segment', () => {
		renderOverviewRealTime();

		expect(screen.queryByText(/^segment membership trend$/i)).toBeNull();
		expect(screen.queryByText(/^total members$/i)).toBeNull();
	});
});
