// 列車種別の定義とデータ構造

export interface TrainType {
  id: string;
  name: string;
  displayName: string;
  color: string;
  priority: number; // 表示優先度（数字が大きいほど優先）
  description?: string;
}

export interface StationStop {
  stationName: string;
  stops: boolean; // その列車種別が停車するかどうか
}

export interface RouteTrainService {
  routeKey: string;
  trainTypes: TrainType[];
  stationStops: { [trainTypeId: string]: StationStop[] };
}

// 共通の列車種別定義
export const commonTrainTypes: { [key: string]: TrainType } = {
  local: {
    id: 'local',
    name: '各駅停車',
    displayName: '各停',
    color: '#666666',
    priority: 1,
    description: 'すべての駅に停車'
  },
  rapid: {
    id: 'rapid',
    name: '快速',
    displayName: '快速',
    color: '#FF6600',
    priority: 2,
    description: '主要駅に停車'
  },
  express: {
    id: 'express',
    name: '急行',
    displayName: '急行',
    color: '#FF0000',
    priority: 3,
    description: '急行停車駅のみ停車'
  },
  limitedExpress: {
    id: 'limitedExpress',
    name: '特急',
    displayName: '特急',
    color: '#CC0000',
    priority: 4,
    description: '特急停車駅のみ停車'
  },
  semi_express: {
    id: 'semi_express',
    name: '準急',
    displayName: '準急',
    color: '#FF9900',
    priority: 2,
    description: '準急停車駅に停車'
  },
  special_rapid: {
    id: 'special_rapid',
    name: '特別快速',
    displayName: '特快',
    color: '#FF3300',
    priority: 3,
    description: '特別快速停車駅のみ停車'
  }
};

// JR線の列車種別
export const jrTrainTypes = {
  ...commonTrainTypes,
  rapid_acty: {
    id: 'rapid_acty',
    name: 'ラピッドアクティー',
    displayName: 'ラピッド',
    color: '#FF6600',
    priority: 3,
    description: 'JR中央線の快速'
  }
};

// 私鉄の列車種別
export const privateRailwayTrainTypes = {
  ...commonTrainTypes,
  romance_car: {
    id: 'romance_car',
    name: 'ロマンスカー',
    displayName: 'ロマンス',
    color: '#8B0000',
    priority: 5,
    description: '小田急の特急'
  },
  multi_express: {
    id: 'multi_express',
    name: '多摩急行',
    displayName: '多摩急',
    color: '#006600',
    priority: 3,
    description: '小田急の多摩線急行'
  }
};