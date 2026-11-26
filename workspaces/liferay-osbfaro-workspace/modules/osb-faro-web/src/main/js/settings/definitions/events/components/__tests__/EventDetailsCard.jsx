import * as data from 'test/data';
import EventDetailsCard from '../EventDetailsCard';
import mockStore from 'test/mock-store';
import React from 'react';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {range} from 'lodash';
import {MemoryRouter} from 'react-router';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn(() => false),
}));

describe('EventDetailsCard', () => {
	const eventAttributes = range(5).map(i =>
		data.mockEventAttributeDefinition(i)
	);

	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<EventDetailsCard
						eventAttributes={eventAttributes}
						eventName='viewArticle'
						groupId='23'
					/>
				</MemoryRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});

	it('should match the displayed code with the selected attributes', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<EventDetailsCard
						eventAttributes={eventAttributes}
						eventName='viewArticle'
						groupId='23'
					/>
				</MemoryRouter>
			</Provider>
		);

		fireEvent.click(container.querySelector('.clickable'));

		expect(container.querySelector('.copy-button')).toHaveAttribute(
			'data-clipboard-text',
			[
				"Analytics.track('viewArticle', {",
				"\n\t'name-1': 'samplevalue-1',",
				"\n\t'name-2': 'samplevalue-2',",
				"\n\t'name-3': 'samplevalue-3',",
				"\n\t'name-4': 'samplevalue-4',",
				'\n});'
			].join('')
		);
	});
});

describe('EventDetailsCard product naming', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('shows the Analytics Cloud text for a non-LDP workspace', () => {
		render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<EventDetailsCard
						eventAttributes={[]}
						eventName='viewArticle'
						groupId='23'
					/>
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByText(/^Use this script to start sending events to Analytics Cloud\./)).toBeInTheDocument();
	});

	it('shows the Liferay Data Platform text for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		render(
			<Provider store={mockStore()}>
				<MemoryRouter>
					<EventDetailsCard
						eventAttributes={[]}
						eventName='viewArticle'
						groupId='23'
					/>
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByText(/^Use this script to start sending events to Liferay Data Platform\./)).toBeInTheDocument();
	});
});
