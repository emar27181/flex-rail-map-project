import React, { useRef, useState } from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { section, text, btn, btnFull, textarea, L } from './legendStyles';

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
  showStationTooltip: boolean;
  showFullRouteStations: boolean;
};

type Props = {
  config: MapConfig;
  theme: 'light' | 'dark';
  onImport: (config: MapConfig) => void;
};

export default function MapConfigPanel({ config, theme, onImport }: Props) {
  const colors = getThemeColors(theme);
  const [open, setOpen]           = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [error, setError]         = useState<string | null>(null);
  const [copied, setCopied]       = useState(false);
  const [importDone, setImportDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const jsonStr = JSON.stringify(config, null, 2);

  const handleExportDownload = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
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
      try { applyConfig(JSON.parse(ev.target?.result as string)); }
      catch { setError('ファイルの読み込みに失敗しました'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={section.wrap(colors)}>
      {/* ヘッダー */}
      <div style={section.header} onClick={() => setOpen(v => !v)}>
        <span style={section.arrow(colors)}>{open ? '▼' : '▶'}</span>
        <span style={section.title(colors)}>設定の保存・読込</span>
        {importDone && (
          <span style={{ fontSize: L.fs.xs, color: '#27ae60', marginLeft: L.sp.xs }}>
            ✓ 適用済み
          </span>
        )}
      </div>

      {open && (
        <div style={section.body}>

          {/* エクスポート */}
          <div>
            <div style={text.desc(colors)}>エクスポート（現在の表示設定）</div>
            <div style={{ display: 'flex', gap: L.sp.xs }}>
              <button onClick={handleExportDownload} style={btn(colors)}>⬇ JSON保存</button>
              <button onClick={handleCopy}           style={btn(colors)}>
                {copied ? '✓ コピー済み' : '📋 テキストコピー'}
              </button>
            </div>
          </div>

          {/* インポート */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: L.sp.xs }}>
            <div style={text.desc(colors)}>インポート（設定を読み込む）</div>
            <input ref={fileInputRef} type="file" accept=".json"
              onChange={handleFileImport} style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current?.click()} style={btnFull(colors)}>
              📂 JSONファイルを開く
            </button>
            <textarea
              value={pasteText}
              onChange={e => { setPasteText(e.target.value); setError(null); }}
              placeholder="JSONテキストをここに貼り付け..."
              rows={3}
              style={textarea(colors)}
            />
            <button
              onClick={handleImportText}
              disabled={!pasteText.trim()}
              style={{ ...btnFull(colors), opacity: pasteText.trim() ? 1 : 0.5 }}
            >
              ✅ テキストから適用
            </button>
            {error && (
              <div style={{ fontSize: L.fs.xs, color: '#e74c3c' }}>{error}</div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
