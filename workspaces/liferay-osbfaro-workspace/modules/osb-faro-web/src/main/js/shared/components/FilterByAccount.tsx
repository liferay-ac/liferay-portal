import * as API from 'shared/api';
import ClayButton from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import Loading, {Align} from 'shared/components/Loading';
import NoResultsDisplay from 'shared/components/NoResultsDisplay';
import React, {useMemo, useState} from 'react';
import {
	createOrderIOMap,
	getDefaultSortOrder,
	NAME,
} from 'shared/util/pagination';
import {getSafeDecodedURIComponent, getSafeTouchpoint} from 'shared/util/util';
import {sub} from 'shared/util/lang';
import {useParams} from 'react-router-dom';
import {useQueryPagination} from 'shared/hooks/useQueryPagination';
import {useRequest} from 'shared/hooks/useRequest';

type Item = {
	id: string;
	name: string;
};

interface IFilterByAccount {
	assetType: string;
	onFilterChange: (item: Item | null) => void;
}

const filterByAccount: React.FC<IFilterByAccount> = ({
	assetType,
	onFilterChange,
}) => {
	const {assetId, channelId, groupId, title, touchpoint} = useParams<{
		assetId: string;
		channelId: string;
		groupId: string;
		title: string;
		touchpoint: string;
	}>();
	const {delta: pageSize, query} = useQueryPagination({
		initialOrderIOMap: createOrderIOMap(NAME, getDefaultSortOrder(NAME)),
	});
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);

	const {data, loading} = useRequest({
		dataSourceFn: API.accounts.searchAccounts,
		variables: {
			assetId:
				assetType === 'page'
					? getSafeTouchpoint(touchpoint)
					: getSafeDecodedURIComponent(assetId),
			assetTitle: getSafeDecodedURIComponent(title),
			assetType,
			channelId,
			groupId,
			pageSize,
			query,
		},
	});

	const items: Item[] = data?.items ?? [];

	return (
		<div className="align-items-center d-flex analytics-account-filter-root">
			<Dropdown
				items={items}
				loading={loading}
				onFilterChange={(item: Item | null) => {
					setSelectedItem(item);

					onFilterChange(item);
				}}
			/>

			{selectedItem && (
				<ClayLabel
					className="ml-2"
					closeButtonProps={{
						'aria-label': Liferay.Language.get('close'),
						id: 'closeId',
						title: Liferay.Language.get('close'),
					}}
					large
					onClick={() => {
						setSelectedItem(null);
						onFilterChange(null);
					}}
				>
					{selectedItem.name}
				</ClayLabel>
			)}
		</div>
	);
};

const Dropdown = ({items, loading, onFilterChange}: any) => {
	const [value, setValue] = useState('');

	const filteredItems = useMemo(() => {
		if (!value) {
			return items;
		}

		return items.filter(
			({name}: any) => name.match(new RegExp(value, 'i')) !== null
		);
	}, [items, value]);

	return (
		<ClayDropDown
			closeOnClick
			trigger={
				<ClayButton
					borderless
					disabled={loading}
					displayType="secondary"
					size="sm"
				>
					{loading && <Loading align={Align.Left} />}

					{Liferay.Language.get('filter')}

					<ClayIcon className="ml-2" symbol="caret-bottom" />
				</ClayButton>
			}
		>
			<ClayDropDown.Search
				onChange={setValue}
				placeholder={Liferay.Language.get('search')}
			/>

			<ClayDropDown.ItemList
				items={[
					{
						children: filteredItems,
						id: 1,
						name: sub(Liferay.Language.get('filter-by-x'), [
							Liferay.Language.get('account'),
						]),
					},
				]}
			>
				{(item: any) => (
					<ClayDropDown.Group
						header={item.name}
						items={item.children}
						key={item.name}
					>
						{(item: any) => (
							<ClayDropDown.Item
								key={item.id}
								onClick={() => {
									onFilterChange(item);
								}}
							>
								{item.name}
							</ClayDropDown.Item>
						)}
					</ClayDropDown.Group>
				)}
			</ClayDropDown.ItemList>

			{!filteredItems.length && (
				<ClayDropDown.Section>
					<NoResultsDisplay
						description={
							<div
								className="d-flex flex-column justify-content-center"
								style={{minHeight: 240}}
							>
								<div className="h4 no-results-title">
									{Liferay.Language.get(
										'there-are-no-results-found'
									)}
								</div>

								{Liferay.Language.get(
									'please-try-a-different-search-term'
								)}
							</div>
						}
						title={undefined}
					/>
				</ClayDropDown.Section>
			)}
		</ClayDropDown>
	);
};

export default filterByAccount;
