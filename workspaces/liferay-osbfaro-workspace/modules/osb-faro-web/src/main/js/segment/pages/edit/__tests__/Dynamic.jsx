import DynamicSegmentEdit from '../Dynamic';
import React from 'react';
import {render} from 'test/render';
import {List} from 'immutable';

jest.mock('contacts/hoc/segment/WithBaseEdit', () => Component => Component);
jest.mock(
	'segment/segment-editor/dynamic/hoc/WithPropertyGroups',
	() => Component => Component
);

// Capture the segment type the editor is rendered with.

jest.mock('segment/segment-editor/dynamic', () => ({
	__esModule: true,
	default: ({type}) => <div data-testid='segment-type'>{type}</div>
}));

const renderEdit = ({location = '/', segment} = {}) =>
	render(
		<DynamicSegmentEdit
			groupId='23'
			id='123'
			propertyGroupsIList={new List()}
			segment={segment}
		/>,
		{route: location}
	);

describe('DynamicSegmentEdit', () => {
	it("should use an existing segment's type", () => {
		const {getByTestId} = renderEdit({
			segment: {segmentType: 'REAL_TIME'}
		});

		expect(getByTestId('segment-type').textContent).toBe('REAL_TIME');
	});

	it('should use the type query param when there is no existing segment', () => {
		const {getByTestId} = renderEdit({location: '/?type=REAL_TIME'});

		expect(getByTestId('segment-type').textContent).toBe('REAL_TIME');
	});

	it('should default to BATCH when neither a segment nor a type param is present', () => {
		const {getByTestId} = renderEdit({});

		expect(getByTestId('segment-type').textContent).toBe('BATCH');
	});
});
