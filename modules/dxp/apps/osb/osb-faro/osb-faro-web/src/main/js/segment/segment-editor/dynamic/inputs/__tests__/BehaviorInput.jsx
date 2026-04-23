import BehaviorInput, {AssetItem} from '../BehaviorInput';
import mockStore from 'test/mock-store';
import React from 'react';
import {ACTIVITY_KEY, RelationalOperators} from '../../utils/constants';
import {AssetNames, SegmentTypes} from 'shared/util/constants';
import {cleanup, fireEvent, render} from '@testing-library/react';
import {createCustomValueMap} from '../../utils/custom-inputs';
import {Map} from 'immutable';
import {Property, Segment} from 'shared/util/records';
import {Provider} from 'react-redux';
import {ReferencedObjectsProvider} from '../../context/referencedObjects';

jest.unmock('react-dom');

const mockValue = createCustomValueMap([
	{
		key: 'criterionGroup',
		value: [
			{
				operatorName: RelationalOperators.EQ,
				propertyName: ACTIVITY_KEY,
				value: 'test#test#123123123'
			}
		]
	},
	{key: 'operator', value: RelationalOperators.GE},
	{key: 'value', value: ''}
]);

const defaultProps = {
	onChange: jest.fn(),
	operatorRenderer: () => <div>{'test'}</div>,
	property: new Property(),
	referencedAssetsIMap: new Map(),
	touched: {asset: false, occurenceCount: false},
	valid: {asset: false, occurenceCount: false},
	value: mockValue
};

const DefaultComponent = props => (
	<Provider store={mockStore()}>
		<ReferencedObjectsProvider
			segment={
				new Segment({
					referencedObjects: new Map({
						assets: new Map({'123_title': 'test'})
					})
				})
			}
		>
			<BehaviorInput {...defaultProps} {...props} />
		</ReferencedObjectsProvider>
	</Provider>
);

describe('BehaviorInput', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container, getAllByText, getByText} = render(
			<DefaultComponent />
		);

		fireEvent.click(getByText('at least'));
		fireEvent.click(getByText('ever'));

		expect(getAllByText('at least')[1]).toBeTruthy();
		expect(getByText('at most')).toBeTruthy();

		expect(getByText('since')).toBeTruthy();
		expect(getByText('before')).toBeTruthy();
		expect(getByText('between')).toBeTruthy();
		expect(getAllByText('ever')[1]).toBeTruthy();
		expect(getByText('on')).toBeTruthy();

		expect(container).toMatchSnapshot();
	});

	it('should render w/ data', () => {
		const {container} = render(
			<DefaultComponent
				referencedAssetsIMap={
					new Map({
						assets: new Map({'123_title': 'test'})
					})
				}
				segmentType={SegmentTypes.RealTime}
				valid={{asset: true, occurenceCount: true}}
				value={mockValue.set('value', 123)}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	describe('add-asset button', () => {
		it('should show add-asset button for batch when no asset is selected', () => {
			const {container, queryByText} = render(
				<DefaultComponent segmentType={SegmentTypes.Batch} />
			);

			expect(container.querySelector('.add-asset-button')).toBeTruthy();
			expect(queryByText('select')).toBeNull();
		});

		it('should show SelectEntityFromModal after clicking add-asset button', () => {
			const {container, getByText} = render(
				<DefaultComponent segmentType={SegmentTypes.Batch} />
			);

			fireEvent.click(container.querySelector('.add-asset-button'));

			expect(getByText('Select')).toBeTruthy();
		});

		it('should not show add-asset button when touched.asset is true', () => {
			const {container, getByText} = render(
				<DefaultComponent
					segmentType={SegmentTypes.Batch}
					touched={{asset: true, occurenceCount: false}}
				/>
			);

			expect(container.querySelector('.add-asset-button')).toBeNull();
			expect(getByText('Select')).toBeTruthy();
		});

		it('should not show add-asset button when asset exists in context', () => {
			const {container, getByText} = render(
				<Provider store={mockStore()}>
					<ReferencedObjectsProvider
						segment={
							new Segment({
								referencedObjects: new Map({
									assets: new Map({
										'123123123_title': new Map({
											id: '123123123',
											name: 'Test Asset'
										})
									})
								})
							})
						}
					>
						<BehaviorInput
							{...defaultProps}
							segmentType={SegmentTypes.Batch}
							valid={{asset: true, occurenceCount: false}}
						/>
					</ReferencedObjectsProvider>
				</Provider>
			);

			expect(container.querySelector('.add-asset-button')).toBeNull();
			expect(getByText('Select')).toBeTruthy();
		});

		it('should show SelectEntityFromModal directly for real-time segments', () => {
			const {container, getByText} = render(
				<DefaultComponent segmentType={SegmentTypes.RealTime} />
			);

			expect(getByText('Select')).toBeTruthy();
			expect(container.querySelector('.add-asset-button')).toBeNull();
		});

		it('should not show add-asset button for pageViewed property', () => {
			const {container, getByText} = render(
				<DefaultComponent
					property={new Property({name: AssetNames.PageViewed})}
					segmentType={SegmentTypes.Batch}
				/>
			);

			expect(container.querySelector('.add-asset-button')).toBeNull();
			expect(getByText('Select')).toBeTruthy();
		});
	});

	it('should render with has-error for asset', () => {
		const {container} = render(
			<DefaultComponent
				touched={{asset: true, occurenceCount: false}}
				valid={{asset: false, occurenceCount: true}}
				value={mockValue.set('value', 123)}
			/>
		);

		expect(
			container.querySelector('.form-group-item-shrink.has-error')
		).toBeNull();

		expect(container.querySelector('.has-error')).toBeTruthy();
	});

	it('should render with has-error for occurenceCount', () => {
		const {container} = render(
			<DefaultComponent touched={{asset: false, occurenceCount: true}} />
		);

		expect(
			container.querySelector('.form-group-item-shrink.has-error')
		).toBeTruthy();
	});

	describe('AssetItem', () => {
		afterEach(cleanup);

		it('should render', () => {
			const {container} = render(<AssetItem />);

			expect(container).toMatchSnapshot();
		});
	});
});
