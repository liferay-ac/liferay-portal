import LifecycleSettingsForm from '../LifecycleSettingsForm';
import React from 'react';
import {createStageConfig} from 'lifecycle/utils/stageConfiguration';
import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {resetBodyWidth, setBodyWidth} from 'test/body-width';
import {useLifecycleSettingsForm} from 'lifecycle/hooks/useLifecycleSettingsForm';
import {useRequest} from 'shared/hooks/useRequest';

jest.unmock('react-dom');

jest.mock('shared/hooks/useRequest', () => ({
	useRequest: jest.fn(),
}));

jest.mock('react-redux', () => ({
	useDispatch: () => jest.fn(),
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({channelId: '123', groupId: '23'}),
}));

jest.mock('shared/hooks/useUnsavedChangesPrompt', () => ({
	useUnsavedChangesPrompt: jest.fn(),
}));

jest.mock('shared/hooks/useTimeZone', () => ({
	useTimeZone: () => ({timeZoneId: 'UTC'}),
}));

jest.mock('shared/hooks/useHistoryAdapter', () => ({
	useHistoryAdapter: () => ({push: jest.fn()}),
}));

const LifecycleSettingsFormHarness = ({stageCount = 0}) => {
	const form = useLifecycleSettingsForm({
		description: '',
		name: 'Customer Lifecycle',
		stageConfigs: () => Array.from({length: stageCount}, createStageConfig),
	});

	return (
		<LifecycleSettingsForm
			authorName="Anneta Smith"
			form={form}
			onSubmit={jest.fn()}
			submitLabel="Save"
			title="Edit Lifecycle"
		/>
	);
};

describe('LifecycleSettingsForm', () => {
	beforeEach(() => {
		setBodyWidth(1440);

		(useRequest as jest.Mock).mockReturnValue({data: [], loading: false});
	});

	afterEach(() => resetBodyWidth());

	it('places the form in the BaseEditPage main content region', () => {
		render(
			<MemoryRouter>
				<LifecycleSettingsFormHarness />
			</MemoryRouter>
		);

		const main = screen
			.getByDisplayValue('Customer Lifecycle')
			.closest('.base-edit-page-main');

		expect(main).not.toBeNull();
		expect(main?.parentElement).toHaveClass('base-edit-page-body');
	});

	it('places the lifecycle conditions panel in the sidebar', () => {
		render(
			<MemoryRouter>
				<LifecycleSettingsFormHarness />
			</MemoryRouter>
		);

		expect(
			screen
				.getByRole('heading', {name: /lifecycle conditions/i})
				.closest('.base-edit-page-sidebar')
		).not.toBeNull();
	});

	it('warns and disables adding stages once the limit of 20 is reached', () => {
		const {container} = render(
			<MemoryRouter>
				<LifecycleSettingsFormHarness stageCount={19} />
			</MemoryRouter>
		);

		const addButton = screen.getByRole('button', {name: /add.stage/i});

		expect(addButton).toBeEnabled();
		expect(
			screen.queryByText(/reached.the.limit/i)
		).not.toBeInTheDocument();

		fireEvent.click(addButton);

		expect(screen.getByText(/reached.the.limit/i)).toBeInTheDocument();
		expect(addButton).toBeDisabled();
		expect(
			container.querySelectorAll('.lifecycle-stage-chip')
		).toHaveLength(20);
	});
});
