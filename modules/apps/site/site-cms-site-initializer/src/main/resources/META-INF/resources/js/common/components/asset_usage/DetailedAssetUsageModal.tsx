/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayModal from '@clayui/modal';
import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {sub} from 'frontend-js-web';
import React from 'react';

import {BulkActionItem} from './types';

interface IDetailedAssetUsageModalProps {
	item: BulkActionItem;
}

const DetailedAssetUsageModal: React.FC<IDetailedAssetUsageModalProps> = ({
	item,
}) => {
	return (
		<>
			<ClayModal.Header>
				{sub(Liferay.Language.get('usages-of-x'), `"${item.name}"`)}
			</ClayModal.Header>

			<ClayModal.Body>
				<FrontendDataSet
					apiURL={`/o/headless-cms/v1.0/asset-usages/${item.classPK}`}
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
								],
							},
							thumbnail: 'table',
						},
					]}
				/>
			</ClayModal.Body>
		</>
	);
};

export {DetailedAssetUsageModal};
