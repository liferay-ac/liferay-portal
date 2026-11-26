import {buildLanguages} from '../buildLanguages';

describe('buildLanguages', () => {
	it('returns every key declared in the Languages contract', () => {
		const languages = buildLanguages('Acme');

		expect(Object.keys(languages).sort()).toEqual(
			[
				'connectDescription',
				'connectTitle',
				'endpointHelper',
				'endpointLabel',
				'tokenLabel',
			].sort()
		);
	});

	it('substitutes the display name in connect-related strings', () => {
		const languages = buildLanguages('Acme');

		expect(languages.connectTitle).toContain('Acme');
		expect(languages.connectDescription).toContain('Acme');
	});

	it('substitutes the display name in endpoint and token labels', () => {
		const languages = buildLanguages('Acme');

		expect(languages.endpointHelper).toContain('Acme');
		expect(languages.endpointLabel).toContain('Acme');
		expect(languages.tokenLabel).toContain('Acme');
	});

	it('returns string values for every key', () => {
		const languages = buildLanguages('Acme');

		Object.values(languages).forEach((value) => {
			expect(typeof value).toBe('string');
		});
	});

	it('names Liferay Data Platform, since every third-party connector requires an LDP plan', () => {
		const languages = buildLanguages('Acme');

		expect(languages.connectDescription).toBe(
			'Connect your Acme account to Liferay Data Platform to start importing data.'
		);
		expect(languages.endpointHelper).toBe(
			'This is the Liferay Data Platform URL that Acme will redirect to after a user authorizes the connection.'
		);
	});
});
