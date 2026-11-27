import Dashboard from '../index';
import DataSourcesProvider from 'shared/context/dataSources';
import React from 'react';
import {render} from 'test/render';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		channelId: '456',
		groupId: '123'
	})
}));

describe('Individuals Dashboard', () => {
	it('renders', () => {
		const {container} = render(
			<DataSourcesProvider groupId='123'>
				<Dashboard />
			</DataSourcesProvider>
		);

		expect(container).toMatchSnapshot();
	});
});
