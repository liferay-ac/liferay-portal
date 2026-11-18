import {getCriterionLabel} from '../getCriterionLabel';
import {
	PropertyTypes,
	RelationalOperators,
	SUPPORTED_OPERATORS_MAP,
} from '../constants';
import {Property} from 'shared/util/records';

const {EQ, GT, NE} = RelationalOperators;

const getOperatorLabel = (type, key) =>
	SUPPORTED_OPERATORS_MAP[type].find((operator) => operator.key === key)
		.label;

const makeProperty = (props) =>
	new Property({
		entityName: 'Individual',
		label: 'Country',
		name: 'country',
		propertyKey: 'individual',
		type: PropertyTypes.Text,
		...props,
	});

describe('getCriterionLabel', () => {
	it('should join the entity, the attribute, the operator and the value', () => {
		expect(
			getCriterionLabel(
				{operatorName: EQ, propertyName: 'country', value: 'Brazil'},
				makeProperty()
			)
		).toBe(
			`Individual Country ${getOperatorLabel(
				PropertyTypes.Text,
				EQ
			)} "Brazil"`
		);
	});

	it('should tell apart two rows with the same attribute', () => {
		const property = makeProperty();

		expect(
			getCriterionLabel(
				{operatorName: EQ, propertyName: 'country', value: 'Brazil'},
				property
			)
		).not.toBe(
			getCriterionLabel(
				{operatorName: EQ, propertyName: 'country', value: 'Chile'},
				property
			)
		);

		expect(
			getCriterionLabel(
				{operatorName: EQ, propertyName: 'country', value: 'Brazil'},
				property
			)
		).not.toBe(
			getCriterionLabel(
				{operatorName: NE, propertyName: 'country', value: 'Brazil'},
				property
			)
		);
	});

	it('should leave the value out when the operator is "is unknown"', () => {
		const label = getCriterionLabel(
			{operatorName: EQ, propertyName: 'country', value: null},
			makeProperty()
		);

		expect(label).toContain('Individual Country');
		expect(label).not.toContain('null');
		expect(label).not.toContain('"');
	});

	it('should leave the value out when the operator is "is known"', () => {
		const label = getCriterionLabel(
			{operatorName: NE, propertyName: 'country', value: null},
			makeProperty()
		);

		expect(label).toContain('Individual Country');
		expect(label).not.toContain('null');
		expect(label).not.toContain('"');
	});

	it('should append a number value as is', () => {
		expect(
			getCriterionLabel(
				{operatorName: GT, propertyName: 'age', value: 18},
				makeProperty({
					label: 'Age',
					name: 'age',
					type: PropertyTypes.Number,
				})
			)
		).toBe(
			`Individual Age ${getOperatorLabel(PropertyTypes.Number, GT)} 18`
		);
	});

	it('should uppercase a boolean value', () => {
		expect(
			getCriterionLabel(
				{operatorName: EQ, propertyName: 'active', value: 'true'},
				makeProperty({
					label: 'Active',
					name: 'active',
					type: PropertyTypes.Boolean,
				})
			)
		).toBe(
			`Individual Active ${getOperatorLabel(
				PropertyTypes.Boolean,
				EQ
			)} TRUE`
		);
	});

	it('should stop at the operator for a select text property, whose value is an id', () => {
		expect(
			getCriterionLabel(
				{operatorName: EQ, propertyName: 'accountId', value: '12345'},
				makeProperty({
					label: 'Account',
					name: 'accountId',
					type: PropertyTypes.SelectText,
				})
			)
		).not.toContain('12345');
	});

	it('should stop at the operator when the value is not a plain value', () => {
		expect(
			getCriterionLabel(
				{
					operatorName: EQ,
					propertyName: 'country',
					value: {nested: 'group'},
				},
				makeProperty()
			)
		).toBe(
			`Individual Country ${getOperatorLabel(PropertyTypes.Text, EQ)}`
		);
	});

	it('should fall back to the property name when the property does not exist', () => {
		expect(
			getCriterionLabel(
				{operatorName: EQ, propertyName: 'removedAttribute', value: 'x'},
				undefined
			)
		).toBe('removedAttribute');
	});

	it('should return an empty label when there is neither a property nor a property name', () => {
		expect(getCriterionLabel({operatorName: EQ, value: 'x'})).toBe('');
	});
});
