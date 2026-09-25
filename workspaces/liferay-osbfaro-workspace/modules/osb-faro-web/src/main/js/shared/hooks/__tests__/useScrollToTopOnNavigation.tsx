import React from 'react';
import {act, renderHook} from '@testing-library/react';
import {MemoryRouter, useNavigate} from 'react-router-dom';
import {useScrollToTopOnNavigation} from '../useScrollToTopOnNavigation';

jest.unmock('react-dom');

const renderNavigation = () =>
	renderHook(
		() => {
			useScrollToTopOnNavigation();

			return useNavigate();
		},
		{
			wrapper: ({children}) => (
				<MemoryRouter initialEntries={['/accounts/overview']}>
					{children}
				</MemoryRouter>
			),
		}
	);

describe('useScrollToTopOnNavigation', () => {
	let scrollTo: jest.SpyInstance;

	beforeEach(() => {
		scrollTo = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
	});

	afterEach(() => {
		scrollTo.mockRestore();
	});

	it('scrolls to the top when a new page is pushed', () => {
		const {result} = renderNavigation();

		scrollTo.mockClear();

		act(() => {
			result.current('/sites/pages/overview/page');
		});

		expect(scrollTo).toHaveBeenCalledWith(0, 0);
	});

	it('keeps the scroll position when only the query changes', () => {
		const {result} = renderNavigation();

		scrollTo.mockClear();

		act(() => {
			result.current('/accounts/overview?rangeKey=7');
		});

		expect(scrollTo).not.toHaveBeenCalled();
	});

	it('leaves back navigation to the browser', () => {
		const {result} = renderNavigation();

		act(() => {
			result.current('/sites/pages/overview/page');
		});

		scrollTo.mockClear();

		act(() => {
			result.current(-1);
		});

		expect(scrollTo).not.toHaveBeenCalled();
	});
});
