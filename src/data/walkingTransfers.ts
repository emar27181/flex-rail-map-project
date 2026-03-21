// 歩行乗換可能な駅ペアの定義
// 各乗換には歩行時間（分）を設定

export interface WalkingTransfer {
  station1: string;
  station2: string;
  walkingTime: number; // 歩行時間（分）
  description?: string; // 乗換の説明
}

export const walkingTransfers: WalkingTransfer[] = [
  // 浜松町 ⇔ モノレール浜松町（JR↔東京モノレール直接接続）
  {
    station1: '浜松町',
    station2: 'モノレール浜松町',
    walkingTime: 3,
    description: 'JR浜松町駅からモノレール乗換'
  },

  // 大門 ⇔ 浜松町（JR/モノレール）
  {
    station1: '大門',
    station2: '浜松町',
    walkingTime: 3,
    description: 'JR線・モノレールへの乗換'
  },
  {
    station1: '大門',
    station2: 'モノレール浜松町',
    walkingTime: 4,
    description: 'モノレールへの乗換'
  },

  // 新橋 ⇔ 汐留
  {
    station1: '新橋',
    station2: '汐留',
    walkingTime: 4,
    description: 'ゆりかもめ・都営大江戸線へ'
  },

  // 銀座 ⇔ 銀座一丁目
  {
    station1: '銀座',
    station2: '銀座一丁目',
    walkingTime: 3,
    description: '有楽町線へ'
  },

  // 有楽町 ⇔ 銀座一丁目
  {
    station1: '有楽町',
    station2: '銀座一丁目',
    walkingTime: 2,
    description: '有楽町線・銀座線へ'
  },

  // 日比谷 ⇔ 有楽町 ⇔ 銀座
  {
    station1: '日比谷',
    station2: '有楽町',
    walkingTime: 2,
    description: 'JR線へ'
  },
  {
    station1: '日比谷',
    station2: '銀座',
    walkingTime: 3,
    description: '銀座線・丸ノ内線へ'
  },

  // 東京 ⇔ 大手町
  {
    station1: '東京',
    station2: '大手町',
    walkingTime: 3,
    description: '地下鉄各線へ'
  },

  // 新宿 ⇔ 新宿三丁目
  {
    station1: '新宿',
    station2: '新宿三丁目',
    walkingTime: 3,
    description: '丸ノ内線・副都心線・新宿線へ'
  },

  // 新宿 ⇔ 南新宿
  {
    station1: '新宿',
    station2: '南新宿',
    walkingTime: 5,
    description: '小田急線・東南口方面'
  },

  // 渋谷 ⇔ 表参道（地下歩行）
  {
    station1: '渋谷',
    station2: '表参道',
    walkingTime: 8,
    description: '地下歩行通路経由'
  },

  // 池袋 ⇔ 東池袋
  {
    station1: '池袋',
    station2: '東池袋',
    walkingTime: 4,
    description: '有楽町線へ'
  },

  // 上野 ⇔ 京成上野
  {
    station1: '上野',
    station2: '京成上野',
    walkingTime: 3,
    description: '京成線へ'
  },

  // 秋葉原 ⇔ 岩本町
  {
    station1: '秋葉原',
    station2: '岩本町',
    walkingTime: 4,
    description: '都営新宿線へ'
  },

  // 九段下 ⇔ 市ヶ谷
  {
    station1: '九段下',
    station2: '市ヶ谷',
    walkingTime: 6,
    description: 'JR線・南北線へ'
  },

  // 赤坂見附 ⇔ 永田町
  {
    station1: '赤坂見附',
    station2: '永田町',
    walkingTime: 2,
    description: '半蔵門線・南北線へ'
  },

  // 溜池山王 ⇔ 赤坂見附 ⇔ 永田町
  {
    station1: '溜池山王',
    station2: '赤坂見附',
    walkingTime: 3,
    description: '銀座線・丸ノ内線へ'
  },
  {
    station1: '溜池山王',
    station2: '永田町',
    walkingTime: 1,
    description: '有楽町線・半蔵門線へ'
  },

  // 霞ヶ関 ⇔ 虎ノ門
  {
    station1: '霞ヶ関',
    station2: '虎ノ門',
    walkingTime: 5,
    description: '銀座線へ'
  },

  // 虎ノ門 ⇔ 虎ノ門ヒルズ
  {
    station1: '虎ノ門',
    station2: '虎ノ門ヒルズ',
    walkingTime: 2,
    description: '日比谷線へ'
  },

  // 六本木 ⇔ 六本木一丁目
  {
    station1: '六本木',
    station2: '六本木一丁目',
    walkingTime: 4,
    description: '南北線へ'
  },

  // 恵比寿 ⇔ 恵比寿（日比谷線）
  {
    station1: '恵比寿',
    station2: '恵比寿',
    walkingTime: 1,
    description: 'JR⇔日比谷線 構内乗換'
  },

  // 中目黒 ⇔ 中目黒（東横線）
  {
    station1: '中目黒',
    station2: '中目黒',
    walkingTime: 1,
    description: '日比谷線⇔東横線 構内乗換'
  },

  // 新宿南口付近
  {
    station1: '新宿',
    station2: '代々木',
    walkingTime: 7,
    description: 'JR南口・東南口経由'
  },

  // 品川 ⇔ 泉岳寺
  {
    station1: '品川',
    station2: '泉岳寺',
    walkingTime: 5,
    description: '京急線・都営浅草線へ'
  },

  // 新橋 ⇔ 内幸町
  {
    station1: '新橋',
    station2: '内幸町',
    walkingTime: 3,
    description: '都営三田線へ'
  },

  // 大門（浅草線・大江戸線） ⇔ 赤羽橋
  {
    station1: '大門',
    station2: '赤羽橋',
    walkingTime: 6,
    description: '都営大江戸線へ'
  },

  // 人形町 ⇔ 水天宮前
  {
    station1: '人形町',
    station2: '水天宮前',
    walkingTime: 3,
    description: '半蔵門線へ'
  },

  // 茅場町 ⇔ 八丁堀
  {
    station1: '茅場町',
    station2: '八丁堀',
    walkingTime: 4,
    description: 'JR京葉線へ'
  }
];

// 駅名から歩行乗換可能な駅を検索する関数
export function getWalkingTransferStations(stationName: string): WalkingTransfer[] {
  return walkingTransfers.filter(transfer => 
    transfer.station1 === stationName || transfer.station2 === stationName
  );
}

// 2つの駅間の歩行乗換時間を取得する関数
export function getWalkingTime(station1: string, station2: string): number | null {
  const transfer = walkingTransfers.find(t => 
    (t.station1 === station1 && t.station2 === station2) ||
    (t.station1 === station2 && t.station2 === station1)
  );
  return transfer ? transfer.walkingTime : null;
}