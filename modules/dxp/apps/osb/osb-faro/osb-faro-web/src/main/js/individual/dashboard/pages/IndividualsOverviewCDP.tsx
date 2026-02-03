import BasePage from 'shared/components/base-page';
import React from 'react';
import {CSVType} from 'shared/components/download-report/utils';
import {DownloadStaticCSVReport} from 'shared/components/download-report/DownloadStaticCSVReport';
import {useDataSource} from 'shared/hooks/useDataSource';

const IndividualsOverviewCDP = () => {
	const dataSourceStates = useDataSource();

	return (
		<>
			<BasePage.SubHeader>
				<div className='d-flex justify-content-end w-100'>
					<DownloadStaticCSVReport
						disabled={dataSourceStates.empty}
						type={CSVType.Individual}
						typeLang={Liferay.Language.get('individuals')}
					/>
				</div>
			</BasePage.SubHeader>
		</>
	);
};

export default IndividualsOverviewCDP;
