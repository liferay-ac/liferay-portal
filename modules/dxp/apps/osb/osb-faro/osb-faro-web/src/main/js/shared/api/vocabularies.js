import sendRequest from 'shared/util/request';

export function search({channelId, delta = 12, groupId, keywords = '', page = 1}) {
	return sendRequest({
		data: {channelId, cur: page, delta, keywords},
		method: 'GET',
		path: `contacts/${groupId}/asset-summary-vocabularies`
	});
}
