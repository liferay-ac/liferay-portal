import InterestDetails from '../InterestDetails';
import React from 'react';
import {render} from 'test/render';
import {
	mockPreferenceReq,
	mockTimeRangeReq,
	mockTouchpointsReq
} from 'test/graphql-data';
import {Routes} from 'shared/util/router';
import {waitForLoading} from 'test/helpers';

const mockItems = [
	{
		__typename: 'PageMetric',
		assetId: 'https://www.liferay.com',
		assetTitle: 'Dashboard - Retail',
		avgTimeOnPageMetric: {
			__typename: 'Metric',
			value: 23
		},
		bounceRateMetric: {
			__typename: 'Metric',
			value: 0.23
		},
		dataSourceId: '123123',
		entrancesMetric: {
			__typename: 'Metric',
			value: 56
		},
		exitRateMetric: {
			__typename: 'Metric',
			value: 0.53
		},
		viewsMetric: {__typename: 'Metric', value: 243.0},
		visitorsMetric: {
			__typename: 'Metric',
			value: 45.0
		}
	}
];

describe('Individuals Dashboard Individuals Interest Details', () => {
	it('renders', async () => {
		const {getByText} = render(
			<InterestDetails
				router={{
					params: {
						channelId: '321321',
						groupId: '23',
						interestId: 'test'
					},
					query: {
						delta: '2',
						page: '1',
						rangeEnd: null,
						rangeKey: '30',
						rangeStart: null
					}
				}}
			/>,
			{
				apolloMocks: [
					mockPreferenceReq(),
					mockTouchpointsReq(mockItems, {size: 2}),
					mockTimeRangeReq()
				],
				path: `${Routes.CONTACTS_INDIVIDUALS_INTEREST_DETAILS}/*`,
				route: '/workspace/23/321321/contacts/individuals/interests/test'
			}
		);

		await waitForLoading(document.body);

		expect(getByText(/^back to interests$/i)).toBeInTheDocument();
	});
});
