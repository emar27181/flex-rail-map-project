/**
 * 読み込み画面（index.astro の #app-loading）の文言の差し替えと消去。DOM だけを触る。
 *
 * 文言は全言語ぶんを data-messages に埋め込んであり、data-lang の言語・data-stage の段階の
 * 文言を出す。段階は進むだけで戻らない。一度消したら出し直さない。
 */
import {
  APP_LOADING_FADE_MS,
  APP_LOADING_ID,
  APP_LOADING_MESSAGE_ID,
  APP_LOADING_STAGES,
  type AppLoadingMessages,
  type AppLoadingStage,
} from '../constants/appLoading';
import type { Language } from './translation';

const stageIndex = (stage: string | undefined) =>
  APP_LOADING_STAGES.indexOf((stage ?? 'start') as AppLoadingStage);

/** 段階（と言語）を進めて文言を差し替える。消した後・要素が無いときは何もしない。差し替えたら true */
export function applyAppLoadingStage(doc: Document, stage: AppLoadingStage, language?: Language): boolean {
  const el = doc.getElementById(APP_LOADING_ID);
  if (!el || el.dataset.hidden === '1') return false;
  if (language) el.dataset.lang = language;
  const next = stageIndex(stage) > stageIndex(el.dataset.stage) ? stage : (el.dataset.stage as AppLoadingStage ?? 'start');
  el.dataset.stage = next;
  let messages: Partial<AppLoadingMessages> = {};
  try { messages = JSON.parse(el.dataset.messages ?? '{}'); } catch { /* 文言が無くても画面は出したまま */ }
  const lang = (el.dataset.lang ?? 'japanese') as Language;
  const text = messages[lang]?.[next] ?? messages.japanese?.[next];
  const msg = doc.getElementById(APP_LOADING_MESSAGE_ID);
  if (msg && text) msg.textContent = text;
  return true;
}

/** 読み込み画面を消す（フェードしてから非表示）。2回目以降は何もしない */
export function hideAppLoadingDom(doc: Document): void {
  const el = doc.getElementById(APP_LOADING_ID);
  if (!el || el.dataset.hidden === '1') return;
  el.dataset.hidden = '1';
  el.style.opacity = '0';
  el.style.pointerEvents = 'none';
  setTimeout(() => { el.style.display = 'none'; }, APP_LOADING_FADE_MS);
}
