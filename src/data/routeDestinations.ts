// 各路線の主要行先情報
export interface RouteDestination {
  routeKey: string;
  destinations: string[]; // 主要な行先（両端駅）
  description?: string; // 追加の説明
}

export const routeDestinations: Record<string, RouteDestination> = {
  'yamanote': {
    routeKey: 'yamanote',
    destinations: ['外回り', '内回り'],
    description: '山手線'
  },
  'chuo-rapid': {
    routeKey: 'chuo-rapid',
    destinations: ['東京', '高尾'],
    description: '中央線快速'
  },
  'chuo-sobu': {
    routeKey: 'chuo-sobu',
    destinations: ['千葉', '三鷹'],
    description: '中央・総武線'
  },
  'keihin-tohoku': {
    routeKey: 'keihin-tohoku',
    destinations: ['大宮', '大船'],
    description: '京浜東北線'
  },
  'tokaido': {
    routeKey: 'tokaido',
    destinations: ['東京', '熱海'],
    description: '東海道線'
  },
  'tokaido-ueno': {
    routeKey: 'tokaido-ueno',
    destinations: ['上野', '熱海'],
    description: '上野東京ライン'
  },
  'takasaki': {
    routeKey: 'takasaki',
    destinations: ['上野', '高崎'],
    description: '高崎線'
  },
  'utsunomiya': {
    routeKey: 'utsunomiya',
    destinations: ['上野', '宇都宮'],
    description: '宇都宮線'
  },
  'joban': {
    routeKey: 'joban',
    destinations: ['上野', '取手'],
    description: '常磐線'
  },
  'saikyo': {
    routeKey: 'saikyo',
    destinations: ['新木場', '川越'],
    description: '埼京線'
  },
  'odakyu-odawara': {
    routeKey: 'odakyu-odawara',
    destinations: ['新宿', '小田原'],
    description: '小田急小田原線'
  },
  'odakyu-enoshima': {
    routeKey: 'odakyu-enoshima',
    destinations: ['新宿', '片瀬江ノ島'],
    description: '小田急江ノ島線'
  },
  'keio-main': {
    routeKey: 'keio-main',
    destinations: ['新宿', '京王八王子'],
    description: '京王線'
  },
  'keio-inokashira': {
    routeKey: 'keio-inokashira',
    destinations: ['渋谷', '吉祥寺'],
    description: '京王井の頭線'
  },
  'tokyu-toyoko': {
    routeKey: 'tokyu-toyoko',
    destinations: ['渋谷', '横浜'],
    description: '東急東横線'
  },
  'tokyu-denentoshi': {
    routeKey: 'tokyu-denentoshi',
    destinations: ['渋谷', '中央林間'],
    description: '東急田園都市線'
  },
  'tokyu-meguro': {
    routeKey: 'tokyu-meguro',
    destinations: ['目黒', '日吉'],
    description: '東急目黒線'
  },
  'tokyu-ikegami': {
    routeKey: 'tokyu-ikegami',
    destinations: ['五反田', '蒲田'],
    description: '東急池上線'
  },
  'tokyu-oimachi': {
    routeKey: 'tokyu-oimachi',
    destinations: ['大井町', '二子玉川'],
    description: '東急大井町線'
  },
  'ginza-line': {
    routeKey: 'ginza-line',
    destinations: ['浅草', '渋谷'],
    description: '銀座線'
  },
  'marunouchi-line': {
    routeKey: 'marunouchi-line',
    destinations: ['池袋', '荻窪'],
    description: '丸ノ内線'
  },
  'hibiya-line': {
    routeKey: 'hibiya-line',
    destinations: ['北千住', '中目黒'],
    description: '日比谷線'
  },
  'tozai-line': {
    routeKey: 'tozai-line',
    destinations: ['中野', '西船橋'],
    description: '東西線'
  },
  'chiyoda-line': {
    routeKey: 'chiyoda-line',
    destinations: ['綾瀬', '代々木上原'],
    description: '千代田線'
  },
  'yurakucho-line': {
    routeKey: 'yurakucho-line',
    destinations: ['和光市', '新木場'],
    description: '有楽町線'
  },
  'hanzomon-line': {
    routeKey: 'hanzomon-line',
    destinations: ['押上', '中央林間'],
    description: '半蔵門線'
  },
  'namboku-line': {
    routeKey: 'namboku-line',
    destinations: ['赤羽岩淵', '目黒'],
    description: '南北線'
  },
  'fukutoshin-line': {
    routeKey: 'fukutoshin-line',
    destinations: ['和光市', '渋谷'],
    description: '副都心線'
  },
  'toei-asakusa-line': {
    routeKey: 'toei-asakusa-line',
    destinations: ['西馬込', '押上'],
    description: '都営浅草線'
  },
  'toei-mita-line': {
    routeKey: 'toei-mita-line',
    destinations: ['目黒', '西高島平'],
    description: '都営三田線'
  },
  'toei-shinjuku-line': {
    routeKey: 'toei-shinjuku-line',
    destinations: ['新宿', '本八幡'],
    description: '都営新宿線'
  },
  'toei-oedo-line': {
    routeKey: 'toei-oedo-line',
    destinations: ['都庁前', '光が丘'],
    description: '都営大江戸線'
  },
  'tokyo-monorail': {
    routeKey: 'tokyo-monorail',
    destinations: ['モノレール浜松町', '羽田空港'],
    description: '東京モノレール'
  },
  'keikyu-main': {
    routeKey: 'keikyu-main',
    destinations: ['品川', '浦賀'],
    description: '京急本線'
  }
};

// 路線キーから行先情報を取得する関数
export function getRouteDestination(routeKey: string): RouteDestination | null {
  return routeDestinations[routeKey] || null;
}

// 路線の表示用文字列を生成する関数
export function getRouteDisplayText(routeKey: string): string {
  const destination = getRouteDestination(routeKey);
  if (!destination) return routeKey;
  
  const destinationText = destination.destinations.join(' ⇔ ');
  return `${destination.description || routeKey}: ${destinationText}`;
}

// 経路セグメント用の行先表示を生成する関数
export function getDirectionText(routeKey: string, fromStation: string, toStation: string): string {
  const destination = getRouteDestination(routeKey);
  if (!destination) return '';
  
  const destinations = destination.destinations;
  
  // 特殊な路線の処理
  if (routeKey === 'yamanote') {
    // 山手線は内回り・外回りで判定
    return ''; // 山手線は行先表示なし
  }
  
  // 両端駅のどちらに向かっているかを判定
  if (destinations.includes(toStation)) {
    return `${toStation}行き`;
  }
  
  // より近い終点駅を推定
  const firstDestination = destinations[0];
  const lastDestination = destinations[destinations.length - 1];
  
  // 簡易的な判定（実際の路線の駅順序に基づいて判定すべきだが、ここでは終点駅名で判定）
  if (toStation.includes(lastDestination) || lastDestination.includes(toStation)) {
    return `${lastDestination}行き`;
  } else {
    return `${firstDestination}行き`;
  }
}

// 主要な行先パターンを定義
export const commonDirections: Record<string, Record<string, string>> = {
  'odakyu-odawara': {
    '新宿': '小田原行き',
    '下北沢': '小田原行き',
    '成城学園前': '小田原行き',
    '新百合ヶ丘': '小田原行き',
    '小田原': '新宿行き',
    '藤沢': '新宿行き'
  },
  'odakyu-enoshima': {
    '新宿': '片瀬江ノ島行き',
    '下北沢': '片瀬江ノ島行き',
    '藤沢': '新宿行き',
    '片瀬江ノ島': '新宿行き'
  },
  'tokaido': {
    '東京': '熱海行き',
    '新橋': '熱海行き',
    '品川': '熱海行き',
    '横浜': '熱海行き',
    '戸塚': '熱海行き',
    '藤沢': '熱海行き',
    '大船': '熱海行き',
    '熱海': '東京行き',
    '小田原': '東京行き'
  }
};