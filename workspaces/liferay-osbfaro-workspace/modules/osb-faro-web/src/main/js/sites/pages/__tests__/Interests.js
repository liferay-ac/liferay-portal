import configureStore from 'shared/store/store-dev';
import Interests from '../Interests';
import React from 'react';
import {mockPreferenceReq, mockTimeRangeReq} from 'test/graphql-data';
import {render} from 'test/render';
import {Routes} from 'shared/util/router';
import {waitForLoadingToBeRemoved} from 'test/helpers';

describe('Sites Dashboard Interests', () => {
	it('render', async () => {
		const {container} = render(
			<Interests router={{params: {groupId: '23'}, query: {}}} />,
			{
				apolloMocks: [mockTimeRangeReq(), mockPreferenceReq()],
				path: `${Routes.SITES_INTERESTS}/*`,
				route: '/workspace/23/sites/interests',
				store: configureStore(),
			}
		);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});
