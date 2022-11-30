/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton from '@clayui/button';
import {ClayToggle} from '@clayui/form';
import {useModal} from '@clayui/modal';
import React, {useState} from 'react';

import {fetchProperties, updatecommerceSyncEnabled} from '../../utils/api';
import TableContext, {Events, useData, useDispatch} from '../table/Context';
import {Table} from '../table/Table';
import {EColumnAlign, TColumns, TItem} from '../table/types';
import AssignModal from './AssignModal';
import CreatePropertyModal from './CreatePropertyModal';
import {getSafeProperty} from './utils';

export type TDataSource = {
	commerceChannelIds: number[];
	dataSourceId?: string;
	siteIds: number[];
};

export type TProperty = {
	channelId: string;
	commerceSyncEnabled: boolean;
	dataSources: TDataSource[] | [];
	name: string;
};

enum EColumn {
	Name = 'name',
	CommerceChannelIds = 'commerceChannelIds',
	SiteIds = 'siteIds',
	ToggleSwitch = 'toggleSwitch',
	AssignButton = 'assignButton',
}

const columns: TColumns = {
	[EColumn.Name]: {
		expanded: true,
		label: Liferay.Language.get('available-properties'),
	},
	[EColumn.CommerceChannelIds]: {
		align: EColumnAlign.Right,
		label: Liferay.Language.get('channels'),
		sortable: false,
	},
	[EColumn.SiteIds]: {
		align: EColumnAlign.Right,
		label: Liferay.Language.get('sites'),
		sortable: false,
	},
	[EColumn.ToggleSwitch]: {
		align: EColumnAlign.Right,
		label: Liferay.Language.get('Commerce'),
		sortable: false,
	},
	[EColumn.AssignButton]: {
		align: EColumnAlign.Right,
		label: '',
		sortable: false,
	},
};

const ToggleSwitch = ({
	onToggle,
	toggle: initialToggle,
}: {
	onToggle: (toggle: boolean) => void;
	toggle: boolean;
}) => {
	const [toggle, setToggle] = useState(initialToggle);

	return (
		<ClayToggle
			onToggle={() => {
				setToggle((toggle) => {
					onToggle(!toggle);

					return !toggle;
				});
			}}
			toggled={toggle}
			value={EColumn.ToggleSwitch}
		/>
	);
};

const getCommerceChannelIdsValue = (enabled: boolean, ids: number[]): string =>
	enabled ? String(ids.length) : '-';

const Properties: React.FC = () => {
	const {reload} = useData();
	const dispatch = useDispatch();

	const {
		observer: assignModalObserver,
		onOpenChange: onAssignModalOpenChange,
		open: assignModalOpen,
	} = useModal();
	const {
		observer: createPropertyModalObserver,
		onOpenChange: onCreatePropertyModalOpenChange,
		open: createPropertyModalOpen,
	} = useModal();

	const [selectedProperty, setSelectedProperty] = useState<TProperty | null>(
		null
	);

	const toggleSwitch = (
		item: TItem,
		{channelId, dataSources: [{commerceChannelIds}]}: TProperty
	) => (
		<ToggleSwitch
			onToggle={async (commerceSyncEnabled) => {
				const {ok} = await updatecommerceSyncEnabled({
					channelId,
					commerceSyncEnabled,
				});

				if (ok) {
					dispatch({
						payload: {
							id: item.id,
							values: [
								{
									id: EColumn.ToggleSwitch,
									property: 'value',
									value: commerceSyncEnabled,
								},
								{
									id: EColumn.CommerceChannelIds,
									property: 'label',
									value: getCommerceChannelIdsValue(
										commerceSyncEnabled,
										commerceChannelIds
									),
								},
							],
						},
						type: Events.ChangeItem,
					});
				}
			}}
			toggle={item.columns[3].value as boolean}
		/>
	);

	const assignButton = (item: TItem, property: TProperty) => (
		<ClayButton
			displayType="secondary"
			onClick={() => {
				setSelectedProperty({
					...property,
					commerceSyncEnabled: item.columns[3].value as boolean,
				});
				onAssignModalOpenChange(true);
			}}
		>
			{Liferay.Language.get('assign')}
		</ClayButton>
	);

	return (
		<>
			<Table<TProperty>
				columns={columns}
				emptyStateTitle={Liferay.Language.get(
					'there-are-no-properties'
				)}
				mapperItems={(items: TProperty[]) =>
					items.map((property) => {
						const safeProperty = getSafeProperty(property);
						const {
							channelId,
							commerceSyncEnabled,
							dataSources: [{commerceChannelIds, siteIds}],
							name,
						} = safeProperty;

						const commerceChannelIdsValue = getCommerceChannelIdsValue(
							commerceSyncEnabled,
							commerceChannelIds
						);
						const siteIdsValue = String(siteIds.length);

						return {
							columns: [
								{
									id: EColumn.Name,
									value: name,
								},
								{
									id: EColumn.CommerceChannelIds,
									value: commerceChannelIdsValue,
								},
								{
									id: EColumn.SiteIds,
									value: siteIdsValue,
								},
								{
									cellRenderer: (item) =>
										toggleSwitch(item, safeProperty),
									id: EColumn.ToggleSwitch,
									value: commerceSyncEnabled,
								},
								{
									cellRenderer: (item) =>
										assignButton(item, safeProperty),
									id: EColumn.AssignButton,
									value: 'assignButton',
								},
							],
							id: channelId,
						};
					})
				}
				noResultsTitle={Liferay.Language.get(
					'no-properties-were-found'
				)}
				onAddItem={() => onCreatePropertyModalOpenChange(true)}
				requestFn={fetchProperties}
				showCheckbox={false}
			/>

			{assignModalOpen && (
				<AssignModal
					observer={assignModalObserver}
					onCancel={() => onAssignModalOpenChange(false)}
					onSubmit={({commerceChannelIds, siteIds}) => {
						Liferay.Util.openToast({
							message: Liferay.Language.get(
								'properties-settings-have-been-saved'
							),
						});

						onAssignModalOpenChange(false);

						dispatch({
							payload: {
								id: selectedProperty?.channelId,
								values: [
									{
										id: EColumn.CommerceChannelIds,
										value: getCommerceChannelIdsValue(
											!!selectedProperty?.commerceSyncEnabled,
											commerceChannelIds
										),
									},
									{
										id: EColumn.SiteIds,
										value: siteIds.length,
									},
								],
							},
							type: Events.ChangeItem,
						});
					}}
					property={selectedProperty}
				/>
			)}

			{createPropertyModalOpen && (
				<CreatePropertyModal
					observer={createPropertyModalObserver}
					onCancel={() => onCreatePropertyModalOpenChange(false)}
					onSubmit={() => {
						Liferay.Util.openToast({
							message: Liferay.Language.get(
								'properties-settings-have-been-saved'
							),
						});

						onCreatePropertyModalOpenChange(false);

						reload();
					}}
				/>
			)}
		</>
	);
};

const PropertiesWrapper = () => (
	<TableContext>
		<Properties />
	</TableContext>
);

export default PropertiesWrapper;
