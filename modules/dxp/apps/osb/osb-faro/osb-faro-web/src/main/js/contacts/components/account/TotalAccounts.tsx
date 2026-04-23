import * as API from 'shared/api';
import MetricCard from 'shared/components/MetricCard';
import React from 'react';
import {Metric} from '../../pages/account/utils/types';
import {sub} from 'shared/util/lang';
import {useRequest} from 'shared/hooks/useRequest';

const renderAccountValue = (metric: Metric) =>
	sub(
		metric?.value === 1
			? Liferay.Language.get('x-account')
			: Liferay.Language.get('x-accounts'),
		[metric?.value ?? 0]
	);

const TotalAccounts = ({groupId}) => {
	const {data, loading} = useRequest({
		dataSourceFn: API.accounts.fetchMetrics,
		variables: {
			groupId
		}
	});

	const {activeCount, newCount, totalCount} = data || {};

	const renderTrendLabel = (percentageNode: React.ReactNode) =>
		sub(
			Liferay.Language.get('x-vs-previous-90-days'),
			[percentageNode],
			false
		);

	const cardContainerClassName = 'col-12 col-lg-4 d-flex';

	return (
		<div className='row g-4'>
			<div className={cardContainerClassName}>
				<MetricCard
					description={Liferay.Language.get(
						'displays-all-accounts-included-in-this-property'
					)}
					loading={loading}
					renderTrendLabel={renderTrendLabel}
					title={Liferay.Language.get('total-accounts')}
					trend={totalCount?.trend}
					value={renderAccountValue(totalCount)}
				/>
			</div>
			<div className={cardContainerClassName}>
				<MetricCard
					description={Liferay.Language.get(
						'displays-all-new-accounts-included-in-this-property'
					)}
					loading={loading}
					renderTrendLabel={renderTrendLabel}
					title={Liferay.Language.get('new-accounts')}
					trend={newCount?.trend}
					value={renderAccountValue(newCount)}
				/>
			</div>
			<div className={cardContainerClassName}>
				<MetricCard
					description={Liferay.Language.get(
						'displays-all-active-accounts-included-in-this-property'
					)}
					loading={loading}
					renderTrendLabel={renderTrendLabel}
					title={Liferay.Language.get('active-accounts')}
					trend={activeCount?.trend}
					value={renderAccountValue(activeCount)}
				/>
			</div>
		</div>
	);
};

export default TotalAccounts;
