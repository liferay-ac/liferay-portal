import {getCurrentUserLanguageId} from 'shared/hooks/useCurrentUser';
import {LanguageIds} from 'shared/util/constants';
import store from 'shared/store';

export const DEFAULT_LANGUAGE_ID = LanguageIds.English;

export const SUPPORTED_LOCALES: Record<LanguageIds, string> = {
	[LanguageIds.English]: 'en-US',
	[LanguageIds.Japanese]: 'ja-JP',
	[LanguageIds.Portuguese]: 'pt-BR',
	[LanguageIds.Spanish]: 'es-ES',
};

export const DEFAULT_LOCALE = SUPPORTED_LOCALES[DEFAULT_LANGUAGE_ID];

/**
 * Clamps a portal languageId to one of the 4 languages the product
 * ships, falling back to DEFAULT_LANGUAGE_ID when it is missing or not
 * one of them. Use this when the consumer needs the portal languageId
 * itself (e.g. `applyTimeZone`'s moment-locale mapping); prefer
 * `resolveLocale`/`getLocale`/`useLocale` for Intl-style formatting.
 */
export function resolveLanguageId(languageId?: string | null): LanguageIds {
	return languageId && SUPPORTED_LOCALES[languageId as LanguageIds]
		? (languageId as LanguageIds)
		: DEFAULT_LANGUAGE_ID;
}

export function resolveLocale(languageId?: string | null): string {
	return SUPPORTED_LOCALES[resolveLanguageId(languageId)];
}

/**
 * Reads the current user's language preference straight from the Redux
 * store. Use this outside React components (module scope, PDF export);
 * components should prefer the `useLocale` hook instead.
 */
export function getLocale(): string {
	return resolveLocale(getCurrentUserLanguageId(store.getState()));
}
