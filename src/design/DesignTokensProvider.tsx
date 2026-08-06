import React, { createContext, useContext, useState, useMemo, useCallback, useRef, useLayoutEffect, useEffect } from 'react';
import { defaultTokens } from './tokens';
import { buildCssVariables, type CssVarMap } from './cssVars';
import { useTheme } from '../contexts/ThemeContext';

const OVERRIDES_STORAGE_KEY = 'v2DesignTokenOverrides';

interface DesignTokensContextValue {
  /** 現在有効な値（デフォルト値 + ユーザー上書きをマージ済み） */
  vars: CssVarMap;
  /** 現在のテーマにおけるデフォルト値（上書きなし） */
  defaults: CssVarMap;
  /** ユーザーによる上書き分のみ */
  overrides: CssVarMap;
  setOverride: (name: string, value: string) => void;
  resetOverride: (name: string) => void;
  resetAll: () => void;
}

const DesignTokensContext = createContext<DesignTokensContextValue | undefined>(undefined);

export const useDesignTokens = (): DesignTokensContextValue => {
  const ctx = useContext(DesignTokensContext);
  if (!ctx) throw new Error('useDesignTokens must be used within DesignTokensProvider');
  return ctx;
};

function loadOverrides(): CssVarMap {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

interface DesignTokensProviderProps {
  children: React.ReactNode;
}

/**
 * v2 UI用のデザイントークンをCSS変数としてDOMに適用するプロバイダ。
 *
 * ラップしたdiv要素にCSS変数をセットする(document.documentElementではなく)ことで、
 * v1のグローバルスタイルに影響を与えずv2配下だけに適用範囲を限定する。
 * カスタムプロパティはDOMツリーを通じて子孫に継承されるため、
 * v2配下のコンポーネントはどこからでも `var(--v2-color-primary)` 等で参照できる。
 */
export const DesignTokensProvider: React.FC<DesignTokensProviderProps> = ({ children }) => {
  const { theme } = useTheme();
  const [overrides, setOverrides] = useState<CssVarMap>(loadOverrides);
  const rootRef = useRef<HTMLDivElement>(null);

  const defaults = useMemo(() => buildCssVariables(defaultTokens, theme), [theme]);
  const vars = useMemo(() => ({ ...defaults, ...overrides }), [defaults, overrides]);

  // ペイント前にCSS変数を適用し、デフォルト値のちらつき(FOUC)を防ぐ
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    Object.entries(vars).forEach(([name, value]) => {
      el.style.setProperty(name, value);
    });
  }, [vars]);

  useEffect(() => {
    localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  }, [overrides]);

  const setOverride = useCallback((name: string, value: string) => {
    setOverrides(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetOverride = useCallback((name: string) => {
    setOverrides(prev => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const resetAll = useCallback(() => setOverrides({}), []);

  const contextValue = useMemo<DesignTokensContextValue>(
    () => ({ vars, defaults, overrides, setOverride, resetOverride, resetAll }),
    [vars, defaults, overrides, setOverride, resetOverride, resetAll]
  );

  return (
    <DesignTokensContext.Provider value={contextValue}>
      <div ref={rootRef} data-v2-root style={{ minHeight: '100%' }}>
        {children}
      </div>
    </DesignTokensContext.Provider>
  );
};
