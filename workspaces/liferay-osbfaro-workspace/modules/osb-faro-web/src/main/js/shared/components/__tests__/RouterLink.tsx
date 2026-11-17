import ClayLink, {ClayLinkContext} from '@clayui/link';
import React from 'react';
import RouterLink, {asRouterLinkProps} from '../RouterLink';
import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter, useLocation} from 'react-router-dom';

jest.unmock('react-dom');

const renderLink = (href: string, ref: React.RefObject<HTMLAnchorElement>) =>
	render(
		<MemoryRouter>
			<ClayLinkContext.Provider value={RouterLink}>
				<ClayLink href={href} ref={ref}>
					{'Sites'}
				</ClayLink>
			</ClayLinkContext.Provider>
		</MemoryRouter>
	);

describe('RouterLink', () => {
	it('forwards the ref of a router link to its anchor', () => {
		const ref = React.createRef<HTMLAnchorElement>();

		renderLink('/workspace/23/sites', ref);

		expect(ref.current).toBe(screen.getByRole('link', {name: 'Sites'}));
		expect(ref.current).toHaveAttribute('href', '/workspace/23/sites');
	});

	it('forwards the ref of an external link to its anchor', () => {
		const ref = React.createRef<HTMLAnchorElement>();

		renderLink('https://www.liferay.com', ref);

		expect(ref.current).toBe(screen.getByRole('link', {name: 'Sites'}));
		expect(ref.current).toHaveAttribute('href', 'https://www.liferay.com');
	});

	it('hands the state of a link to the history entry it opens', () => {
		const LocationState = () => (
			<div data-testid="state">{JSON.stringify(useLocation().state)}</div>
		);

		render(
			<MemoryRouter>
				<ClayLinkContext.Provider value={RouterLink}>
					<ClayLink
						href="/campaigns"
						{...asRouterLinkProps({
							state: {campaignAccount: {id: '9', name: 'Acme'}},
						})}
					>
						{'Campaigns'}
					</ClayLink>
				</ClayLinkContext.Provider>

				<LocationState />
			</MemoryRouter>
		);

		fireEvent.click(screen.getByRole('link', {name: 'Campaigns'}));

		expect(screen.getByTestId('state')).toHaveTextContent(
			'{"campaignAccount":{"id":"9","name":"Acme"}}'
		);
	});
});
