import Conjunction from '../Conjunction';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('Conjunction', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<Conjunction conjunctionName='and' />);

		expect(container).toMatchSnapshot();
	});

	it('should render the And label for an AND conjunction outside sequential mode', () => {
		const {getByText} = render(<Conjunction conjunctionName='and' />);

		expect(getByText('And')).toBeInTheDocument();
	});

	it('should render the Or label for an OR conjunction', () => {
		const {getByText} = render(<Conjunction conjunctionName='or' />);

		expect(getByText('Or')).toBeInTheDocument();
	});

	it('should hide the separator from assistive technology outside sequential mode, since the group operator picker already says it', () => {
		const {getByText, queryByRole} = render(
			<Conjunction conjunctionName='and' />
		);

		expect(getByText('And')).toHaveAttribute('aria-hidden', 'true');
		expect(queryByRole('button')).not.toBeInTheDocument();
	});

	it('should render the separator as disabled, so it is not interactive', () => {
		const {getByText} = render(<Conjunction conjunctionName='and' />);

		expect(getByText('And')).toBeDisabled();
	});

	it('should render the Then label for an AND conjunction in sequential mode', () => {
		const {getByRole} = render(
			<Conjunction conjunctionName='and' sequential />
		);

		expect(getByRole('button')).toHaveTextContent('Then');
	});

	it('should keep the Then separator exposed to assistive technology in sequential mode', () => {
		const {getByRole} = render(
			<Conjunction conjunctionName='and' sequential />
		);

		expect(getByRole('button')).not.toHaveAttribute('aria-hidden', 'true');
		expect(getByRole('button')).toBeDisabled();
	});
});
