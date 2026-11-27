import ModalInfoBar from '../ModalInfoBar';
import React from 'react';
import {render} from '@testing-library/react';

describe('ModalInfoBar', () => {
	it('should render', () => {
		const {container} = render(<ModalInfoBar children={['Test Info']} />);
		expect(container).toMatchSnapshot();
	});
});
