/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.spi.bearer.token.provider;

import com.liferay.oauth2.provider.model.OAuth2Application;
import com.liferay.oauth2.provider.rest.spi.bearer.token.provider.BearerTokenProvider;
import com.liferay.osb.faro.web.internal.util.AccessTokenExpiresInUtil;
import com.liferay.petra.io.BigEndianCodec;
import com.liferay.petra.reflect.ReflectionUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.security.SecureRandomUtil;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.KeyLengthException;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import java.util.Date;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import org.osgi.service.component.annotations.Component;

/**
 * @author Ivica Cardic
 */
@Component(
	property = {"name=default", "service.ranking:Integer=100"},
	service = BearerTokenProvider.class
)
public class AnalyticsCloudBearerTokenProvider implements BearerTokenProvider {

	@Override
	public boolean isValid(AccessToken accessToken) {
		return isValid(accessToken.getExpiresIn(), accessToken.getIssuedAt());
	}

	@Override
	public void onBeforeCreate(AccessToken accessToken) {
		OAuth2Application oAuth2Application =
			accessToken.getOAuth2Application();

		if ((oAuth2Application != null) &&
			Objects.equals(
				oAuth2Application.getExternalReferenceCode(), "AI-HUB-CELL")) {

			accessToken.setExpiresIn(TimeUnit.DAYS.toSeconds(30));
			accessToken.setTokenKey(_generateJWTTokenKey(accessToken));

			return;
		}

		accessToken.setExpiresIn(AccessTokenExpiresInUtil.getExpiresIn());
		accessToken.setTokenKey(generateTokenKey(32));
	}

	protected String generateTokenKey(int size) {
		if (size < 0) {
			throw new IllegalArgumentException("Token key size is less than 0");
		}

		int count = (int)Math.ceil((double)size / 8);

		byte[] buffer = new byte[count * 8];

		for (int i = 0; i < count; i++) {
			BigEndianCodec.putLong(buffer, i * 8, SecureRandomUtil.nextLong());
		}

		StringBundler sb = new StringBundler(size);

		for (int i = 0; i < size; i++) {
			sb.append(Integer.toHexString(0xFF & buffer[i]));
		}

		return sb.toString();
	}

	protected boolean isValid(long expiresIn, long issuedAt) {
		long expiresInMillis = expiresIn * 1000;

		if (expiresInMillis < 0) {
			return false;
		}

		long issuedAtMillis = issuedAt * 1000;

		if ((issuedAtMillis > System.currentTimeMillis()) ||
			((issuedAtMillis + expiresInMillis) < System.currentTimeMillis())) {

			return false;
		}

		return true;
	}

	private static JWSSigner _createJWSSigner() {
		byte[] secret = new byte[32];

		for (int i = 0; i < 4; i++) {
			BigEndianCodec.putLong(secret, i * 8, SecureRandomUtil.nextLong());
		}

		try {
			return new MACSigner(secret);
		}
		catch (KeyLengthException keyLengthException) {
			return ReflectionUtil.throwException(keyLengthException);
		}
	}

	private String _generateJWTTokenKey(AccessToken accessToken) {
		long issuedAt = accessToken.getIssuedAt();

		SignedJWT signedJWT = new SignedJWT(
			new JWSHeader(JWSAlgorithm.HS256),
			new JWTClaimsSet.Builder(
			).expirationTime(
				new Date((issuedAt + accessToken.getExpiresIn()) * 1000)
			).issueTime(
				new Date(issuedAt * 1000)
			).jwtID(
				generateTokenKey(32)
			).build());

		try {
			signedJWT.sign(_jwsSigner);
		}
		catch (JOSEException joseException) {
			return ReflectionUtil.throwException(joseException);
		}

		return signedJWT.serialize();
	}

	private static final JWSSigner _jwsSigner = _createJWSSigner();

}