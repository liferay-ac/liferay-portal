import AssetsListCard from '../AssetsListCard';
import BasePage from 'shared/components/base-page';
import React from 'react';
import {render} from 'test/render';

const items = [
	{
		assetId: '01234',
		assetType: 'journal',
		interactions: 1,
		title: '231494203',
		type: 'Web Content'
	},
	{
		assetId: '01234',
		assetType: 'journal',
		interactions: 1,
		title: '231494203',
		type: 'Web Content'
	},
	{
		assetId: '01234',
		assetType: 'journal',
		interactions: 1,
		title: '231494203',
		type: 'Web Content'
	},
	{
		assetId: '01234',
		assetType: 'journal',
		interactions: 1,
		title: '231494203',
		type: 'Web Content'
	},
	{
		assetId: '01234',
		assetType: 'journal',
		interactions: 1,
		title: '231494203',
		type: 'Web Content'
	},
	{
		assetId: '01234',
		assetType: 'journal',
		interactions: 1,
		title: '231494203',
		type: 'Web Content'
	},
	{
		assetId: '01234',
		assetType: 'journal',
		interactions: 1,
		title: '231494203',
		type: 'Web Content'
	},
	{
		assetId: '01234',
		assetType: 'journal',
		interactions: 1,
		title: '231494203',
		type: 'Web Content'
	},
	{
		assetId: '01234',
		assetType: 'journal',
		interactions: 1,
		title: '231494203',
		type: 'Web Content'
	}
];

describe('AssetsListCard', () => {
	const MOCK_CONTEXT = {
		router: {
			params: {
				channelId: 123,
				groupId: '2000',
				touchpoint: 'www.liferay.com'
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

	const renderCard = props =>
		render(<AssetsListCard {...props} rangeSelectors={{rangeKey: '30'}} />, {
			wrapper: BasePageContext
		});

	it('should render component', () => {
		const {container} = renderCard();

		expect(container).toMatchSnapshot();
	});

	it('should render component with items', () => {
		const {container} = renderCard({items});

		expect(container).toMatchSnapshot();
	});
});
