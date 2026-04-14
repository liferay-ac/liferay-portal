import Card from 'shared/components/Card';
import ClayButton from '@clayui/button';
import ClayModal from '@clayui/modal';
import React from 'react';
import {useFrontendDataSet} from 'shared/hooks/useFrontendDataSet';

interface IExperienceModalProps {
	observer: any;
	onClose: () => void;
	onSelect: (id: string) => void;
	urlParams: {
		channelId: string;
		groupId: string;
		title: string;
		touchpoint: string;
	};
}

const ExperienceModal: React.FC<IExperienceModalProps> = ({
	observer,
	onClose,
	onSelect,
	urlParams
}) => {
	const {channelId, groupId, title, touchpoint} = urlParams;
	const FrontendDataSet = useFrontendDataSet();

	return (
		<ClayModal observer={observer} size='lg'>
			<ClayModal.Header>
				{Liferay.Language.get('select-experience')}
			</ClayModal.Header>
			<ClayModal.Body className='p-0'>
				<Card className='m-3'>
					{FrontendDataSet && (
						<FrontendDataSet
							apiURL={`/o/faro/main/${groupId}/page-experiences?canonicalUrl=${touchpoint}&pageTitle=${title}&channelId=${channelId}`}
							configInURLBehavior='off'
							customDataRenderers={{
								titleRenderer: ({itemData, value}: any) => (
									<ClayButton
										className='text-dark text-left w-100 p-0'
										displayType='link'
										onClick={() => {
											onSelect(String(itemData.id));
											onClose();
										}}
									>
										{value || itemData?.name}
									</ClayButton>
								)
							}}
							id='experienceTable'
							onSelectChange={(selectedItems: any) => {
								const items = Array.from(selectedItems);
								if (items.length > 0) {
									const item: any = items[0];
									const id = item.id || item.itemData?.id;
									if (id) {
										onSelect(String(id));
										onClose();
									}
								}
							}}
							pagination
							showPagination
							showSearch
							views={[
								{
									contentRenderer: 'table',
									default: true,
									label: Liferay.Language.get('table'),
									name: 'table',
									schema: {
										fields: [
											{
												_key: 'name',
												contentRenderer:
													'titleRenderer',
												fieldName: 'name',
												label: Liferay.Language.get(
													'name'
												),
												sortable: true,
												truncate: true
											}
										]
									}
								}
							]}
						/>
					)}
				</Card>
			</ClayModal.Body>
		</ClayModal>
	);
};

export default ExperienceModal;
