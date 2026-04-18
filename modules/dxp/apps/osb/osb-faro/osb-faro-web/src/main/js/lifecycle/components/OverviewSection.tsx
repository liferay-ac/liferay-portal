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
						description={Liferay.Language.get(
							'total-new-accounts-that-entered-the-pipeline-stage-within-the-selected-timeframe,-excluding-cross-sells,-upsells,-and-renewals.'
						)}
						loading={loading}
						renderTrendLabel={renderTrendLabel}
						title={Liferay.Language.get(
							'net-new-pipeline-generated'
						)}
						trend={progressedAccounts?.trend}
						trendClassName='text-lowercase'
						value={progressedAccounts?.value ?? 0}
					/>
				</div>
				<div className={cardContainerClassName}>
					<MetricCard
						bodyClassName={bodyClassName}
						description={Liferay.Language.get(
							'the-total-number-of-accounts-specifically-stuck-in-the-engaged-stage-that-have-exceeded-their-designated-time-in-stage-threshold-(>-90-days)'
						)}
						loading={loading}
						renderTrendLabel={renderTrendLabel}
						title={Liferay.Language.get('stalled-accounts')}
						trend={staticAccounts?.trend}
						trendClassName='text-lowercase'
						value={staticAccounts?.value ?? 0}
					/>
				</div>
				<div className={cardContainerClassName}>
					<MetricCard
						bodyClassName={bodyClassName}
						description={Liferay.Language.get(
							'customers-showing-a-drop-in-product-usage-or-warning-signs-of-churn.-requires-immediate-intervention.'
						)}
						loading={loading}
						renderTrendLabel={renderTrendLabel}
						title={Liferay.Language.get('at-risk-accounts')}
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
