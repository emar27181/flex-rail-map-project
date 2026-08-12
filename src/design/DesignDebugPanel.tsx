import React, { useMemo, useState } from 'react';
import { Palette, X, RotateCcw } from 'lucide-react';
import { useDesignTokens } from './DesignTokensProvider';
import { CSS_VAR_PREFIX } from './cssVars';

const HEX_COLOR = /^#([0-9a-fA-F]{6})$/;

const CATEGORY_LABELS: Record<string, string> = {
  color: '色',
  font: 'フォント',
  line: '行の高さ',
  space: '余白',
  radius: '角丸',
  shadow: '影',
  transition: 'トランジション',
  z: '重なり順(z-index)',
  breakpoint: 'ブレークポイント(px)',
};

function categoryOf(varName: string): string {
  return varName.replace(CSS_VAR_PREFIX, '').split('-')[0];
}

function labelOf(varName: string): string {
  return varName.replace(CSS_VAR_PREFIX, '');
}

/**
 * v2 UIのデザイントークンをその場で自由に調整できるデバッグ用パネル。
 *
 * defaults(buildCssVariablesの出力)のキー集合をそのまま列挙するため、
 * tokens.ts に新しい値を追加すればこのパネルにも自動的に編集項目が増える。
 * 変更はDesignTokensProvider経由でCSS変数へ即時反映され、localStorageに永続化される。
 */
const DesignDebugPanel: React.FC = () => {
  const { defaults, overrides, setOverride, resetOverride, resetAll } = useDesignTokens();
  const [isOpen, setIsOpen] = useState(false);

  const grouped = useMemo(() => {
    const groups = new Map<string, string[]>();
    Object.keys(defaults).forEach(name => {
      const cat = categoryOf(name);
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(name);
    });
    return Array.from(groups.entries());
  }, [defaults]);

  const overrideCount = Object.keys(overrides).length;

  return (
    <>
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-label="デザイントークンを編集"
        title="デザイントークンを編集(デバッグ用)"
        style={{
          position: 'fixed',
          // 下部Sticky広告(90px)の上に浮かせて隠れないようにする
          bottom: 'calc(106px + env(safe-area-inset-bottom, 0px))',
          right: '16px',
          zIndex: 9998,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'var(--v2-color-primary)',
          color: 'var(--v2-color-text-on-primary)',
          boxShadow: 'var(--v2-shadow-md)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Palette size={20} />
        {overrideCount > 0 && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-2px',
            minWidth: '16px', height: '16px', padding: '0 3px',
            borderRadius: '999px', backgroundColor: 'var(--v2-color-danger)',
            color: '#fff', fontSize: '10px', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{overrideCount}</span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(340px, 100vw)',
          zIndex: 9999,
          backgroundColor: 'var(--v2-color-surface)',
          borderLeft: '1px solid var(--v2-color-border)',
          boxShadow: 'var(--v2-shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--v2-font-family)',
          color: 'var(--v2-color-text)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 'var(--v2-space-3) var(--v2-space-4)',
            borderBottom: '1px solid var(--v2-color-border)',
          }}>
            <span style={{ fontSize: 'var(--v2-font-size-md)', fontWeight: 'var(--v2-font-weight-bold)' }}>
              デザイントークン (デバッグ)
            </span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="閉じる"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--v2-color-text-secondary)' }}
            ><X size={18} /></button>
          </div>

          <div style={{ padding: 'var(--v2-space-2) var(--v2-space-4)', borderBottom: '1px solid var(--v2-color-border)' }}>
            <button
              onClick={resetAll}
              disabled={overrideCount === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--v2-space-1)',
                fontSize: 'var(--v2-font-size-sm)',
                padding: 'var(--v2-space-1) var(--v2-space-3)',
                borderRadius: 'var(--v2-radius-sm)',
                border: '1px solid var(--v2-color-border)',
                backgroundColor: 'transparent',
                color: overrideCount === 0 ? 'var(--v2-color-text-muted)' : 'var(--v2-color-text)',
                cursor: overrideCount === 0 ? 'default' : 'pointer',
              }}
            ><RotateCcw size={13} /> 全てリセット ({overrideCount})</button>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: 'var(--v2-space-2) var(--v2-space-4)' }}>
            {grouped.map(([cat, names]) => (
              <div key={cat} style={{ marginBottom: 'var(--v2-space-4)' }}>
                <div style={{
                  fontSize: 'var(--v2-font-size-xs)', fontWeight: 'var(--v2-font-weight-bold)',
                  color: 'var(--v2-color-text-secondary)', textTransform: 'uppercase',
                  marginBottom: 'var(--v2-space-2)', letterSpacing: '0.04em',
                }}>{CATEGORY_LABELS[cat] ?? cat}</div>

                {names.map(name => {
                  const defaultValue = defaults[name];
                  const currentValue = overrides[name] ?? defaultValue;
                  const isOverridden = name in overrides;
                  const isColor = HEX_COLOR.test(defaultValue);

                  return (
                    <div key={name} style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--v2-space-2)',
                      marginBottom: 'var(--v2-space-2)',
                    }}>
                      <label
                        title={name}
                        style={{
                          flex: 1, minWidth: 0, fontSize: 'var(--v2-font-size-xs)',
                          color: isOverridden ? 'var(--v2-color-primary)' : 'var(--v2-color-text-secondary)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}
                      >{labelOf(name)}</label>

                      {isColor ? (
                        <input
                          type="color"
                          value={currentValue}
                          onChange={e => setOverride(name, e.target.value)}
                          style={{ width: '28px', height: '24px', padding: 0, border: '1px solid var(--v2-color-border)', borderRadius: 'var(--v2-radius-sm)', cursor: 'pointer', flexShrink: 0 }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={currentValue}
                          onChange={e => setOverride(name, e.target.value)}
                          style={{
                            width: '96px', flexShrink: 0, boxSizing: 'border-box',
                            fontSize: 'var(--v2-font-size-xs)', padding: '2px 4px',
                            border: '1px solid var(--v2-color-border)', borderRadius: 'var(--v2-radius-sm)',
                            backgroundColor: 'var(--v2-color-bg-elevated)', color: 'var(--v2-color-text)',
                          }}
                        />
                      )}

                      {isOverridden && (
                        <button
                          onClick={() => resetOverride(name)}
                          aria-label={`${name}をリセット`}
                          title="デフォルトに戻す"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--v2-color-text-muted)', flexShrink: 0, display: 'flex' }}
                        ><RotateCcw size={12} /></button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DesignDebugPanel;
