import BasePage from 'shared/components/base-page';
import React from 'react';
import TopPagesCard from '../TopPagesCard';
import {
	mockPreferenceReq,
	mockSitesTopPagesReq,
	mockTimeRangeReq,
} from 'test/graphql-data';
import {RangeKeyTimeRanges} from 'shared/util/constants';
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

describe('TopPagesCard', () => {
	it('renders', async () => {
		const {container} = render(
			<TopPagesCard
				footer={{
					href: 'link-to-the-next-page',
					label: 'view pages',
				}}
				label="card label"
			/>,
			{
				addTypename: false,
				apolloMocks: [
					mockTimeRangeReq(),
					mockPreferenceReq(),
					mockSitesTopPagesReq(),
				],
				wrapper: BasePageContext,
			}
		);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});
