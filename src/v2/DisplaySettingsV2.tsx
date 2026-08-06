import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { translateUI } from '../utils/translation';
import type { Language } from '../utils/translation';

interface DisplaySettingsV2Props {
  showStationNames: boolean;
  onShowStationNamesChange: (v: boolean) => void;
  language: Language;
}

/** v2版の表示設定パネル。v1のLegendRouteListの一部に相当する軽量版 */
const DisplaySettingsV2: React.FC<DisplaySettingsV2Props> = ({
  showStationNames, onShowStationNamesChange, language,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      backgroundColor: 'var(--v2-color-surface)',
      border: '1px solid var(--v2-color-border)',
      borderRadius: 'var(--v2-radius-lg)',
      boxShadow: 'var(--v2-shadow-sm)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setIsOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--v2-space-3) var(--v2-space-4)',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--v2-font-family)', color: 'var(--v2-color-text)',
        }}
      >
        <span style={{ fontSize: 'var(--v2-font-size-base)', fontWeight: 'var(--v2-font-weight-bold)' }}>
          {translateUI('displaySettings', language)}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div style={{ padding: '0 var(--v2-space-4) var(--v2-space-4)' }}>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 'var(--v2-space-2)',
            padding: 'var(--v2-space-1) 0', fontSize: 'var(--v2-font-size-sm)',
            color: 'var(--v2-color-text)', cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={showStationNames}
              onChange={e => onShowStationNamesChange(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--v2-color-primary)' }}
            />
            {translateUI('showStationNames', language)}
          </label>
        </div>
      )}
    </div>
  );
};

export default DisplaySettingsV2;
