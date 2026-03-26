import AudienceReportCard from 'shared/components/audience-report/AudienceReportBaseCard';
import ObjectEntryMetricCard from '../components/ObjectEntryMetricCard';
import React from 'react';
import {
	Accessor,
	AssetAppearsOnCard,
	EmptyStateLink,
	EmptyStateText
} from 'assets/components/AssetAppearsOnCard';
import {AssetTypes} from 'shared/util/constants';
import {MetricName} from 'shared/types/MetricName';
import {Name} from 'shared/components/audience-report/types';

const ObjectEntry = () => (
	<>
		<div className='row'>
			<div className='col-sm-12'>
				<ObjectEntryMetricCard
					label={Liferay.Language.get('visitors-behavior')}
				/>
			</div>
		</div>

		<div className='row'>
			<div className='col-sm-12'>
				<AudienceReportCard
					knownIndividualsTitle={Liferay.Language.get(
						'segmented-views'
					)}
					query={{
						metricName: MetricName.Views,
						name: Name.ObjectEntry
					}}
					uniqueVisitorsTitle={Liferay.Language.get('views')}
				/>
			</div>
		</div>

		<div className='row'>
			<div className='col-sm-12'>
				<AssetAppearsOnCard
					accessors={[
						Accessor.ImpressionMadeMetric,
						Accessor.ViewsMetric,
						Accessor.DownloadsMetric
					]}
					assetType={AssetTypes.ObjectEntry}
					emptyStateLink={EmptyStateLink.ObjectEntry}
					emptyStateText={EmptyStateText.ObjectEntry}
				/>
			</div>
		</div>
	</>
);

export default ObjectEntry;
