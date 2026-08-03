jest.mock('shared/store', () => ({
	__esModule: true,
	default: {
		getState: jest.fn(),
	},
}));

import {
	DEFAULT_LANGUAGE_ID,
	DEFAULT_LOCALE,
	getLocale,
	resolveLanguageId,
	resolveLocale,
} from '../locale';
import {fromJS} from 'immutable';
import {LanguageIds} from 'shared/util/constants';
import store from 'shared/store';

describe('resolveLanguageId', () => {
	it.each([
		LanguageIds.English,
		LanguageIds.Japanese,
		LanguageIds.Portuguese,
		LanguageIds.Spanish,
	])('keeps %s unchanged', (languageId) => {
		expect(resolveLanguageId(languageId)).toBe(languageId);
	});

	it.each([null, undefined, '', 'de_DE', 'not-a-real-language'])(
		'falls back to the default language id for %p',
		(languageId) => {
			expect(resolveLanguageId(languageId)).toBe(DEFAULT_LANGUAGE_ID);
		}
	);
});

describe('resolveLocale', () => {
	it.each([
		[LanguageIds.English, 'en-US'],
		[LanguageIds.Japanese, 'ja-JP'],
		[LanguageIds.Portuguese, 'pt-BR'],
		[LanguageIds.Spanish, 'es-ES'],
	])('resolves %s to %s', (languageId, locale) => {
		expect(resolveLocale(languageId)).toBe(locale);
	});

	it.each([null, undefined, '', 'de_DE', 'not-a-real-language'])(
		'falls back to the default locale for %p',
		(languageId) => {
			expect(resolveLocale(languageId)).toBe(DEFAULT_LOCALE);
		}
	);
});

describe('getLocale', () => {
	const mockGetState = store.getState as jest.Mock;

	afterEach(() => {
		mockGetState.mockReset();
	});

	function mockState({
		currentUserId = '23',
		languageId,
	}: {
		currentUserId?: string;
		languageId?: string | null;
	}) {
		return fromJS({
			currentUser: {data: currentUserId},
			users: {
				[currentUserId]: {
					data: {languageId},
				},
			},
		});
	}

	it('resolves the locale from the current user languageId', () => {
		mockGetState.mockReturnValue(
			mockState({languageId: LanguageIds.Portuguese})
		);

		expect(getLocale()).toBe('pt-BR');
	});

	it('falls back to the default locale when the current user has no languageId set', () => {
		mockGetState.mockReturnValue(mockState({languageId: null}));

		expect(getLocale()).toBe(DEFAULT_LOCALE);
	});

	it('falls back to the default locale when the current user has an unsupported languageId', () => {
		mockGetState.mockReturnValue(mockState({languageId: 'de_DE'}));

		expect(getLocale()).toBe(DEFAULT_LOCALE);
	});
});
