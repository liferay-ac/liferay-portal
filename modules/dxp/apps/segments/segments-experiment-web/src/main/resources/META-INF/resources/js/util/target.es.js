/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export function getTarget(selectedTarget) {
	const targetableCollectionElement = document.querySelector(
		'[data-analytics-targetable-collection]'
	);

	if (
		targetableCollectionElement &&
		JSON.parse(
			targetableCollectionElement.dataset.analyticsTargetableCollection
		).key === selectedTarget
	) {
		return targetableCollectionElement;
	}

	return document.getElementById(selectedTarget);
}
