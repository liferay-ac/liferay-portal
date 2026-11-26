import React from 'react';
import {cleanup, render, screen} from '@testing-library/react';
import {ReviewSyncedDataFragment} from '../ReviewSyncedDataFragment';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn()
}));

describe('ReviewSyncedDataFragment', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('points to the Analytics Cloud instance settings for a non-LDP workspace', () => {
		render(<ReviewSyncedDataFragment contactsSelected sitesSelected />);

		expect(
			screen.getByText(
				'Represents the sites synced from Liferay Portal, under DXP Instance Settings > Analytics Cloud.'
			)
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'Represents the fields synced from the Contact object within Liferay Portal, under DXP Instance Settings > Analytics Cloud.'
			)
		).toBeInTheDocument();
	});

	it('points to the Liferay Data Platform instance settings for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		render(<ReviewSyncedDataFragment contactsSelected sitesSelected />);

		expect(
			screen.getByText(
				'Represents the sites synced from Liferay Portal, under DXP Instance Settings > Liferay Data Platform.'
			)
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'Represents the fields synced from the Contact object within Liferay Portal, under DXP Instance Settings > Liferay Data Platform.'
			)
		).toBeInTheDocument();
	});
});
