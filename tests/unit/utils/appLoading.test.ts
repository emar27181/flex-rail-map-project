/**
 * 地図ページの読み込み画面（constants/appLoading.ts / utils/appLoadingDom.ts）のテスト。
 *
 * 以前は ThemeWrapper のマウントで消していて、地図ライブラリが届くまで仮表示とフッターが見えていた。
 * 読み込み画面は段階ごとに文言を進め（戻らない）、地図を描いた後に一度だけ消す。
 */
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  APP_LOADING_ID,
  APP_LOADING_MESSAGE_ID,
  APP_LOADING_STAGES,
  APP_LOADING_MESSAGE_KEYS,
  APP_LOADING_FADE_MS,
  type AppLoadingMessages,
} from '../../../src/constants/appLoading';
import { applyAppLoadingStage, hideAppLoadingDom } from '../../../src/utils/appLoadingDom';
import { translateUI, type Language } from '../../../src/utils/translation';

const LANGS: Language[] = ['japanese', 'english', 'chinese', 'korean'];
const messages = Object.fromEntries(LANGS.map(l => [
  l, Object.fromEntries(APP_LOADING_STAGES.map(s => [s, translateUI(APP_LOADING_MESSAGE_KEYS[s], l)])),
])) as AppLoadingMessages;

function mount() {
  document.body.innerHTML = `<div id="${APP_LOADING_ID}" data-stage="start" data-lang="japanese"><div id="${APP_LOADING_MESSAGE_ID}"></div></div>`;
  document.getElementById(APP_LOADING_ID)!.dataset.messages = JSON.stringify(messages);
}
const text = () => document.getElementById(APP_LOADING_MESSAGE_ID)!.textContent;
const el = () => document.getElementById(APP_LOADING_ID)!;

describe('読み込み画面の文言', () => {
  it('全言語・全段階に訳がある（キーのまま出ない）', () => {
    for (const l of LANGS) for (const s of APP_LOADING_STAGES) {
      expect(messages[l][s]).toBeTruthy();
      expect(messages[l][s]).not.toBe(APP_LOADING_MESSAGE_KEYS[s]);
    }
  });

  it('段階ごとに文言が違う', () => {
    expect(new Set(APP_LOADING_STAGES.map(s => messages.japanese[s])).size).toBe(APP_LOADING_STAGES.length);
  });
});

describe('段階の進み方', () => {
  beforeEach(mount);

  it('段階を進めると文言が変わる', () => {
    applyAppLoadingStage(document, 'start');
    expect(text()).toBe(messages.japanese.start);
    applyAppLoadingStage(document, 'routes');
    expect(text()).toBe(messages.japanese.routes);
    applyAppLoadingStage(document, 'map');
    expect(text()).toBe(messages.japanese.map);
  });

  it('前の段階には戻らない（遅れて届いた知らせで巻き戻らない）', () => {
    applyAppLoadingStage(document, 'map');
    applyAppLoadingStage(document, 'routes');
    expect(el().dataset.stage).toBe('map');
    expect(text()).toBe(messages.japanese.map);
  });

  it('言語を渡すとその言語の文言になり、段階はそのまま', () => {
    applyAppLoadingStage(document, 'routes');
    applyAppLoadingStage(document, 'start', 'english');
    expect(el().dataset.stage).toBe('routes');
    expect(text()).toBe(messages.english.routes);
  });

  it('要素が無くても落ちない', () => {
    document.body.innerHTML = '';
    expect(applyAppLoadingStage(document, 'map')).toBe(false);
    expect(() => hideAppLoadingDom(document)).not.toThrow();
  });
});

describe('消し方', () => {
  beforeEach(() => { mount(); vi.useFakeTimers(); });
  afterEach(() => vi.useRealTimers());

  it('フェードしてから非表示にする', () => {
    hideAppLoadingDom(document);
    expect(el().style.opacity).toBe('0');
    expect(el().style.display).not.toBe('none');
    vi.advanceTimersByTime(APP_LOADING_FADE_MS);
    expect(el().style.display).toBe('none');
  });

  it('消した後は段階を進めても出し直さない', () => {
    hideAppLoadingDom(document);
    vi.advanceTimersByTime(APP_LOADING_FADE_MS);
    expect(applyAppLoadingStage(document, 'map')).toBe(false);
    expect(el().style.display).toBe('none');
  });
});
