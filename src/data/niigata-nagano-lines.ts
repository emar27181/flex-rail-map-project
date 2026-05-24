import type { Station } from './yamanote';

// JR越後線: 新潟〜柏崎
export const jrEtsugoLine: Station[] = [
  { name: "新潟",       lat: 37.913460, lng: 139.059580, timeToNext: 5 },
  { name: "白山",       lat: 37.904510, lng: 139.038060, timeToNext: 5 },
  { name: "関屋",       lat: 37.900350, lng: 139.023130, timeToNext: 5 },
  { name: "青山",       lat: 37.897990, lng: 139.006720, timeToNext: 5 },
  { name: "小針",       lat: 37.890710, lng: 138.983080, timeToNext: 5 },
  { name: "寺尾",       lat: 37.879282, lng: 138.973934, timeToNext: 5 },
  { name: "内野",       lat: 37.867360, lng: 138.937200, timeToNext: 8 },
  { name: "越後曽根",   lat: 37.804400, lng: 138.817810, timeToNext: 15 },
  { name: "吉田",       lat: 37.749440, lng: 138.761560, timeToNext: 10 },
  { name: "燕三条",     lat: 37.64837, lng: 138.939089, timeToNext: 8 },
  { name: "柏崎",       lat: 37.372530, lng: 138.559420, timeToNext: 0 },
];

// JR信越本線（新潟〜柏崎）
export const jrShinetsuNiigata: Station[] = [
  { name: "新潟",       lat: 37.913460, lng: 139.059580, timeToNext: 5 },
  { name: "越後石山",   lat: 37.896568, lng: 139.095285, timeToNext: 5 },
  { name: "亀田",       lat: 37.877239, lng: 139.108266, timeToNext: 5 },
  { name: "荻川",       lat: 37.872830, lng: 139.190280, timeToNext: 8 },
  { name: "さつき野",   lat: 37.846930, lng: 139.226820, timeToNext: 5 },
  { name: "新津",       lat: 37.822760, lng: 139.220820, timeToNext: 5 },
  { name: "加茂",       lat: 37.658901, lng: 139.049247, timeToNext: 10 },
  { name: "三条",       lat: 37.62114, lng: 138.960895, timeToNext: 8 },
  { name: "東三条",     lat: 37.628596, lng: 138.974463, timeToNext: 5 },
  { name: "柏崎",       lat: 37.372530, lng: 138.559420, timeToNext: 0 },
];

// 北越急行ほくほく線: 六日町〜犀潟
export const hokuetsukyu: Station[] = [
  { name: "六日町",     lat: 37.059120, lng: 138.877490, timeToNext: 10 },
  { name: "美佐島",     lat: 37.131050, lng: 138.789537, timeToNext: 8 },
  { name: "しんざ",     lat: 37.139728, lng: 138.768589, timeToNext: 8 },
  { name: "十日町",     lat: 37.139880, lng: 138.760210, timeToNext: 10 },
  { name: "まつだい",   lat: 37.132214, lng: 138.613731, timeToNext: 10 },
  { name: "ほくほく大島", lat: 37.146936, lng: 138.509269, timeToNext: 8 },
  { name: "犀潟",       lat: 37.210369, lng: 138.305210, timeToNext: 0 },
];

// しなの鉄道北しなの線: 長野〜妙高高原
export const shinanoBrandNorth: Station[] = [
  { name: "長野",       lat: 36.644790, lng: 138.188710, timeToNext: 5 },
  { name: "北長野",     lat: 36.665478, lng: 138.223014, timeToNext: 5 },
  { name: "三才",       lat: 36.686172, lng: 138.243517, timeToNext: 5 },
  { name: "豊野",       lat: 36.710912, lng: 138.275039, timeToNext: 8 },
  { name: "牟礼",       lat: 36.753147, lng: 138.247602, timeToNext: 8 },
  { name: "古間",       lat: 36.791926, lng: 138.230443, timeToNext: 8 },
  { name: "黒姫",       lat: 36.807738, lng: 138.196507, timeToNext: 8 },
  { name: "妙高高原",   lat: 36.872201, lng: 138.212196, timeToNext: 0 },
];

// しなの鉄道本線: 軽井沢〜篠ノ井
export const shinanoRailway: Station[] = [
  { name: "軽井沢",     lat: 36.342551, lng: 138.635109, timeToNext: 8 },
  { name: "中軽井沢",   lat: 36.341870, lng: 138.566200, timeToNext: 5 },
  { name: "信濃追分",   lat: 36.33574, lng: 138.558983, timeToNext: 5 },
  { name: "御代田",     lat: 36.318979, lng: 138.506442, timeToNext: 8 },
  { name: "小諸",       lat: 36.322100, lng: 138.431800, timeToNext: 5 },
  { name: "滋野",       lat: 36.342441, lng: 138.363619, timeToNext: 5 },
  { name: "田中",       lat: 36.330210, lng: 138.388950, timeToNext: 5 },
  { name: "大屋",       lat: 36.369726, lng: 138.296825, timeToNext: 5 },
  { name: "信濃国分寺", lat: 36.378680, lng: 138.273212, timeToNext: 5 },
  { name: "上田",       lat: 36.402000, lng: 138.249350, timeToNext: 8 },
  { name: "坂城",       lat: 36.453820, lng: 138.175710, timeToNext: 8 },
  { name: "戸倉",       lat: 36.490660, lng: 138.147200, timeToNext: 5 },
  { name: "千曲",       lat: 36.514030, lng: 138.153120, timeToNext: 5 },
  { name: "篠ノ井",     lat: 36.577415, lng: 138.138184, timeToNext: 0 },
];

// JR飯山線: 豊野〜越後川口
export const jrIiyamaLineExt: Station[] = [
  { name: "豊野",       lat: 36.710912, lng: 138.275039, timeToNext: 8 },
  { name: "信濃平",     lat: 36.884917, lng: 138.378526, timeToNext: 8 },
  { name: "戸狩野沢温泉", lat: 36.917131, lng: 138.393379, timeToNext: 10 },
  { name: "上境",       lat: 36.938008, lng: 138.419054, timeToNext: 8 },
  { name: "替佐",       lat: 36.769063, lng: 138.323638, timeToNext: 8 },
  { name: "飯山",       lat: 36.846288, lng: 138.358787, timeToNext: 8 },
  { name: "北飯山",     lat: 36.858813, lng: 138.36378, timeToNext: 5 },
  { name: "信濃白鳥",   lat: 36.983586, lng: 138.503027, timeToNext: 8 },
  { name: "西大滝",     lat: 36.979219, lng: 138.480922, timeToNext: 8 },
  { name: "津南",       lat: 37.023684, lng: 138.639401, timeToNext: 10 },
  { name: "越後田沢",   lat: 37.055268, lng: 138.694720, timeToNext: 8 },
  { name: "越後鹿渡",   lat: 37.044110, lng: 138.666420, timeToNext: 8 },
  { name: "越後川口",   lat: 37.272913, lng: 138.861961, timeToNext: 0 },
];
