import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

export type CampaignAccount = {
	id: string;
	name: string;
};

interface ICampaignAccountFilterContext {
	accountId?: string;
	accountName?: string;
	setAccount: (account: CampaignAccount | null) => void;
}

interface ICampaignAccountFilterProviderProps {
	children: React.ReactNode;
	initialAccount?: CampaignAccount | null;
}

const CampaignAccountFilterContext =
	createContext<ICampaignAccountFilterContext | null>(null);

/**
 * Holds the account filter of the Campaigns area in state, shared by the list
 * and the detail pages. It stays out of the URL, like the Lifecycle filters, so
 * a reload clears it.
 */

export const CampaignAccountFilterProvider: React.FC<
	ICampaignAccountFilterProviderProps
> = ({children, initialAccount = null}) => {
	const [account, setAccount] = useState<CampaignAccount | null>(
		initialAccount
	);

	const handleSetAccount = useCallback(
		(nextAccount: CampaignAccount | null) => setAccount(nextAccount),
		[]
	);

	const value = useMemo(
		() => ({
			accountId: account?.id,
			accountName: account?.name,
			setAccount: handleSetAccount,
		}),
		[account, handleSetAccount]
	);

	return (
		<CampaignAccountFilterContext.Provider value={value}>
			{children}
		</CampaignAccountFilterContext.Provider>
	);
};

export const useCampaignAccountFilter = (): ICampaignAccountFilterContext => {
	const context = useContext(CampaignAccountFilterContext);

	if (!context) {
		throw new Error(
			'useCampaignAccountFilter must be used within a CampaignAccountFilterProvider'
		);
	}

	return context;
};
