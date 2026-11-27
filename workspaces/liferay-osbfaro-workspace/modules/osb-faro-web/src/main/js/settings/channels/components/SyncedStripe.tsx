import getCN from 'classnames';
import React from 'react';
import {sub} from 'shared/util/lang';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';
import {useParams} from 'react-router-dom';

interface ISyncedStripeProps {
	sitesSyncedCount: number;
}

export function getTitle(sitesSyncedCount: number): string | any[] {
	if (sitesSyncedCount === 1) {
		return Liferay.Language.get('there-is-1-site-synced-to-this-property');
	}

	return sub(
		Liferay.Language.get('there-are-x-sites-synced-to-this-property'),
		[sitesSyncedCount]
	);
}

const SyncedStripe: React.FC<ISyncedStripeProps> = ({sitesSyncedCount}) => {
	const {groupId = ''} = useParams();

	const ldpEnabled = useLDPEnabled({groupId});

	return (
		<div
			className={getCN('sites-synced-stripe-root', {
				empty: !sitesSyncedCount,
			})}
		>
			<div className="title d-flex align-items-center">
				{getTitle(sitesSyncedCount)}
			</div>

			<div>
				{sub(
					Liferay.Language.get(
						'manage-sites-synced-to-this-property-by-going-to-x-in-your-dxp-instance'
					),
					[
						<b key="INSTANCE_SETTINGS">
							{ldpEnabled
								? Liferay.Language.get(
										'instance-settings-liferay-data-platform'
									)
								: Liferay.Language.get(
										'instance-settings-analytics-cloud'
									)}
						</b>,
					],
					false
				)}
			</div>
		</div>
	);
};

export default SyncedStripe;
