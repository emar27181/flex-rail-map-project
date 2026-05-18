import type { Station } from './yamanote';

// JR越後線: 新潟〜柏崎
export const jrEtsugoLine: Station[] = [
  { name: "新潟",       lat: 37.913460, lng: 139.059580, timeToNext: 5 },
  { name: "白山",       lat: 37.904510, lng: 139.038060, timeToNext: 5 },
  { name: "関屋",       lat: 37.900350, lng: 139.023130, timeToNext: 5 },
  { name: "青山",       lat: 37.897990, lng: 139.006720, timeToNext: 5 },
  { name: "小針",       lat: 37.890710, lng: 138.983080, timeToNext: 5 },
  { name: "寺尾",       lat: 37.882230, lng: 138.958720, timeToNext: 5 },
  { name: "内野",       lat: 37.867360, lng: 138.937200, timeToNext: 8 },
  { name: "越後曽根",   lat: 37.804400, lng: 138.817810, timeToNext: 15 },
  { name: "吉田",       lat: 37.749440, lng: 138.761560, timeToNext: 10 },
  { name: "燕三条",     lat: 37.681530, lng: 138.798360, timeToNext: 8 },
  { name: "柏崎",       lat: 37.372530, lng: 138.559420, timeToNext: 0 },
];

// JR信越本線（新潟〜柏崎）
export const jrShinetsuNiigata: Station[] = [
  { name: "新潟",       lat: 37.913460, lng: 139.059580, timeToNext: 5 },
  { name: "越後石山",   lat: 37.899310, lng: 139.114260, timeToNext: 5 },
  { name: "亀田",       lat: 37.892050, lng: 139.138920, timeToNext: 5 },
  { name: "荻川",       lat: 37.872830, lng: 139.190280, timeToNext: 8 },
  { name: "さつき野",   lat: 37.846930, lng: 139.226820, timeToNext: 5 },
  { name: "新津",       lat: 37.822760, lng: 139.220820, timeToNext: 5 },
  { name: "加茂",       lat: 37.664420, lng: 139.038120, timeToNext: 10 },
  { name: "三条",       lat: 37.635540, lng: 138.973920, timeToNext: 8 },
  { name: "東三条",     lat: 37.690010, lng: 138.952010, timeToNext: 5 },
  { name: "柏崎",       lat: 37.372530, lng: 138.559420, timeToNext: 0 },
];

// 北越急行ほくほく線: 六日町〜犀潟
export const hokuetsukyu: Station[] = [
  { name: "六日町",     lat: 37.059120, lng: 138.877490, timeToNext: 10 },
  { name: "美佐島",     lat: 37.082680, lng: 138.901670, timeToNext: 8 },
  { name: "しんざ",     lat: 37.110280, lng: 138.923920, timeToNext: 8 },
  { name: "十日町",     lat: 37.139880, lng: 138.760210, timeToNext: 10 },
  { name: "まつだい",   lat: 37.178870, lng: 138.712330, timeToNext: 10 },
  { name: "ほくほく大島", lat: 37.214050, lng: 138.660810, timeToNext: 8 },
  { name: "犀潟",       lat: 37.254340, lng: 138.616780, timeToNext: 0 },
];

// しなの鉄道北しなの線: 長野〜妙高高原
export const shinanoBrandNorth: Station[] = [
  { name: "長野",       lat: 36.644790, lng: 138.188710, timeToNext: 5 },
  { name: "北長野",     lat: 36.673130, lng: 138.193090, timeToNext: 5 },
  { name: "三才",       lat: 36.695550, lng: 138.193250, timeToNext: 5 },
  { name: "豊野",       lat: 36.743840, lng: 138.218050, timeToNext: 8 },
  { name: "牟礼",       lat: 36.774100, lng: 138.204360, timeToNext: 8 },
  { name: "古間",       lat: 36.806010, lng: 138.163800, timeToNext: 8 },
  { name: "黒姫",       lat: 36.833280, lng: 138.147780, timeToNext: 8 },
  { name: "妙高高原",   lat: 36.893090, lng: 138.222360, timeToNext: 0 },
];

// しなの鉄道本線: 軽井沢〜篠ノ井
export const shinanoRailway: Station[] = [
  { name: "軽井沢",     lat: 36.348720, lng: 138.592040, timeToNext: 8 },
  { name: "中軽井沢",   lat: 36.341870, lng: 138.566200, timeToNext: 5 },
  { name: "信濃追分",   lat: 36.363630, lng: 138.507080, timeToNext: 5 },
  { name: "御代田",     lat: 36.379540, lng: 138.474090, timeToNext: 8 },
  { name: "小諸",       lat: 36.322100, lng: 138.431800, timeToNext: 5 },
  { name: "滋野",       lat: 36.315630, lng: 138.415870, timeToNext: 5 },
  { name: "田中",       lat: 36.330210, lng: 138.388950, timeToNext: 5 },
  { name: "大屋",       lat: 36.323750, lng: 138.372860, timeToNext: 5 },
  { name: "信濃国分寺", lat: 36.318450, lng: 138.360540, timeToNext: 5 },
  { name: "上田",       lat: 36.402000, lng: 138.249350, timeToNext: 8 },
  { name: "坂城",       lat: 36.453820, lng: 138.175710, timeToNext: 8 },
  { name: "戸倉",       lat: 36.490660, lng: 138.147200, timeToNext: 5 },
  { name: "千曲",       lat: 36.514030, lng: 138.153120, timeToNext: 5 },
  { name: "篠ノ井",     lat: 36.593650, lng: 138.124880, timeToNext: 0 },
];

// JR飯山線: 豊野〜越後川口
export const jrIiyamaLineExt: Station[] = [
  { name: "豊野",       lat: 36.743840, lng: 138.218050, timeToNext: 8 },
  { name: "信濃平",     lat: 36.773190, lng: 138.282250, timeToNext: 8 },
  { name: "戸狩野沢温泉", lat: 36.827980, lng: 138.357660, timeToNext: 10 },
  { name: "上境",       lat: 36.880680, lng: 138.404020, timeToNext: 8 },
  { name: "替佐",       lat: 36.906730, lng: 138.426260, timeToNext: 8 },
  { name: "飯山",       lat: 36.853130, lng: 138.370010, timeToNext: 8 },
  { name: "北飯山",     lat: 36.867030, lng: 138.384810, timeToNext: 5 },
  { name: "信濃白鳥",   lat: 36.931300, lng: 138.443500, timeToNext: 8 },
  { name: "西大滝",     lat: 36.986720, lng: 138.506830, timeToNext: 8 },
  { name: "津南",       lat: 37.006560, lng: 138.605620, timeToNext: 10 },
  { name: "越後田沢",   lat: 37.019630, lng: 138.637020, timeToNext: 8 },
  { name: "越後鹿渡",   lat: 37.044110, lng: 138.666420, timeToNext: 8 },
  { name: "越後川口",   lat: 37.092030, lng: 138.737620, timeToNext: 0 },
];
