import * as data from 'test/data';
import Overview from '../Overview';
import React from 'react';
import {render} from 'test/render';
import {Segment} from 'shared/util/records';
import {waitForLoadingToBeRemoved} from 'test/helpers';

const segment = new Segment(
	data.mockSegment(0, {
		criteriaString: "(demographics/middleName/value eq 'additionalName')",
		lastMembershipUpdateDate: 1700000000000,
		referencedObjects: {
			fieldMappings: {
				individual: {
					demographics: {
						middleName: {
							context: 'demographics',
							dataSourceFieldNames: {},
							displayName: 'Middle Name',
							displayType: 'input-field',
							id: 'middleName',
							name: 'additionalName',
							ownerType: 'individual',
							rawType: 'Text',
							type: 'text'
						}
					}
				}
			}
		}
	})
);

jest.mock('shared/hooks/useTimeZone', () => ({
	useTimeZone: () => ({
		timeZoneId: 'UTC'
	})
}));

describe('SegmentOverview', () => {
	it('should render', async () => {
		const {container} = render(
			<Overview groupId='23' segment={segment} />
		);

		await waitForLoadingToBeRemoved(container).then(() => {
			expect(container).toMatchSnapshot();
		});
	});

	it('should render the composition counts as processing while the membership is processing', async () => {
		const {container} = render(
			<Overview
				groupId='23'
				segment={segment.set('lastMembershipUpdateDate', null)}
			/>
		);

		await waitForLoadingToBeRemoved(container);

		const compositionCard = container.querySelector(
			'.composition-card-root'
		);

		expect(compositionCard).toHaveTextContent(/processing/i);
		expect(compositionCard).not.toHaveTextContent('0%');
	});
});
