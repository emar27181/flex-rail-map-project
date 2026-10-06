/**
 * 地図ページ（/）の読み込み画面の規格。
 *
 * 以前は ThemeWrapper がマウントした時点で読み込み画面を消していたため、
 * 地図ライブラリが届くまでの数秒間、仮表示「マップを読み込み中...」とフッターが見えていた。
 * 読み込み画面は地図を最初に描いた後に消し、その間は段階ごとの文言を出す。
 *
 * 段階は進むだけで戻らない（後から届いた古い知らせで文言が巻き戻らないように）。
 * - start : ページが開いた（読み込んでいます…）
 * - routes: アプリ本体・地図ライブラリが届いた（路線図を準備しています…）
 * - map   : 地図を描いている（地図を表示しています…）
 */
import type { Language } from '../utils/translation';

export const APP_LOADING_ID = 'app-loading';
export const APP_LOADING_MESSAGE_ID = 'app-loading-message';

export const APP_LOADING_STAGES = ['start', 'routes', 'map'] as const;
export type AppLoadingStage = typeof APP_LOADING_STAGES[number];

/** 段階ごとの文言の翻訳キー（translation.ts） */
export const APP_LOADING_MESSAGE_KEYS: Record<AppLoadingStage, string> = {
  start: 'appLoadingStart',
  routes: 'appLoadingRoutes',
  map: 'appLoadingMap',
};

/** 流れる帯の大きさと1往復の時間（進み具合ではなく「動いている」ことだけを示す） */
export const APP_LOADING_BAR = { widthPx: 160, heightPx: 3, cycleMs: 1200 } as const;

/** 読み込み画面を消すときのフェードの長さ(ms) */
export const APP_LOADING_FADE_MS = 200;
/** 何かで消し損ねても、この時間(ms)で必ず消す（読み込み画面が出たままにならない保険） */
export const APP_LOADING_FAILSAFE_MS = 20000;

/** 全言語ぶんの文言。ビルド時にページへ埋め込み、閲覧者の言語をページ側で選ぶ */
export type AppLoadingMessages = Record<Language, Record<AppLoadingStage, string>>;
