// 駅ごとの列車種別停車分析データ
// このファイルは各駅でどの列車種別が停車するかの詳細なデータを提供します

import { routes, type RouteKey } from './routes';

export interface StationTrainTypeInfo {
  stationName: string;
  routeKey: RouteKey;
  stoppingTrainTypes: string[];
  description: string; // この駅の特徴（例: "急行・快速・各停停車", "各停のみ"）
  serviceLevel: 'high' | 'medium' | 'low'; // サービスレベル（多くの種別が停車するほど高）
}

export interface RouteStationAnalysis {
  routeKey: RouteKey;
  routeName: string;
  stations: StationTrainTypeInfo[];
  totalStations: number;
  trainTypes: {
    id: string;
    name: string;
    stoppingStations: string[];
    stoppingStationCount: number;
    stoppingPercentage: number;
  }[];
}

// 路線別の列車種別と停車駅パターン
const trainServicePatterns: Record<RouteKey, Record<string, string[]>> = {
  yamanote: {
    local: ['all'], // 山手線は全駅停車
    rapid: ['東京', '新橋', '品川', '渋谷', '新宿', '池袋', '上野'], // 主要ターミナル駅
    express: ['東京', '新宿', '渋谷', '池袋', '上野'] // 超主要駅
  },
  chuo: {
    local: ['all'],
    rapid_acty: ['東京', '神田', '御茶ノ水', '四ツ谷', '新宿', '中野', '荻窪', '阿佐ヶ谷', '高円寺', '吉祥寺', '三鷹', '武蔵境', '東小金井', '国分寺', '国立', '立川', '日野', '豊田', '八王子', '西八王子', '高尾'],
    special_rapid: ['東京', '新宿', '中野', '吉祥寺', '三鷹', '立川', '八王子', '高尾']
  },
  odakyuLine: {
    local: ['all'],
    semi_express: ['新宿', '代々木上原', '下北沢', '梅ヶ丘', '豪徳寺', '経堂', '成城学園前', '登戸', '向ヶ丘遊園', '生田', '新百合ヶ丘', '町田', '相模大野', '本厚木', '伊勢原', '秦野', '新松田', '小田原'],
    express: ['新宿', '代々木上原', '下北沢', '成城学園前', '登戸', '新百合ヶ丘', '町田', '相模大野', '本厚木', '伊勢原', '秦野', '新松田', '小田原'],
    multi_express: ['新宿', '代々木上原', '下北沢', '登戸', '向ヶ丘遊園', '新百合ヶ丘'],
    romance_car: ['新宿', '町田', '相模大野', '本厚木', '小田原']
  },
  keihinTohoku: {
    local: ['all'],
    rapid: ['大宮', '浦和', '赤羽', '上野', '東京', '新橋', '品川', '蒲田', '川崎', '鶴見', '横浜'],
    express: ['東京', '上野', '新橋', '品川', '横浜'] // 主要駅には急行相当も追加
  },
  ginzaLine: {
    local: ['all'],
    rapid: ['銀座', '表参道', '赤坂見附', '新橋', '上野'], // 主要駅
    express: ['銀座', '表参道', '上野'] // 超主要駅
  }
};

// 列車種別の表示名とプライオリティ
const trainTypeInfo: Record<string, { name: string; priority: number; category: string }> = {
  romance_car: { name: 'ロマンスカー', priority: 5, category: '特急' },
  limitedExpress: { name: '特急', priority: 5, category: '特急' },
  special_rapid: { name: '特別快速', priority: 4, category: '快速' },
  multi_express: { name: '多摩急行', priority: 4, category: '急行' },
  express: { name: '急行', priority: 4, category: '急行' },
  rapid_acty: { name: 'ラピッドアクティー', priority: 3, category: '快速' },
  rapid: { name: '快速', priority: 3, category: '快速' },
  semi_express: { name: '準急', priority: 2, category: '準急' },
  local: { name: '各駅停車', priority: 1, category: '各停' }
};

/**
 * 指定した駅で停車する列車種別を取得
 */
export function getStoppingTrainTypes(routeKey: RouteKey, stationName: string): string[] {
  const patterns = trainServicePatterns[routeKey];
  if (!patterns) return [];

  const stoppingTypes: string[] = [];

  Object.entries(patterns).forEach(([trainType, stations]) => {
    if (stations.includes('all') || stations.includes(stationName)) {
      stoppingTypes.push(trainType);
    }
  });

  // プライオリティ順にソート（高い順）
  return stoppingTypes.sort((a, b) => {
    const priorityA = trainTypeInfo[a]?.priority || 0;
    const priorityB = trainTypeInfo[b]?.priority || 0;
    return priorityB - priorityA;
  });
}

/**
 * 駅の停車パターンから説明文を生成
 */
export function generateStationDescription(stoppingTypes: string[]): string {
  if (stoppingTypes.length === 0) return '停車なし';
  if (stoppingTypes.length === 1 && stoppingTypes[0] === 'local') return '各駅停車のみ';

  const typeNames = stoppingTypes.map(type => trainTypeInfo[type]?.name || type);
  if (typeNames.length === 1) return `${typeNames[0]}停車`;

  return `${typeNames.slice(0, -1).join('・')}・${typeNames[typeNames.length - 1]}停車`;
}

/**
 * 駅のサービスレベルを判定
 */
export function getServiceLevel(stoppingTypes: string[]): 'high' | 'medium' | 'low' {
  const maxPriority = Math.max(...stoppingTypes.map(type => trainTypeInfo[type]?.priority || 0));
  const typeCount = stoppingTypes.length;

  if (maxPriority >= 4 && typeCount >= 3) return 'high'; // 急行以上かつ3種別以上
  if (maxPriority >= 3 || typeCount >= 2) return 'medium'; // 快速以上または2種別以上
  return 'low'; // 各停のみまたは停車なし
}

/**
 * 路線全体の駅分析データを生成
 */
export function generateRouteStationAnalysis(routeKey: RouteKey): RouteStationAnalysis | null {
  const route = routes[routeKey];
  if (!route) return null;

  const routeNames: Record<RouteKey, string> = {
    yamanote: '山手線',
    chuo: '中央線',
    odakyuLine: '小田急小田原線',
    keihinTohoku: '京浜東北線',
    ginzaLine: '銀座線'
  };

  const patterns = trainServicePatterns[routeKey];
  if (!patterns) return null;

  // 各駅の分析
  const stations: StationTrainTypeInfo[] = route.map(station => {
    const stoppingTypes = getStoppingTrainTypes(routeKey, station.name);
    return {
      stationName: station.name,
      routeKey,
      stoppingTrainTypes: stoppingTypes,
      description: generateStationDescription(stoppingTypes),
      serviceLevel: getServiceLevel(stoppingTypes)
    };
  });

  // 列車種別ごとの分析
  const trainTypes = Object.entries(patterns).map(([trainTypeId, stoppingStations]) => {
    const actualStoppingStations = stoppingStations.includes('all')
      ? route.map(s => s.name)
      : stoppingStations.filter(name => route.some(s => s.name === name));

    return {
      id: trainTypeId,
      name: trainTypeInfo[trainTypeId]?.name || trainTypeId,
      stoppingStations: actualStoppingStations,
      stoppingStationCount: actualStoppingStations.length,
      stoppingPercentage: Math.round((actualStoppingStations.length / route.length) * 100)
    };
  });

  return {
    routeKey,
    routeName: routeNames[routeKey] || routeKey,
    stations,
    totalStations: route.length,
    trainTypes
  };
}

/**
 * すべての対応路線の分析データを生成
 */
export function generateAllRouteAnalyses(): RouteStationAnalysis[] {
  const supportedRoutes: RouteKey[] = ['yamanote', 'chuo', 'odakyuLine', 'keihinTohoku', 'ginzaLine'];

  return supportedRoutes
    .map(routeKey => generateRouteStationAnalysis(routeKey))
    .filter((analysis): analysis is RouteStationAnalysis => analysis !== null);
}

/**
 * 特定の駅について、全路線での停車状況を取得
 */
export function getStationServiceAcrossRoutes(stationName: string): {
  stationName: string;
  routes: {
    routeKey: RouteKey;
    routeName: string;
    stoppingTrainTypes: string[];
    description: string;
    serviceLevel: 'high' | 'medium' | 'low';
  }[];
} {
  const supportedRoutes: RouteKey[] = ['yamanote', 'chuo', 'odakyuLine', 'keihinTohoku', 'ginzaLine'];
  const routeNames: Record<RouteKey, string> = {
    yamanote: '山手線',
    chuo: '中央線',
    odakyuLine: '小田急小田原線',
    keihinTohoku: '京浜東北線',
    ginzaLine: '銀座線'
  };

  const routeData = supportedRoutes
    .map(routeKey => {
      const route = routes[routeKey];
      const hasStation = route?.some(station => station.name === stationName);

      if (!hasStation) return null;

      const stoppingTypes = getStoppingTrainTypes(routeKey, stationName);

      return {
        routeKey,
        routeName: routeNames[routeKey] || routeKey,
        stoppingTrainTypes: stoppingTypes,
        description: generateStationDescription(stoppingTypes),
        serviceLevel: getServiceLevel(stoppingTypes)
      };
    })
    .filter((data): data is NonNullable<typeof data> => data !== null);

  return {
    stationName,
    routes: routeData
  };
}

/**
 * サービスレベル別の駅数統計を取得
 */
export function getServiceLevelStatistics(routeKey: RouteKey): {
  high: number;
  medium: number;
  low: number;
  total: number;
} {
  const analysis = generateRouteStationAnalysis(routeKey);
  if (!analysis) return { high: 0, medium: 0, low: 0, total: 0 };

  const stats = { high: 0, medium: 0, low: 0, total: analysis.stations.length };

  analysis.stations.forEach(station => {
    stats[station.serviceLevel]++;
  });

  return stats;
}