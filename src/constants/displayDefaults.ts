import type { Language } from '../utils/translation';
import type { MapViewMode } from './mapViewMode';
import type { StationStats } from '../data/stationStats';

export const DISPLAY_DEFAULTS = {
  lastTrainModeEnabled: false,
  meetingModeEnabled: false,
  rideLogModeEnabled: false,
  showTransferStationsOnly: false,
  showTrainStatusPanel: false,
  autoSetDepartureFromLocation: false,
  alwaysVisibleStationsEnabled: true,
  alwaysVisibleMinRoutes: 7,
  showExpressStationsOnly: false,
  showStationTierBadges: false,
  showTravelTimes: false,
  showStationNames: true,
  showFurigana: false,
  showOsmTiles: false,
  mapViewMode: 'realistic' as MapViewMode,
  timeFilterEnabled: false,
  timeFilterMaxMinutes: 15,
  showTravelTimeOverlay: false,
  timetableModeEnabled: true,
  showTrainDemo: false,
  showDimmedMapRoutes: true,
  arrivalAlertEnabled: false,
  heatmapEnabled: false,
  showEstimatedData: false,
  heatmapParam: 'restaurantCount' as keyof StationStats,
  bubbleShape: 'circle' as 'circle' | 'square',
  bubbleMaxRadiusM: 1250,
  heatmapRangeFilterEnabled: false,
  showStationTooltip: false,
  showFullRouteStations: false,
  showRouteRecommendationsPanel: false,
  showPerRouteStationTimes: false,
  showRouteLine: true,
};

export const defaultStationNumbers = (language: Language) => language !== 'japanese';

export const defaultShowTravelTimes = (hasDeparture: boolean) => hasDeparture || DISPLAY_DEFAULTS.showTravelTimes;
