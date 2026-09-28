/**
 * サイト紹介文（/about・/faq など）に出す数値の唯一の出どころ。
 *
 * /about・/faq には「39路線・東京のみ・日本語と英語のみ」と手で書かれたまま、
 * 実装は全国約490路線・4言語になっていた（文言の手書きが実装に追いつかない）。
 * 路線数・駅数は路線データからビルド時に数えるので、データを増やせば自動で追従する。
 */
import { routes } from '../data/routes';

/** 収録路線数（路線データの本数） */
export const ROUTE_COUNT = Object.keys(routes).length;

/** 収録駅数（駅名の重複を除いた数） */
export const STATION_COUNT = new Set(Object.values(routes).flatMap(list => list.map(s => s.name))).size;

/** 「約6,000」のように百の位で切り捨てた表記 */
export function approxCount(n: number, locale: 'ja' | 'en' = 'ja'): string {
  const floored = Math.floor(n / 100) * 100;
  return floored.toLocaleString(locale === 'ja' ? 'ja-JP' : 'en-US');
}

/** アプリの対応言語（src/utils/translation.ts の Language 型と同じ4つ） */
export const SUPPORTED_LANGUAGES = {
  ja: '日本語・英語・中国語（簡体字）・韓国語',
  en: 'Japanese, English, Chinese (Simplified) and Korean',
} as const;
