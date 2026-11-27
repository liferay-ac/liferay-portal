import BasePage from 'shared/components/base-page';
import Overview from '../Overview';
import React from 'react';
import {fireEvent, render} from 'test/render';
import {Routes} from 'shared/util/router';

const MOCK_CONTEXT = {
	rangeKey: {defaultValue: '30'},
	router: {
		params: {
			channelId: '123123',
			groupId: '23',
		},
		query: {
			rangeKey: '30',
		},
	},
};

const BasePageContext = ({children}) => (
	<BasePage.Context.Provider value={MOCK_CONTEXT}>
		{children}
	</BasePage.Context.Provider>
);

const renderOverview = (path = Routes.SITES) =>
	render(
		<Overview
			channelName="Test Channel"
			router={{
				params: {
					channelId: '123123',
					groupId: '23',
				},
			}}
		/>,
		{
			path,
			route: '/workspace/23/123123/sites',
			wrapper: BasePageContext,
		}
	);

describe('Sites Dashboard Overview', () => {
	it('should give the Top Pages and Acquisitions cards the same minimum height', () => {
		const {container} = renderOverview();

		expect(container.querySelector('.top-pages-card-root')).toHaveStyle(
			'min-height: 575px'
		);
		expect(container.querySelector('.acquisitions-card-root')).toHaveStyle(
			'min-height: 575px'
		);
	});

	it('should give the Visitors by Time, Search Terms and Interests cards the same minimum height', () => {
		const {container} = renderOverview();

		expect(container.querySelector('.visitors-by-time-card')).toHaveStyle(
			'min-height: 545px'
		);
		expect(container.querySelector('.search-terms-card-root')).toHaveStyle(
			'min-height: 545px'
		);
		expect(container.querySelector('.interests-card-root')).toHaveStyle(
			'min-height: 545px'
		);
	});

	it('render', () => {
		const {container, getAllByText, getByLabelText, getByText} =
			renderOverview(`${Routes.SITES}/*`);

		fireEvent.click(getByText(/^all visitors$/i));

		expect(getAllByText(/^all visitors$/i)[1]).toBeTruthy();
		expect(getByText(/^anonymous visitors$/i)).toBeTruthy();
		expect(getByText(/^known visitors$/i)).toBeTruthy();
		expect(getByLabelText(/^view all pages$/i)).toBeInTheDocument();
		expect(getByLabelText(/^view all search terms$/i)).toBeInTheDocument();
		expect(getByLabelText(/^view all interests$/i)).toBeInTheDocument();

		expect(container).toMatchSnapshot();
	});
});
