import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

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

const STATE_KEY = 'campaignAccount';

/**
 * The router state a link carries to enter Campaigns with an account already
 * selected, such as the one on the account profile. It travels in the history
 * entry rather than in the URL.
 */

export const buildCampaignAccountState = (account: CampaignAccount) => ({
	[STATE_KEY]: account,
});

const getAccountFromState = (state: unknown): CampaignAccount | null => {
	const account = (
		state as {[STATE_KEY]?: Partial<CampaignAccount>} | null
	)?.[STATE_KEY];

	return typeof account?.id === 'string' && account.id
		? {id: account.id, name: account.name || account.id}
		: null;
};

const CampaignAccountFilterContext =
	createContext<ICampaignAccountFilterContext | null>(null);

/**
 * Holds the account filter of the Campaigns area in state, shared by the list
 * and the detail pages. It stays out of the URL, like the Lifecycle filters, so
 * a reload clears it. An account that a link carries in the router state is
 * taken once and then cleared from the history entry, so the reload does not
 * bring it back.
 */

export const CampaignAccountFilterProvider: React.FC<
	ICampaignAccountFilterProviderProps
> = ({children, initialAccount = null}) => {
	const location = useLocation();
	const navigate = useNavigate();

	const [account, setAccount] = useState<CampaignAccount | null>(
		() => getAccountFromState(location.state) ?? initialAccount
	);

	useEffect(() => {
		const accountFromState = getAccountFromState(location.state);

		if (accountFromState) {
			setAccount(accountFromState);

			navigate(
				{pathname: location.pathname, search: location.search},
				{replace: true, state: null}
			);
		}
	}, [location.pathname, location.search, location.state, navigate]);

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
