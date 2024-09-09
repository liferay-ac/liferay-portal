/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.analytics.reports.rest.client.dto.v1_0;

import com.liferay.analytics.reports.rest.client.function.UnsafeSupplier;
import com.liferay.analytics.reports.rest.client.serdes.v1_0.AssetPageHistogramMetricSerDes;

import java.io.Serializable;

import java.util.Objects;

import javax.annotation.Generated;

/**
 * @author Marcos Martins
 * @generated
 */
@Generated("")
public class AssetPageHistogramMetric implements Cloneable, Serializable {

	public static AssetPageHistogramMetric toDTO(String json) {
		return AssetPageHistogramMetricSerDes.toDTO(json);
	}

	public PageHistogram[] getPageHistograms() {
		return pageHistograms;
	}

	public void setPageHistograms(PageHistogram[] pageHistograms) {
		this.pageHistograms = pageHistograms;
	}

	public void setPageHistograms(
		UnsafeSupplier<PageHistogram[], Exception>
			pageHistogramsUnsafeSupplier) {

		try {
			pageHistograms = pageHistogramsUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected PageHistogram[] pageHistograms;

	@Override
	public AssetPageHistogramMetric clone() throws CloneNotSupportedException {
		return (AssetPageHistogramMetric)super.clone();
	}

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof AssetPageHistogramMetric)) {
			return false;
		}

		AssetPageHistogramMetric assetPageHistogramMetric =
			(AssetPageHistogramMetric)object;

		return Objects.equals(toString(), assetPageHistogramMetric.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		return AssetPageHistogramMetricSerDes.toJSON(this);
	}

}