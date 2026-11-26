import * as API from 'shared/api';
import mockStore, {mockStoreData} from 'test/mock-store';
import React from 'react';
import {DataTransformation, processFieldMappings} from '../DataTransformation';
import {fromJS, Map} from 'immutable';
import {InMemoryCache} from '@apollo/client';
import {MemoryRouter, Route, Routes as RouterRoutes} from 'react-router-dom';
import {MockedProvider} from '@apollo/client/testing';
import {mockFieldMapping, mockMapping} from 'test/data';
import {Provider} from 'react-redux';
import {render, screen} from '@testing-library/react';
import {SubscriptionNames} from 'shared/util/subscriptions';
import {waitForLoadingToBeRemoved} from 'test/helpers';

const defaultProps = {
	groupId: '23',
	id: '123',
	onSubmit: jest.fn()
};

const WrappedComponent = ({store = mockStore(), ...props}) => (
	<Provider store={store}>
		<MemoryRouter
			initialEntries={['/workspace/23/settings/data-source/123']}
		>
			<RouterRoutes>
				<Route
					element={
						<MockedProvider
							cache={
								new InMemoryCache({
									addTypename: false,
									freezeResults: false
								})
							}
						>
							<DataTransformation {...defaultProps} {...props} />
						</MockedProvider>
					}
					path='/workspace/:groupId/settings/data-source/:id/*'
				/>
			</RouterRoutes>
		</MemoryRouter>
	</Provider>
);

describe('processFieldMappings', () => {
	it('should return fieldMappings', () => {
		const foo = 'foo';
		const bar = 'bar';
		const baz = 'baz';

		const inputValue = fromJS([
			{source: {name: foo}, suggestion: {}},
			{source: {name: bar}, suggestion: {}},
			{source: {name: baz}, suggestion: {}}
		]);

		const result = processFieldMappings(inputValue);

		expect(result.length).toEqual(3);

		expect(result).toMatchSnapshot();
	});
});

describe('DataTransformation', () => {
	it('should render', async () => {
		const {container} = render(<WrappedComponent />);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});

	it('should render w/ the done button enabled', async () => {
		API.dataSource.fetchMappings.mockReturnValue(
			Promise.resolve([
				mockMapping('Matched Field', {
					suggestions: [mockFieldMapping()]
				})
			])
		);

		const {getByText} = render(<WrappedComponent />);

		await waitForLoadingToBeRemoved(document.body);

		expect(getByText(/^done$/i)).not.toBeDisabled();
	});

	it('should render w/ the done button disabled if there are duplicate CSV field mappings', async () => {
		API.dataSource.fetchMappings.mockReturnValue(
			Promise.resolve([
				mockMapping('Has default match 1', {
					suggestions: [
						mockFieldMapping(null, {name: 'foo'}),
						mockFieldMapping(null, {name: 'jack', value: 'dupe'})
					]
					// eslint-disable-next-line comma-dangle
				}),
				mockMapping('Has default match 2', {
					suggestions: [
						mockFieldMapping(null, {name: 'bar'}),
						mockFieldMapping(null, {name: 'jack', value: 'dupe'})
					]
					// eslint-disable-next-line comma-dangle
				}),
				mockMapping('No default match')
			])
		);

		const {getByText} = render(<WrappedComponent />);

		await waitForLoadingToBeRemoved(document.body);

		expect(getByText(/^done$/i)).toBeDisabled();
	});

	it.each`
		ldpEnabled | productName
		${false}   | ${'Analytics Cloud'}
		${true}    | ${'Liferay Data Platform'}
	`(
		'names $productName in the mapping instructions, column and field placeholder when the plan is LDP: $ldpEnabled',
		async ({ldpEnabled, productName}) => {
			API.dataSource.fetchMappings.mockReturnValue(
				Promise.resolve([mockMapping('No default match')])
			);

			const store = ldpEnabled
				? mockStore(
						mockStoreData.setIn(
							['projects', '23', 'data', 'faroSubscription'],
							Map({name: SubscriptionNames.LiferayDataPlatform})
						)
					)
				: mockStore();

			render(<WrappedComponent ldpEnabled={ldpEnabled} store={store} />);

			await waitForLoadingToBeRemoved(document.body);

			expect(
				screen.getByText(
					`All fields have been mapped automatically to the best possible match. Please confirm the data mapping below and make any changes if necessary. You may only map one source data field to a single ${productName} field.`
				)
			).toBeInTheDocument();
			expect(screen.getByText(`${productName} Field`)).toBeInTheDocument();
			expect(
				screen.getByText(`Select ${productName} Field`)
			).toBeInTheDocument();
		}
	);
});
