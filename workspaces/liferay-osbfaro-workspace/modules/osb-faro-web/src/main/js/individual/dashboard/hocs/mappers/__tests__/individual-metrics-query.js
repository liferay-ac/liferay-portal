import {mapPropsToOptions, mapResultToProps} from '../individual-metrics-query';

const mockMetric = {
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
		it('should map each metric to its total and trend', () => {
			expect(mapResultToProps(mockData).items).toEqual([
				{
					change: 25.4,
					id: 'totalIndividuals',
					info: undefined,
					title: 'Total Individuals',
					total: 10,
				},
				{
					change: 25.4,
					id: 'knownIndividualsMetric',
					info: {
						content: expect.stringMatching(/known individuals/i),
						title: 'Known Individuals',
					},
					title: 'Known',
					total: 10,
				},
				{
					change: 25.4,
					id: 'anonymousIndividualsMetric',
					info: {
						content: expect.stringMatching(
							/anonymous individuals/i
						),
						title: 'Anonymous Individuals',
					},
					title: 'Anonymous',
					total: 10,
				},
			]);
		});
	});
});
