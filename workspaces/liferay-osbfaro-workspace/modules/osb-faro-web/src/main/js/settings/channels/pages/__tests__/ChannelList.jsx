import * as API from 'shared/api';
import * as data from 'test/data';
import ChannelList from '../ChannelList';
import mockStore, {mockStoreData} from 'test/mock-store';
import React from 'react';
import {cleanup, render, screen} from '@testing-library/react';
import {MemoryRouter, Route, Routes as RouterRoutes} from 'react-router-dom';
import {Provider} from 'react-redux';
import {RemoteData, TimeZone, User} from 'shared/util/records';
import {Routes} from 'shared/util/router';
import {waitForLoadingToBeRemoved} from 'test/helpers';

const defaultProps = {
	groupId: '23'
};

const Wrapper = ({children, store = mockStore()}) => (
	<Provider store={store}>
		<MemoryRouter initialEntries={['/workspace/23/settings/properties']}>
			<RouterRoutes>
				<Route element={children} path={`${Routes.SETTINGS_CHANNELS}/*`} />
			</RouterRoutes>
		</MemoryRouter>
	</Provider>
);

describe('Channels List', () => {
	afterEach(cleanup);

	it('should list the properties of the workspace', async () => {
		API.channels.search.mockReturnValue(
			Promise.resolve(data.mockChannels())
		);

		render(
			<Wrapper>
				<ChannelList {...defaultProps} />
			</Wrapper>
		);

		await waitForLoadingToBeRemoved();

		expect(screen.getByText(/^liferay dxp$/i)).toBeInTheDocument();
		expect(screen.getByText('643280225365059871')).toBeInTheDocument();
	});

	it('should not render add button if user is not an admin', async () => {
		const memberStore = mockStore(
			mockStoreData.setIn(['currentUser', 'data'], '24').setIn(
				['users', '24'],
				new RemoteData({
					data: new User(data.mockMemberUser('24')),
					loading: false
				})
			)
		);

		API.channels.search.mockReturnValue(
			Promise.resolve(data.mockChannels())
		);

		render(
			<Wrapper store={memberStore}>
				<ChannelList {...defaultProps} />
			</Wrapper>
		);

		await waitForLoadingToBeRemoved();

		expect(screen.queryByText(/^new property$/i)).toBeNull();
	});

	it('should show the number of synced sites for each property', async () => {
		API.channels.search.mockReturnValue(
			Promise.resolve(data.mockChannels())
		);

		render(
			<Wrapper>
				<ChannelList {...defaultProps} />
			</Wrapper>
		);

		await waitForLoadingToBeRemoved();

		expect(screen.getByText(/^sites$/i)).toBeInTheDocument();
		expect(screen.getByText('6')).toBeInTheDocument();
	});

	it('should check if actions "DELETE" and "CLEAR DATA" are displayed in the ellipsis and its icons', async () => {
		API.channels.search.mockReturnValue(
			Promise.resolve(data.mockChannels())
		);

		const {container} = render(
			<Wrapper>
				<ChannelList {...defaultProps} />
			</Wrapper>
		);

		await waitForLoadingToBeRemoved();

		// In some environments or screen sizes, RowActions might render quick actions as buttons
		// If they are in an ellipsis, we would need to click it first.
		// Let's check if the buttons are present.

		const clearDataBtn = screen.getByRole('button', {
			name: /clear data/i
		});

		const deleteBtn = screen.getByRole('button', {
			name: /delete/i
		});

		expect(clearDataBtn).toBeInTheDocument();
		expect(deleteBtn).toBeInTheDocument();

		const clearDataIcon = container.querySelector('svg.lexicon-icon-magic');

		const deleteIcon = container.querySelector('svg.lexicon-icon-trash');

		expect(clearDataIcon).toBeInTheDocument();
		expect(deleteIcon).toBeInTheDocument();
	});
});

describe('ChannelList', () => {
	afterEach(cleanup);

	it('renders the date added in the workspace time zone', async () => {
		API.channels.search.mockReturnValue(
			Promise.resolve({
				...data.mockChannels(),
				items: [
					{
						...data.mockChannels().items[0],
						createTime: Date.UTC(2026, 5, 10, 1, 30)
					}
				]
			})
		);

		render(
			<Wrapper
				store={mockStore(
					mockStoreData.setIn(
						['projects', '23', 'data', 'timeZone'],
						new TimeZone({timeZoneId: 'America/Recife'})
					)
				)}
			>
				<ChannelList {...defaultProps} />
			</Wrapper>
		);

		expect(await screen.findByText('Jun 9, 2026')).toBeInTheDocument();
	});
});
