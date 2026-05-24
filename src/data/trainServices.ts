// 路線ごとの列車種別と停車駅データ

import { commonTrainTypes, jrTrainTypes, privateRailwayTrainTypes, TrainType, StationStop, RouteTrainService } from './trainTypes';
import { routes } from './routes';

// 山手線（各駅停車のみ）
export const yamanoteTrainService: RouteTrainService = {
  routeKey: 'yamanote',
  trainTypes: [commonTrainTypes.local],
  stationStops: {
    local: routes.yamanote.map(station => ({
      stationName: station.name,
      stops: true
    }))
  }
};

// 中央線（快速・各駅停車）
export const chuoTrainService: RouteTrainService = {
  routeKey: 'chuo',
  trainTypes: [commonTrainTypes.local, jrTrainTypes.rapid_acty, commonTrainTypes.special_rapid],
  stationStops: {
    local: routes.chuo.map(station => ({
      stationName: station.name,
      stops: true
    })),
    rapid_acty: routes.chuo.map(station => ({
      stationName: station.name,
      stops: [
        '東京', '神田', '御茶ノ水', '四ツ谷', '新宿', '中野', '荻窪',
        '阿佐ヶ谷', '高円寺', '吉祥寺', '三鷹', '武蔵境', '東小金井',
        '国分寺', '国立', '立川', '日野', '豊田', '八王子', '西八王子', '高尾'
      ].includes(station.name)
    })),
    special_rapid: routes.chuo.map(station => ({
      stationName: station.name,
      stops: [
        '東京', '新宿', '中野', '吉祥寺', '三鷹', '立川', '八王子', '高尾'
      ].includes(station.name)
    }))
  }
};

// 小田急小田原線
export const odakyuMainLineTrainService: RouteTrainService = {
  routeKey: 'odakyuLine',
  trainTypes: [
    commonTrainTypes.local,
    commonTrainTypes.semi_express,
    commonTrainTypes.express,
    privateRailwayTrainTypes.multi_express,
    privateRailwayTrainTypes.romance_car
  ],
  stationStops: {
    local: routes.odakyuLine.map(station => ({
      stationName: station.name,
      stops: true
    })),
    semi_express: routes.odakyuLine.map(station => ({
      stationName: station.name,
      stops: [
        '新宿', '代々木上原', '下北沢', '梅ヶ丘', '豪徳寺', '経堂', '成城学園前',
        '登戸', '向ヶ丘遊園', '生田', '新百合ヶ丘', '町田', '相模大野',
        '本厚木', '伊勢原', '秦野', '新松田', '小田原'
      ].includes(station.name)
    })),
    express: routes.odakyuLine.map(station => ({
      stationName: station.name,
      stops: [
        '新宿', '代々木上原', '下北沢', '成城学園前', '登戸', '新百合ヶ丘',
        '町田', '相模大野', '本厚木', '伊勢原', '秦野', '新松田', '小田原'
      ].includes(station.name)
    })),
    multi_express: routes.odakyuLine.map(station => ({
      stationName: station.name,
      stops: [
        '新宿', '代々木上原', '下北沢', '登戸', '向ヶ丘遊園', '新百合ヶ丘'
      ].includes(station.name)
    })),
    romance_car: routes.odakyuLine.map(station => ({
      stationName: station.name,
      stops: [
        '新宿', '町田', '相模大野', '本厚木', '小田原'
      ].includes(station.name)
    }))
  }
};

// 京浜東北線
export const keihinTohokuTrainService: RouteTrainService = {
  routeKey: 'keihinTohoku',
  trainTypes: [commonTrainTypes.local, commonTrainTypes.rapid],
  stationStops: {
    local: routes.keihinTohoku.map(station => ({
      stationName: station.name,
      stops: true
    })),
    rapid: routes.keihinTohoku.map(station => ({
      stationName: station.name,
      stops: [
        '大宮', '浦和', '赤羽', '上野', '東京', '新橋', '品川', '蒲田', '川崎', '鶴見', '横浜'
      ].includes(station.name)
    }))
  }
};

// 銀座線（各駅停車のみ）
export const ginzaLineTrainService: RouteTrainService = {
  routeKey: 'ginzaLine',
  trainTypes: [commonTrainTypes.local],
  stationStops: {
    local: routes.ginzaLine.map(station => ({
      stationName: station.name,
      stops: true
    }))
  }
};

// 全ての列車サービスデータ
export const trainServices: { [routeKey: string]: RouteTrainService } = {
  yamanote: yamanoteTrainService,
  chuo: chuoTrainService,
  odakyuLine: odakyuMainLineTrainService,
  keihinTohoku: keihinTohokuTrainService,
  ginzaLine: ginzaLineTrainService
};

// 指定した路線と列車種別で、各駅の停車状況を取得する関数
export function getStationStops(routeKey: string, trainTypeId: string): { [stationName: string]: boolean } {
  const service = trainServices[routeKey];
  if (!service || !service.stationStops[trainTypeId]) {
    return {};
  }

  const stops: { [stationName: string]: boolean } = {};
  service.stationStops[trainTypeId].forEach(stop => {
    stops[stop.stationName] = stop.stops;
  });

  return stops;
}

// 指定した駅に停車する列車種別を取得する関数
export function getTrainTypesForStation(routeKey: string, stationName: string): string[] {
  const service = trainServices[routeKey];
  if (!service) {
    return [];
  }

  const trainTypes: string[] = [];
  Object.entries(service.stationStops).forEach(([trainTypeId, stops]) => {
    const stationStop = stops.find(stop => stop.stationName === stationName);
    if (stationStop && stationStop.stops) {
      trainTypes.push(trainTypeId);
    }
  });

  return trainTypes;
}

// 駅の停車パターンを解析して枠線スタイルを決定する関数
export interface StationBorderStyle {
  borderWidth: number;
  borderStyle: 'solid' | 'double' | 'dashed';
  borderColor: string;
  description: string;
}

export function getStationBorderStyle(routeKey: string, stationName: string): StationBorderStyle {
  const service = trainServices[routeKey];
  if (!service) {
    return {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#CCCCCC',
      description: 'データなし'
    };
  }

  // その駅に停車する列車種別を取得
  const stoppingTrainTypes = getTrainTypesForStation(routeKey, stationName);

  if (stoppingTrainTypes.length === 0) {
    return {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: '#CCCCCC',
      description: '通過のみ'
    };
  }

  // 列車種別を優先度順にソート
  const sortedTrainTypes = stoppingTrainTypes
    .map(typeId => service.trainTypes.find(t => t.id === typeId))
    .filter(Boolean)
    .sort((a, b) => (b?.priority || 0) - (a?.priority || 0)); // 高い優先度順

  // 停車する列車種別の分析
  const hasLocal = stoppingTrainTypes.includes('local');
  const hasRapid = stoppingTrainTypes.some(t => ['rapid', 'semi_express', 'rapid_acty'].includes(t));
  const hasExpress = stoppingTrainTypes.some(t => ['express', 'multi_express'].includes(t));
  const hasLimitedExpress = stoppingTrainTypes.some(t => ['limitedExpress', 'special_rapid', 'romance_car'].includes(t));

  // 最高優先度の列車種別の色を使用
  const primaryColor = sortedTrainTypes[0]?.color || '#666666';

  // 枠線スタイルの決定
  if (hasLimitedExpress && hasExpress && hasRapid && hasLocal) {
    // 特急、急行、快速、各停すべて停車 → 太い二重線
    return {
      borderWidth: 4,
      borderStyle: 'double',
      borderColor: primaryColor,
      description: '特急・急行・快速・各停すべて停車'
    };
  } else if ((hasExpress && hasRapid) || (hasLimitedExpress && hasRapid)) {
    // 急行と快速が停車、または特急と快速が停車 → 太い二重線
    return {
      borderWidth: 4,
      borderStyle: 'double',
      borderColor: primaryColor,
      description: '急行・快速系統停車'
    };
  } else if (hasExpress || hasLimitedExpress) {
    // 急行系統のみ停車 → 太い一重線
    return {
      borderWidth: 3,
      borderStyle: 'solid',
      borderColor: primaryColor,
      description: '急行系統停車'
    };
  } else if (hasRapid) {
    // 快速系統停車 → 中太一重線
    return {
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: primaryColor,
      description: '快速系統停車'
    };
  } else if (hasLocal) {
    // 各駅停車のみ → 細い一重線
    return {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: primaryColor,
      description: '各駅停車のみ'
    };
  }

  // その他 → デフォルト
  return {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: primaryColor,
    description: '特殊列車停車'
  };
}