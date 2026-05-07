import DateFilterConjunctionDisplay from './DateFilterConjunctionDisplay';
import React from 'react';
import {
	APPLICATION_ID_ASSET_TYPE_MAP,
	EVENT_ID_EVENT_TYPE_MAP
} from 'segment/segment-editor/dynamic/utils/constants';
import {
	ASSET_TYPE_OPTIONS,
	EVENT_TYPE_OPTIONS,
	OCCURRENCE_OPTIONS
} from 'segment/segment-editor/dynamic/inputs/VocabularyInput';
import {CustomValue} from 'shared/util/records';
import {
	getFilterCriterionIMap,
	getIndexFromPropertyName
} from 'segment/segment-editor/dynamic/utils/custom-inputs';
import {getOperatorLabel, maybeFormatToKnownType} from '../utils';
import {IDisplayComponentProps} from '../types';

const VocabularyDisplay: React.FC<IDisplayComponentProps> = ({
	criterion,
	property
}) => {
	const {operatorName, value} = criterion;
	const {entityName, label, type} = property;

	const valueIMap = value as CustomValue | undefined;

	const operatorKey = maybeFormatToKnownType(operatorName ?? '', value);
	const operatorLabel = getOperatorLabel(operatorKey, type);

	const activityKeyIndex = valueIMap
		? getIndexFromPropertyName(valueIMap, 'activityKey')
		: -1;

	const activityKey =
		activityKeyIndex >= 0
			? (valueIMap?.getIn([
					'criterionGroup',
					'items',
					activityKeyIndex,
					'value'
			  ]) as string)
			: undefined;

	const [applicationId, eventId] = activityKey?.split('#') ?? [];

	const assetType = APPLICATION_ID_ASSET_TYPE_MAP[applicationId] ?? 'any';
	const eventType = eventId ? EVENT_ID_EVENT_TYPE_MAP[eventId] ?? 'all' : 'all';

	const occurrenceOperator = valueIMap?.get('operator') as string | null;
	const occurrenceCount = valueIMap?.get('value') as number | null;

	const eventTypeLabel =
		EVENT_TYPE_OPTIONS.find(({value}) => value === eventType)?.label ??
		eventType;

	const assetTypeLabel =
		ASSET_TYPE_OPTIONS.find(({value}) => value === assetType)?.label ??
		assetType;

	const occurrenceLabel =
		OCCURRENCE_OPTIONS.find(
			({value}) => value === (occurrenceOperator ?? 'any')
		)?.label ?? '';

	const dayIndex = valueIMap
		? getIndexFromPropertyName(valueIMap, 'day')
		: -1;

	const conjunctionCriterion =
		dayIndex >= 0
			? getFilterCriterionIMap(valueIMap!, dayIndex)?.toJS()
			: undefined;

	return (
		<>
			{entityName}

			<span>{operatorLabel}</span>

			<span>{Liferay.Language.get('triggered')}</span>

			<b>{eventTypeLabel}</b>

			<span>{Liferay.Language.get('on-the-vocabulary')}</span>

			<b>{label}</b>

			<span>{Liferay.Language.get('for-fragment')}</span>

			<b>{assetTypeLabel}</b>

			<span>{Liferay.Language.get('asset-type-fragment')}</span>

			<span>{occurrenceLabel}</span>

			{occurrenceCount !== null && (
				<>
					<b>{occurrenceCount}</b>

					<span>{Liferay.Language.get('times')}</span>
				</>
			)}

			<DateFilterConjunctionDisplay
				conjunctionCriterion={conjunctionCriterion}
			/>
		</>
	);
};

export default VocabularyDisplay;
