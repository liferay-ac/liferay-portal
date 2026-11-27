import * as data from 'test/data';
import client from 'shared/apollo/client';
import EventAnalysisEdit from '../Edit';
import mockStore from 'test/mock-store';
import React from 'react';
import {ApolloProvider} from '@apollo/client';
import {
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from '@testing-library/react';
import {DISPLAY_NAME} from 'shared/util/pagination';
import {DndProvider} from 'react-dnd';
import {EventTypes} from 'event-analysis/utils/types';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {MemoryRouter, Route, Routes as RouterRoutes} from 'react-router-dom';
import {MockedProvider} from '@apollo/client/testing';
import {mockSuccessState} from 'test/__mocks__/mock-objects';
import {
	mockEventAnalysisReq,
	mockEventAttributeDefinitionsReq,
	mockEventDefinitionsReq,
	mockPreferenceReq,
	mockTimeRangeReq
} from 'test/graphql-data';
import {OrderByDirections} from 'shared/util/constants';
import {Provider} from 'react-redux';
import {range} from 'lodash';
import {Routes} from 'shared/util/router';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useBlocker: () => ({state: 'unblocked'}),
	useParams: () => ({
		channelId: '123',
		groupId: '456',
		id: '1'
	})
}));

jest.mock('shared/context/dataSources', () => ({
	...jest.requireActual('shared/context/dataSources'),
	useDataSources: () => mockSuccessState,
}));

const WrappedComponent = () => (
	<Provider store={mockStore()}>
		<ApolloProvider client={client}>
			<MockedProvider
				mocks={[
					mockTimeRangeReq(),
					mockPreferenceReq(),
					mockEventAnalysisReq(),
					mockEventAttributeDefinitionsReq(
						range(10).map(i =>
							data.mockEventAttributeDefinition(i, {
								__typename: 'EventAttributeDefinition'
							})
						),
						{
							eventDefinitionId: '1',
							size: 200,
							sort: {
								column: DISPLAY_NAME,
								type: OrderByDirections.Ascending
							}
						}
					),
					mockEventDefinitionsReq(
						range(10).map(i =>
							data.mockEventDefinition(i, {
								__typename: 'EventDefinition'
							})
						),
						{
							eventType: EventTypes.All,
							hidden: false,
							page: 0,
							size: 200,
							sort: {
								column: DISPLAY_NAME,
								type: OrderByDirections.Ascending
							}
						}
					)
				]}
			>
				<MemoryRouter
					initialEntries={['/workspace/123/456/event-analysis/1']}
				>
					<RouterRoutes>
						<Route
							element={
								<DndProvider backend={HTML5Backend}>
									<EventAnalysisEdit />
								</DndProvider>
							}
							path={`${Routes.EVENT_ANALYSIS_EDIT}/*`}
						/>
					</RouterRoutes>
				</MemoryRouter>
			</MockedProvider>
		</ApolloProvider>
	</Provider>
);

describe('Event Analysis Edit', () => {
	afterEach(cleanup);

	it('should render', async () => {
		const {container} = render(<WrappedComponent />);

		await waitForLoadingToBeRemoved(container);

		expect(
			screen.getByRole('heading', {name: /^edit event analysis$/i})
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', {name: /^download reports$/i})
		).toBeInTheDocument();
		expect(screen.getByLabelText(/^title/i)).toBeInTheDocument();
	});

	it('should render event analysis with data', async () => {
		const {container} = render(<WrappedComponent />);

		jest.runOnlyPendingTimers();

		await waitForLoadingToBeRemoved(container);

		expect(screen.getByLabelText(/^title/i)).toHaveValue(
			'My First Event Analysis'
		);
		expect(
			screen.getByRole('button', {name: /^last 90 days$/i})
		).toBeInTheDocument();
		expect(
			screen.getByRole('group', {name: 'assetClicked'})
		).toBeInTheDocument();
		expect(
			within(
				screen.getByRole('region', {name: /^breakdown by/i})
			).getAllByRole('group')
		).toHaveLength(2);
		expect(
			within(screen.getByRole('region', {name: /^filter by/i})).getAllByRole(
				'group'
			)
		).toHaveLength(1);
		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	it('should check if search autocomplete is working properly', async () => {
		const {container} = render(<WrappedComponent />);

		jest.runOnlyPendingTimers();

		await waitForLoadingToBeRemoved(container);

		fireEvent.click(screen.getByRole('button', {name: /^add filter$/i}));

		jest.runOnlyPendingTimers();

		fireEvent.click(await screen.findByRole('button', {name: /^individual$/i}));

		jest.runOnlyPendingTimers();

		expect(
			await screen.findByRole('menuitem', {name: 'jobTitle'})
		).toBeInTheDocument();
		expect(
			screen.getByRole('menuitem', {name: 'languageId'})
		).toBeInTheDocument();

		// The conditions library has its own search field; the open menu's is the last one.

		fireEvent.change(screen.getAllByPlaceholderText(/^search$/i).at(-1), {
			target: {value: 'jobTitle'},
		});

		jest.runOnlyPendingTimers();

		expect(
			screen.getByRole('menuitem', {name: 'jobTitle'})
		).toBeInTheDocument();
		expect(
			screen.queryByRole('menuitem', {name: 'languageId'})
		).not.toBeInTheDocument();
	});

	it('should enable the save button when name is changed', async () => {
		const {container} = render(<WrappedComponent />);

		jest.runOnlyPendingTimers();

		await waitForLoadingToBeRemoved(container);

		fireEvent.change(screen.getByLabelText(/^title/i), {
			target: {value: 'My First Event Analysis Updated'},
		});

		expect(screen.getByLabelText(/^title/i)).toHaveValue(
			'My First Event Analysis Updated'
		);
		expect(
			screen.getByRole('button', {name: /^save analysis$/i})
		).toBeEnabled();
	});

	it('should enable the save button when a new breakdown is added', async () => {
		const {container} = render(<WrappedComponent />);

		jest.runOnlyPendingTimers();

		await waitForLoadingToBeRemoved(container);

		expect(
			screen.getByRole('button', {name: /^save analysis$/i})
		).toBeDisabled();

		fireEvent.click(screen.getByRole('button', {name: /^add breakdown$/i}));

		jest.runOnlyPendingTimers();

		fireEvent.click(
			await screen.findByRole('button', {name: 'displayName-2'})
		);

		jest.runOnlyPendingTimers();

		// The open menu hides the rest of the page from the accessibility tree.

		expect(
			within(
				screen.getByRole('region', {hidden: true, name: /^breakdown by/i})
			).getAllByRole('group', {hidden: true})
		).toHaveLength(3);
		expect(
			screen.getByRole('button', {name: /^save analysis$/i})
		).toBeEnabled();
	});

	it('should enable the save button when compareToPrevious checkbox is changed', async () => {
		const {container} = render(<WrappedComponent />);

		jest.runOnlyPendingTimers();

		await waitForLoadingToBeRemoved(container);

		expect(
			screen.getByRole('button', {name: /^save analysis$/i})
		).toBeDisabled();

		const compareToPreviousCheckbox = screen.getByRole('checkbox');

		expect(compareToPreviousCheckbox).toBeChecked();

		fireEvent.click(compareToPreviousCheckbox);

		expect(compareToPreviousCheckbox).not.toBeChecked();
		expect(
			screen.getByRole('button', {name: /^save analysis$/i})
		).toBeEnabled();
	});

	it('should enable the save button when range selector is changed', async () => {
		const {container} = render(<WrappedComponent />);

		jest.runOnlyPendingTimers();

		await waitForLoadingToBeRemoved(container);

		expect(
			screen.getByRole('button', {name: /^save analysis$/i})
		).toBeDisabled();

		fireEvent.click(screen.getByRole('button', {name: /^last 90 days$/i}));

		jest.runOnlyPendingTimers();

		// A range item's name also lists the dates it covers.

		fireEvent.click(
			await screen.findByRole('menuitem', {name: /^last 24 hours/i})
		);

		jest.runOnlyPendingTimers();

		expect(
			screen.getByRole('button', {name: /^last 24 hours$/i})
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', {name: /^save analysis$/i})
		).toBeEnabled();
	});
});
