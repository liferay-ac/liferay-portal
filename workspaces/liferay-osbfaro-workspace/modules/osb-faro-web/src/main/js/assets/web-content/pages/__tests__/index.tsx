import mockStore from 'test/mock-store';
import React from 'react';
import WebContent from '../index';
import {getMatchedRoute, Routes} from 'shared/util/router';
import {MemoryRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {render, screen} from '@testing-library/react';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

jest.unmock('react-dom');

jest.mock('shared/components/download-report/DownloadCSVReport', () => ({
	__esModule: true,
	default: () => null,
}));

jest.mock('shared/components/download-report/DownloadPDFReport', () => ({
	__esModule: true,
	default: () => null,
}));

jest.mock('shared/components/Loading', () => ({
	__esModule: true,
	default: () => null,
}));

jest.mock('shared/components/RouteNotFound', () => ({
	__esModule: true,
	default: () => null,
}));

jest.mock('route-middleware/BundleRouter', () => ({
	__esModule: true,
	default: () => null,
}));

jest.mock('shared/components/FilterByAccount', () => ({
	__esModule: true,
	default: ({assetType}: {assetType: string}) => (
		<div data-asset-type={assetType} data-testid="filter-by-account" />
	),
}));

jest.mock('shared/context/channel', () => ({
	useChannelContext: () => ({selectedChannel: {name: 'test channel'}}),
}));

jest.mock('shared/context/dataSources', () => ({
	useDataSources: () => ({empty: false}),
}));

jest.mock('shared/hooks/useQueryRangeSelectors', () => ({
	useQueryRangeSelectors: () => ({rangeKey: '30'}),
}));

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn(),
}));

jest.mock('shared/util/router', () => {
	const actual = jest.requireActual('shared/util/router');

	return {
		...actual,
		getMatchedRoute: jest.fn(
			() => actual.Routes.ASSETS_WEB_CONTENT_OVERVIEW
		),
	};
});

describe('WebContent', () => {
	const router = {
		params: {
			assetId: '123',
			channelId: '456',
			groupId: '789',
			title: 'Web Content Title',
			touchpoint: 'https://liferay.com/web-content',
			type: 'Web Content',
		},
	};

	beforeEach(() => {
		(getMatchedRoute as jest.Mock).mockReturnValue(
			Routes.ASSETS_WEB_CONTENT_OVERVIEW
		);
	});

	it('shows the account filter on the overview route for LDP workspaces', () => {
		(useLDPEnabled as jest.Mock).mockReturnValue(true);

		render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<WebContent className="" router={router as any} />
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByTestId('filter-by-account')).toHaveAttribute(
			'data-asset-type',
			'journal'
		);
	});

	it('hides the account filter on the overview route for non-LDP workspaces', () => {
		(useLDPEnabled as jest.Mock).mockReturnValue(false);

		render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<WebContent className="" router={router as any} />
				</MemoryRouter>
			</Provider>
		);

		expect(screen.queryByTestId('filter-by-account')).toBeNull();
	});
});
