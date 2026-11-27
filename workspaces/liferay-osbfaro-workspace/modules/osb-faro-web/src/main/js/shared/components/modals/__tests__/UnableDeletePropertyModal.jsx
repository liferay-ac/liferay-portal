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

	it.each([
		[false, /navigate to instance settings > analytics cloud > properties/i],
		[true, /navigate to instance settings > liferay data platform > properties/i],
	])(
		'names the instance settings of the product when ldpEnabled is %s',
		async (ldpEnabled, text) => {
			useLDPEnabled.mockReturnValue(ldpEnabled);

			await renderModal(observer => (
				<UnableDeletePropertyModal observer={observer} onClose={jest.fn()} />
			));

			expect(screen.getByText(text)).toBeInTheDocument();
		}
	);
});
