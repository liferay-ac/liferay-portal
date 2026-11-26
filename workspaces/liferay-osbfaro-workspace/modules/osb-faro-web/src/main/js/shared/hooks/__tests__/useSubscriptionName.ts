import {fromJS} from 'immutable';
import {getSubscriptionName} from 'shared/hooks/useSubscriptionName';
import {SubscriptionNames} from 'shared/util/subscriptions';

describe('getSubscriptionName', () => {
	it('returns the subscription name of the project', () => {
		const state = fromJS({
			projects: {
				23: {
					data: {
						faroSubscription: {
							name: SubscriptionNames.LiferayDataPlatform,
						},
					},
				},
			},
		});

		expect(getSubscriptionName(state, '23')).toBe(
			SubscriptionNames.LiferayDataPlatform
		);
	});

	it('returns null when the project is not loaded', () => {
		expect(getSubscriptionName(fromJS({projects: {}}), '23')).toBeNull();
	});
});
