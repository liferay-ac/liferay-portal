import ClayButton from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import Form from 'shared/components/form';
import Input from 'shared/components/Input';
import React, {useState} from 'react';
import {close, modalTypes, open} from 'shared/actions/modals';
import {connect, ConnectedProps} from 'react-redux';

type CategorizationType = 'category' | 'vocabulary';

const CATEGORIZATION_OPTIONS: {label: string; value: CategorizationType}[] = [
	{label: Liferay.Language.get('vocabulary'), value: 'vocabulary'},
	{label: Liferay.Language.get('category'), value: 'category'}
];

const connector = connect(null, {close, open});

type PropsFromRedux = ConnectedProps<typeof connector>;

const CategorizationInput: React.FC<PropsFromRedux> = ({close, open}) => {
	const [selectedType, setSelectedType] = useState<CategorizationType>(
		'vocabulary'
	);
	const [showSelect, setShowSelect] = useState(false);

	const handleOpenModal = () => {
		open(modalTypes.CONFIRMATION_MODAL, {
			message: Liferay.Language.get('categorization'),
			onClose: close,
			title: Liferay.Language.get('categorization')
		});
	};

	if (!showSelect) {
		return (
			<Form.GroupItem shrink>
				<ClayButton
					className='add-categorization-button'
					displayType='secondary'
					onClick={() => setShowSelect(true)}
				>
					<ClayIcon className='icon-root mr-2' symbol='plus' />

					{Liferay.Language.get('add-categorization')}
				</ClayButton>
			</Form.GroupItem>
		);
	}

	const selectedOption = CATEGORIZATION_OPTIONS.find(
		({value}) => value === selectedType
	);

	return (
		<>
			<Form.GroupItem shrink>
				<ClayDropDown
					closeOnClick
					trigger={
						<ClayButton
							className='form-control form-control-select form-control-select-secondary'
							displayType='secondary'
						>
							{selectedOption?.label}
						</ClayButton>
					}
				>
					<ClayDropDown.ItemList>
						{CATEGORIZATION_OPTIONS.map(({label, value}) => (
							<ClayDropDown.Item
								active={selectedType === value}
								key={value}
								onClick={() => setSelectedType(value)}
							>
								{label}
							</ClayDropDown.Item>
						))}
					</ClayDropDown.ItemList>
				</ClayDropDown>
			</Form.GroupItem>

			<Form.GroupItem>
				<Input.Group className='select-entity-group'>
					<Input.GroupItem>
						<Input />
					</Input.GroupItem>

					<Input.Button
						displayType='secondary'
						onClick={handleOpenModal}
						position='append'
					>
						{Liferay.Language.get('select')}
					</Input.Button>
				</Input.Group>
			</Form.GroupItem>
		</>
	);
};

export default connector(CategorizationInput);
