import React from 'react';
import SyncedStripe, {getTitle} from '../SyncedStripe';
import {cleanup, render, screen} from '@testing-library/react';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn(),
}));

describe('SyncedStripe', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('should render', () => {
		const {container} = render(<SyncedStripe sitesSyncedCount={0} />);

		expect(container).toMatchSnapshot();
	});

	it.each`
		sitesSyncedCount
		${0}
		${1}
		${2}
	`(
		'returns correct text if sitesSyncedCount is $sitesSyncedCount',
		({sitesSyncedCount}) => {
			const {queryByText} = render(
				<SyncedStripe sitesSyncedCount={sitesSyncedCount} />
			);

			if (sitesSyncedCount === 1) {
				expect(
					queryByText(/^there is 1 site synced to this property\.$/i)
				).toBeInTheDocument();
			} else {
				expect(
					queryByText(
						`There are ${sitesSyncedCount} sites synced to this property.`
					)
				).toBeInTheDocument();
			}
		}
	);
});

describe('getTitle', () => {
	it.each`
		sitesSyncedCount
		${0}
		${1}
		${2}
	`(
		'returns correct text if sitesSyncedCount is $sitesSyncedCount',
		({sitesSyncedCount}) => {
			const title = getTitle(sitesSyncedCount);

			if (sitesSyncedCount === 1) {
				expect(title).toEqual('There is 1 site synced to this property.');
			} else {
				expect(title).toEqual(
					`There are ${sitesSyncedCount} sites synced to this property.`
				);
			}
		}
	);
});

describe('SyncedStripe product naming', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('shows the Analytics Cloud text for a non-LDP workspace', () => {
		render(<SyncedStripe sitesSyncedCount={1} />);

		expect(screen.getByText('Instance Settings > Analytics Cloud')).toBeInTheDocument();
	});

	it('shows the Liferay Data Platform text for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		render(<SyncedStripe sitesSyncedCount={1} />);

		expect(screen.getByText('Instance Settings > Liferay Data Platform')).toBeInTheDocument();
	});
});
