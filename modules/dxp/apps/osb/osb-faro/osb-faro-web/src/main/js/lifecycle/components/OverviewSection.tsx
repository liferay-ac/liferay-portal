import Card from 'shared/components/Card';
import classNames from 'classnames';
import ClayIcon from '@clayui/icon';
import Loading from 'shared/components/Loading';
import React from 'react';
import {getIcon, getStatsColor} from 'shared/util/metrics';
import {isNil} from 'lodash';
import {Metric} from '../../contacts/pages/account/utils/types';
import {SectionHeader} from 'individual/profile/components/SectionHeader';
import {sub} from 'shared/util/lang';
import {Text} from '@clayui/core';
import {toRounded} from 'shared/util/numbers';
import {TrendClassification} from 'segment/types';

interface IOverviewSectionProps {
	metrics: {
		atRiskAccounts?: Metric;
		progressedAccounts?: Metric;
		staticAccounts?: Metric;
	};
	loading?: boolean;
}

interface ILifecycleStatusCardProps {
	className?: string;
	description: string;
	loading?: boolean;
	metrics?: Metric;
	title: String;
}

const LifecycleStatusCard: React.FC<ILifecycleStatusCardProps> = ({
	className,
	description,
	loading = false,
	metrics,
	title
}) => {
	if (loading) {
		return (
			<Card className={classNames(className, 'flex-fill p-3 w-100')}>
				<Card.Body>
					<Loading />
				</Card.Body>
			</Card>
		);
	}

	return (
		<Card className={classNames(className, 'flex-fill p-3 w-100')}>
			<Card.Title>
				<div className='text-uppercase text-weight-semi-bold'>
					<Text>{title}</Text>
				</div>
			</Card.Title>
			<Card.Body
				className='d-flex flex-column justify-content-around'
				noPadding
			>
				<div className='mt-1'>
					<Text color='secondary' size={3}>
						{description}
					</Text>
				</div>

				<span className='mt-3 text-lowercase text-weight-semi-bold'>
					<Text size={7}>{metrics?.value ?? 0}</Text>
				</span>

				<span className='text-lowercase text-secondary'>
					{!isNil(metrics?.trend?.trendClassification) &&
						metrics?.trend?.trendClassification !==
							TrendClassification.Neutral && (
							<ClayIcon
								style={{
									color: getStatsColor(
										metrics?.trend?.trendClassification
									)
								}}
								symbol={getIcon(metrics?.trend?.percentage)}
							/>
						)}
					{sub(
						Liferay.Language.get('x-vs-last-x-months'),
						[
							<span
								className='mr-1'
								key='percentage'
								style={{
									color:
										getStatsColor(
											metrics?.trend?.trendClassification
										) || TrendClassification.Neutral
								}}
							>
								{`${toRounded(
									Math.abs(metrics?.trend?.percentage ?? 0),
									2
								)}%`}
							</span>,
							3
						],
						false
					)}
				</span>
			</Card.Body>
		</Card>
	);
};

const OverviewSection: React.FC<IOverviewSectionProps> = ({
	loading = false,
	metrics
}) => {
	const atRiskAccounts = metrics?.atRiskAccounts;
	const progressedAccounts = metrics?.progressedAccounts;
	const staticAccounts = metrics?.staticAccounts;

	const cardContainerClassName = 'col-12 col-md-4 d-flex';

	return (
		<>
			<SectionHeader
				icon='box-container'
				title={Liferay.Language.get('overview')}
			/>
			<div className='row g-4'>
				<div className={cardContainerClassName}>
					<LifecycleStatusCard
						description='Accounts...'
						loading={loading}
						metrics={progressedAccounts}
						title={Liferay.Language.get('progressed-accounts')}
					/>
				</div>
				<div className={cardContainerClassName}>
					<LifecycleStatusCard
						description={Liferay.Language.get(
							'accounts-without-activities-for-the-past-three-months'
						)}
						loading={loading}
						metrics={staticAccounts}
						title={Liferay.Language.get('static-accounts')}
					/>
				</div>
				<div className={cardContainerClassName}>
					<LifecycleStatusCard
						description={Liferay.Language.get(
							'early-warning-system.-triggers-immediate-csm-rescue-before-the-client-asks-to-cancel'
						)}
						loading={loading}
						metrics={atRiskAccounts}
						title={Liferay.Language.get('at-risk')}
					/>
				</div>
			</div>
		</>
	);
};

export default OverviewSection;
