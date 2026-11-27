import ClayButton from '@clayui/button';
import ClayModal from '@clayui/modal';
import ClayLink from '@clayui/link';
import React from 'react';
import type {Observer} from '@clayui/modal/lib/types';
import URLConstants from 'shared/util/url-constants';
import {sub} from 'shared/util/lang';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';
import {useParams} from 'react-router-dom';

const UnableDeletePropertyModal: React.FC<{
	observer: Observer;
	onClose: () => void;
}> = ({observer, onClose}) => {
	const {groupId = ''} = useParams();

	const ldpEnabled = useLDPEnabled({groupId});

	return (
		<ClayModal observer={observer} status="danger">
			<ClayModal.Header>
				{Liferay.Language.get('unable-to-delete-property')}
			</ClayModal.Header>

			<ClayModal.Body scrollable>
				<p className="text-secondary">
					{sub(
						ldpEnabled
							? Liferay.Language.get(
									'ensure-no-sites-are-assigned-to-it-before-deleting-a-property-in-liferay-data-platform'
								)
							: Liferay.Language.get(
									'ensure-no-sites-are-assigned-to-it-before-deleting-a-property'
								),
						[
							<ClayLink
								href={URLConstants.DeletePropertyDocumentation}
								key="URL"
								target="_blank"
							>
								{Liferay.Language.get(
									'access-our-documentation-to-learn-more'
								)}
							</ClayLink>,
						],
						false
					)}
				</p>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							className="button-root"
							displayType="danger"
							onClick={onClose}
						>
							{Liferay.Language.get('done')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
};

export default UnableDeletePropertyModal;
