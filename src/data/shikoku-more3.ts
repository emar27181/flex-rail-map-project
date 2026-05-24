import type { Station } from './yamanote';

// いよ鉄道高浜線: 松山市〜高浜
export const iyotetsuTakahama: Station[] = [
  { name: "松山市",     lat: 33.840080, lng: 132.763470, timeToNext: 3 },
  { name: "大手町",     lat: 33.842480, lng: 132.759620, timeToNext: 3 },
  { name: "西堀端",     lat: 33.843820, lng: 132.755270, timeToNext: 2 },
  { name: "南堀端",     lat: 33.840820, lng: 132.755630, timeToNext: 2 },
  { name: "西衣山",     lat: 33.843110, lng: 132.748610, timeToNext: 3 },
  { name: "衣山",       lat: 33.843600, lng: 132.740450, timeToNext: 3 },
  { name: "福音寺",     lat: 33.843750, lng: 132.732180, timeToNext: 4 },
  { name: "北久米",     lat: 33.847980, lng: 132.718230, timeToNext: 4 },
  { name: "久米",       lat: 33.855580, lng: 132.704560, timeToNext: 4 },
  { name: "石手川公園", lat: 33.861030, lng: 132.694280, timeToNext: 3 },
  { name: "いよ立花",   lat: 33.858640, lng: 132.682580, timeToNext: 3 },
  { name: "梅本",       lat: 33.854720, lng: 132.668130, timeToNext: 4 },
  { name: "北条",       lat: 33.789620, lng: 132.544000, timeToNext: 25 },
  { name: "高浜",       lat: 33.775840, lng: 132.544080, timeToNext: 0 },
];

// いよ鉄道横河原線: 松山市〜横河原
export const iyotetsuYokogawara: Station[] = [
  { name: "松山市",     lat: 33.840080, lng: 132.763470, timeToNext: 4 },
  { name: "石崎",       lat: 33.843000, lng: 132.779700, timeToNext: 3 },
  { name: "鷹ノ子",     lat: 33.847830, lng: 132.793550, timeToNext: 4 },
  { name: "平井",       lat: 33.849180, lng: 132.814020, timeToNext: 4 },
  { name: "牛渕団地前", lat: 33.846040, lng: 132.831640, timeToNext: 3 },
  { name: "牛渕",       lat: 33.843840, lng: 132.843010, timeToNext: 3 },
  { name: "田窪",       lat: 33.843260, lng: 132.856680, timeToNext: 4 },
  { name: "見奈良",     lat: 33.840800, lng: 132.872880, timeToNext: 3 },
  { name: "愛大医学部南口", lat: 33.836460, lng: 132.882920, timeToNext: 3 },
  { name: "横河原",     lat: 33.831440, lng: 132.896800, timeToNext: 0 },
];

// いよ鉄道郡中線: 松山市〜郡中港
export const iyotetsuGunchu: Station[] = [
  { name: "松山市",     lat: 33.840080, lng: 132.763470, timeToNext: 4 },
  { name: "余戸",       lat: 33.822740, lng: 132.764620, timeToNext: 3 },
  { name: "鎌田",       lat: 33.809640, lng: 132.764830, timeToNext: 4 },
  { name: "土橋",       lat: 33.796820, lng: 132.762500, timeToNext: 3 },
  { name: "松前",       lat: 33.772140, lng: 132.760590, timeToNext: 4 },
  { name: "岡田",       lat: 33.754680, lng: 132.759670, timeToNext: 4 },
  { name: "郡中",       lat: 33.737680, lng: 132.755140, timeToNext: 3 },
  { name: "郡中港",     lat: 33.733850, lng: 132.749630, timeToNext: 0 },
];

// とさでん交通後免・安芸線: 後免町〜安芸
export const tosadentsuAki: Station[] = [
  { name: "後免町",     lat: 33.546710, lng: 133.641300, timeToNext: 5 },
  { name: "後免西町",   lat: 33.546620, lng: 133.634840, timeToNext: 3 },
  { name: "後免中町",   lat: 33.546470, lng: 133.628550, timeToNext: 3 },
  { name: "後免東町",   lat: 33.546320, lng: 133.622230, timeToNext: 3 },
  { name: "領石通",     lat: 33.544300, lng: 133.606390, timeToNext: 8 },
  { name: "のいち",     lat: 33.569350, lng: 133.629680, timeToNext: 8 },
  { name: "よしだ",     lat: 33.578140, lng: 133.668420, timeToNext: 6 },
  { name: "あかおか",   lat: 33.552310, lng: 133.685820, timeToNext: 6 },
  { name: "香我美",     lat: 33.549810, lng: 133.707280, timeToNext: 8 },
  { name: "夜須",       lat: 33.567590, lng: 133.737390, timeToNext: 8 },
  { name: "安芸",       lat: 33.503480, lng: 133.906500, timeToNext: 0 },
];

// とさでん交通伊野線（市内電車）: 枝川〜はりまや橋
export const tosadentsuIno: Station[] = [
  { name: "枝川",       lat: 33.553810, lng: 133.448380, timeToNext: 5 },
  { name: "朝倉",       lat: 33.566650, lng: 133.471350, timeToNext: 5 },
  { name: "舟戸",       lat: 33.558450, lng: 133.512380, timeToNext: 5 },
  { name: "旭",         lat: 33.560300, lng: 133.530440, timeToNext: 4 },
  { name: "咥内",       lat: 33.559840, lng: 133.538740, timeToNext: 3 },
  { name: "県立美術館通", lat: 33.559560, lng: 133.546230, timeToNext: 3 },
  { name: "高知城前",   lat: 33.558250, lng: 133.558800, timeToNext: 3 },
  { name: "はりまや橋", lat: 33.558540, lng: 133.569570, timeToNext: 0 },
];

// 阿佐海岸鉄道阿佐東線: 海部〜甲浦
export const asaKaiganRailway: Station[] = [
  { name: "海部",       lat: 33.589250, lng: 134.338960, timeToNext: 5 },
  { name: "宍喰",       lat: 33.591150, lng: 134.378090, timeToNext: 8 },
  { name: "甲浦",       lat: 33.578840, lng: 134.440400, timeToNext: 0 },
];
