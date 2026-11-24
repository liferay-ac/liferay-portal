import AcquisitionsCard from '../AcquisitionsCard';
import BasePage from 'shared/components/base-page';
import React from 'react';
import {CompositionTypes, RangeKeyTimeRanges} from 'shared/util/constants';
import {
	mockAcquisitionsReq,
	mockPreferenceReq,
	mockTimeRangeReq,
} from 'test/graphql-data';
import {render} from 'test/render';
import {waitForLoadingToBeRemoved} from 'test/helpers';

const MOCK_CONTEXT = {
	filters: {},
	router: {
		params: {
			channelId: '123',
			groupId: '456',
		},
		query: {
			rangeKey: RangeKeyTimeRanges.Last30Days,
		},
	},
};

const BasePageContext = ({children}: {children: React.ReactNode}) => (
	<BasePage.Context.Provider value={MOCK_CONTEXT}>
		{children}
	</BasePage.Context.Provider>
);

describe('AcquisitionsCard', () => {
	it('renders', async () => {
		const {container} = render(
			<AcquisitionsCard
				compositionBagName={CompositionTypes.Acquisitions}
				label="card label"
			/>,
			{
				addTypename: false,
				apolloMocks: [
					mockTimeRangeReq(),
					mockPreferenceReq(),
					mockAcquisitionsReq(),
				],
				wrapper: BasePageContext,
			}
		);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});
