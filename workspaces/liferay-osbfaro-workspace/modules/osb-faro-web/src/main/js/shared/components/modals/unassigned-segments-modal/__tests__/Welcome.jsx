import React from 'react';
import Welcome from '../Welcome';
import {cleanup, fireEvent, render} from '@testing-library/react';
import {noop} from 'lodash';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn(),
}));

describe('Welcome', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('should render', () => {
		const {container} = render(<Welcome onClose={noop} onNext={noop} />);

		expect(container).toMatchSnapshot();
	});

	it('should call onNext when "Next" is clicked', () => {
		const spy = jest.fn();

		const {queryByText} = render(<Welcome onClose={noop} onNext={spy} />);

		expect(spy).not.toBeCalled();

		fireEvent.click(queryByText(/^next$/i));

		expect(spy).toBeCalled();
	});

	it('names Analytics Cloud in the upgrade message for a non-LDP workspace', () => {
		const {queryByText} = render(<Welcome onNext={noop} />);

		expect(
			queryByText(
				/^we have upgraded your analytics cloud workspace to include properties\.$/i
			)
		).toBeTruthy();
	});

	it('names Liferay Data Platform in the upgrade message for an LDP workspace', () => {
		useLDPEnabled.mockReturnValue(true);

		const {queryByText} = render(<Welcome groupId='23' onNext={noop} />);

		expect(
			queryByText(
				/^we have upgraded your liferay data platform workspace to include properties\.$/i
			)
		).toBeTruthy();

		expect(useLDPEnabled).toHaveBeenCalledWith({groupId: '23'});
	});
});
