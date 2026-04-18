import * as API from 'shared/api';
import * as breadcrumbs from 'shared/util/breadcrumbs';
import BasePage from 'shared/components/base-page';
import GlobalFilters from '../components/GlobalFilters';
import OverviewSection from '../components/OverviewSection';
import React, {useContext} from 'react';
import {ChannelContext} from 'shared/context/channel';
import {LifecycleContextProvider} from '../context/LifecycleContext';
import {useParams} from 'react-router-dom';
import {useRequest} from 'shared/hooks/useRequest';

const BaseLifecycle = () => {
	const {selectedChannel} = useContext(ChannelContext);

	const {channelId, groupId} = useParams();

	const {data: overviewData, loading: overviewLoading} = useRequest({
		dataSourceFn: API.lifecycle.fetchOverviewMetrics,
		variables: {
			groupId
		}
	});

	return (
		<LifecycleContextProvider>
			<BasePage documentTitle={Liferay.Language.get('lifecycles')}>
				<BasePage.Header
					breadcrumbs={[
						breadcrumbs.getHome({
							channelId,
							groupId,
							label: selectedChannel.name
						})
					]}
					groupId={groupId}
				>
					<BasePage.Row>
						<BasePage.Header.TitleSection
							className='mb-3'
							title={Liferay.Language.get('lifecycles')}
						/>
					</BasePage.Row>
				</BasePage.Header>
				<BasePage.SubHeader>
					<div className='d-flex justify-content-between w-100'>
						<GlobalFilters />
					</div>
				</BasePage.SubHeader>
				<BasePage.Body>
					<OverviewSection
						loading={overviewLoading}
						metrics={overviewData}
					/>
				</BasePage.Body>
			</BasePage>
		</LifecycleContextProvider>
	);
};

export default BaseLifecycle;
