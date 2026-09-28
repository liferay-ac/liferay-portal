jest.unmock('react-dom');

import {renderHook} from '@testing-library/react';
import {useHistoryAdapter} from '../useHistoryAdapter';
import {useNavigate} from 'react-router-dom';

jest.mock('react-router-dom', () => ({
	useNavigate: jest.fn(),
}));

describe('useHistoryAdapter', () => {
	const navigate = jest.fn();

	beforeEach(() => {
		(useNavigate as jest.Mock).mockReturnValue(navigate);

		window.history.pushState({}, '', '/workspace/23/123/sites');
	});

	afterEach(() => {
		navigate.mockReset();
	});

	it('resets the scroll when pushing another pathname', () => {
		const {result} = renderHook(() => useHistoryAdapter());

		result.current.push('/workspace/23/123/sites/pages');

		expect(navigate).toHaveBeenCalledWith('/workspace/23/123/sites/pages', {
			preventScrollReset: false,
			replace: false,
			state: undefined,
		});
	});

	it('keeps the scroll when pushing a query only change', () => {
		const {result} = renderHook(() => useHistoryAdapter());

		result.current.push('/workspace/23/123/sites?rangeKey=7');

		expect(navigate).toHaveBeenCalledWith(
			'/workspace/23/123/sites?rangeKey=7',
			{preventScrollReset: true, replace: false, state: undefined}
		);
	});

	it('keeps the scroll when replacing with a location object', () => {
		const {result} = renderHook(() => useHistoryAdapter());

		result.current.replace({search: '?page=2', state: {from: 'toolbar'}});

		expect(navigate).toHaveBeenCalledWith(
			{search: '?page=2'},
			{
				preventScrollReset: true,
				replace: true,
				state: {from: 'toolbar'},
			}
		);
	});
});
