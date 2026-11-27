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

	it.each`
		ldpEnabled | productName
		${false}   | ${'analytics cloud'}
		${true}    | ${'liferay data platform'}
	`(
		'points to the $productName instance settings when ldpEnabled is $ldpEnabled',
		({ldpEnabled, productName}) => {
			useLDPEnabled.mockReturnValue(ldpEnabled);

			render(<ReviewSyncedDataFragment contactsSelected sitesSelected />);

			expect(
				screen.getByText(
					new RegExp(
						`^represents the sites synced from liferay portal, under dxp instance settings > ${productName}\\.$`,
						'i'
					)
				)
			).toBeInTheDocument();
			expect(
				screen.getByText(
					new RegExp(
						`^represents the fields synced from the contact object within liferay portal, under dxp instance settings > ${productName}\\.$`,
						'i'
					)
				)
			).toBeInTheDocument();
		}
	);
});
