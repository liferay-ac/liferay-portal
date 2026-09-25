import {useLayoutEffect, useRef} from 'react';
import {NavigationType, useLocation, useNavigationType} from 'react-router-dom';

/**
 * A client side navigation keeps the window scrolled where the previous page
 * left it. This hook starts every newly pushed page at the top and leaves back
 * and forward alone. Query only changes, such as filters and pagination, keep
 * the pathname, so they stay put.
 */
export const useScrollToTopOnNavigation = () => {
	const {pathname} = useLocation();
	const navigationType = useNavigationType();

	const previousPathnameRef = useRef(pathname);

	useLayoutEffect(() => {
		if (previousPathnameRef.current === pathname) {
			return;
		}

		previousPathnameRef.current = pathname;

		if (navigationType === NavigationType.Push) {
			window.scrollTo(0, 0);
		}
	}, [navigationType, pathname]);
};
