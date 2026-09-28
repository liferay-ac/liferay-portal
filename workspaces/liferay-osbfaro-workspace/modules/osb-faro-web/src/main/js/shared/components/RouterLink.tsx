import React from 'react';
import {isSamePathname} from 'shared/util/router';
import {Link, useLocation} from 'react-router-dom';

interface IRouterLinkProps {
	children?: React.ReactNode;
	externalLink?: boolean;
	href?: string;
}

/**
 * Renders every `ClayLink` through the router. A link that only changes the
 * query, such as pagination or table sorting, keeps the scroll position that
 * `<ScrollRestoration />` would otherwise reset.
 */
const RouterLink: React.FC<IRouterLinkProps> = ({
	children,
	externalLink = false,
	href,
	...otherProps
}) => {
	const {pathname} = useLocation();

	if (href?.startsWith('http') || externalLink) {
		return (
			<a {...otherProps} href={href}>
				{children}
			</a>
		);
	}

	const to = href || '';

	return (
		<Link
			{...otherProps}
			preventScrollReset={isSamePathname(to, pathname)}
			to={to}
		>
			{children}
		</Link>
	);
};

export default RouterLink;
