import PickerTriggerButton from 'shared/components/PickerTriggerButton';
import React from 'react';
import {Conjunctions} from '../utils/constants';
import {Option, Picker} from '@clayui/core';
import {sub} from 'shared/util/lang';

export const GROUP_OPERATOR_OPTIONS = [
	{label: Liferay.Language.get('all'), value: Conjunctions.And},
	{label: Liferay.Language.get('any'), value: Conjunctions.Or},
];

interface IGroupOperatorProps {
	conjunctionName: string;
	id: string;
	onChange: (conjunctionName: Conjunctions) => void;
}

/**
 * The same "All / Any of these criteria must be met" control the lifecycle
 * stage configuration uses to match its conditions.
 */
const GroupOperator: React.FC<IGroupOperatorProps> = ({
	conjunctionName,
	id,
	onChange,
}) => {
	const selectedOption =
		GROUP_OPERATOR_OPTIONS.find(({value}) => value === conjunctionName) ??
		GROUP_OPERATOR_OPTIONS[0];

	return (
		<div className="align-items-center c-gap-2 d-flex group-operator text-secondary">
			{sub(
				Liferay.Language.get('x-of-these-criteria-must-be-met'),
				[
					<Picker
						aria-label={Liferay.Language.get('match-logic')}
						as={PickerTriggerButton}
						id={id}
						items={GROUP_OPERATOR_OPTIONS}
						key="matchLogic"
						label={selectedOption.label}
						onSelectionChange={(value) =>
							onChange(value as Conjunctions)
						}
						selectedKey={selectedOption.value}
						size="xs"
					>
						{({label, value}) => <Option key={value}>{label}</Option>}
					</Picker>,
				],
				false
			)}
		</div>
	);
};

export default GroupOperator;
