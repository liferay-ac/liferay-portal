/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayDropdown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import React, {useState} from 'react';

import CurrentVsPreviousChart from './CurrentVsPreviousChart';
import {TableView} from './TableView';

type DropdownItem = {
	Component: () => JSX.Element;
	icon: string;
	name: string;
	value: string;
};

const dropdownItems: DropdownItem[] = [
	{
		Component: CurrentVsPreviousChart,
		icon: 'analytics',
		name: Liferay.Language.get('chart'),
		value: 'chart',
	},
	{
		Component: TableView,
		icon: 'table',
		name: Liferay.Language.get('table'),
		value: 'table',
	},
];

const CurrentVsPrevious = () => {
	const [selectedItem, setSelectedItem] = useState(dropdownItems[0]);
	const [dropdownActive, setDropdownActive] = useState(false);

	return (
		<>
			<div className="align-items-center d-flex justify-content-around mt-3">
				<span className="text-3 text-nowrap text-secondary">
					{Liferay.Language.get(
						'total-number-of-times-an-asset-is-seen-by-visitors'
					)}
				</span>

				<ClayDropdown
					active={dropdownActive}
					closeOnClickOutside={true}
					onActiveChange={setDropdownActive}
					trigger={
						<ClayButton
							aria-label={selectedItem.name}
							borderless={true}
							displayType="secondary"
							onClick={() => {
								setDropdownActive(!dropdownActive);
							}}
							size="sm"
						>
							{selectedItem.icon && (
								<ClayIcon symbol={selectedItem.icon} />
							)}

							<ClayIcon className="mx-2" symbol="caret-bottom" />
						</ClayButton>
					}
				>
					{dropdownItems.map((item) => (
						<ClayDropdown.Item
							active={item.value === selectedItem.value}
							key={item.value}
							onClick={() => {
								setSelectedItem(item);
								setDropdownActive(false);
							}}
						>
							{item.icon && (
								<ClayIcon className="mr-2" symbol={item.icon} />
							)}

							{item.name}
						</ClayDropdown.Item>
					))}
				</ClayDropdown>
			</div>

			<main className="mt-3">
				<selectedItem.Component />
			</main>
		</>
	);
};
export {CurrentVsPrevious};
