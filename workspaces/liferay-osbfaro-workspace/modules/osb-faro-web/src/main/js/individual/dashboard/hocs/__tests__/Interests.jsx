import Interests from '../Interests';
import React from 'react';
import {mockIndividualInterestsReq} from 'test/graphql-data';
import {render} from 'test/render';
import {Routes} from 'shared/util/router';
import {waitForLoadingToBeRemoved} from 'test/helpers';

describe('Interests', () => {
	it('renders', async () => {
		const {getByText} = render(<Interests />, {
			apolloMocks: [
				mockIndividualInterestsReq(defaultVars => ({
					...defaultVars,
					id: undefined,
					keywords: '',
					size: 2
				}))
			],
			path: `${Routes.CONTACTS_INDIVIDUALS_INTERESTS}/*`,
			route: '/workspace/123/456/contacts/individuals/interests'
		});

		await waitForLoadingToBeRemoved(document.body);

		jest.runAllTimers();

		expect(getByText(/^interest topics$/i)).toBeInTheDocument();
	});
});
