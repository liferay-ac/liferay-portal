import Card from 'shared/components/Card';
import getMetricsMapper from 'shared/hoc/mappers/metrics';
import ObjectEntryKnownAccountsListQuery from 'shared/queries/ObjectEntryKnownAccountsListQuery';
import React, {useState} from 'react';
import {accountsListColumns} from 'shared/util/table-columns';
import {
	compose,
	withBaseResults,
	withQueryPagination,
	withQueryRangeSelectors,
} from 'shared/hoc';
import {createOrderIOMap, NAME} from 'shared/util/pagination';
import {graphql} from '@apollo/client/react/hoc';
import {RangeSelectors} from 'shared/types';
import {Sizes} from 'shared/util/constants';

const withData = () =>
	graphql(
		ObjectEntryKnownAccountsListQuery,
		getMetricsMapper((result) => ({
			items: result.objectEntry.viewsMetric.accounts.accounts,
			total: result.objectEntry.viewsMetric.accounts.total,
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
	}: {
		router: {params: {channelId: string; groupId: string}};
	}) => [
		{
			...accountsListColumns.getName({channelId, groupId}),
			sortable: false,
		},
	],
	legacyDropdownRangeKey: false,
	rowIdentifier: 'id',
});

interface IKnownAccountsListCardProps {
	rangeSelectors: RangeSelectors;
	[key: string]: unknown;
}

const KnownAccountsListCard = ({
	rangeSelectors: initialRangeSelectors,
	...otherProps
}: IKnownAccountsListCardProps) => {
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
