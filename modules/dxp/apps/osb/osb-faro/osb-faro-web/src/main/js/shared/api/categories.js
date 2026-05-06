import sendRequest from 'shared/util/request';

export function search({
	channelId,
	delta = 20,
	groupId,
	keywords = '',
	page = 1,
	vocabularyId = ''
}) {
	return sendRequest({
		data: {channelId, cur: page, delta, keywords, vocabularyId},
		method: 'GET',
		path: `contacts/${groupId}/asset-summary-categories`
	});
}
