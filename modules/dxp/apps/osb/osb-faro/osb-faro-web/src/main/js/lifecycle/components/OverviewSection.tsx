import MetricCard from 'shared/components/MetricCard';
import React from 'react';
import {Metric} from '../../contacts/pages/account/utils/types';
import {SectionHeader} from 'individual/profile/components/SectionHeader';
import {sub} from 'shared/util/lang';

interface IOverviewSectionProps {
	loading?: boolean;
	metrics?: {
		atRiskAccounts?: Metric;
		progressedAccounts?: Metric;
		staticAccounts?: Metric;
	};
}

const renderTrendLabel = (percentageNode: React.ReactNode) =>
	sub(Liferay.Language.get('x-vs-last-x-months'), [percentageNode, 3], false);

const OverviewSection: React.FC<IOverviewSectionProps> = ({
	loading = false,
	metrics
}) => {
	const atRiskAccounts = metrics?.atRiskAccounts;
	const netNewPipelineGenerated = metrics?.progressedAccounts;
	const stalledAccounts = metrics?.staticAccounts;

	const cardContainerClassName = 'col-12 col-lg-4 d-flex';
	const bodyClassName = 'd-flex flex-column justify-content-around';

	const cards = [
		{
			description: Liferay.Language.get(
				'total-new-accounts-that-entered-the-pipeline-stage-within-the-selected-timeframe,-excluding-cross-sells,-upsells,-and-renewals.'
			),
			metric: netNewPipelineGenerated,
			title: Liferay.Language.get('net-new-pipeline-generated')
		},
		{
			description: Liferay.Language.get(
				'the-total-number-of-accounts-specifically-stuck-in-the-engaged-stage-that-have-exceeded-their-designated-time-in-stage-threshold-(>-90-days)'
			),
			metric: stalledAccounts,
			title: Liferay.Language.get('stalled-accounts')
		},
		{
			description: Liferay.Language.get(
				'customers-showing-a-drop-in-product-usage-or-warning-signs-of-churn.-requires-immediate-intervention.'
			),
			metric: atRiskAccounts,
			title: Liferay.Language.get('at-risk-accounts')
		}
	];

	return (
		<>
			<SectionHeader
				icon='box-container'
				title={Liferay.Language.get('overview')}
			/>
			<div className='row g-4'>
				{cards.map(({description, metric, title}) => (
					<div className={cardContainerClassName} key={title}>
						<MetricCard
							bodyClassName={bodyClassName}
							description={description}
							loading={loading}
							renderTrendLabel={renderTrendLabel}
							title={title}
							trend={metric?.trend}
							trendClassName='text-lowercase'
							value={metric?.value ?? 0}
						/>
					</div>
				))}
			</div>
		</>
	);
};

export default OverviewSection;
