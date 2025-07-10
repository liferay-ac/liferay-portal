/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Button from '@clayui/button';
import EmptyState from '@clayui/empty-state';
import ClayLink from '@clayui/link';
import React from 'react';

import {getImage} from '../../../../common/utils/getImage';
import {EmptyStateData} from '../PerformanceTabContent';

import '../../../../../css/infoPanel/PerfomanceTabEmptyState.scss';
export function getEmptyState(data: EmptyStateData) {
	let title = '';
	let description = '';
	let imgSrc = '';
	let action = null;

	if (!data.connectedToSpace) {
		title = Liferay.Language.get('no-sites-are-connected-yet');
		if (data.isAdmin) {
			description = Liferay.Language.get(
				'connect-sites-within-this-space'
			);
			action = <Button>{Liferay.Language.get('connect')}</Button>;
		}
		else {
			description = Liferay.Language.get(
				'please-contact-an-administrator-to-sync-sites-to-this-space'
			);
		}
	}
	else if (!data.connectedToAnalyticsCloud) {
		title = Liferay.Language.get('connect-to-liferay-analytics-cloud');
		imgSrc = getImage('performance_tab_empty_state.svg');
		if (data.isAdmin) {
			description = Liferay.Language.get(
				'in-order-to-view-asset-performance,-your-liferay-dxp-instance-has-to-be-connected-with-liferay-analytics-cloud'
			);
			action = (
				<ClayLink
					button
					displayType="primary"
					href={data.analyticsSettingsPortletURL}
				>
					{Liferay.Language.get('connect')}
				</ClayLink>
			);
		}
		else {
			description = Liferay.Language.get(
				'please-contact-a-dxp-instance-administrator-to-connect-your-dxp-instance-to-analytics-cloud'
			);
		}
	}
	else if (!data.siteSyncedToAnalyticsCloud) {
		title = Liferay.Language.get('sync-to-analytics-cloud');
		imgSrc = getImage('performance_tab_empty_state.svg');
		if (data.isAdmin) {
			description = Liferay.Language.get(
				'in-order-to-view-asset-performance,-your-sites-have-to-be-synced-to-liferay-analytics-cloud'
			);
			action = (
				<ClayLink
					button
					displayType="primary"
					href={`${data.analyticsSettingsPortletURL}&currentPage=PROPERTIES`}
				>
					{Liferay.Language.get('sync')}
				</ClayLink>
			);
		}
		else {
			description = Liferay.Language.get(
				'please-contact-a-dxp-instance-administrator-to-sync-your-sites-to-analytics-cloud'
			);
		}
	}
	else {
		return null;
	}

	return (
		<EmptyState
			className="d-flex flex-column justify-content-center pt-6 text-center"
			description={description}
			imgSrc={imgSrc}
			title={title}
		>
			{action}
		</EmptyState>
	);
}
