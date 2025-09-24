/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import ClayModal from '@clayui/modal';
import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {openModal} from 'frontend-js-components-web';
import {sub} from 'frontend-js-web';
import React from 'react';

import formatActionURL from '../../utils/formatActionURL';
import {BulkActionItem} from './types';

import '../../../../css/components/AssetUsageListModal.scss';

interface IDetailedAssetUsageModalProps {
	item: BulkActionItem;
}

const ViewButton = ({
	item,
	itemData,
}: {
	item: BulkActionItem;
	itemData: {type: string; url?: string};
}) => {
	if (!itemData.url) {
		return null;
	}

	if (itemData.url.includes('objectEntryId')) {
		return (
			<ClayButtonWithIcon
				aria-label={Liferay.Language.get('view-asset')}
				borderless
				data-testid="view-asset-button"
				displayType="secondary"
				onClick={() => {
					openModal({
						size: 'full-screen',
						title: item.name,
						url: formatActionURL(item.name, itemData.url as string),
					});
				}}
				symbol="view"
				title={Liferay.Language.get('open-asset')}
			/>
		);
	}

	return (
		<ClayLink
			borderless
			button
			displayType="tertiary"
			href={itemData.url}
			target="_blank"
		>
			<ClayIcon symbol="shortcut" />
		</ClayLink>
	);
};

const DetailedAssetUsageModal: React.FC<IDetailedAssetUsageModalProps> = ({
	item,
}) => {
	return (
		<div className="cms-detailed-asset-usage-modal">
			<ClayModal.Header>
				{sub(Liferay.Language.get('usages-of-x'), `"${item.name}"`)}
			</ClayModal.Header>

			<ClayModal.Body>
				<FrontendDataSet
					apiURL={`/o/headless-cms/v1.0/asset-usages/${item.classPK}`}
					customRenderers={{
						tableCell: [
							{
								component: ({itemData}) => (
									<ViewButton
										item={item}
										itemData={itemData}
									/>
								),
								name: 'viewButton',
								type: 'internal',
							},
						],
					}}
					id="asset-usages-table"
					pagination={{
						deltas: [{label: 20}, {label: 40}, {label: 60}],
						initialDelta: 20,
					}}
					showManagementBar
					showPagination
					showSearch
					sorts={[
						{
							active: true,
							direction: 'desc',
							key: 'name',
							label: Liferay.Language.get('name'),
						},
					]}
					views={[
						{
							contentRenderer: 'table',
							default: true,
							label: Liferay.Language.get('table'),
							name: 'table',
							schema: {
								fields: [
									{
										fieldName: 'name',
										label: Liferay.Language.get('name'),
										sortable: true,
									},
									{
										fieldName: 'type',
										label: Liferay.Language.get('type'),
										sortable: false,
									},
									{
										contentRenderer: 'viewButton',
										fieldName: 'view',
										label: '',
									},
								],
							},
							thumbnail: 'table',
						},
					]}
				/>
			</ClayModal.Body>
		</div>
	);
};

export {DetailedAssetUsageModal};
