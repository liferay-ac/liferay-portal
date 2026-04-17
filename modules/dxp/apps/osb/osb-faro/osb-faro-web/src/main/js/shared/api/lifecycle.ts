import sendRequest from 'shared/util/request';
import {RESTParams} from 'shared/types';

export async function fetchOverviewMetrics({groupId, query}: RESTParams) {
	return {
		atRiskAccounts: {
			trend: {
				percentage: 0,
				trendClassification: 'NEUTRAL'
			},
			value: 1
		},
		progressedAccounts: {
			trend: {
				percentage: 50,
				trendClassification: 'POSITIVE'
			},
			value: 15
		},
		staticAccounts: {
			trend: {
				percentage: -30,
				trendClassification: 'NEGATIVE'
			},
			value: 10
		}
	};

	// return sendRequest({
	// 	data: {
	// 		displayName: query
	// 	},
	// 	method: 'GET',
	// 	path: '/o/api/something'
	// });
}
