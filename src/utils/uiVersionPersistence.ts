export type UiVersion = 'v1' | 'v2';

export const UI_VERSION_STORAGE_KEY = 'frm-ui-version';

export const normalizeUiVersion = (value: string | null): UiVersion | null => {
  return value === 'v1' || value === 'v2' ? value : null;
};

/**
 * 初期表示するUIバージョンを決定する。
 *
 * @param toggleEnabled 切り替えボタンが表示されているか。
 *   false のときは localStorage の保存値を無視して v1 に固定する。
 *   これを無視すると、以前v2を選んだ状態で切り替えボタンを隠した場合に
 *   ユーザーがv2から戻れなくなる。URLの ?ui=v2 は開発用に常に有効。
 */
export const getInitialUiVersion = (toggleEnabled: boolean = true): UiVersion => {
  if (typeof window === 'undefined') return 'v1';
  const params = new URLSearchParams(window.location.search);
  const fromUrl = normalizeUiVersion(params.get('ui'));
  if (fromUrl) return fromUrl;
  if (!toggleEnabled) return 'v1';
  return normalizeUiVersion(window.localStorage.getItem(UI_VERSION_STORAGE_KEY)) ?? 'v1';
};

export const persistUiVersion = (version: UiVersion): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(UI_VERSION_STORAGE_KEY, version);
};
