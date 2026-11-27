import React from 'react';
import Touchpoints from '../Touchpoints';
import {mockPreferenceReq, mockTimeRangeReq} from 'test/graphql-data';
import {render} from 'test/render';
import {waitForLoadingToBeRemoved} from 'test/helpers';

describe('Sites Dashboard Touchpoints Page', () => {
	it('render', async () => {
		const {container} = render(
			<Touchpoints router={{params: {}, query: {}}} />,
			{
				addTypename: false,
				apolloMocks: [mockTimeRangeReq(), mockPreferenceReq()],
			}
		);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});
