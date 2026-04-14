import ExperienceModal from './ExperienceModal';
import React, {useMemo, useState} from 'react';
import {ClayTooltipProvider} from '@clayui/tooltip';
import {fetchPageExperience} from 'shared/api/experiences';
import {Option, Picker, Text} from '@clayui/core';
import {truncateText} from 'shared/util/util';
import {useModal} from '@clayui/modal';
import {useParams} from 'react-router-dom';
import {useRequest} from 'shared/hooks/useRequest';

interface IExperienceItem {
	id: string | null;
	name: string;
	isMoreButton?: boolean;
	displayName?: string;
}

const ALL_EXPERIENCES_ITEM: IExperienceItem = {
	id: null,
	name: Liferay.Language.get('all-experiences')
};

interface IExperienceDropdownProps {
	onChange: (experienceId: string | null) => void;
}

const ExperienceDropdown: React.FC<IExperienceDropdownProps> = ({onChange}) => {
	const {channelId, groupId, title, touchpoint} = useParams();

	const [selectedKey, setSelectedKey] = useState<string>('null');
	const {observer, onOpenChange, open} = useModal();

	const {data} = useRequest({
		dataSourceFn: fetchPageExperience,
		variables: {
			canonicalUrl: touchpoint,
			channelId,
			groupId,
			pageTitle: title
		}
	});

	const displayItems = useMemo(() => {
		const apiItems: IExperienceItem[] = data?.items || [];
		const totalCount = data?.totalCount || apiItems.length;

		const topItems = apiItems.slice(0, 3);

		const isSelectedInBase = topItems.some(
			item => String(item.id) === selectedKey
		);
		const isAllSelected = selectedKey === 'null';

		const selectedItemOutOfBase =
			!isSelectedInBase && !isAllSelected && selectedKey !== 'more_button'
				? apiItems.find(item => String(item.id) === selectedKey)
				: null;

		const rawItems: IExperienceItem[] = [
			ALL_EXPERIENCES_ITEM,
			...(selectedItemOutOfBase ? [selectedItemOutOfBase] : []),
			...topItems
		];

		const uniqueItems = Array.from(
			new Map(rawItems.map(item => [String(item.id), item])).values()
		);

		if (totalCount > 3) {
			uniqueItems.push({
				id: 'more_button',
				isMoreButton: true,
				name: Liferay.Language.get('more-experiences')
			});
		}

		return uniqueItems.map(item => ({
			...item,
			displayName: item.isMoreButton
				? item.name
				: truncateText(item.name, 35, null)
		}));
	}, [data, selectedKey]);

	const selectedItem = useMemo(
		() => displayItems.find(item => String(item.id) === selectedKey),
		[displayItems, selectedKey]
	);

	const handleSelectionChange = (key: string) => {
		if (key === 'more_button') {
			onOpenChange(true);
		} else {
			const valueForBackend = key === 'null' ? null : key;

			setSelectedKey(key);
			onChange(valueForBackend);
		}
	};

	return (
		<ClayTooltipProvider>
			<div className='experience-dropdown'>
				<Picker
					aria-label={Liferay.Language.get('experience-selector')}
					className='border-light form-control-sm'
					items={displayItems}
					onSelectionChange={key =>
						handleSelectionChange(String(key))
					}
					selectedKey={selectedKey}
					triggerValue={selectedItem?.displayName}
				>
					{(item: IExperienceItem) => (
						<Option
							key={String(item.id)}
							textValue={item.displayName}
						>
							{item.isMoreButton ? (
								<div className='border-top pt-2 mt-n1'>
									<Text size={3}>{item.name}</Text>
								</div>
							) : (
								<span
									className={`pr-1 d-inline-block w-100 ${
										item.id === null
											? 'border-bottom pb-1'
											: ''
									}`}
									title={
										item.name.length > 35
											? item.name
											: undefined
									}
								>
									<Text size={3}>{item.displayName}</Text>
								</span>
							)}
						</Option>
					)}
				</Picker>

				{open && (
					<ExperienceModal
						observer={observer}
						onClose={() => onOpenChange(false)}
						onSelect={handleSelectionChange}
						urlParams={{
							channelId: channelId!,
							groupId: groupId!,
							title: title!,
							touchpoint: touchpoint!
						}}
					/>
				)}
			</div>
		</ClayTooltipProvider>
	);
};

export default ExperienceDropdown;
