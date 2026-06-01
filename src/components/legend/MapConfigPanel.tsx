import React, { useRef, useState } from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';

export type MapConfig = {
  version: 1;
  heatmapEnabled: boolean;
  heatmapParam: string;
  heatmapCustomRange?: { min: number; max: number };
  visibleRoutes: string[];
  showTransferStationsOnly: boolean;
  showExpressStationsOnly: boolean;
  showTravelTimes: boolean;
  showStationNames: boolean;
  showFurigana: boolean;
  showStationNumbers: boolean;
  showOsmTiles: boolean;
  mapViewMode: string;
  timeFilterEnabled: boolean;
  timeFilterMaxMinutes: number;
};

type Props = {
  config: MapConfig;
  theme: 'light' | 'dark';
  onImport: (config: MapConfig) => void;
};

export default function MapConfigPanel({ config, theme, onImport }: Props) {
  const colors = getThemeColors(theme);
  const [open, setOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [importDone, setImportDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const jsonStr = JSON.stringify(config, null, 2);

  const handleExportDownload = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flex-rail-map-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyConfig = (parsed: unknown) => {
    try {
      onImport(parsed as MapConfig);
      setError(null);
      setPasteText('');
      setImportDone(true);
      setTimeout(() => setImportDone(false), 2000);
    } catch {
      setError('設定の適用に失敗しました');
    }
  };

  const handleImportText = () => {
    try {
      applyConfig(JSON.parse(pasteText));
    } catch {
      setError('JSONの形式が正しくありません');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        applyConfig(JSON.parse(ev.target?.result as string));
      } catch {
        setError('ファイルの読み込みに失敗しました');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const btn: React.CSSProperties = {
    fontSize: '11px', padding: '3px 8px', cursor: 'pointer',
    borderRadius: '4px', border: `1px solid ${colors.border}`,
    background: colors.surfaceElevated, color: colors.text,
  };

  return (
    <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '8px', marginTop: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        onClick={() => setOpen(v => !v)}>
        <span style={{ fontSize: '11px', color: colors.textSecondary, userSelect: 'none' }}>
          {open ? '▼' : '▶'}
        </span>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: colors.text, userSelect: 'none' }}>
          設定の保存・読込
        </span>
        {importDone && (
          <span style={{ fontSize: '10px', color: '#27ae60' }}>✓ 適用済み</span>
        )}
      </div>

      {open && (
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* エクスポート */}
          <div>
            <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px' }}>
              エクスポート（現在の表示設定）
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={handleExportDownload} style={btn}>⬇ JSON保存</button>
              <button onClick={handleCopy} style={btn}>
                {copied ? '✓ コピー済み' : '📋 テキストコピー'}
              </button>
            </div>
          </div>

          {/* インポート */}
          <div>
            <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px' }}>
              インポート（設定を読み込む）
            </div>
            <input ref={fileInputRef} type="file" accept=".json"
              onChange={handleFileImport} style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current?.click()}
              style={{ ...btn, width: '100%', marginBottom: '4px', boxSizing: 'border-box' }}>
              📂 JSONファイルを開く
            </button>
            <textarea
              value={pasteText}
              onChange={e => { setPasteText(e.target.value); setError(null); }}
              placeholder="JSONテキストをここに貼り付け..."
              rows={3}
              style={{
                width: '100%', fontSize: '11px', padding: '4px',
                border: `1px solid ${colors.border}`, borderRadius: '4px',
                background: colors.surface, color: colors.text,
                resize: 'vertical', boxSizing: 'border-box', display: 'block',
              }}
            />
            <button onClick={handleImportText} disabled={!pasteText.trim()}
              style={{ ...btn, width: '100%', marginTop: '4px', boxSizing: 'border-box',
                opacity: pasteText.trim() ? 1 : 0.5 }}>
              ✅ テキストから適用
            </button>
            {error && (
              <div style={{ fontSize: '10px', color: '#e74c3c', marginTop: '3px' }}>{error}</div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
