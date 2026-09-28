import {isSamePathname} from 'shared/util/router';
import {useMemo} from 'react';
import {useNavigate} from 'react-router-dom';

export interface IHistoryAdapter {
	goBack: () => void;
	push: (to: any, state?: unknown) => void;
	replace: (to: any, state?: unknown) => void;
}

function toNavigateArgs(
	to: any,
	state: unknown,
	replace: boolean
): [any, {preventScrollReset: boolean; replace: boolean; state?: unknown}] {

	// `<ScrollRestoration />` starts every navigation at the top. A query only
	// change, such as a filter or a page of results, keeps the reader where
	// they are. `window.location` is read at call time, so the adapter still
	// does not subscribe to the location.

	if (to && typeof to === 'object') {
		const {state: locationState, ...path} = to;

		return [
			path,
			{
				preventScrollReset: isSamePathname(
					path,
					window.location.pathname
				),
				replace,
				state: locationState ?? state,
			},
		];
	}

	return [
		to,
		{
			preventScrollReset: isSamePathname(to, window.location.pathname),
			replace,
			state,
		},
	];
}

/**
 * A v5-`history`-shaped adapter (`push`/`replace`/`goBack`) built on
 * `useNavigate`, with a stable identity that survives navigations. It
 * deliberately does NOT read `useLocation`: `useNavigate` is subscription-free
 * under the data router, so the ~18 imperative consumers (e.g. Toolbar,
 * Breadcrumbs) do not re-render on every navigation. Callers that need the
 * current location call `useLocation` themselves.
 */
export function useHistoryAdapter(): IHistoryAdapter {
	const navigate = useNavigate();

	return useMemo<IHistoryAdapter>(
		() => ({
			goBack: () => navigate(-1),
			push: (to, state) => navigate(...toNavigateArgs(to, state, false)),
			replace: (to, state) =>
				navigate(...toNavigateArgs(to, state, true)),
		}),
		[navigate]
	);
}
