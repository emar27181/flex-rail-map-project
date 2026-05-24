import React from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';

interface ToggleableItemProps {
  id: string;
  label: string;
  isActive: boolean;
  isHighlighted?: boolean;
  theme: 'light' | 'dark';
  colorIndicator?: {
    color: string;
    opacity?: number;
  };
  badge?: string;
  inputType?: 'checkbox' | 'radio';
  inputName?: string;
  onToggle: (id: string) => void;
  adjustColorForTheme?: (color: string, theme: 'light' | 'dark') => string;
}

const ToggleableItem: React.FC<ToggleableItemProps> = ({
  id,
  label,
  isActive,
  isHighlighted = false,
  theme,
  colorIndicator,
  badge,
  inputType = 'checkbox',
  inputName,
  onToggle,
  adjustColorForTheme
}) => {
  const colors = getThemeColors(theme);

  return (
    <div
      onClick={() => onToggle(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '6px',
        fontSize: '12px',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '3px',
        backgroundColor: isHighlighted
          ? 'rgba(33, 150, 243, 0.25)'
          : isActive
            ? 'rgba(0, 123, 255, 0.1)'
            : 'rgba(108, 117, 125, 0.1)',
        border: isHighlighted
          ? '2px solid #2196F3'
          : `1px solid ${isActive ? '#007bff' : '#6c757d'}`,
        transition: 'all 0.2s ease'
      }}
    >
      <input
        type={inputType}
        name={inputName}
        checked={isActive}
        onChange={(e) => {
          e.stopPropagation();
          onToggle(id);
        }}
        style={{
          marginRight: '8px',
          cursor: 'pointer'
        }}
      />

      {colorIndicator && (
        <div style={{
          width: '20px',
          height: '3px',
          backgroundColor: adjustColorForTheme
            ? adjustColorForTheme(colorIndicator.color, theme)
            : colorIndicator.color,
          marginRight: '8px',
          borderRadius: '1px',
          flexShrink: 0,
          opacity: isActive ? (colorIndicator.opacity || 1) : 0.3
        }} />
      )}

      <span style={{
        color: isHighlighted
          ? '#2196F3'
          : isActive
            ? colors.text
            : colors.textMuted,
        lineHeight: '1.2',
        fontWeight: isHighlighted ? 'bold' : 'normal',
        opacity: isActive ? 1 : 0.6
      }}>
        {label}
        {badge && (
          <span style={{
            fontSize: '10px',
            marginLeft: '4px',
            color: '#2196F3',
            fontWeight: 'normal'
          }}>
            ({badge})
          </span>
        )}
      </span>
    </div>
  );
};

export default ToggleableItem;