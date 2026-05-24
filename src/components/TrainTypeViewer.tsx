import React, { useState } from 'react';
import { RouteKey } from '../data/routes';
import { trainServices, getStationStops, getStationBorderStyle } from '../data/trainServices';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';

interface TrainTypeViewerProps {
  selectedRoute: RouteKey | null;
  selectedTrainType: string | null;
  onRouteSelect: (routeKey: RouteKey | null) => void;
  onTrainTypeSelect: (trainTypeId: string | null) => void;
  className?: string;
}

const TrainTypeViewer: React.FC<TrainTypeViewerProps> = ({
  selectedRoute,
  selectedTrainType,
  onRouteSelect,
  onTrainTypeSelect,
  className = ''
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  const [isExpanded, setIsExpanded] = useState(true);
  const [stationFilter, setStationFilter] = useState('');

  // 利用可能な路線（列車種別データがある路線のみ）
  const availableRoutes = Object.keys(trainServices) as RouteKey[];

  // 選択された路線の列車種別データ
  const selectedRouteService = selectedRoute ? trainServices[selectedRoute] : null;

  // 選択された路線の停車駅データ
  const stationStops = selectedRoute && selectedTrainType ?
    getStationStops(selectedRoute, selectedTrainType) : {};

  const handleRouteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const routeKey = event.target.value as RouteKey;
    onRouteSelect(routeKey || null);
    onTrainTypeSelect(null); // 路線変更時は列車種別をリセット
  };

  const handleTrainTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const trainTypeId = event.target.value;
    onTrainTypeSelect(trainTypeId || null);
  };

  const getRouteDisplayName = (routeKey: string): string => {
    const routeNames: { [key: string]: string } = {
      yamanote: '山手線',
      chuo: '中央線',
      odakyuLine: '小田急小田原線',
      keihinTohoku: '京浜東北線',
      ginzaLine: '銀座線'
    };
    return routeNames[routeKey] || routeKey;
  };

  const filteredStations = Object.entries(stationStops).filter(([stationName]) =>
    stationName.includes(stationFilter)
  );

  return (
    <div
      className={`train-type-viewer ${className}`}
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          backgroundColor: colors.primary,
          color: colors.onPrimary,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span style={{ fontWeight: '600', fontSize: '14px' }}>
          🚆 列車種別表示
        </span>
        <span style={{
          fontSize: '12px',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div style={{ padding: '16px' }}>
          {/* 路線選択 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '12px',
              fontWeight: '500',
              color: colors.onSurface
            }}>
              路線選択
            </label>
            <select
              value={selectedRoute || ''}
              onChange={handleRouteChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                color: colors.onSurface,
                fontSize: '13px'
              }}
            >
              <option value="">路線を選択してください</option>
              {availableRoutes.map(routeKey => (
                <option key={routeKey} value={routeKey}>
                  {getRouteDisplayName(routeKey)}
                </option>
              ))}
            </select>
          </div>

          {/* 列車種別選択 */}
          {selectedRouteService && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: '500',
                color: colors.onSurface
              }}>
                列車種別
              </label>
              <select
                value={selectedTrainType || ''}
                onChange={handleTrainTypeChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.surface,
                  color: colors.onSurface,
                  fontSize: '13px'
                }}
              >
                <option value="">列車種別を選択してください</option>
                {selectedRouteService.trainTypes.map(trainType => (
                  <option key={trainType.id} value={trainType.id}>
                    {trainType.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 列車種別の説明 */}
          {selectedRouteService && selectedTrainType && (
            <div style={{ marginBottom: '16px' }}>
              {(() => {
                const trainType = selectedRouteService.trainTypes.find(t => t.id === selectedTrainType);
                if (!trainType) return null;

                return (
                  <div style={{
                    padding: '12px',
                    backgroundColor: trainType.color + '20',
                    borderRadius: '6px',
                    border: `1px solid ${trainType.color}50`
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        backgroundColor: trainType.color,
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginRight: '8px'
                      }}>
                        {trainType.displayName}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: colors.onSurface }}>
                        {trainType.name}
                      </span>
                    </div>
                    {trainType.description && (
                      <p style={{
                        fontSize: '12px',
                        color: colors.onSurface + '80',
                        margin: 0
                      }}>
                        {trainType.description}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* 駅フィルター */}
          {Object.keys(stationStops).length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: '500',
                color: colors.onSurface
              }}>
                駅名フィルター
              </label>
              <input
                type="text"
                placeholder="駅名で絞り込み..."
                value={stationFilter}
                onChange={(e) => setStationFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.surface,
                  color: colors.onSurface,
                  fontSize: '13px'
                }}
              />
            </div>
          )}

          {/* 停車駅一覧 */}
          {Object.keys(stationStops).length > 0 && (
            <div>
              <div style={{
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: colors.onSurface
                }}>
                  停車駅一覧
                </span>
                <span style={{
                  fontSize: '11px',
                  color: colors.onSurface + '60'
                }}>
                  {filteredStations.filter(([, stops]) => stops).length} / {filteredStations.length} 駅
                </span>
              </div>

              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: `1px solid ${colors.border}`,
                borderRadius: '4px'
              }}>
                {filteredStations.map(([stationName, stops], index) => {
                  // 個別駅の枠線スタイルを取得
                  const borderStyle = selectedRoute ? getStationBorderStyle(selectedRoute, stationName) : null;

                  return (
                    <div
                      key={stationName}
                      style={{
                        padding: '8px 12px',
                        borderBottom: index < filteredStations.length - 1 ? `1px solid ${colors.border}` : 'none',
                        backgroundColor: colors.surface,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* 枠線プレビュー */}
                        {borderStyle && (
                          <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            border: `${borderStyle.borderWidth}px ${borderStyle.borderStyle} ${borderStyle.borderColor}`,
                            backgroundColor: borderStyle.borderStyle === 'dashed' ? 'transparent' : borderStyle.borderColor + '40',
                            flexShrink: 0
                          }} />
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{
                            fontSize: '13px',
                            color: colors.onSurface,
                            fontWeight: stops ? '500' : 'normal'
                          }}>
                            {stationName}
                          </span>
                          {borderStyle && (
                            <span style={{
                              fontSize: '10px',
                              color: colors.onSurface + '60'
                            }}>
                              {borderStyle.description}
                            </span>
                          )}
                        </div>
                      </div>

                      <span style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: stops ? '#22C55E' : '#EF4444'
                      }}>
                        {stops ? '●停車' : '○通過'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 枠線スタイル凡例 */}
          {selectedRoute && (
            <div style={{ marginTop: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: '500',
                color: colors.onSurface
              }}>
                駅の枠線の見方
              </label>
              <div style={{
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                backgroundColor: colors.surface + '50',
                padding: '12px'
              }}>
                {/* 枠線パターンの説明 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '4px double #FF0000',
                      backgroundColor: '#FF6666',
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '11px', color: colors.onSurface }}>
                      太い二重線：特急・急行・快速系統停車
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '3px solid #FF6600',
                      backgroundColor: '#FF9966',
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '11px', color: colors.onSurface }}>
                      太い一重線：急行系統停車
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid #0066CC',
                      backgroundColor: '#6699FF',
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '11px', color: colors.onSurface }}>
                      中太一重線：快速系統停車
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '1px solid #666666',
                      backgroundColor: '#CCCCCC',
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '11px', color: colors.onSurface }}>
                      細い一重線：各駅停車のみ
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '1px dashed #CCCCCC',
                      backgroundColor: 'transparent',
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '11px', color: colors.onSurface }}>
                      破線：通過のみ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 選択がない場合のメッセージ */}
          {!selectedRoute && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: colors.onSurface + '60',
              fontSize: '13px'
            }}>
              路線を選択すると、その路線の列車種別と停車駅情報を表示できます
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainTypeViewer;