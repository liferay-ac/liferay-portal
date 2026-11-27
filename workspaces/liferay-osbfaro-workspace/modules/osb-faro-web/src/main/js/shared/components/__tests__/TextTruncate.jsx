import React from 'react';
import TextTruncate from '../TextTruncate';
import {render} from '@testing-library/react';
import {range} from 'lodash';

describe('TextTruncate', () => {
	it('should render', () => {
		const {container} = render(<TextTruncate title='foo' />);

		expect(container).toMatchSnapshot();
	});

	it('should render with the title pre-truncated if maxCharLength is given', () => {
		const {getByText} = render(
			<TextTruncate
				maxCharLength={10}
				title={range(20)
					.map(() => 'a')
					.join('')}
			/>
		);

		expect(
			getByText(
				`${range(7)
					.map(() => 'a')
					.join('')}...`
			)
		).toBeTruthy();
	});
});
