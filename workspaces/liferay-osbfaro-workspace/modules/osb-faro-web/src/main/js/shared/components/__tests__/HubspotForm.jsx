import HubspotForm from '../HubspotForm';
import React from 'react';
import {render} from '@testing-library/react';

describe('HubspotForm', () => {
	it('should render a hubspot div with id', () => {
		const {container} = render(<HubspotForm />);

		expect(container).toMatchSnapshot();
	});

	it('should append the hubspot script in the head of the document', () => {
		render(<HubspotForm />);

		expect(document.head.innerHTML).toContain(
			'<script src="//js.hsforms.net/forms/v2.js"></script>'
		);
	});
});
