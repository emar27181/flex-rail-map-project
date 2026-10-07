/**
 * 本番のサイトで開いているかの判定。
 *
 * PR ごとのプレビュー（deploy-preview-N--…）はURLが毎回違い、ブラウザの保存領域も別になる。
 * そのため Cookie の確認を保存していても、プレビューを開くたびに同じ確認が出ていた。
 * Cookie の確認と GA4 の計測は本番（SITE_URL と同じオリジン）だけで行う。
 */
import { SITE_URL } from '../config/seo';

/** 本番サイトのオリジン（https://…） */
export const PRODUCTION_ORIGIN = new URL(SITE_URL).origin;

/** origin が本番サイトか。プレビュー・ローカル（localhost）では false */
export function isProductionSite(
  origin: string = typeof window !== 'undefined' ? window.location.origin : '',
): boolean {
  return origin === PRODUCTION_ORIGIN;
}
