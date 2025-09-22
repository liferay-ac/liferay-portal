/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {openModal} from 'frontend-js-components-web';

import {AssetUsageListModal} from './AssetUsageListModal';
import {DetailedAssetUsageModal} from './DetailedAssetUsageModal';
import {BulkActionItem} from './types';

const openAssetUsageListModal = ({
	apiURL,
	itemsData,
	onDelete,
	selectAll,
}: {
	apiURL?: string;
	itemsData: ItemData[];
	onDelete: () => void;
	selectAll: boolean;
}) => {
	openModal({
		contentComponent: ({closeModal}: {closeModal: () => void}) =>
			AssetUsageListModal({
				apiURL,
				closeModal,
				itemsData,
				onDelete,
				selectAll,
			}) as React.JSX.Element,
		size: 'lg',
		status: 'danger',
	});
};

const openDetailedAssetUsageModal = ({
	item,
	onClose,
}: {
	item: BulkActionItem;
	onClose: () => void;
}) => {
	openModal({
		contentComponent: () =>
			DetailedAssetUsageModal({
				item,
			}) as React.JSX.Element,
		onClose,
		size: 'lg',
	});
};

export {openAssetUsageListModal, openDetailedAssetUsageModal};
