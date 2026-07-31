import type { Station } from './yamanote';

// timeToNextは急行相当の平均所要時間（各駅停車の実測値の約0.56倍）で近似している。
// odakyu-line.tsと同じ理由（各駅停車ベースの生値だと経路検索で不当に遅く算出される）。
export const odakyuEnoshimaLine: Station[] = [
  { name: '相模大野', lat: 35.532200, lng: 139.437885, timeToNext: 1 },
  { name: '東林間', lat: 35.520193, lng: 139.439025, timeToNext: 1 },
  { name: '中央林間', lat: 35.508005, lng: 139.444100, timeToNext: 1 },
  { name: '南林間', lat: 35.495600, lng: 139.448005, timeToNext: 1 },
  { name: '鶴間', lat: 35.490570, lng: 139.450640, timeToNext: 1 },
  { name: '大和', lat: 35.4699, lng: 139.4614, timeToNext: 1 },
  { name: '桜ヶ丘', lat: 35.450530, lng: 139.465740, timeToNext: 1 },
  { name: '高座渋谷', lat: 35.432145, lng: 139.464710, timeToNext: 1 },
  { name: '長後', lat: 35.412250, lng: 139.465325, timeToNext: 2 },
  { name: '湘南台', lat: 35.396545, lng: 139.466470, timeToNext: 1 },
  { name: '六会日大前', lat: 35.383760, lng: 139.470720, timeToNext: 1 },
  { name: '善行', lat: 35.362590, lng: 139.473265, timeToNext: 1 },
  { name: '藤沢本町', lat: 35.348210, lng: 139.475840, timeToNext: 1 },
  { name: '藤沢', lat: 35.338595, lng: 139.487120, timeToNext: 1 },
  { name: '本鵠沼', lat: 35.331035, lng: 139.475290, timeToNext: 1 },
  { name: '鵠沼海岸', lat: 35.320750, lng: 139.471220, timeToNext: 1 },
  { name: '片瀬江ノ島', lat: 35.309310, lng: 139.482925, timeToNext: 1 }
];