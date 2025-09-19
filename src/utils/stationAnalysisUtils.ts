// 駅分析ユーティリティ関数
// データの出力、デバッグ、分析のためのヘルパー関数

import {
  generateAllRouteAnalyses,
  generateRouteStationAnalysis,
  getStationServiceAcrossRoutes,
  getServiceLevelStatistics,
  type RouteStationAnalysis,
  type StationTrainTypeInfo
} from '../data/stationTrainTypeAnalysis';
import { type RouteKey } from '../data/routes';

/**
 * コンソールに駅分析データをフォーマットして出力
 */
export function logStationAnalysis(routeKey: RouteKey): void {
  const analysis = generateRouteStationAnalysis(routeKey);
  if (!analysis) {
    console.warn(`❌ 路線 "${routeKey}" の分析データが見つかりません`);
    return;
  }

  console.group(`🚉 ${analysis.routeName} - 駅分析レポート`);
  console.log(`📊 総駅数: ${analysis.totalStations}駅`);

  // サービスレベル別統計
  const stats = getServiceLevelStatistics(routeKey);
  console.log(`🔴 高サービス駅: ${stats.high}駅 (${Math.round((stats.high/stats.total)*100)}%)`);
  console.log(`🟡 中サービス駅: ${stats.medium}駅 (${Math.round((stats.medium/stats.total)*100)}%)`);
  console.log(`🔵 低サービス駅: ${stats.low}駅 (${Math.round((stats.low/stats.total)*100)}%)`);

  // 列車種別別統計
  console.group('🚆 列車種別別停車駅数');
  analysis.trainTypes.forEach(trainType => {
    console.log(`${trainType.name}: ${trainType.stoppingStationCount}駅 (${trainType.stoppingPercentage}%)`);
  });
  console.groupEnd();

  // 詳細駅リスト
  console.group('📍 駅別詳細');
  analysis.stations.forEach(station => {
    const icon = station.serviceLevel === 'high' ? '🔴' : station.serviceLevel === 'medium' ? '🟡' : '🔵';
    console.log(`${icon} ${station.stationName}: ${station.description}`);
  });
  console.groupEnd();

  console.groupEnd();
}

/**
 * 全路線の分析データをコンソールに出力
 */
export function logAllRouteAnalyses(): void {
  console.group('🗾 全路線 駅分析レポート');

  const analyses = generateAllRouteAnalyses();
  analyses.forEach(analysis => {
    logStationAnalysis(analysis.routeKey);
  });

  // 総合統計
  const totalStats = analyses.reduce((acc, analysis) => {
    const stats = getServiceLevelStatistics(analysis.routeKey);
    return {
      totalStations: acc.totalStations + stats.total,
      highService: acc.highService + stats.high,
      mediumService: acc.mediumService + stats.medium,
      lowService: acc.lowService + stats.low
    };
  }, { totalStations: 0, highService: 0, mediumService: 0, lowService: 0 });

  console.group('📈 総合統計');
  console.log(`対象路線数: ${analyses.length}路線`);
  console.log(`総駅数: ${totalStats.totalStations}駅`);
  console.log(`高サービス駅: ${totalStats.highService}駅 (${Math.round((totalStats.highService/totalStats.totalStations)*100)}%)`);
  console.log(`中サービス駅: ${totalStats.mediumService}駅 (${Math.round((totalStats.mediumService/totalStats.totalStations)*100)}%)`);
  console.log(`低サービス駅: ${totalStats.lowService}駅 (${Math.round((totalStats.lowService/totalStats.totalStations)*100)}%)`);
  console.groupEnd();

  console.groupEnd();
}

/**
 * 特定の駅の全路線での停車状況を出力
 */
export function logStationServiceAcrossRoutes(stationName: string): void {
  const stationData = getStationServiceAcrossRoutes(stationName);

  if (stationData.routes.length === 0) {
    console.warn(`❌ 駅 "${stationName}" は対象路線に見つかりません`);
    return;
  }

  console.group(`🚉 ${stationName}駅 - 路線別停車状況`);
  stationData.routes.forEach(route => {
    const icon = route.serviceLevel === 'high' ? '🔴' : route.serviceLevel === 'medium' ? '🟡' : '🔵';
    console.log(`${icon} ${route.routeName}: ${route.description}`);
  });
  console.groupEnd();
}

/**
 * JSONファイルとして保存可能な形式でデータを生成
 */
export function generateStationDataForExport(): {
  timestamp: string;
  routes: RouteStationAnalysis[];
  summary: {
    totalRoutes: number;
    totalStations: number;
    serviceDistribution: {
      high: number;
      medium: number;
      low: number;
    };
  };
} {
  const analyses = generateAllRouteAnalyses();

  const totalStats = analyses.reduce((acc, analysis) => {
    const stats = getServiceLevelStatistics(analysis.routeKey);
    return {
      totalStations: acc.totalStations + stats.total,
      highService: acc.highService + stats.high,
      mediumService: acc.mediumService + stats.medium,
      lowService: acc.lowService + stats.low
    };
  }, { totalStations: 0, highService: 0, mediumService: 0, lowService: 0 });

  return {
    timestamp: new Date().toISOString(),
    routes: analyses,
    summary: {
      totalRoutes: analyses.length,
      totalStations: totalStats.totalStations,
      serviceDistribution: {
        high: totalStats.highService,
        medium: totalStats.mediumService,
        low: totalStats.lowService
      }
    }
  };
}

/**
 * CSV形式で駅データを出力（コンソール用）
 */
export function generateStationDataCSV(): string {
  const analyses = generateAllRouteAnalyses();

  const headers = ['路線名', '駅名', '停車列車種別', '説明', 'サービスレベル'];
  const rows = [headers.join(',')];

  analyses.forEach(analysis => {
    analysis.stations.forEach(station => {
      const row = [
        analysis.routeName,
        station.stationName,
        station.stoppingTrainTypes.join('・'),
        station.description,
        station.serviceLevel
      ].map(cell => `"${cell}"`).join(',');
      rows.push(row);
    });
  });

  return rows.join('\n');
}

/**
 * 路線別の列車種別統計を取得
 */
export function getTrainTypeStatistics(): {
  [routeKey: string]: {
    routeName: string;
    trainTypes: {
      name: string;
      stoppingStations: number;
      percentage: number;
    }[];
  };
} {
  const analyses = generateAllRouteAnalyses();
  const result: any = {};

  analyses.forEach(analysis => {
    result[analysis.routeKey] = {
      routeName: analysis.routeName,
      trainTypes: analysis.trainTypes.map(trainType => ({
        name: trainType.name,
        stoppingStations: trainType.stoppingStationCount,
        percentage: trainType.stoppingPercentage
      }))
    };
  });

  return result;
}

/**
 * 特定の列車種別が停車する駅のリストを取得
 */
export function getStationsByTrainType(routeKey: RouteKey, trainTypeId: string): string[] {
  const analysis = generateRouteStationAnalysis(routeKey);
  if (!analysis) return [];

  return analysis.stations
    .filter(station => station.stoppingTrainTypes.includes(trainTypeId))
    .map(station => station.stationName);
}

/**
 * デバッグ用: ブラウザコンソールで利用可能な関数をwindowオブジェクトに追加
 */
export function attachDebugFunctions(): void {
  if (typeof window !== 'undefined') {
    (window as any).stationAnalysis = {
      logRoute: logStationAnalysis,
      logAll: logAllRouteAnalyses,
      logStation: logStationServiceAcrossRoutes,
      exportData: generateStationDataForExport,
      exportCSV: generateStationDataCSV,
      getStats: getTrainTypeStatistics,
      getStationsByType: getStationsByTrainType
    };

    console.log('🔧 駅分析デバッグ関数が利用可能になりました:');
    console.log('  window.stationAnalysis.logAll() - 全路線分析表示');
    console.log('  window.stationAnalysis.logRoute("odakyuLine") - 特定路線分析');
    console.log('  window.stationAnalysis.logStation("新宿") - 特定駅分析');
    console.log('  window.stationAnalysis.exportData() - データ出力');
    console.log('  window.stationAnalysis.exportCSV() - CSV出力');
  }
}