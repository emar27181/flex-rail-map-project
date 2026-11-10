/**
 * 設定パネルのいちばん下の「バージョン」（オーガニズム）。
 *
 * - いま動いている版の番号と、ビルドした時刻
 * - 「更新を確認」: サーバーにある版と比べ、新しければ再読み込みを出す。最後に確認した時刻も出す
 * - 更新履歴: 版ごとの公開時刻と変更点（src/data/releases.ts）。最初は数件だけ出し、少しずつ広げる
 *
 * 時刻は見ている人の時間帯で出す。最後に確認した時刻は、その人のブラウザにだけ残す（無くても動く）。
 */
import React, { useCallback, useState } from 'react';
import { RefreshCw, RotateCw } from 'lucide-react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { section, text, L } from './legendStyles';
import { translateUI, type Language } from '../../utils/translation';
import Button from '../ui/atoms/Button';
import DisclosureIndicator from '../ui/atoms/DisclosureIndicator';
import { RELEASES, type Release } from '../../data/releases';
import {
  BUILT_AT, BUILD_COMMIT, CURRENT_VERSION, checkForUpdate, formatDateTime, releaseNotes, type UpdateCheckResult,
} from '../../utils/appVersion';

/** 更新履歴を最初に出す件数と、「さらに表示」で増やす件数 */
export const VERSION_HISTORY_INITIAL = 5;
export const VERSION_HISTORY_STEP = 10;

const LAST_CHECK_KEY = 'flexRailMap.lastUpdateCheck';

function readLastCheck(): UpdateCheckResult | null {
  try {
    const raw = localStorage.getItem(LAST_CHECK_KEY);
    return raw ? JSON.parse(raw) as UpdateCheckResult : null;
  } catch {
    return null;
  }
}

function saveLastCheck(result: UpdateCheckResult) {
  try { localStorage.setItem(LAST_CHECK_KEY, JSON.stringify(result)); } catch { /* 保存できなくても確認の結果は画面に出る */ }
}

interface Props {
  theme: 'light' | 'dark';
  language: Language;
  /** 更新の確認（テストで差し替える） */
  check?: () => Promise<UpdateCheckResult>;
  /** 新しい版を読み込む（テストで差し替える） */
  reload?: () => void;
  /** 更新履歴（テストで差し替える） */
  releases?: Release[];
}

export default function VersionPanel({
  theme, language, check = () => checkForUpdate(), reload = () => window.location.reload(), releases = RELEASES,
}: Props) {
  const colors = getThemeColors(theme);
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<UpdateCheckResult | null>(readLastCheck);
  const [shown, setShown] = useState(VERSION_HISTORY_INITIAL);

  const runCheck = useCallback(async () => {
    setChecking(true);
    const r = await check();
    setResult(r);
    saveLastCheck(r);
    setChecking(false);
  }, [check]);

  const time = (iso: string) => formatDateTime(iso, language);
  const visible = releases.slice(0, shown);
  const rest = releases.length - visible.length;

  return (
    <div style={section.wrap(colors)} data-version-panel>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        style={section.header}
        onClick={() => setOpen(v => !v)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(v => !v); } }}
      >
        <span style={section.title(colors)}>{translateUI('versionTitle', language)}</span>
        <span style={text.body(colors)}>{CURRENT_VERSION}</span>
        <span style={section.indicator}><DisclosureIndicator expanded={open} theme={theme} /></span>
      </div>

      {open && (
        <div style={section.body}>
          {/* いまの版 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: L.sp.xs }}>
            <div style={text.body(colors)}>
              <strong>{CURRENT_VERSION}</strong>
              {BUILT_AT && (
                <span style={{ color: colors.textSecondary }}>
                  {'  '}{translateUI('versionBuiltAt', language)} {time(BUILT_AT)}{BUILD_COMMIT ? ` (${BUILD_COMMIT})` : ''}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.xs, flexWrap: 'wrap' }}>
              <Button theme={theme} variant="outline" size="sm" onClick={runCheck} disabled={checking} icon={<RefreshCw />}>
                {translateUI(checking ? 'versionChecking' : 'versionCheckUpdate', language)}
              </Button>
              {result?.status === 'available' && (
                <Button theme={theme} variant="primary" size="sm" onClick={reload} icon={<RotateCw />}>
                  {translateUI('versionReload', language)}
                </Button>
              )}
            </div>
            {result && (
              <div style={text.desc(colors)} role="status" data-update-status={result.status}>
                {result.status === 'latest' && translateUI('versionUpToDate', language)}
                {result.status === 'available' && translateUI('versionUpdateAvailable', language, { version: result.latest.version })}
                {result.status === 'failed' && translateUI('versionCheckFailed', language)}
                {' · '}{translateUI('versionLastChecked', language, { time: time(result.checkedAt) })}
              </div>
            )}
          </div>

          {/* 更新履歴 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: L.sp.sm }}>
            <div style={section.title(colors)}>{translateUI('versionHistory', language)}</div>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: L.sp.md }}>
              {visible.map(r => {
                const at = r.releasedAt ?? BUILT_AT;
                return (
                  <li key={r.version} data-release={r.version}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: L.sp.sm, flexWrap: 'wrap' }}>
                      <strong style={text.body(colors)}>{r.version}</strong>
                      {at && <span style={{ ...text.body(colors), color: colors.textSecondary }}>{time(at)}</span>}
                    </div>
                    <ul style={{ margin: `${L.sp.xxs} 0 0`, paddingLeft: L.sp.xl, ...text.body(colors) }}>
                      {releaseNotes(r, language).map(note => <li key={note}>{note}</li>)}
                    </ul>
                  </li>
                );
              })}
            </ol>
            {rest > 0 && (
              <Button theme={theme} variant="outline" size="sm" fullWidth onClick={() => setShown(n => n + VERSION_HISTORY_STEP)}>
                {translateUI('versionShowMore', language, { count: rest })}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
