/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {Text} from '@clayui/core';
import ClayEmptyState from '@clayui/empty-state';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayLabel from '@clayui/label';
import ClayList from '@clayui/list';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal from '@clayui/modal';
import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';
import classNames from 'classnames';
import {sub} from 'frontend-js-web';
import React, {useEffect, useRef, useState} from 'react';

import ApiHelper from '../../services/ApiHelper';
import {AssetIcon, MimeTypes} from '../AssetIcon';
import {BulkActionItem, BulkActionItemResponse} from './types';
import {openAssetUsageListModal, openDetailedAssetUsageModal} from './utils';

import '../../../../css/components/AssetUsageListModal.scss';

interface IAssetUsageListModalProps {
	apiURL?: string;
	closeModal: () => void;
	itemsData: ItemData[];
	onDelete: () => void;
	selectAll: boolean;
}

function buildQueryString(params: Record<string, string | string[]>) {
	const queryParams = Object.keys(params).sort();

	const queryString = queryParams
		.map((key) => {
			return `${encodeURIComponent(key)}=${encodeURIComponent(params[key] as string)}`;
		})
		.filter(Boolean)
		.join('&');

	return `?${queryString}`;
}

function getFilterFromApiURL(apiURL: string) {
	const queryIndex = apiURL.indexOf('?');

	if (queryIndex === -1) {
		return '';
	}

	const queryString = apiURL.slice(queryIndex + 1);
	const searchParams = new URLSearchParams(queryString);

	return searchParams.get('filter') ?? '';
}

const AssetUsageListModal: React.FC<IAssetUsageListModalProps> = ({
	apiURL = '',
	closeModal,
	itemsData,
	onDelete,
	selectAll,
}) => {
	const [data, setData] = useState<BulkActionItemResponse | null>(null);
	const [loading, setLoading] = useState(false);

	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);

	const inputSearchRef = useRef<HTMLInputElement>(null);

	const itemsDataRef = useRef(itemsData);

	useEffect(() => {
		itemsDataRef.current = itemsData;
	}, [itemsData]);

	useEffect(() => {
		const fetchUsageAssetData = async () => {
			const queryString = buildQueryString({
				filter: getFilterFromApiURL(apiURL),
				page: String(page),
				pageSize: String(pageSize),
				search,
			});

			const {data, error} = await ApiHelper.post<BulkActionItemResponse>(
				`/o/headless-cms/v1.0/bulk-action-item/preview${queryString}`,
				{
					bulkActionItems: !selectAll
						? itemsDataRef.current.map(
								({embedded, entryClassName}) => ({
									classExternalReferenceCode:
										embedded.externalReferenceCode,
									className: entryClassName,
									classPK: embedded.id,
									name: embedded.title,
								})
							)
						: [],
					selectAll,
					type: 'DeleteBulkAction',
				}
			);

			if (error) {
				console.error(error);
			}

			if (data) {
				setData(data);
			}

			setLoading(false);
		};

		fetchUsageAssetData();
	}, [apiURL, page, pageSize, search, selectAll]);

	let modalProps = {
		deleteButtonLabel: Liferay.Language.get('delete'),
		description: Liferay.Language.get(
			'some-items-are-being-used-in-other-assets-or-pages.-deleting-them-will-break-those-references-and-cause-broken-links-or-missing-content.-this-action-cannot-be-undone.-are-you-sure-you-want-to-continue'
		),
		title: sub(
			Liferay.Language.get('delete-x-items'),

			// It needs to check selectAll, because when it is set to true,
			// itemsData does not exist. Also, it cannot rely on data.totalCount,
			// since when a search returns no results, totalCount is zero

			selectAll ? Liferay.Language.get('all') : itemsData.length
		),
	};

	if (data && data.totalCount === 1) {
		modalProps = {
			deleteButtonLabel: Liferay.Language.get('delete-asset'),
			description: Liferay.Language.get(
				'this-item-is-being-used-in-other-assets-or-pages-deleting-it-will-break-those-references-and-cause-broken-links-or-missing-content-this-action-cannot-be-undone-are-you-sure-you-want-to-continue'
			),
			title: sub(
				Liferay.Language.get('delete-x'),
				`"${data.items[0].name}"`
			),
		};
	}

	const handleClearSearch = () => {
		setSearch('');

		inputSearchRef.current!.value = '';
		inputSearchRef.current!.focus();
	};

	const handleOpenDetailedAssetUsageModal = (item: BulkActionItem) => {
		closeModal();

		openDetailedAssetUsageModal({
			item,
			onClose: () =>
				openAssetUsageListModal({itemsData, onDelete, selectAll}),
		});
	};

	const multipleItems = itemsData.length > 1 || selectAll;

	return (
		<div className="cms-asset-usage-list-modal">
			<ClayModal.Header>{modalProps.title}</ClayModal.Header>

			<ClayModal.Body className="modal-body">
				<div className="mb-3">
					<Text>{modalProps.description}</Text>
				</div>

				{loading && <ClayLoadingIndicator />}

				{data && (
					<>
						{multipleItems && (
							<ClayForm
								onSubmit={(event) => {
									event.preventDefault();

									setSearch(
										inputSearchRef?.current?.value ?? ''
									);
								}}
							>
								<ClayInput.Group className="mb-4">
									<ClayInput.GroupItem>
										<ClayInput
											aria-label={Liferay.Language.get(
												'search'
											)}
											className="form-control input-group-inset input-group-inset-after"
											disabled={loading}
											name="search"
											placeholder={Liferay.Language.get(
												'search'
											)}
											ref={inputSearchRef}
											sizing="lg"
											type="text"
										/>

										<ClayInput.GroupInsetItem
											after
											tag="span"
										>
											{!!search && (
												<ClayButtonWithIcon
													aria-label={Liferay.Language.get(
														'clear'
													)}
													displayType="unstyled"
													onClick={() =>
														handleClearSearch()
													}
													onKeyDown={(event) => {
														if (
															event.key ===
															'Enter'
														) {
															handleClearSearch();
														}
													}}
													symbol="times-small"
												/>
											)}

											<ClayButtonWithIcon
												aria-label={Liferay.Language.get(
													'search'
												)}
												displayType="unstyled"
												symbol="search"
												type="submit"
											/>
										</ClayInput.GroupInsetItem>
									</ClayInput.GroupItem>
								</ClayInput.Group>
							</ClayForm>
						)}

						{!!search && multipleItems && (
							<ClayForm
								onSubmit={(event) => {
									event.preventDefault();

									handleClearSearch();
								}}
							>
								<ClayEmptyState
									className="mb-6 mt-0"
									description={Liferay.Language.get(
										'review-your-search-and-try-again'
									)}
									imgSrc={`${Liferay.ThemeDisplay.getPathThemeImages()}/states/search_state.svg`}
									imgSrcReducedMotion={`${Liferay.ThemeDisplay.getPathThemeImages()}/states/search_state_reduced_motion.svg`}
									title={Liferay.Language.get(
										'no-results-found'
									)}
								>
									<ClayButton
										displayType="secondary"
										type="submit"
									>
										{Liferay.Language.get('clear-search')}
									</ClayButton>
								</ClayEmptyState>
							</ClayForm>
						)}

						<ClayList
							className={classNames({
								'mb-0': !selectAll && data.totalCount === 1,
							})}
						>
							{data.items.map((item) => {
								const {attributes, classPK, name} = item;

								return (
									<ClayList.Item flex key={classPK}>
										<ClayList.ItemField>
											<AssetIcon
												mimeType={
													attributes.type === 'FOLDER'
														? MimeTypes.Folder
														: attributes.mimeType
												}
											/>
										</ClayList.ItemField>

										<ClayList.ItemField expand>
											<ClayList.ItemTitle>
												{name}
											</ClayList.ItemTitle>

											{attributes.type === 'ASSET' && (
												<>
													<ClayList.ItemText>
														{sub(
															Liferay.Language.get(
																'x-usages'
															),
															[attributes.usages]
														)}
													</ClayList.ItemText>

													<ClayList.ItemText>
														<ClayLabel
															displayType={
																attributes.deletionType ===
																'PERMANENT_DELETION'
																	? 'danger'
																	: 'secondary'
															}
														>
															{attributes.deletionType ===
															'PERMANENT_DELETION'
																? Liferay.Language.get(
																		'permanent-deletion'
																	)
																: Liferay.Language.get(
																		'recycle-bin'
																	)}
														</ClayLabel>
													</ClayList.ItemText>
												</>
											)}
										</ClayList.ItemField>

										<ClayList.ItemField>
											<ClayButtonWithIcon
												aria-label={
													attributes.type === 'ASSET'
														? Liferay.Language.get(
																'view-usages'
															)
														: Liferay.Language.get(
																'view-asset-list'
															)
												}
												className="border-0"
												disabled={!attributes.usages}
												displayType="secondary"
												onClick={() =>
													handleOpenDetailedAssetUsageModal(
														item
													)
												}
												onKeyDown={() =>
													handleOpenDetailedAssetUsageModal(
														item
													)
												}
												symbol={
													attributes.type === 'ASSET'
														? 'list-ul'
														: 'forms'
												}
												title={
													attributes.type === 'ASSET'
														? Liferay.Language.get(
																'view-usages'
															)
														: Liferay.Language.get(
																'view-asset-list'
															)
												}
											/>
										</ClayList.ItemField>
									</ClayList.Item>
								);
							})}
						</ClayList>

						{!!data.totalCount && multipleItems && (
							<ClayPaginationBarWithBasicItems
								active={page}
								activeDelta={pageSize}
								deltas={[20, 40, 60].map((size) => ({
									label: size,
								}))}
								disableEllipsis={
									data.totalCount / pageSize - 5 > 999
								}
								ellipsisBuffer={3}
								onActiveChange={(page: number) => {
									if (
										data &&
										page >= 1 &&
										page <= data.lastPage
									) {
										setPage(page);
									}
								}}
								onDeltaChange={(delta) => {
									setPage(1);
									setPageSize(delta);
								}}
								showDeltasDropDown
								totalItems={data.totalCount}
							/>
						)}
					</>
				)}
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							onClick={closeModal}
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							displayType="danger"
							onClick={async () => {
								closeModal();

								onDelete();
							}}
						>
							{modalProps.deleteButtonLabel}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</div>
	);
};

export {AssetUsageListModal};
