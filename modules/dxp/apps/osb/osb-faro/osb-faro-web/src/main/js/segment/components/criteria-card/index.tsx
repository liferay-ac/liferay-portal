import * as API from 'shared/api';
import CriteriaView from './CriteriaView';
import Label from 'shared/components/Label';
import Panel from '@clayui/panel';
import React, {useContext, useEffect, useMemo} from 'react';
import {createVocabularyProperty} from 'segment/segment-editor/dynamic/utils/utils';
import {
	CustomFunctionOperators,
	NotOperators
} from 'segment/segment-editor/dynamic/utils/constants';
import {ReferencedObjectsContext} from 'segment/segment-editor/dynamic/context/referencedObjects';
import {ReportContainer} from 'shared/components/download-report/DownloadPDFReport';
import {SegmentTypes} from 'shared/util/constants';
import {translateQueryToCriteria} from 'segment/segment-editor/dynamic/utils/odata';
import {useDownloadReportContext} from 'shared/components/download-report/DownloadReportContext';

const VOCABULARY_OPERATORS = new Set([
	CustomFunctionOperators.VocabulariesFilter,
	NotOperators.NotVocabulariesFilter
]);

function extractVocabularyIds(criteria: any): string[] {
	if (!criteria) return [];

	if (criteria.items) {
		return criteria.items.flatMap(extractVocabularyIds);
	}

	if (criteria.propertyName && VOCABULARY_OPERATORS.has(criteria.operatorName)) {
		return [criteria.propertyName];
	}

	return [];
}

interface ICriteriaCardProps {
	channelId?: string;
	criteriaString: string;
	groupId?: string;
	includeAnonymousUsers: boolean;
	segmentType: SegmentTypes;
	sequential: boolean;
	timeZoneId: string;
}

const CriteriaCard: React.FC<ICriteriaCardProps> = ({
	channelId,
	criteriaString,
	groupId,
	includeAnonymousUsers,
	segmentType,
	sequential,
	timeZoneId
}) => {
	const _criteriaViewRef = React.createRef<HTMLDivElement>();

	const {clearReportContainers, setReportContainer} =
		useDownloadReportContext();

	const {addProperty} = useContext(ReferencedObjectsContext);

	const criteria = useMemo(
		() => translateQueryToCriteria(criteriaString),
		[criteriaString]
	);

	useEffect(() => {
		setReportContainer(ReportContainer.SegmentCriteriaCard);

		return clearReportContainers;
	}, []);

	useEffect(() => {
		if (!channelId || !groupId || !addProperty) return;

		const vocabularyIds = extractVocabularyIds(criteria);

		if (!vocabularyIds.length) return;

		API.vocabularies
			.search({channelId, delta: 500, groupId, page: 1})
			.then(
				(result: {items: Array<{id: string; name: string}>}) => {
					(result.items ?? []).forEach(({id, name}) => {
						if (vocabularyIds.includes(id)) {
							addProperty(createVocabularyProperty({id, name}));
						}
					});
				}
			);
	}, [channelId, groupId, criteria]);

	return (
		<Panel
			className='card-root'
			collapsable
			defaultExpanded
			displayTitle={
				<Panel.Title className='card-title'>
					{Liferay.Language.get('segment-criteria')}
				</Panel.Title>
			}
			id={ReportContainer.SegmentCriteriaCard}
		>
			<Panel.Body className='criteria-card-root'>
				{includeAnonymousUsers && (
					<Label display='info' size='lg' uppercase>
						{Liferay.Language.get('includes-anonymous-individuals')}
					</Label>
				)}

				{segmentType === SegmentTypes.RealTime && sequential && (
					<Label display='info' size='lg' uppercase>
						{Liferay.Language.get('sequential-events')}
					</Label>
				)}

				<CriteriaView
					criteria={criteria}
					ref={_criteriaViewRef}
					segmentType={segmentType}
					sequential={sequential}
					timeZoneId={timeZoneId}
				/>
			</Panel.Body>
		</Panel>
	);
};

export default CriteriaCard;
