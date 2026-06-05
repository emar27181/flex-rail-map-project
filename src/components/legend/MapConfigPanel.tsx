import React, { useRef, useState } from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { section, text, btn, btnFull, textarea, L } from './legendStyles';
import { translateUI } from '../../utils/translation';
import type { Language } from '../../utils/translation';

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
  showRouteLine: boolean;
};

type Props = {
  config: MapConfig;
  theme: 'light' | 'dark';
  language: Language;
  onImport: (config: MapConfig) => void;
};

export default function MapConfigPanel({ config, theme, language, onImport }: Props) {
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
      setError(translateUI('configImportErrorApply', language));
    }
  };

  const handleImportText = () => {
    try {
      applyConfig(JSON.parse(pasteText));
    } catch {
      setError(translateUI('configImportErrorJson', language));
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try { applyConfig(JSON.parse(ev.target?.result as string)); }
      catch { setError(translateUI('configImportErrorFile', language)); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={section.wrap(colors)}>
      {/* ヘッダー */}
      <div style={section.header} onClick={() => setOpen(v => !v)}>
        <span style={section.arrow(colors)}>{open ? '▼' : '▶'}</span>
        <span style={section.title(colors)}>{translateUI('configSaveLoad', language)}</span>
        {importDone && (
          <span style={{ fontSize: L.fs.xs, color: '#27ae60', marginLeft: L.sp.xs }}>
            {translateUI('configImportDone', language)}
          </span>
        )}
      </div>

      {open && (
        <div style={section.body}>

          {/* エクスポート */}
          <div>
            <div style={text.desc(colors)}>{translateUI('configExportDesc', language)}</div>
            <div style={{ display: 'flex', gap: L.sp.xs }}>
              <button onClick={handleExportDownload} style={btn(colors)}>{translateUI('configExportSave', language)}</button>
              <button onClick={handleCopy}           style={btn(colors)}>
                {copied ? translateUI('configExportCopied', language) : translateUI('configExportCopy', language)}
              </button>
            </div>
          </div>

          {/* インポート */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: L.sp.xs }}>
            <div style={text.desc(colors)}>{translateUI('configImportDesc', language)}</div>
            <input ref={fileInputRef} type="file" accept=".json"
              onChange={handleFileImport} style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current?.click()} style={btnFull(colors)}>
              {translateUI('configImportFile', language)}
            </button>
            <textarea
              value={pasteText}
              onChange={e => { setPasteText(e.target.value); setError(null); }}
              placeholder={translateUI('configImportPaste', language)}
              rows={3}
              style={textarea(colors)}
            />
            <button
              onClick={handleImportText}
              disabled={!pasteText.trim()}
              style={{ ...btnFull(colors), opacity: pasteText.trim() ? 1 : 0.5 }}
            >
              {translateUI('configImportApply', language)}
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
