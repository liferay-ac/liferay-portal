import {Property} from 'shared/util/records';
import {PropertyTypes} from '../constants';

const createAccountProperty = ({
	label,
	name,
	type
}: {
	label: string;
	name: string;
	type: PropertyTypes;
}): Property =>
	new Property({
		entityName: Liferay.Language.get('account'),
		label,
		name,
		propertyKey: 'account',
		type
	});

const ACCOUNT_PROPERTIES = [
	{
		label: Liferay.Language.get('annual-revenue'),
		name: 'annualRevenue',
		type: PropertyTypes.Number
	},
	{
		label: Liferay.Language.get('country'),
		name: 'country',
		type: PropertyTypes.Text
	},
	{
		label: Liferay.Language.get('created-date'),
		name: 'createdDate',
		type: PropertyTypes.Date
	},
	{
		label: Liferay.Language.get('currency-code'),
		name: 'currencyCode',
		type: PropertyTypes.Text
	},
	{
		label: Liferay.Language.get('customer-since'),
		name: 'customerSince',
		type: PropertyTypes.Date
	},
	{
		label: Liferay.Language.get('id'),
		name: 'accountId',
		type: PropertyTypes.Text
	},
	{
		label: Liferay.Language.get('last-activity-date'),
		name: 'lastActivityDate',
		type: PropertyTypes.Date
	},
	{
		label: Liferay.Language.get('industry'),
		name: 'industry',
		type: PropertyTypes.Text
	},
	{
		label: Liferay.Language.get('name'),
		name: 'accountName',
		type: PropertyTypes.Text
	},
	{
		label: Liferay.Language.get('number-of-employees'),
		name: 'numberOfEmployees',
		type: PropertyTypes.Number
	},
	{
		label: Liferay.Language.get('state'),
		name: 'state',
		type: PropertyTypes.Text
	},
	{
		label: Liferay.Language.get('type'),
		name: 'accountType',
		type: PropertyTypes.Text
	}
].map(createAccountProperty);

export default ACCOUNT_PROPERTIES;
