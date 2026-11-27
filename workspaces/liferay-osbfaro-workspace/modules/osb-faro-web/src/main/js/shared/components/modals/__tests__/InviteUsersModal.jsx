import InviteUsersModal from '../InviteUsersModal';
import React from 'react';
import {cleanup, fireEvent, screen} from '@testing-library/react';
import {noop} from 'lodash';
import {renderModal} from 'test/render-modal';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn(),
}));

describe('InviteUsersModal', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('should render', async () => {
		await renderModal(observer => (
			<InviteUsersModal observer={observer} onClose={noop} />
		));

		expect(document.body).toMatchSnapshot();
	});

	it('should render with custom class', async () => {
		await renderModal(observer => (
			<InviteUsersModal
				className='custom-class'
				observer={observer}
				onClose={noop}
			/>
		));

		expect(document.querySelector('.custom-class')).toBeTruthy();
	});

	it('should close when cancel is clicked', async () => {
		const onClose = jest.fn();

		await renderModal(observer => (
			<InviteUsersModal observer={observer} onClose={onClose} />
		));

		fireEvent.click(screen.getByText(/^cancel$/i));

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('asks to invite people to Liferay Data Platform in an LDP workspace', async () => {
		useLDPEnabled.mockReturnValue(true);

		await renderModal(observer => (
			<InviteUsersModal observer={observer} onClose={noop} />
		));

		expect(
			screen.getByText(
				/invite to liferay data platform\. separate each address/i
			)
		).toBeInTheDocument();
	});
});
