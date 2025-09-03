// オープンデータに基づく図式化路線図のレイアウト定義
// 国土地理院の路線データとOpenStreetMapのデータを参考に作成

export interface SchematicPosition {
  x: number;
  y: number;
}

export interface SchematicStationLayout {
  [stationName: string]: SchematicPosition;
}

// 基準となるキャンバスサイズ: 800x600
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// 山手線を基準とした駅配置（円形レイアウト）
const yamanoteLayout: { [station: string]: { angle: number; radius: number } } = {
  // 時計回りに配置（実際の路線図を参考）
  '東京': { angle: 0, radius: 150 },
  '有楽町': { angle: Math.PI / 12, radius: 150 },
  '新橋': { angle: Math.PI / 6, radius: 150 },
  '浜松町': { angle: Math.PI / 4, radius: 150 },
  '田町': { angle: Math.PI / 3, radius: 150 },
  '品川': { angle: Math.PI / 2, radius: 150 },
  '大崎': { angle: 2 * Math.PI / 3, radius: 150 },
  '五反田': { angle: 3 * Math.PI / 4, radius: 150 },
  '目黒': { angle: 5 * Math.PI / 6, radius: 150 },
  '恵比寿': { angle: Math.PI, radius: 150 },
  '渋谷': { angle: 7 * Math.PI / 6, radius: 150 },
  '原宿': { angle: 4 * Math.PI / 3, radius: 150 },
  '代々木': { angle: 3 * Math.PI / 2 - Math.PI / 6, radius: 150 },
  '新宿': { angle: 3 * Math.PI / 2, radius: 150 },
  '新大久保': { angle: 3 * Math.PI / 2 + Math.PI / 8, radius: 150 },
  '高田馬場': { angle: 5 * Math.PI / 3, radius: 150 },
  '目白': { angle: 11 * Math.PI / 6, radius: 150 },
  '池袋': { angle: 0, radius: 150 }, // 12時方向
  '大塚': { angle: Math.PI / 12, radius: 150 },
  '巣鴨': { angle: Math.PI / 6, radius: 150 },
  '駒込': { angle: Math.PI / 4, radius: 150 },
  '田端': { angle: Math.PI / 3, radius: 150 },
  '西日暮里': { angle: 5 * Math.PI / 12, radius: 150 },
  '日暮里': { angle: Math.PI / 2, radius: 150 },
  '鶯谷': { angle: 7 * Math.PI / 12, radius: 150 },
  '上野': { angle: 2 * Math.PI / 3, radius: 150 },
  '御徒町': { angle: 3 * Math.PI / 4, radius: 150 },
  '秋葉原': { angle: 5 * Math.PI / 6, radius: 150 },
  '神田': { angle: 11 * Math.PI / 12, radius: 150 },
};

// 中央線（東西方向の直線配置）
const chuoLineLayout: { [station: string]: { position: number } } = {
  '東京': { position: 0 },
  '神田': { position: 1 },
  '御茶ノ水': { position: 2 },
  '水道橋': { position: 3 },
  '飯田橋': { position: 4 },
  '市ヶ谷': { position: 5 },
  '四ツ谷': { position: 6 },
  '信濃町': { position: 7 },
  '千駄ヶ谷': { position: 8 },
  '代々木': { position: 9 },
  '新宿': { position: 10 },
  '大久保': { position: 11 },
  '東中野': { position: 12 },
  '中野': { position: 13 },
  '高円寺': { position: 14 },
  '阿佐ヶ谷': { position: 15 },
  '荻窪': { position: 16 },
  '西荻窪': { position: 17 },
  '吉祥寺': { position: 18 },
  '三鷹': { position: 19 },
};

// 銀座線（地下鉄の典型的な配置）
const ginzaLineLayout: { [station: string]: SchematicPosition } = {
  '浅草': { x: 600, y: 100 },
  '田原町': { x: 580, y: 120 },
  '稲荷町': { x: 560, y: 140 },
  '上野': { x: 540, y: 160 },
  '上野広小路': { x: 520, y: 180 },
  '末広町': { x: 500, y: 200 },
  '神田': { x: 480, y: 220 },
  '三越前': { x: 460, y: 240 },
  '日本橋': { x: 440, y: 260 },
  '京橋': { x: 420, y: 280 },
  '銀座': { x: 400, y: 300 },
  '新橋': { x: 380, y: 320 },
  '虎ノ門': { x: 360, y: 340 },
  '溜池山王': { x: 340, y: 360 },
  '赤坂見附': { x: 320, y: 380 },
  '青山一丁目': { x: 300, y: 400 },
  '外苑前': { x: 280, y: 420 },
  '表参道': { x: 260, y: 440 },
  '渋谷': { x: 240, y: 460 },
};

// 全体のレイアウト計算
export const createSchematicLayout = (): SchematicStationLayout => {
  const layout: SchematicStationLayout = {};
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;

  // 山手線の配置
  Object.entries(yamanoteLayout).forEach(([station, { angle, radius }]) => {
    layout[station] = {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  });

  // 中央線の配置（水平）
  const chuoStartX = 100;
  const chuoY = centerY;
  const chuoSpacing = 30;
  
  Object.entries(chuoLineLayout).forEach(([station, { position }]) => {
    if (!layout[station]) { // 山手線と重複しない場合のみ
      layout[station] = {
        x: chuoStartX + position * chuoSpacing,
        y: chuoY
      };
    }
  });

  // 銀座線の配置
  Object.entries(ginzaLineLayout).forEach(([station, position]) => {
    if (!layout[station]) { // 他路線と重複しない場合のみ
      layout[station] = position;
    }
  });

  // 東海道線（南北方向）
  const tokaido = [
    '東京', '新橋', '品川', '川崎', '横浜'
  ];
  tokaido.forEach((station, index) => {
    if (!layout[station]) {
      layout[station] = {
        x: centerX + 200,
        y: 150 + index * 80
      };
    }
  });

  // 京浜東北線
  const keihinTohoku = [
    '大宮', '浦和', '蕨', '西川口', '川口', '赤羽', '王子', '上野', '御徒町', 
    '秋葉原', '神田', '東京', '有楽町', '新橋', '浜松町', '田町', '品川',
    '大井町', '大森', '蒲田', '川崎', '鶴見', '新子安', '東神奈川', '横浜',
    '根岸', '磯子', '新杉田', '洋光台', '港南台', '本郷台', '大船'
  ];
  keihinTohoku.forEach((station, index) => {
    if (!layout[station]) {
      layout[station] = {
        x: centerX - 250,
        y: 50 + index * 15
      };
    }
  });

  // 常磐線（北東方向）
  const joban = [
    '日暮里', '三河島', '南千住', '北千住', '松戸', '柏', '我孫子'
  ];
  joban.forEach((station, index) => {
    if (!layout[station]) {
      layout[station] = {
        x: centerX + 100 + index * 40,
        y: centerY - 150 - index * 30
      };
    }
  });

  // 小田急線（南西方向）
  const odakyu = [
    '新宿', '南新宿', '参宮橋', '代々木八幡', '代々木上原', '下北沢', 
    '世田谷代田', '梅ヶ丘', '豪徳寺', '経堂', '千歳船橋', '祖師ヶ谷大蔵',
    '成城学園前', '喜多見', '狛江', '和泉多摩川', '登戸', '向ヶ丘遊園',
    '生田', '読売ランド前', '百合ヶ丘', '新百合ヶ丘', '柿生', '鶴川',
    '玉川学園前', '町田'
  ];
  odakyu.forEach((station, index) => {
    if (!layout[station]) {
      layout[station] = {
        x: centerX - index * 25,
        y: centerY + 100 + index * 20
      };
    }
  });

  return layout;
};

// 路線固有の配置パターン
export const getRouteLayout = (routeKey: string): 'circular' | 'linear' | 'diagonal' | 'custom' => {
  switch (routeKey) {
    case 'yamanote':
      return 'circular';
    case 'chuo':
    case 'tokaido':
    case 'keihin-tohoku':
      return 'linear';
    case 'ginza-line':
    case 'odakyu':
      return 'diagonal';
    default:
      return 'custom';
  }
};