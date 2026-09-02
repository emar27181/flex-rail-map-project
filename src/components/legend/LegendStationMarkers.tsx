import React from 'react';
import type { Station } from '../../data/yamanote';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateStation, translateUI } from '../../utils/translation'
import type { Language } from '../../utils/translation';
import { SEMANTIC, FS} from '../../constants/ui';
import { L } from './legendStyles';

interface LegendStationMarkersProps {
  departure: Station | null;
  arrival: Station | null;
  theme: 'light' | 'dark';
  language: Language;
}

const LegendStationMarkers: React.FC<LegendStationMarkersProps> = ({
  departure,
  arrival,
  theme,
  language
}) => {
  const colors = getThemeColors(theme);

  if (!departure && !arrival) {
    return null;
  }

  return (
    <div style={{
      marginBottom: L.sp['2xl'],
      padding: L.sp.lg,
      backgroundColor: colors.surface,
      borderRadius: L.r.md,
      border: `1px solid ${colors.borderLight}`
    }}>
      <div style={{
        fontSize: FS.sectionTitle,
        fontWeight: 'bold',
        marginBottom: L.sp.md,
        color: colors.text
      }}>
        {translateUI('currentStationSettings', language)}
      </div>

      {departure && arrival && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: L.sp.md,
          marginBottom: L.sp.md,
          fontSize: FS.label,
          padding: L.sp.md,
          backgroundColor: colors.infoLight,
          borderRadius: L.r.md,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: L.sp.xs
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colors.surfaceElevated,
              border: `2px solid ${SEMANTIC.departure}`,
              borderRadius: L.r.sm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: FS.tiny,
              fontWeight: 'bold',
              color: SEMANTIC.departure,
              flexShrink: 0
            }}>
              S
            </div>
            <span style={{ color: colors.text, fontWeight: 'bold' }}>
              {translateStation(departure.name, language)}
            </span>
          </div>
          <span style={{
            color: SEMANTIC.departure,
            fontSize: FS.sectionTitle,
            fontWeight: 'bold'
          }}>→</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: L.sp.xs
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colors.surfaceElevated,
              border: `2px solid ${SEMANTIC.arrival}`,
              borderRadius: L.r.sm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: FS.tiny,
              fontWeight: 'bold',
              color: SEMANTIC.arrival,
              flexShrink: 0
            }}>
              G
            </div>
            <span style={{ color: colors.text, fontWeight: 'bold' }}>
              {translateStation(arrival.name, language)}
            </span>
          </div>
        </div>
      )}

      {departure && !arrival && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: L.sp.sm,
          fontSize: FS.label
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: colors.surfaceElevated,
            border: `3px solid ${SEMANTIC.departure}`,
            borderRadius: L.r.md,
            marginRight: L.sp.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: FS.label,
            fontWeight: 'bold',
            color: SEMANTIC.departure,
            flexShrink: 0
          }}>
            S
          </div>
          <span style={{ color: colors.text, fontWeight: 'bold' }}>
            {translateUI('departureStationLabel', language)} {translateStation(departure.name, language)}
          </span>
        </div>
      )}

      {!departure && arrival && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: L.sp.sm,
          fontSize: FS.label
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: colors.surfaceElevated,
            border: `3px solid ${SEMANTIC.arrival}`,
            borderRadius: L.r.md,
            marginRight: L.sp.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: FS.label,
            fontWeight: 'bold',
            color: SEMANTIC.arrival,
            flexShrink: 0
          }}>
            G
          </div>
          <span style={{ color: colors.text, fontWeight: 'bold' }}>
            {translateUI('arrivalStationLabel', language)} {translateStation(arrival.name, language)}
          </span>
        </div>
      )}
    </div>
  );
};

export default LegendStationMarkers;