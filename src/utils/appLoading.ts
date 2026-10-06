/**
 * 読み込み画面の段階を進める・消す（React からもページのスクリプトからも呼ぶ）。
 * 中身は appLoadingDom.ts。サーバー側（document が無いとき）は何もしない。
 */
import { APP_LOADING_FAILSAFE_MS, type AppLoadingStage } from '../constants/appLoading';
import { applyAppLoadingStage, hideAppLoadingDom } from './appLoadingDom';
import type { Language } from './translation';

export function setAppLoadingStage(stage: AppLoadingStage, language?: Language): void {
  if (typeof document === 'undefined') return;
  applyAppLoadingStage(document, stage, language);
}

export function hideAppLoading(): void {
  if (typeof document === 'undefined') return;
  hideAppLoadingDom(document);
}

/** 何かで消し損ねても読み込み画面が出たままにならないよう、一定時間で必ず消す。戻り値で取り消せる */
export function scheduleAppLoadingFailsafe(): () => void {
  if (typeof window === 'undefined') return () => {};
  const id = window.setTimeout(hideAppLoading, APP_LOADING_FAILSAFE_MS);
  return () => window.clearTimeout(id);
}
