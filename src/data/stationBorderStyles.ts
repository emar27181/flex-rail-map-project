// 駅の枠線スタイル決定システム
// 停車する列車種別に応じて視覚的に分かりやすい枠線を生成

import { getStoppingTrainTypes } from './stationTrainTypeAnalysis';
import { type RouteKey } from './routes';

export interface StationBorderStyle {
  borderWidth: number;
  borderStyle: 'solid' | 'double' | 'dashed' | 'none';
  borderColor: string;
  boxShadow?: string; // 三重枠線用
  description: string;
  visualLevel: 'basic' | 'enhanced' | 'premium' | 'special';
}

// 列車種別の階層レベル定義
const trainTypeHierarchy: Record<string, number> = {
  // 基本レベル（各駅停車）
  local: 1,

  // 快速レベル
  rapid: 2,
  semi_express: 2,
  rapid_acty: 2,

  // 急行レベル
  express: 3,
  multi_express: 3,
  special_rapid: 3,

  // 特急レベル
  limitedExpress: 4,
  romance_car: 4
};

// 列車種別の表示名
const trainTypeNames: Record<string, string> = {
  local: '各停',
  rapid: '快速',
  semi_express: '準急',
  rapid_acty: 'ラピッド',
  express: '急行',
  multi_express: '多摩急',
  special_rapid: '特快',
  limitedExpress: '特急',
  romance_car: 'ロマンス'
};

/**
 * 駅に停車する列車種別から枠線スタイルを決定
 *
 * ルール:
 * - 各駅停車のみ: 枠線なし
 * - 快速系統まで: 単一枠線（2px solid）
 * - 急行系統まで: 二重枠線（2px double）
 * - 特急系統まで: 三重枠線（2px solid + box-shadow）
 * - 停車なし: 枠線なし（薄いグレー）
 * - 枠線色: ライトモード（グレー）、ダークモード（白）で固定
 */
export function getStationBorderStyleByPattern(routeKey: RouteKey, stationName: string): StationBorderStyle {
  const stoppingTypes = getStoppingTrainTypes(routeKey, stationName);

  // ライト/ダークモード対応の枠線色（CSS変数またはメディアクエリで制御可能）
  const borderColor = 'var(--station-border-color, #000000)';
  const passingStationColor = 'var(--station-border-color-light, #CCCCCC)';

  if (stoppingTypes.length === 0) {
    return {
      borderWidth: 0,
      borderStyle: 'none',
      borderColor: 'transparent',
      description: '通過のみ',
      visualLevel: 'basic'
    };
  }

  // 停車する列車種別の最高階層レベルを取得
  const maxLevel = Math.max(...stoppingTypes.map(type => trainTypeHierarchy[type] || 1));

  // 停車種別名を生成（階層順にソート）
  const sortedTypes = stoppingTypes
    .sort((a, b) => (trainTypeHierarchy[b] || 1) - (trainTypeHierarchy[a] || 1))
    .map(type => trainTypeNames[type] || type);

  const description = sortedTypes.length === 1
    ? `${sortedTypes[0]}停車`
    : `${sortedTypes.join('・')}停車`;

  // 最高階層レベルに応じて枠線スタイルを決定
  switch (maxLevel) {
    case 1: // 各駅停車のみ
      return {
        borderWidth: 0,
        borderStyle: 'none',
        borderColor: 'transparent',
        description,
        visualLevel: 'basic'
      };

    case 2: // 快速系統まで停車
      return {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor,
        description,
        visualLevel: 'enhanced'
      };

    case 3: // 急行系統まで停車
      return {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor,
        boxShadow: `0 0 0 2px white, 0 0 0 4px ${borderColor}`,
        description,
        visualLevel: 'premium'
      };

    case 4: // 特急系統まで停車
      return {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor,
        boxShadow: `0 0 0 2px white, 0 0 0 4px ${borderColor}, 0 0 0 6px white, 0 0 0 8px ${borderColor}`,
        description,
        visualLevel: 'special'
      };

    default:
      return {
        borderWidth: 0,
        borderStyle: 'none',
        borderColor: 'transparent',
        description,
        visualLevel: 'basic'
      };
  }
}

/**
 * 枠線スタイルの視覚的説明を取得
 */
export function getBorderStyleExplanation(): {
  level: string;
  style: string;
  description: string;
  example: string;
}[] {
  return [
    {
      level: 'basic',
      style: '細い実線（1px）',
      description: '各駅停車のみ停車',
      example: '地域密着型の駅'
    },
    {
      level: 'enhanced',
      style: '中太実線（3px）',
      description: '快速系統まで停車',
      example: '準急・快速が停車する駅'
    },
    {
      level: 'premium',
      style: '太い実線（5px）',
      description: '急行系統まで停車',
      example: '急行・特別快速が停車する主要駅'
    },
    {
      level: 'special',
      style: '太い二重線（5px double）',
      description: '特急系統まで停車',
      example: 'ロマンスカー・特急が停車する特別駅'
    }
  ];
}

/**
 * 路線別の枠線パターン統計を取得
 */
export function getRouteBoderPatternStats(routeKey: RouteKey): {
  basic: number;
  enhanced: number;
  premium: number;
  special: number;
  total: number;
} {
  const route = require('./routes').routes[routeKey];
  if (!route) return { basic: 0, enhanced: 0, premium: 0, special: 0, total: 0 };

  const stats = { basic: 0, enhanced: 0, premium: 0, special: 0, total: route.length };

  route.forEach((station: any) => {
    const borderStyle = getStationBorderStyleByPattern(routeKey, station.name);
    stats[borderStyle.visualLevel]++;
  });

  return stats;
}

/**
 * 特定の列車種別が選択された時の駅フィルタリング
 */
export function getStationsBySelectedTrainType(routeKey: RouteKey, selectedTrainType: string): {
  stopping: string[];
  passing: string[];
} {
  const route = require('./routes').routes[routeKey];
  if (!route) return { stopping: [], passing: [] };

  const stopping: string[] = [];
  const passing: string[] = [];

  route.forEach((station: any) => {
    const stoppingTypes = getStoppingTrainTypes(routeKey, station.name);
    if (stoppingTypes.includes(selectedTrainType)) {
      stopping.push(station.name);
    } else {
      passing.push(station.name);
    }
  });

  return { stopping, passing };
}