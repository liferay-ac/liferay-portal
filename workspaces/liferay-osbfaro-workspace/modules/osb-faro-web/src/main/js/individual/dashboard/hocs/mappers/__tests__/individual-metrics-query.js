import {mapPropsToOptions, mapResultToProps} from '../individual-metrics-query';
import {range} from 'lodash';

const mockMetric = {
	histogram: {metrics: range(5).map((i) => ({value: i}))},
	trend: {percentage: 25.4},
	value: 10,
};

const mockData = {
	data: {
		individualMetric: {
			anonymousIndividualsMetric: mockMetric,
			knownIndividualsMetric: mockMetric,
			totalIndividualsMetric: mockMetric,
		},
	},
};

describe('Individual Metrics Query Mapper', () => {
	describe('mapPropsToOptions', () => {
		it('should map props to options', () => {
			const props = {
				interval: 'day',
				rangeSelectors: {
					rangeKey: '30',
				},
			};

			expect(mapPropsToOptions(props)).toEqual(
				expect.objectContaining({
					variables: {
						interval: 'day',
						rangeEnd: null,
						rangeKey: 30,
						rangeStart: null,
					},
				})
			);
		});
	});

	describe('mapResultToProps', () => {
		const getInfoContent = (ownProps, id) =>
			mapResultToProps({data: mockData.data, ownProps}).items.find(
				(item) => item.id === id
			).info.content;

		it.each`
			id                              | text
			${'knownIndividualsMetric'}     | ${/^current total of known individuals that are tracked by analytics cloud\./i}
			${'anonymousIndividualsMetric'} | ${/^current total of anonymous individuals that are tracked by analytics cloud\./i}
		`(
			'names Analytics Cloud in the $id info for a non-LDP workspace',
			({id, text}) => {
				expect(getInfoContent({ldpEnabled: false}, id)).toMatch(text);
			}
		);

		it.each`
			id                              | text
			${'knownIndividualsMetric'}     | ${/^current total of known individuals that are tracked by liferay data platform\./i}
			${'anonymousIndividualsMetric'} | ${/^current total of anonymous individuals that are tracked by liferay data platform\./i}
		`(
			'names Liferay Data Platform in the $id info for an LDP workspace',
			({id, text}) => {
				expect(getInfoContent({ldpEnabled: true}, id)).toMatch(text);
			}
		);

		xit('should map results to props', () => {
			expect(mapResultToProps(mockData).items).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						change: expect.any(Number),
						data: expect.any(Array),
						id: expect.any(String),
						info:
							expect.objectContaining({
								content: expect.any(String),
								title: expect.any(String),
							}) || undefined,
						title: expect.any(String),
						total: expect.any(Number),
					}),
				])
			);
		});
	});
});
