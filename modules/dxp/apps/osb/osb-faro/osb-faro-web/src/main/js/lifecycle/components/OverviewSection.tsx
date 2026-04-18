import MetricCard from 'shared/components/MetricCard';
import React from 'react';
import {Metric} from '../../contacts/pages/account/utils/types';
import {SectionHeader} from 'individual/profile/components/SectionHeader';
import {sub} from 'shared/util/lang';

interface IOverviewSectionProps {
	metrics: {
		atRiskAccounts?: Metric;
		progressedAccounts?: Metric;
		staticAccounts?: Metric;
	};
	loading?: boolean;
}

const renderTrendLabel = (percentageNode: React.ReactNode) =>
	sub(Liferay.Language.get('x-vs-last-x-months'), [percentageNode, 3], false);

const OverviewSection: React.FC<IOverviewSectionProps> = ({
	loading = false,
	metrics
}) => {
	const atRiskAccounts = metrics?.atRiskAccounts;
	const progressedAccounts = metrics?.progressedAccounts;
	const staticAccounts = metrics?.staticAccounts;

	const cardContainerClassName = 'col-12 col-lg-4 d-flex';
	const bodyClassName = 'd-flex flex-column justify-content-around';

	return (
		<>
			<SectionHeader
				icon='box-container'
				title={Liferay.Language.get('overview')}
			/>
			<div className='row g-4'>
				<div className={cardContainerClassName}>
					<MetricCard
						bodyClassName={bodyClassName}
						description='Accounts...'
						loading={loading}
						renderTrendLabel={renderTrendLabel}
						title={Liferay.Language.get('progressed-accounts')}
						trend={progressedAccounts?.trend}
						trendClassName='text-lowercase'
						value={progressedAccounts?.value ?? 0}
					/>
				</div>
				<div className={cardContainerClassName}>
					<MetricCard
						bodyClassName={bodyClassName}
						description={Liferay.Language.get(
							'accounts-without-activities-for-the-past-three-months'
						)}
						loading={loading}
						renderTrendLabel={renderTrendLabel}
						title={Liferay.Language.get('static-accounts')}
						trend={staticAccounts?.trend}
						trendClassName='text-lowercase'
						value={staticAccounts?.value ?? 0}
					/>
				</div>
				<div className={cardContainerClassName}>
					<MetricCard
						bodyClassName={bodyClassName}
						description={Liferay.Language.get(
							'early-warning-system.-triggers-immediate-csm-rescue-before-the-client-asks-to-cancel'
						)}
						loading={loading}
						renderTrendLabel={renderTrendLabel}
						title={Liferay.Language.get('at-risk')}
						trend={atRiskAccounts?.trend}
						trendClassName='text-lowercase'
						value={atRiskAccounts?.value ?? 0}
					/>
				</div>
			</div>
		</>
	);
};

export default OverviewSection;
