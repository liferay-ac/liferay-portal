import * as API from 'shared/api';
import ErrorDisplay from 'shared/components/ErrorDisplay';
import Loading from 'shared/components/Loading';
import React from 'react';
import UtmParametersCard, {
	ICustomUtmParameter,
	UTM_PARAMETERS,
	UtmParameter,
	UtmParameters,
} from './UtmParametersCard';
import {camelCase, omit, pickBy} from 'lodash';
import {ICampaignAcquisitionProperty} from 'shared/api/campaigns';
import {RangeKeyTimeRanges} from 'shared/util/constants';
import {useQueryRangeSelectors} from 'shared/hooks/useQueryRangeSelectors';
import {useRequest} from 'shared/hooks/useRequest';

/**
 * The API names parameters as the URL does (`utm_source`), while the card
 * keys the five standard ones in camel case. Anything else goes through as a
 * custom parameter under its own name.
 */
export function toCardProps(properties: ICampaignAcquisitionProperty[]): {
	customParameters: ICustomUtmParameter[];
	utmParameters: UtmParameters;
} {
	const customParameters: ICustomUtmParameter[] = [];
	const utmParameters: UtmParameters = {};

	properties.forEach(({custom, name, values}) => {
		const parameter = camelCase(name) as UtmParameter;

		if (!custom && UTM_PARAMETERS.includes(parameter)) {
			utmParameters[parameter] = values;
		}
		else {
			customParameters.push({name, values});
		}
	});

	return {customParameters, utmParameters};
}

interface ICampaignUtmParametersProps {
	campaignId: string;
	channelId: string;
	groupId: string;
}

/**
 * Fetches on its own so the UTM parameters never hold up the rest of the
 * campaign detail page.
 */
const CampaignUtmParameters: React.FC<ICampaignUtmParametersProps> = ({
	campaignId,
	channelId,
	groupId,
}) => {
	const rangeQueryValues = pickBy(useQueryRangeSelectors());

	// `CUSTOM` is a client side sentinel the API answers with a 500, so a
	// custom range travels as its bounds alone.

	const {
		data: properties,
		error,
		loading,
		refetch,
	} = useRequest({
		dataSourceFn: API.campaigns.fetchCampaignAcquisitionProperties,
		variables: {
			channelId,
			groupId,
			id: campaignId,
			rangeQueryValues:
				rangeQueryValues.rangeKey === RangeKeyTimeRanges.CustomRange
					? omit(rangeQueryValues, 'rangeKey')
					: rangeQueryValues,
		},
	});

	if (loading) {
		return <Loading />;
	}
	else if (error) {
		return <ErrorDisplay onReload={refetch} spacer />;
	}

	return <UtmParametersCard {...toCardProps(properties ?? [])} />;
};

export default CampaignUtmParameters;
