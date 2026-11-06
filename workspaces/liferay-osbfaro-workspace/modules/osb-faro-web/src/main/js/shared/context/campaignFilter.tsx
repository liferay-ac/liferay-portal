import React, {createContext, useCallback, useMemo, useState} from 'react';

export type CampaignFilterCampaign = {
	id: string;
	name: string;
};

export interface ICampaignFilterContext {
	campaignId?: string;
	campaignName?: string;
	setCampaign: (campaign: CampaignFilterCampaign | null) => void;
}

interface ICampaignFilterProviderProps {
	children: React.ReactNode;
	initialCampaign?: CampaignFilterCampaign | null;
}

export const CampaignFilterContext =
	createContext<ICampaignFilterContext | null>(null);

/**
 * Holds the campaign filter of a list in state, shared by the list and the
 * profile pages it opens, so the filter survives going to a profile and back.
 * It stays out of the URL, like the Lifecycle filters, so a reload clears it.
 */

export const CampaignFilterProvider: React.FC<ICampaignFilterProviderProps> = ({
	children,
	initialCampaign = null,
}) => {
	const [campaign, setCampaignState] =
		useState<CampaignFilterCampaign | null>(initialCampaign);

	const setCampaign = useCallback(
		(nextCampaign: CampaignFilterCampaign | null) =>
			setCampaignState(nextCampaign),
		[]
	);

	const value = useMemo(
		() => ({
			campaignId: campaign?.id,
			campaignName: campaign?.name,
			setCampaign,
		}),
		[campaign, setCampaign]
	);

	return (
		<CampaignFilterContext.Provider value={value}>
			{children}
		</CampaignFilterContext.Provider>
	);
};
