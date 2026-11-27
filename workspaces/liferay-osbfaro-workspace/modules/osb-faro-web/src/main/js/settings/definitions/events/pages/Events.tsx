import BasePage from 'settings/components/base-page/BasePage';
import React from 'react';
import TabsCard from '../components/TabsCard';
import {getDefinitions} from 'shared/util/breadcrumbs';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

interface IEventsProps {
	groupId: string;
}

const Events: React.FC<IEventsProps> = ({groupId}) => {
	const ldpEnabled = useLDPEnabled({groupId});

	return (
		<BasePage
			breadcrumbItems={[
				getDefinitions({groupId}),
				{active: true, label: Liferay.Language.get('events')},
			]}
			pageDescription={
				ldpEnabled
					? Liferay.Language.get(
							'this-is-the-data-model-of-events-sent-to-liferay-data-platform'
						)
					: Liferay.Language.get(
							'this-is-the-data-model-of-events-sent-to-analytics-cloud'
						)
			}
			pageTitle={Liferay.Language.get('events')}
		>
			<TabsCard groupId={groupId} />
		</BasePage>
	);
};

export default Events;
