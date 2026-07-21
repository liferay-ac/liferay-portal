import Card from 'shared/components/Card';
import getMetricsMapper from 'shared/hoc/mappers/metrics';
import knownAccountsListAssetQuery from 'shared/queries/knownAccountsListAssetQuery';
import React, {useState} from 'react';
import {accountsListColumns} from 'shared/util/table-columns';
import {
	compose,
	withBaseResults,
	withQueryPagination,
	withQueryRangeSelectors,
} from 'shared/hoc';
import {createOrderIOMap, NAME, VIEWS_METRIC} from 'shared/util/pagination';
import {graphql} from '@apollo/client/react/hoc';
import {RangeSelectors} from 'shared/types';
import {Sizes} from 'shared/util/constants';

const withData = () =>
	graphql(
		knownAccountsListAssetQuery('blog', VIEWS_METRIC),
		getMetricsMapper((result) => ({
			items: result.blog.viewsMetric.accounts.accounts,
			total: result.blog.viewsMetric.accounts.total,
		}))
	);

const TableWithData = withBaseResults(withData, {
	emptyIcon: {
		border: false,
		size: Sizes.XXXLarge,
		symbol: 'ac_satellite',
	},
	emptyTitle: Liferay.Language.get('there-are-no-accounts-found'),
	getColumns: ({
		router: {
			params: {channelId, groupId},
		},
	}: any) => [
		{
			...accountsListColumns.getName({channelId, groupId}),
			sortable: false,
		},
	],
	legacyDropdownRangeKey: false,
	rowIdentifier: 'id',
});

const KnownAccountsListCard = ({
	rangeSelectors: initialRangeSelectors,
	...otherProps
}: any) => {
	const [rangeSelectors, setRangeSelectors] = useState<RangeSelectors>(
		initialRangeSelectors
	);

	return (
		<Card className="known-accounts-root" pageDisplay>
			<TableWithData
				{...otherProps}
				onRangeSelectorsChange={setRangeSelectors}
				rangeSelectors={rangeSelectors}
			/>
		</Card>
	);
};

export default compose<React.ComponentType<any>>(
	withQueryPagination({initialOrderIOMap: createOrderIOMap(NAME)}),
	withQueryRangeSelectors()
)(KnownAccountsListCard);
