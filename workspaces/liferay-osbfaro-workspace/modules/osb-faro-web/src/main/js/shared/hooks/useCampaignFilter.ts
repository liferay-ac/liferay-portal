import {
	CampaignFilterContext,
	ICampaignFilterContext,
} from 'shared/context/campaignFilter';
import {useContext} from 'react';

/**
 * Reads the campaign filter of the list the page belongs to. The filter is
 * held in state by a `CampaignFilterProvider`, not in the URL, and the pages
 * that render it share one provider with the profiles they open.
 */

export const useCampaignFilter = (): ICampaignFilterContext => {
	const context = useContext(CampaignFilterContext);

	if (!context) {
		throw new Error(
			'useCampaignFilter must be used within a CampaignFilterProvider'
		);
	}

	return context;
};
