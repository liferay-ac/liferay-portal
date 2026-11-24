/**
 * Testing Library's custom render: import everything from here instead of
 * `@testing-library/react`, and `render` wraps the component in every app
 * provider, always:
 *
 *     import {render, screen} from 'test/render';
 *
 *     render(<List />, {
 *         path: `${Routes.CONTACTS_LIST_SEGMENT}/*`,
 *         route: '/workspace/23/123/contacts/segments',
 *     });
 *
 * - Redux: `mockStore()`; `storeData` uses `mockStore(storeData)` and `store`
 *   uses a ready store.
 * - Apollo: `MockedProvider` with no responses; `apolloMocks` (and
 *   `addTypename`) configure it. Never the real client.
 * - Router: `MemoryRouter` at `/`; `route` sets the URL (or a location with
 *   `state`), and `path` renders the component as the element of a matching
 *   `Route`, so `useParams` reads the URL.
 * - Channel: `mockChannelContext()`; `channel` provides another value.
 * - `wrapper` still works and sits innermost, for one-off contexts.
 *
 * Returns Testing Library's result plus the `store` it used. Components that
 * render their own router cannot sit inside the `MemoryRouter`; their tests
 * import `render` from `@testing-library/react`.
 */

import mockStore from 'test/mock-store';
import React from 'react';
import {MockedProvider, MockedResponse} from '@apollo/client/testing';
import {ChannelContext} from 'shared/context/channel';
import {InitialEntry, MemoryRouter, Route, Routes} from 'react-router-dom';
import {mockChannelContext} from 'test/mock-channel-context';
import {Provider} from 'react-redux';
import {
	render as testingLibraryRender,
	RenderOptions,
	RenderResult,
} from '@testing-library/react';
import {Store} from 'redux';

export * from '@testing-library/react';

export interface IRenderOptions extends RenderOptions {
	addTypename?: boolean;
	apolloMocks?: ReadonlyArray<MockedResponse>;
	channel?: React.ContextType<typeof ChannelContext>;
	path?: string;
	route?: InitialEntry;
	store?: Store;
	storeData?: unknown;
}

export function render(
	ui: React.ReactElement,
	{
		addTypename,
		apolloMocks = [],
		channel = mockChannelContext(),
		path,
		route = '/',
		store: storeOption,
		storeData,
		wrapper: InnerWrapper = React.Fragment,
		...renderOptions
	}: IRenderOptions = {}
): RenderResult & {store: Store} {
	const store: Store = storeOption ?? mockStore(storeData);

	const Wrapper = ({children}: {children: React.ReactNode}) => (
		<Provider store={store}>
			<MockedProvider addTypename={addTypename} mocks={apolloMocks}>
				<MemoryRouter initialEntries={[route]}>
					<ChannelContext.Provider value={channel}>
						<InnerWrapper>
							{path ? (
								<Routes>
									<Route element={children} path={path} />
								</Routes>
							) : (
								children
							)}
						</InnerWrapper>
					</ChannelContext.Provider>
				</MemoryRouter>
			</MockedProvider>
		</Provider>
	);

	return {
		...testingLibraryRender(ui, {...renderOptions, wrapper: Wrapper}),
		store,
	};
}
