/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import ClayLabel from '@clayui/label';
import ClayList from '@clayui/list';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal from '@clayui/modal';
import {fetch, sub} from 'frontend-js-web';
import React, {useEffect, useMemo, useState} from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {AssetUsageItem} from './AssetUsageItem';
import {
	Item,
	openDisplayUsagesModal,
	openMultipleAssetUsageModal,
	useFetchAssetDeletionOverview,
} from './utils';

import '../../../../css/components/MultipleAssetUsageModal.scss';

import {ClayInput} from '@clayui/form';
import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';

import {AssetIcon, MimeTypes} from '../AssetIcon';

// Mock de itens

const mockItems = [
	{
		deletionType: 'PERMANENT_DELETION',
		id: 1,
		mimeType: MimeTypes.DocumentText,
		name: 'Contrato',
		usages: 3,
	},
	{
		deletionType: 'RECYCLE_BIN',
		id: 2,
		mimeType: MimeTypes.DocumentImage,
		name: 'Banner',
		usages: 1,
	},
	{
		deletionType: 'PERMANENT_DELETION',
		id: 3,
		mimeType: MimeTypes.Blog,
		name: 'Blog',
		usages: 7,
	},
	{
		deletionType: 'RECYCLE_BIN',
		id: 4,
		mimeType: MimeTypes.KnowledgeBase,
		name: 'Artigo',
		usages: 0,
	},
];

interface IMultipleAssetUsageModal {
	closeModal: () => void;
	itemsData: ItemData[];
	loadData?: () => {};
}

const MultipleAssetUsageModal: React.FC<IMultipleAssetUsageModal> = ({
	closeModal,
	itemsData,
	loadData,
}) => {
	const {data, loading} = useFetchAssetDeletionOverview(
		itemsData.map(({embedded: {id}}) => id)
	);

	const [search, setSearch] = useState('');
	const [activePage, setActivePage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(2);

	// filtrar itens pelo saerch

	const filteredItems = useMemo(() => {
		return mockItems.filter((item) =>
			item.name.toLowerCase().includes(search.toLowerCase())
		);
	}, [search]);

	// calcular itens da pagina atual

	const paginatedItems = useMemo(() => {
		const start = (activePage - 1) * itemsPerPage;
		const end = start + itemsPerPage;

		return filteredItems.slice(start, end);
	}, [filteredItems, activePage, itemsPerPage]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [selectedIds, setSelectedIds] = useState<number[]>(
		itemsData.map(({embedded: {id}}) => id)
	);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [alert, setAlert] = useState<{
		displayType: string;
		title: string;
	} | null>(null);

	useEffect(() => {
		if (!selectedIds.length) {
			setAlert({
				displayType: 'warning',
				title: Liferay.Language.get(
					'to-perform-this-action,-please-select-an-item-to-delete'
				),
			});
		}
		else {
			setAlert(null);
		}
	}, [selectedIds]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const itemsListUsingClassPK = useMemo(() => {
		if (!data?.items) {
			return [];
		}

		return data.items.map((item) => ({
			...item,
			id: item.classPK,
		}));
	}, [data]);

	if (!data) {
		return null;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleClickUsageItem = (item: Item) => {
		closeModal();

		openDisplayUsagesModal({
			item,
			onClose: () => openMultipleAssetUsageModal(itemsData, loadData),
		});
	};

	return (
		<>
			<ClayModal.Header>
				{sub(
					itemsData.length === 1
						? Liferay.Language.get('delete-1-item')
						: Liferay.Language.get('delete-x-items'),
					itemsData.length
				)}
			</ClayModal.Header>

			<ClayModal.Body className="modal-body">
				{loading && <ClayLoadingIndicator />}

				{!loading && !!paginatedItems.length && (
					<>
						<ClayInput.Group className="mb-4">
							<ClayInput.GroupItem>
								<ClayInput
									aria-label="Search"
									className="form-control input-group-inset input-group-inset-after"
									sizing="lg"
									type="text"
									value={search}
								/>

								<ClayInput.GroupInsetItem after tag="span">
									<ClayButtonWithIcon
										aria-label="Search"
										displayType="unstyled"
										symbol="search"
										type="submit"
									/>
								</ClayInput.GroupInsetItem>
							</ClayInput.GroupItem>
						</ClayInput.Group>

						<ClayList>
							{paginatedItems.map(
								({
									deletionType,
									id,
									mimeType,
									name,
									usages,
								}) => (
									<ClayList.Item flex key={id}>
										<ClayList.ItemField>
											<AssetIcon mimeType={mimeType} />
										</ClayList.ItemField>

										<ClayList.ItemField expand>
											<ClayList.ItemTitle>
												{name}
											</ClayList.ItemTitle>

											<ClayList.ItemText>
												{sub(
													Liferay.Language.get(
														'x-usages'
													),
													[usages]
												)}
											</ClayList.ItemText>

											<ClayList.ItemText>
												<ClayLabel
													displayType={
														deletionType ===
														'PERMANENT_DELETION'
															? 'danger'
															: 'secondary'
													}
												>
													{deletionType ===
													'PERMANENT_DELETION'
														? Liferay.Language.get(
																'permanent-deletion'
															)
														: Liferay.Language.get(
																'recycle-bin'
															)}
												</ClayLabel>
											</ClayList.ItemText>
										</ClayList.ItemField>

										<ClayList.ItemField>
											<ClayButtonWithIcon
												aria-label={Liferay.Language.get(
													'view-usages'
												)}
												className="border-0"
												displayType="secondary"
												symbol="list-ul"
												title={Liferay.Language.get(
													'view-usages'
												)}
											/>
										</ClayList.ItemField>
									</ClayList.Item>
								)
							)}
						</ClayList>

						<ClayPaginationBarWithBasicItems
							activeDelta={itemsPerPage}
							activePage={activePage}
							deltas={[{label: 2}, {label: 5}, {label: 10}]}
							ellipsisBuffer={2}
							onActiveChange={setActivePage}
							onDeltaChange={(delta) => {
								setItemsPerPage(delta);
								setActivePage(1);
							}}
							showDeltasDropDown
							totalItems={filteredItems.length}
						/>
					</>
				)}
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							onClick={() => closeModal()}
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							displayType="danger"
							onClick={async () => {
								closeModal();

								const bulkActionItems = itemsData.map(
									(item) => ({
										classExternalReferenceCode:
											item.embedded.externalReferenceCode,
										className: item.entryClassName,
										classPK: item.embedded.id,
										name: item.embedded.title,
									})
								);

								await fetch(
									'/o/headless-cms/v1.0/bulk-action',
									{
										body: JSON.stringify({
											bulkActionItems,
											selectAll: false,
											type: 'DeleteBulkAction',
										}),
										headers: {
											'Accept': 'application/json',
											'Content-Type': 'application/json',
											'x-csrf-token': Liferay.authToken,
										},
										method: 'POST',
									}
								);

								loadData?.();
							}}
						>
							{Liferay.Language.get('delete')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</>
	);
};

export {MultipleAssetUsageModal};
