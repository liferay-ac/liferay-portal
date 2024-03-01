import moment from 'moment';
import {formatDate, isJapaneseString} from '../utils';

describe('isJapaneseString', () => {
	it('returns true for Japanese string', () => {
		expect(isJapaneseString('ライフレイ')).toBeTruthy();
		expect(
			isJapaneseString('プラットフォームのエクスペリエンス')
		).toBeTruthy();
		expect(isJapaneseString('分析クラウド')).toBeTruthy();
		expect(isJapaneseString('Liferay')).toBeFalsy();
		expect(isJapaneseString('Plataform Experience')).toBeFalsy();
		expect(isJapaneseString('Analytics Cloud')).toBeFalsy();
	});
});

describe('formatDate', () => {
	it('returns formatted date for PDF document', () => {
		expect(formatDate(moment(0))).toBe('1970-01-01');
	});
});
