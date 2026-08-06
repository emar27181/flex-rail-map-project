export type UiVersion = 'v1' | 'v2';

export const UI_VERSION_STORAGE_KEY = 'frm-ui-version';

export const normalizeUiVersion = (value: string | null): UiVersion | null => {
  return value === 'v1' || value === 'v2' ? value : null;
};

export const getInitialUiVersion = (): UiVersion => {
  if (typeof window === 'undefined') return 'v1';
  const params = new URLSearchParams(window.location.search);
  return normalizeUiVersion(params.get('ui'))
    ?? normalizeUiVersion(window.localStorage.getItem(UI_VERSION_STORAGE_KEY))
    ?? 'v1';
};

export const persistUiVersion = (version: UiVersion): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(UI_VERSION_STORAGE_KEY, version);
};
