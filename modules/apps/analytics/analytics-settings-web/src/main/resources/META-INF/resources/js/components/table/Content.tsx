/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import {ClayCheckbox} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayTable from '@clayui/table';
import classNames from 'classnames';
import React from 'react';

import {OrderBy} from '../../utils/filter';
import {Events, useData, useDispatch} from './Context';
import {EColumnAlign, TColumns} from './types';

interface IContentProps {
	columns: TColumns;
	disabled: boolean;
	showCheckbox: boolean;
}

const Content: React.FC<IContentProps> = ({
	columns: headerColumns,
	disabled,
	showCheckbox,
}) => {
	const {filter, formattedItems, rows} = useData();
	const dispatch = useDispatch();

	return (
		<ClayTable hover={!disabled}>
			<ClayTable.Head>
				<ClayTable.Row>
					{showCheckbox && <ClayTable.Cell />}

					{Object.keys(headerColumns).map((key) => {
						const {
							align = EColumnAlign.Left,
							expanded = false,
							label,
							show = true,
						} = headerColumns[key];

						return (
							show && (
								<ClayTable.Cell
									columnTextAlignment={align}
									expanded={expanded}
									headingCell
									key={label}
								>
									<span>{label}</span>

									{filter.value === key && (
										<span>
											<ClayIcon
												symbol={
													filter.type === OrderBy.Asc
														? 'order-arrow-up'
														: 'order-arrow-down'
												}
											/>
										</span>
									)}
								</ClayTable.Cell>
							)
						);
					})}
				</ClayTable.Row>
			</ClayTable.Head>

			<ClayTable.Body>
				{rows.map((rowId) => {
					const {
						checked = false,
						columns,
						disabled: disabledItem = false,
						id,
					} = formattedItems[rowId];

					return (
						<ClayTable.Row
							className={classNames({
								'table-active': checked,
								'text-muted': disabled,
							})}
							key={id}
						>
							{showCheckbox && (
								<ClayTable.Cell>
									<ClayCheckbox
										checked={checked}
										disabled={disabled || disabledItem}
										id={id}
										onChange={() => {
											if (!disabled && !disabledItem) {
												dispatch({
													payload: id,
													type: Events.ChangeItems,
												});
											}
										}}
									/>
								</ClayTable.Cell>
							)}

							{columns.map(({cellRenderer, id, value}) => {
								const {align, show = true} = headerColumns[id];

								return (
									show && (
										<ClayTable.Cell
											columnTextAlignment={
												align || EColumnAlign.Left
											}
											key={id}
										>
											{cellRenderer
												? cellRenderer(
														formattedItems[rowId]
												  )
												: value}
										</ClayTable.Cell>
									)
								);
							})}
						</ClayTable.Row>
					);
				})}
			</ClayTable.Body>
		</ClayTable>
	);
};

export default Content;
