import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import IndividualProfileCard from '../hoc/ProfileCard';
import React from 'react';
import StatesRenderer from 'shared/components/states-renderer/StatesRenderer';
import URLConstants from 'shared/util/url-constants';
import {connect} from 'react-redux';
import {Routes, toRoute} from 'shared/util/router';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {useDataSource} from 'shared/hooks/useDataSource';

const Overview = ({channelId, groupId, individual, tabId, timeZoneId}) => {
	const currentUser = useCurrentUser();
	const authorized = currentUser.isAdmin();
	const dataSourceStates = useDataSource();

	// Precisa mudar a logica de verificar se tem Data Source conectado pq o empty sempre retorna 'false'

	const items = dataSourceStates?.items || [];

	const isEmpty =
		dataSourceStates.empty ||
		items.length === 0 ||
		items[0]?.status !== 'ACTIVE';

	const processedStates = {
		...dataSourceStates,
		empty: isEmpty
	};

	return (
		<StatesRenderer {...processedStates}>
			<StatesRenderer.Loading />

			<StatesRenderer.Empty
				description={
					<>
						{authorized
							? Liferay.Language.get(
									'connect-a-data-source-containing-site-data'
							  )
							: Liferay.Language.get(
									'contact-an-administrator-to-connect-a-data-source-containing-site-data'
							  )}

						<ClayLink
							className='d-block mb-3'
							decoration='underline'
							href={URLConstants.DataSourceConnection}
							key='DOCUMENTATION'
							target='_blank'
						>
							{Liferay.Language.get(
								'learn-more-about-data-sources'
							)}

							<span className='inline-item inline-item-after'>
								<ClayIcon fontSize={8} symbol='shortcut' />
							</span>
						</ClayLink>

						{authorized && (
							<ClayLink
								button
								className='button-root mt-1'
								displayType='primary'
								href={toRoute(
									Routes.SETTINGS_DATA_SOURCE_LIST,
									{
										groupId
									}
								)}
							>
								{Liferay.Language.get('connect-data-source')}
							</ClayLink>
						)}
					</>
				}
				displayCard
				showIcon={false}
				title={Liferay.Language.get('no-site-data-synced')}
			/>

			<StatesRenderer.Success>
				<div className='overview-column-main'>
					<IndividualProfileCard
						channelId={channelId}
						entity={individual}
						groupId={groupId}
						tabId={tabId}
						timeZoneId={timeZoneId}
					/>
				</div>
			</StatesRenderer.Success>
		</StatesRenderer>
	);
};

export default connect((store, {groupId}) => ({
	timeZoneId: store.getIn([
		'projects',
		groupId,
		'data',
		'timeZone',
		'timeZoneId'
	])
}))(Overview);
