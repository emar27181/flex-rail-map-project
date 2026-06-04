import React from 'react';
import type { Station } from '../../data/yamanote';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateStation, translateUI } from '../../utils/translation'
import type { Language } from '../../utils/translation';

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
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: colors.surface,
      borderRadius: '4px',
      border: `1px solid ${colors.borderLight}`
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: colors.text
      }}>
        {translateUI('currentStationSettings', language)}
      </div>

      {departure && arrival && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '8px',
          fontSize: '12px',
          padding: '8px',
          backgroundColor: colors.infoLight,
          borderRadius: '4px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colors.surfaceElevated,
              border: '2px solid #4CAF50',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#4CAF50',
              flexShrink: 0
            }}>
              S
            </div>
            <span style={{ color: colors.text, fontWeight: 'bold' }}>
              {translateStation(departure.name, language)}
            </span>
          </div>
          <span style={{
            color: '#4CAF50',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>→</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colors.surfaceElevated,
              border: '2px solid #F44336',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#F44336',
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
          marginBottom: '6px',
          fontSize: '12px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: colors.surfaceElevated,
            border: '3px solid #4CAF50',
            borderRadius: '4px',
            marginRight: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#4CAF50',
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
          marginBottom: '6px',
          fontSize: '12px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: colors.surfaceElevated,
            border: '3px solid #F44336',
            borderRadius: '4px',
            marginRight: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#F44336',
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