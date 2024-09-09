/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.analytics.reports.rest.client.dto.v1_0;

import com.liferay.analytics.reports.rest.client.function.UnsafeSupplier;
import com.liferay.analytics.reports.rest.client.serdes.v1_0.PageHistogramSerDes;

import java.io.Serializable;

import java.util.Objects;

import javax.annotation.Generated;

/**
 * @author Marcos Martins
 * @generated
 */
@Generated("")
public class PageHistogram implements Cloneable, Serializable {

	public static PageHistogram toDTO(String json) {
		return PageHistogramSerDes.toDTO(json);
	}

	public AssetHistogramMetric[] getAssetHistogramMetrics() {
		return assetHistogramMetrics;
	}

	public void setAssetHistogramMetrics(
		AssetHistogramMetric[] assetHistogramMetrics) {

		this.assetHistogramMetrics = assetHistogramMetrics;
	}

	public void setAssetHistogramMetrics(
		UnsafeSupplier<AssetHistogramMetric[], Exception>
			assetHistogramMetricsUnsafeSupplier) {

		try {
			assetHistogramMetrics = assetHistogramMetricsUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected AssetHistogramMetric[] assetHistogramMetrics;

	public String getPageTitle() {
		return pageTitle;
	}

	public void setPageTitle(String pageTitle) {
		this.pageTitle = pageTitle;
	}

	public void setPageTitle(
		UnsafeSupplier<String, Exception> pageTitleUnsafeSupplier) {

		try {
			pageTitle = pageTitleUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected String pageTitle;

	@Override
	public PageHistogram clone() throws CloneNotSupportedException {
		return (PageHistogram)super.clone();
	}

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof PageHistogram)) {
			return false;
		}

		PageHistogram pageHistogram = (PageHistogram)object;

		return Objects.equals(toString(), pageHistogram.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		return PageHistogramSerDes.toJSON(this);
	}

}