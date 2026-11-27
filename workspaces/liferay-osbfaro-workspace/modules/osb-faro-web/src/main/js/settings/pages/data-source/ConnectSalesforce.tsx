import React from 'react';
import WizardPage, {Step} from 'settings/components/base-page/WizardPage';
import {Alert} from 'shared/types';
import {AssignIndividualsDataToPropertiesStep} from 'settings/components/salesforce/steps/AssignIndividualsDataToChannelsStep';
import {ConnectSalesforceStep} from 'settings/components/salesforce/steps/ConnectSalesforceStep';
import {sub} from 'shared/util/lang';
import {SyncSalesforceDataStep} from 'settings/components/salesforce/steps/SyncSalesforceDataStep';
import {updateSalesforce} from 'shared/api/data-source';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';
import {useParams} from 'react-router-dom';

const getSteps = (ldpEnabled: boolean): Step[] => [
	{
		content: (props: any) => <ConnectSalesforceStep {...props} />,
		description: Liferay.Language.get(
			'to-connect-your-data-source-with-liferay-data-platform-enter-their-url-the-client-id-and-secret'
		),
		title: Liferay.Language.get('connect-salesforce'),
	},
	{
		content: (props: any) => <SyncSalesforceDataStep {...props} />,
		description: ldpEnabled
			? (sub(
					Liferay.Language.get(
						'select-which-x-data-you-would-like-to-sync-to-liferay-data-platform'
					),
					[Liferay.Language.get('salesforce')]
				) as string)
			: Liferay.Language.get(
					'select-which-salesforce-data-you-would-like-to-sync-to-analytics-cloud'
				),
		title: sub(Liferay.Language.get('sync-x-data'), [
			Liferay.Language.get('salesforce'),
		]) as string,
	},
	{
		content: (props: any) => (
			<AssignIndividualsDataToPropertiesStep
				{...props}
				onSubmit={(dataSource) => {
					const accountsEnabled = dataSource.provider?.getIn([
						'accountsConfiguration',
						'enableAllAccounts',
					]);

					const contactsConfiguration = dataSource.provider?.get(
						'contactsConfiguration'
					);

					const individualsEnabled =
						contactsConfiguration?.get('enableAllContacts') &&
						contactsConfiguration?.get('enableAllLeads');

					if (accountsEnabled || individualsEnabled) {
						props.addAlert({
							alertType: Alert.Types.Success,
							message: Liferay.Language.get(
								'the-data-source-setup-is-now-complete,-and-you-will-begin-to-see-data-as-activities-occur-on-your-sites'
							),
						});
					}
					else {
						props.addAlert({
							alertType: Alert.Types.Success,
							message: Liferay.Language.get(
								'the-data-source-setup-has-finished'
							),
						});
					}
				}}
				updateDataSourceFn={
					updateSalesforce as (params: {
						[key: string]: any;
					}) => Promise<any>
				}
			/>
		),
		description: Liferay.Language.get(
			'properties-let-you-consolidate-data-from-individuals,-accounts,-campaigns,-and-sites-in-one-place.-an-individuals-data-is-available-in-every-property-they-are-assigned-to'
		),
		title: Liferay.Language.get('assign-individuals-data-to-properties'),
	},
];

const ConnectSalesforce = () => {
	const {groupId = ''} = useParams();

	const ldpEnabled = useLDPEnabled({groupId});

	return <WizardPage steps={getSteps(ldpEnabled)} />;
};

export default ConnectSalesforce;
