import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import Form from 'shared/components/form';
import Input from 'shared/components/Input';
import React, {useState} from 'react';
import {close, modalTypes, open} from 'shared/actions/modals';
import {connect, ConnectedProps} from 'react-redux';

const connector = connect(null, {close, open});

type PropsFromRedux = ConnectedProps<typeof connector>;

const TagInput: React.FC<PropsFromRedux> = ({close, open}) => {
	const [showSelect, setShowSelect] = useState(false);

	const handleOpenModal = () => {
		open(modalTypes.CONFIRMATION_MODAL, {
			message: Liferay.Language.get('tag'),
			onClose: close,
			title: Liferay.Language.get('tag')
		});
	};

	if (!showSelect) {
		return (
			<Form.GroupItem shrink>
				<ClayButton
					className='add-tag-button'
					displayType='secondary'
					onClick={() => setShowSelect(true)}
				>
					<ClayIcon className='icon-root mr-2' symbol='plus' />

					{Liferay.Language.get('add-tag')}
				</ClayButton>
			</Form.GroupItem>
		);
	}

	return (
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
	);
};

export default connector(TagInput);
