import * as breadcrumbs from 'shared/util/breadcrumbs';
import BasePage from 'shared/components/base-page';
import Card from 'shared/components/Card';
import ClayLink from '@clayui/link';
import React from 'react';
// @ts-ignore
import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {Routes, toRoute} from 'shared/util/router';
import {toThousands} from 'shared/util/numbers';
import {useChannelContext} from 'shared/context/channel';
import {useParams} from 'react-router-dom';

const mapRoutes = {
	blog: Routes.ASSETS_BLOGS_OVERVIEW,
	document: Routes.ASSETS_DOCUMENTS_AND_MEDIA_OVERVIEW,
	form: Routes.ASSETS_FORMS_OVERVIEW,
	webContent: Routes.ASSETS_WEB_CONTENT_OVERVIEW
};

const List = () => {
	const {selectedChannel} = useChannelContext();
	const {channelId, groupId} = useParams();

	const customRenderers = {
		assetMetricRenderer: ({value}) => (
			<span>{toThousands(value.value)}</span>
		),
		assetTitleRenderer: ({itemData, value}) => {
			const assetTitle = value || itemData.id;
			const route = mapRoutes[itemData.assetType];

			if (route) {
				return (
					<ClayLink
						href={toRoute(`${route}?rangeKey=0`, {
							assetId: itemData.id,
							channelId,
							groupId,
							touchpoint: 'Any',
							...(assetTitle && {
								title: encodeURIComponent(assetTitle)
							})
						})}
						style={{color: '#000'}}
					>
						{value || itemData.id}
					</ClayLink>
				);
			}

			return <span>{value || itemData.id}</span>;
		}
	};

	const tableView = {
		contentRenderer: 'table',
		default: false,
		label: 'table',
		name: 'table',
		schema: {
			fields: [
				{
					contentRenderer: 'assetTitleRenderer',
					fieldName: 'assetTitle',
					label: Liferay.Language.get('title'),
					sortable: true,
					truncate: true
				},
				{
					fieldName: 'assetType',
					label: Liferay.Language.get('type'),
					sortable: true
				},
				{
					contentRenderer: 'assetMetricRenderer',
					fieldName: 'viewsMetric', // Removido o .value
					label: Liferay.Language.get('views'),
					sortable: true
				},
				{
					contentRenderer: 'assetMetricRenderer',
					fieldName: 'impressionsMetric', // Removido o .value
					label: Liferay.Language.get('impressions'),
					sortable: true
				},
				{
					contentRenderer: 'assetMetricRenderer',
					fieldName: 'downloadsMetric', // Removido o .value
					label: Liferay.Language.get('downloads'),
					sortable: true,
					visible: false
				}
			]
		},
		thumbnail: 'table'
	};

	const props = {
		apiURL: `/o/faro/contacts/${groupId}/asset-summary?channelId=${channelId}`,
		customDataRenderers: customRenderers,
		pagination: {
			deltas: [{label: 10}, {label: 20}, {label: 50}],
			initialDelta: 20,
			initialPageNumber: 1
		},
		showPagination: true,
		sorts: [
			{
				active: true,
				direction: 'asc',
				key: 'assetId',
				label: Liferay.Language.get('title')
			},
			{
				active: false,
				direction: 'asc',
				key: 'assetType',
				label: Liferay.Language.get('type')
			},
			{
				active: false,
				direction: 'desc',
				key: 'viewsMetric',
				label: Liferay.Language.get('views')
			},
			{
				active: false,
				direction: 'desc',
				key: 'impressionsMetric',
				label: Liferay.Language.get('impressions')
			},
			{
				active: false,
				direction: 'desc',
				key: 'downloadsMetric',
				label: Liferay.Language.get('downloads')
			}
		]
	};

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
			<BasePage.Body>
				<Card>
					<FrontendDataSet {...props} views={[tableView]} />
				</Card>
			</BasePage.Body>
		</BasePage>
	);
};

export default List;
