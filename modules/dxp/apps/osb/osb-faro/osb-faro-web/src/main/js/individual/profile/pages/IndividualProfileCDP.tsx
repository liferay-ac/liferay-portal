import * as API from 'shared/api';
import BaseDetails from 'contacts/pages/BaseDetails';
import Card from 'shared/components/Card';
import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import Loading from 'shared/components/Loading';
import NoResultsDisplay from 'shared/components/NoResultsDisplay';
import React from 'react';
import URLConstants from 'shared/util/url-constants';
import {Text as ClayText} from '@clayui/core';
import {Individual} from 'shared/util/records';
import {isNil} from 'lodash';
import {Routes, toRoute} from 'shared/util/router';
import {SectionHeader} from '../components/SectionHeader';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {useRequest} from 'shared/hooks/useRequest';

const fetchIndividualDetails = ({groupId, id}) =>
	API.individuals
		.fetchDetails({groupId, individualId: id})
		.then(({custom, demographics}) => {
			const retVal = {...demographics};

			Object.values(custom).forEach(([fieldMapping, ...others]) => {
				retVal[`custom-${fieldMapping.name}`] = [
					{
						...fieldMapping,
						sourceName: `[${Liferay.Language.get(
							'custom-field'
						)}] ${fieldMapping.sourceName}`
					},
					...others
				];
			});

			return retVal;
		});

interface IDetailsProps {
	groupId: string;
	individual: Individual;
}

const DetailsCard = ({className = '', description, loading, title, value}) => (
	<Card className={`w-100 ${className}`}>
		<Card.Header>
			<ClayText weight='semi-bold'>{title}</ClayText>
		</Card.Header>
		<Card.Body className='d-flex flex-column'>
			<span className='text-secondary'>{description}</span>
			<h2 className='mt-2 text-secondary'>{loading ? '...' : value}</h2>
		</Card.Body>
	</Card>
);

const DetailsCDPEmptyState = ({
	authorized,
	dataSourceData,
	dataSourceLoading,
	groupId
}) => {
	if (dataSourceLoading) {
		return (
			<NoResultsDisplay>
				<Loading key='LOADING' />
			</NoResultsDisplay>
		);
	}

	const sitesSelected = dataSourceData?.items[0]?.sitesSelected;

	const noSitesSelected = isNil(sitesSelected) || !sitesSelected;

	if (noSitesSelected) {
		return (
			<Card pageDisplay>
				<NoResultsDisplay
					description={
						<>
							{authorized
								? Liferay.Language.get(
										'connect-a-data-source-with-individuals-data-to-get-started'
								  )
								: Liferay.Language.get(
										'contact-an-administrator-to-connect-a-data-source-containing-individuals-data-to-get-started'
								  )}

							<ClayLink
								className='d-block mb-3'
								decoration='underline'
								href={
									URLConstants.ConnectLiferayDxpToAnalyticsCloud
								}
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
						</>
					}
					primary
					title={Liferay.Language.get('no-individual-data-synced')}
				>
					{authorized && (
						<ClayLink
							button
							className='button-root mt-1'
							displayType='primary'
							href={toRoute(Routes.SETTINGS_DATA_SOURCE_LIST, {
								groupId
							})}
						>
							{Liferay.Language.get('connect-data-source')}
						</ClayLink>
					)}
				</NoResultsDisplay>
			</Card>
		);
	}

	return null;
};

const IndividualProfileCDP: React.FC<IDetailsProps> = ({
	groupId,
	individual
}) => {
	const currentUser = useCurrentUser();
	const authorized = currentUser.isAdmin();

	const {data: dataSourceData, loading: dataSourceLoading} = useRequest({
		dataSourceFn: API.dataSource.search,
		variables: {delta: 1, groupId}
	});

	const {data: individualDetails, loading: detailsLoading} = useRequest({
		dataSourceFn: API.individuals.fetchDetails,
		variables: {groupId, individualId: individual.id}
	});

	const {attributesCount, sourcesCount} = React.useMemo(() => {
		if (!individualDetails) return {attributesCount: 0, sourcesCount: 0};

		const {custom = {}, demographics = {}} = individualDetails;

		const allFields = [
			...Object.values(demographics),
			...Object.values(custom)
		].flat();

		const uniqueSources = new Set(
			allFields.map(entry => entry.dataSourceId).filter(Boolean)
		);

		return {
			attributesCount: allFields.length,
			sourcesCount: uniqueSources.size
		};
	}, [individualDetails]);

	const sitesSelected = dataSourceData?.items[0]?.sitesSelected;

	if (!sitesSelected) {
		return (
			<DetailsCDPEmptyState
				authorized={authorized}
				dataSourceData={dataSourceData}
				dataSourceLoading={dataSourceLoading}
				groupId={groupId}
			/>
		);
	}

	return (
		<>
			<SectionHeader
				icon='fieldset'
				title={Liferay.Language.get('all-attributes')}
			/>

			<div className='d-flex flex-row justify-content-between'>
				<DetailsCard
					className='mr-2'
					description={Liferay.Language.get(
						'displays-the-total-count-of-data-sources-associated-with-this-profile'
					)}
					loading={detailsLoading}
					title={Liferay.Language.get('data-sources')}
					value={sourcesCount}
				/>

				<DetailsCard
					description={Liferay.Language.get(
						'displays-the-total-number-of-enriched-individual-attributes-for-this-profile'
					)}
					loading={detailsLoading}
					title={Liferay.Language.get('individual-attributes')}
					value={attributesCount}
				/>
			</div>

			<BaseDetails
				dataSourceFn={fetchIndividualDetails}
				groupId={groupId}
				id={individual.id}
			/>
		</>
	);
};

export default IndividualProfileCDP;
