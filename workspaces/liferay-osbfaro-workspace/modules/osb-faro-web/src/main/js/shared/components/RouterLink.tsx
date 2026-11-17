import React from 'react';
import {Link} from 'react-router-dom';

interface IRouterLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	externalLink?: boolean;
}

/**
 * Renders every `ClayLink` through React Router, except external links. The
 * ref reaches the anchor, which components such as `VerticalNav` rely on to
 * track keyboard focus.
 */
const RouterLink = React.forwardRef<HTMLAnchorElement, IRouterLinkProps>(
	({children, externalLink = false, href, ...otherProps}, ref) => {
		if (href?.startsWith('http') || externalLink) {
			return (
				<a {...otherProps} href={href} ref={ref}>
					{children}
				</a>
			);
		}

		return (
			<Link {...otherProps} ref={ref} to={href || ''}>
				{children}
			</Link>
		);
	}
);

export default RouterLink;

/**
 * `ClayLink` hands its extra props to the link it renders, which is a router
 * `Link` here, so `state` reaches it even though the Clay types do not declare
 * it. This keeps the cast in one place.
 */

export const asRouterLinkProps = (props: {state?: object}) => props as {};
