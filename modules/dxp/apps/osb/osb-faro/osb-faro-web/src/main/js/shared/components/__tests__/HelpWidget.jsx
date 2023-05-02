import HelpWidget from '../HelpWidget';
import mockStore from 'test/mock-store';
import React from 'react';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

describe('HelpWidget', () => {
	xit('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<HelpWidget />
			</Provider>
		);
		expect(container).toMatchSnapshot();
	});

	xit('should render a dropdown', () => {
		const {getByText} = render(
			<Provider store={mockStore()}>
				<HelpWidget />
			</Provider>
		);
		expect(getByText('Report an Issue')).toBeTruthy();
	});
});
