import BasePage from 'shared/components/base-page';
import React from 'react';
import VisitorsByTimeCard, {
	formatHour,
	renderTooltip
} from '../VisitorsByTimeCard';
import {mockPreferenceReq, mockTimeRangeReq} from 'test/graphql-data';
import {render} from 'test/render';
import {waitForLoadingToBeRemoved} from 'test/helpers';

const MOCK_CONTEXT = {
	rangeKey: {defaultValue: '30'},
	router: {
		params: {
			channelId: '123',
			groupId: '2000'
		},
		query: {
			rangeKey: '30'
		}
	}
};

const BasePageContext = ({children}) => (
	<BasePage.Context.Provider value={MOCK_CONTEXT}>
		{children}
	</BasePage.Context.Provider>
);

describe('VisitorsByTimeCard', () => {
	it('render', async () => {
		const {container} = render(<VisitorsByTimeCard />, {
			addTypename: false,
			apolloMocks: [mockTimeRangeReq(), mockPreferenceReq()],
			path: '/workspace/:groupId/:channelId/*',
			route: '/workspace/2000/123',
			wrapper: BasePageContext
		});

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});

describe('renderTooltip', () => {
	it('render', () => {
		const {container} = render(
			renderTooltip({column: 'Sunday', row: 12, value: 98})
		);

		expect(container).toMatchSnapshot();
	});
});

describe('formatHour', () => {
	it.each`
		hour  | retVal
		${0}  | ${'12 AM'}
		${6}  | ${'6 AM'}
		${11} | ${'11 AM'}
		${12} | ${'12 PM'}
		${18} | ${'6 PM'}
	`('return $retVal when formatting $hour', ({hour, retVal}) => {
		expect(formatHour(hour)).toBe(retVal);
	});
});
