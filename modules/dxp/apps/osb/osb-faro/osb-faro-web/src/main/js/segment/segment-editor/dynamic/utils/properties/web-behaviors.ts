import {AssetNames, AssetTypes} from 'shared/util/constants';
import {List} from 'immutable';
import {Property} from 'shared/util/records';
import {PropertyTypes} from '../constants';

const createWebProperty = ({
	entityType,
	label,
	name,
	type = PropertyTypes.Behavior
}: {
	entityType: AssetTypes;
	label: string;
	name: AssetNames;
	type?: PropertyTypes;
}): Property =>
	new Property({
		entityName: Liferay.Language.get('individual'),
		entityType,
		label,
		name,
		propertyKey: 'web',
		type
	});

const WEB_BEHAVIORS = List(
	[
		{
			entityType: AssetTypes.Asset,
			label: Liferay.Language.get('click'),
			name: AssetNames.Click
		},
		{
			entityType: AssetTypes.Asset,
			label: Liferay.Language.get('comment'),
			name: AssetNames.Comment
		},
		{
			entityType: AssetTypes.Asset,
			label: Liferay.Language.get('download'),
			name: AssetNames.Download
		},
		{
			entityType: AssetTypes.Asset,
			label: Liferay.Language.get('impression'),
			name: AssetNames.Impression
		},
		{
			entityType: AssetTypes.Asset,
			label: Liferay.Language.get('submit'),
			name: AssetNames.Submit
		},
		{
			entityType: AssetTypes.Asset,
			label: Liferay.Language.get('view-asset'),
			name: AssetNames.ViewAsset
		},
		{
			entityType: AssetTypes.WebPage,
			label: Liferay.Language.get('view-page'),
			name: AssetNames.ViewPage
		}
	].map(createWebProperty)
);

export default WEB_BEHAVIORS;
