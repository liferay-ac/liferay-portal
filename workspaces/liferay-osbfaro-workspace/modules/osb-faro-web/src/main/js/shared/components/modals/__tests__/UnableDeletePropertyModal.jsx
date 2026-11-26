import React from 'react';
import UnableDeletePropertyModal from '../UnableDeletePropertyModal';
import {cleanup, fireEvent, screen} from '@testing-library/react';
import {renderModal} from 'test/render-modal';
import {useLDPEnabled} from 'shared/hooks/useLDPEnabled';

jest.mock('shared/hooks/useLDPEnabled', () => ({
	useLDPEnabled: jest.fn(),
}));

describe('UnableDeletePropertyModal', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('renders the title, the documentation link and the danger status', async () => {
		await renderModal(observer => (
			<UnableDeletePropertyModal observer={observer} onClose={jest.fn()} />
		));

		expect(screen.getByText(/^unable to delete property$/i)).toBeInTheDocument();

		expect(document.querySelector('.modal-danger')).toBeTruthy();

		expect(
			document.querySelector('.lexicon-icon-exclamation-full')
		).toBeTruthy();

		expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
	});

	it('closes when done is clicked', async () => {
		const onClose = jest.fn();

		await renderModal(observer => (
			<UnableDeletePropertyModal observer={observer} onClose={onClose} />
		));

		fireEvent.click(screen.getByText(/^done$/i));

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe('UnableDeletePropertyModal product naming', () => {
	afterEach(cleanup);

	beforeEach(() => {
		useLDPEnabled.mockReturnValue(false);
	});

	it('shows the Analytics Cloud text for a non-LDP workspace', async () => {
		await renderModal(observer => (
			<UnableDeletePropertyModal observer={observer} onClose={jest.fn()} />
		));

		expect(screen.getByText(/navigate to Instance Settings > Analytics Cloud > Properties/)).toBeInTheDocument();
	});

	it('shows the Liferay Data Platform text for an LDP workspace', async () => {
		useLDPEnabled.mockReturnValue(true);

		await renderModal(observer => (
			<UnableDeletePropertyModal observer={observer} onClose={jest.fn()} />
		));

		expect(screen.getByText(/navigate to Instance Settings > Liferay Data Platform > Properties/)).toBeInTheDocument();
	});
});
