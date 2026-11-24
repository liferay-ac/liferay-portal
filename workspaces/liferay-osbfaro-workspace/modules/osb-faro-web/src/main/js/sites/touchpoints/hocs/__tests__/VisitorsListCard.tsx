import VisitorsListCard from '../VisitorsListCard';
import React from 'react';
import {fireEvent, render} from 'test/render';

const MOCK_ROUTER = {
	params: {
		channelId: '456',
		groupId: '789',
	},
	query: {},
};

describe('VisitorsListCard', () => {
	it('shows an Accounts tab active by default and switches to the Known Individuals tab on click', () => {
		const {getByTestId, getByText} = render(
			<VisitorsListCard router={MOCK_ROUTER} />
		);

		expect(getByText(/^accounts$/i)).toBeTruthy();
		expect(getByText(/^known individuals$/i)).toBeTruthy();

		expect(getByTestId('accounts').className).toContain('active');
		expect(getByTestId('individuals').className).not.toContain('active');

		fireEvent.click(getByText(/^known individuals$/i));

		expect(getByTestId('individuals').className).toContain('active');
		expect(getByTestId('accounts').className).not.toContain('active');
	});
});
