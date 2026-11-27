import AddDataSource from '../AddDataSource';
import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {render} from '@testing-library/react';

describe('DistributionCard AddDataSource', () => {
	it('renders', () => {
		const {getByText} = render(
			<BrowserRouter>
				<AddDataSource groupId='123' />
			</BrowserRouter>
		);

		expect(
			getByText(Liferay.Language.get('add-data-source'))
		).toBeInTheDocument();
		expect(
			getByText(Liferay.Language.get('distribution'))
		).toBeInTheDocument();
	});
});
