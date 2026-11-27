import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import 'jest-extended/all';
import {cleanup} from '@testing-library/react';
import lang from './lang';
import {TextDecoder, TextEncoder} from 'util';

// Temporarily silence console.error/warn in tests until the underlying
// deprecations (Apollo Client v3, react-dom/test-utils, graphql HOC/<Query />,
// cache merge policies) are addressed. See MIGRATION_PLAN.md, Phase 12.
// The `./pedantic` module remains available to re-enable the strict behavior
// (throw on any console.error/warn) once tests are clean.

console.error = jest.fn(); // eslint-disable-line no-console
console.warn = jest.fn(); // eslint-disable-line no-console

// Testing Library's auto cleanup misses files when runners skip isolation.

afterEach(cleanup);

// Every test runs against the mock API in shared/api/__mocks__; none unmock it.

jest.mock('shared/api');

// DocumentTitle swaps the favicon through the LDP check; three tests unmock it.

jest.mock('shared/components/DocumentTitle');

// The portal page puts this class on body, and popovers and tooltips portal
// into `body.dxp`, so tests exercise the lookup the portal takes.

document.body.className = 'dxp';

// Browser APIs jsdom lacks.

global.ResizeObserver = jest.fn().mockImplementation(() => ({
	disconnect: jest.fn(),
	observe: jest.fn(),
	unobserve: jest.fn(),
}));

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

// Globals the portal page provides. Almost every component calls
// Liferay.Language.get, and shared/util/pendo.ts calls the Pendo agent.

global.Liferay = {
	FeatureFlags: {},
	Language: {
		available: {
			en_US: 'English (United States)',
			es_ES: 'español (España)',
			ja_JP: '日本語 (日本)',
			pt_BR: 'português (Brasil)',
		},
		get: lang,
	},
	Util: {
		fetch: () =>
			Promise.resolve({
				json: () => Promise.resolve({items: []}),
			}),
	},
};

global.pendo = {
	initialize: () => {},
};
