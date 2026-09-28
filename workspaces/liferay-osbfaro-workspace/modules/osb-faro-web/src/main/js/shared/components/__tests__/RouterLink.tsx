import React from 'react';
import RouterLink from '../RouterLink';
import {MemoryRouter} from 'react-router-dom';
import {render, screen} from '@testing-library/react';

jest.unmock('react-dom');

jest.mock('react-router-dom', () => {
	const actual = jest.requireActual('react-router-dom');

	return {
		...actual,
		Link: ({preventScrollReset, to, ...otherProps}: any) => (
			<a
				data-prevent-scroll-reset={String(preventScrollReset)}
				href={to}
				{...otherProps}
			/>
		),
	};
});

const renderLink = (href: string, props = {}) =>
	render(
		<MemoryRouter initialEntries={['/workspace/23/123/sites']}>
			<RouterLink href={href} {...props}>
				{'link'}
			</RouterLink>
		</MemoryRouter>
	);

describe('RouterLink', () => {
	it('resets the scroll for another pathname', () => {
		renderLink('/workspace/23/123/sites/pages');

		expect(screen.getByText('link')).toHaveAttribute(
			'data-prevent-scroll-reset',
			'false'
		);
	});

	it('keeps the scroll for a query only change', () => {
		renderLink('/workspace/23/123/sites?page=2');

		expect(screen.getByText('link')).toHaveAttribute(
			'data-prevent-scroll-reset',
			'true'
		);
	});

	it('renders an external link outside the router', () => {
		renderLink('https://www.liferay.com');

		const link = screen.getByText('link');

		expect(link).toHaveAttribute('href', 'https://www.liferay.com');
		expect(link).not.toHaveAttribute('data-prevent-scroll-reset');
	});
});
