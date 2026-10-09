import React from 'react';
import Dialog from './ui/molecules/Dialog';
import Button from './ui/atoms/Button';
import { getThemeColors } from '../contexts/ThemeContext';
import { FS } from '../constants/ui';
import { L } from './legend/legendStyles';
import { translateUI, type Language } from '../utils/translation';

export default function LocationPermissionDialog({ open, theme, language, denied, supported, onRetry, onClose }: {
  open: boolean; theme: 'light' | 'dark'; language: Language; denied: boolean; supported: boolean;
  onRetry?: () => void; onClose: () => void;
}) {
  const colors = getThemeColors(theme);
  return <Dialog open={open} title={translateUI('locationPermissionTitle', language)} theme={theme} onClose={onClose}>
    <div style={{ fontSize: FS.body, color: colors.text, display: 'grid', gap: L.sp.lg, lineHeight: 1.5 }}>
      <p style={{ margin: 0 }}>{translateUI(!supported ? 'geolocationNotSupported' : denied ? 'locationDenied' : 'locationPermissionPrompt', language)}</p>
      {supported && <p style={{ margin: 0, color: colors.textSecondary }}>{translateUI('locationPermissionSettings', language)}</p>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: L.sp.md }}>
        <Button theme={theme} size="md" variant="outline" onClick={onClose}>{translateUI('close', language)}</Button>
        {supported && onRetry && <Button theme={theme} size="md" variant="primary" onClick={onRetry}>{translateUI('retryLocation', language)}</Button>}
      </div>
    </div>
  </Dialog>;
}
