import * as breadcrumbs from 'shared/util/breadcrumbs';
import BasePage from 'shared/components/base-page';
import Card from 'shared/components/Card';
import ClayLink from '@clayui/link';
import React, {useState} from 'react';
import {DropdownRangeKey} from 'shared/components/dropdown-range-key/DropdownRangeKey';
import {pagination} from 'shared/util/frontend-data-set';
import {RangeSelectors} from 'shared/types';
import {Routes, toRoute} from 'shared/util/router';
import {toThousands} from 'shared/util/numbers';
import {useChannelContext} from 'shared/context/channel';
import {useFrontendDataSet} from 'shared/hooks/useFrontendDataSet';
import {useParams} from 'react-router-dom';
import {useQueryRangeSelectors} from 'shared/hooks/useQueryRangeSelectors';

const mapRoutes = {
	blog: Routes.ASSETS_BLOGS_OVERVIEW,
	document: Routes.ASSETS_DOCUMENTS_AND_MEDIA_OVERVIEW,
	form: Routes.ASSETS_FORMS_OVERVIEW,
	webContent: Routes.ASSETS_WEB_CONTENT_OVERVIEW
};

const List = () => {
	const {selectedChannel} = useChannelContext();
	const {channelId, groupId} = useParams();
	const initialRangeSelectors = useQueryRangeSelectors();

	const [rangeSelectors, setRangeSelectors] = useState<RangeSelectors>(
		initialRangeSelectors
	);

	const FrontendDataSet = useFrontendDataSet();

	let apiURL = `/o/faro/contacts/${groupId}/asset-summary?channelId=${channelId}&rangeKey=${rangeSelectors.rangeKey}`;

	if (rangeSelectors.rangeEnd) {
		apiURL += `&rangeEnd=${rangeSelectors.rangeEnd}`;
	}

	if (rangeSelectors.rangeStart) {
		apiURL += `&rangeStart=${rangeSelectors.rangeStart}`;
	}

	return (
		<BasePage documentTitle={Liferay.Language.get('assets')}>
			<BasePage.Header
				breadcrumbs={[
					breadcrumbs.getHome({
						channelId,
						groupId,
						label: selectedChannel?.name
					})
				]}
				groupId={groupId}
			>
				<BasePage.Header.TitleSection
					title={Liferay.Language.get('assets')}
				/>
			</BasePage.Header>

			<BasePage.SubHeader>
				<div className='d-flex justify-content-end w-100'>
					<DropdownRangeKey
						legacy={false}
						onRangeSelectorChange={setRangeSelectors}
						rangeSelectors={rangeSelectors}
					/>
				</div>
			</BasePage.SubHeader>

			<BasePage.Body>
				<Card>
					{FrontendDataSet && (
						<FrontendDataSet
							apiURL={apiURL}
							configInURLBehavior='off'
							customDataRenderers={{
								assetMetricRenderer: ({value}) => (
									<span>{toThousands(value.value)}</span>
								),
								assetTitleRenderer: ({itemData, value}) => {
									const assetTitle = value || itemData.id;
									const route =
										mapRoutes?.[itemData.assetType] ??
										Routes.ASSETS_OBJECT_ENTRY_OVERVIEW;

									return (
										<ClayLink
											href={toRoute(route, {
												assetId: itemData.id,
												channelId,
												groupId,
												touchpoint: 'Any',
												...(assetTitle && {
													title: encodeURIComponent(
														assetTitle
													)
												})
											})}
											style={{color: '#000'}}
										>
											{value || itemData.id}
										</ClayLink>
									);
								}
							}}
							filters={[
								{
									apiURL: `/o/faro/contacts/${groupId}/asset-summary-types?channelId=${channelId}&rangeKey=${rangeSelectors.rangeKey}`,
									entityFieldType: 'string',
									id: 'assetType',
									itemKey: 'name',
									itemLabel: 'name',
									label: Liferay.Language.get('type'),
									multiple: true,
									type: 'selection'
								}
							]}
							id='assetTable'
							pagination={pagination}
							showPagination
							views={[
								{
									contentRenderer: 'table',
									default: false,
									label: 'table',
									name: 'table',
									schema: {
										fields: [
											{
												contentRenderer:
													'assetTitleRenderer',
												fieldName: 'assetTitle',
												label: Liferay.Language.get(
													'title'
												),
												sortable: true,
												truncate: true
											},
											{
												fieldName: 'assetType',
												label: Liferay.Language.get(
													'type'
												),
												sortable: true
											},
											{
												contentRenderer:
													'assetMetricRenderer',
												fieldName: 'viewsMetric',
												label: Liferay.Language.get(
													'views'
												),
												sortable: true
											},
											{
												contentRenderer:
													'assetMetricRenderer',
												fieldName: 'impressionsMetric',
												label: Liferay.Language.get(
													'impressions'
												),
												sortable: true
											},
											{
												contentRenderer:
													'assetMetricRenderer',
												fieldName: 'downloadsMetric',
												label: Liferay.Language.get(
													'downloads'
												),
												sortable: true,
												visible: false
											}
										]
									},
									thumbnail: 'table',
									visibleFieldNames: {
										downloadsMetric: false
									}
								}
							]}
						/>
					)}
				</Card>
			</BasePage.Body>
		</BasePage>
	);
};

export default List;
