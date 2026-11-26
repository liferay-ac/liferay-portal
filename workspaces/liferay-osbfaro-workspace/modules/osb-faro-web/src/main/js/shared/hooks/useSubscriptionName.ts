import {Map} from 'immutable';
import {useSelector} from 'react-redux';

type RootState = Map<string, any>;

export const getSubscriptionName = (
	state: RootState,
	groupId: string
): string | null =>
	state.getIn(
		['projects', groupId, 'data', 'faroSubscription', 'name'],
		null
	);

export const useSubscriptionName = ({
	groupId,
}: {
	groupId: string;
}): string | null =>
	useSelector((state: RootState) => getSubscriptionName(state, groupId));
