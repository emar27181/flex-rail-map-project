export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const jrOmeLine: Station[] = [
  { name: "立川", lat: 35.698025, lng: 139.413782, timeToNext: 3 },
  { name: "西立川", lat: 35.703546, lng: 139.393390, timeToNext: 2 },
  { name: "東中神", lat: 35.706337, lng: 139.384529, timeToNext: 2 },
  { name: "中神", lat: 35.709000, lng: 139.375710, timeToNext: 2 },
  { name: "昭島", lat: 35.713220, lng: 139.361635, timeToNext: 2 },
  { name: "拝島", lat: 35.721278, lng: 139.343468, timeToNext: 3 },
  { name: "牛浜", lat: 35.734335, lng: 139.333790, timeToNext: 2 },
  { name: "福生", lat: 35.742456, lng: 139.327763, timeToNext: 2 },
  { name: "羽村", lat: 35.757940, lng: 139.316300, timeToNext: 2 },
  { name: "小作", lat: 35.776048, lng: 139.302233, timeToNext: 2 },
  { name: "河辺", lat: 35.78473, lng: 139.284032, timeToNext: 2 },
  { name: "東青梅", lat: 35.789768, lng: 139.272841, timeToNext: 2 },
  { name: "青梅", lat: 35.790512, lng: 139.258096, timeToNext: 3 },
  { name: "宮ノ平", lat: 35.787545, lng: 139.237289, timeToNext: 2 },
  { name: "日向和田", lat: 35.788665, lng: 139.229515, timeToNext: 2 },
  { name: "石神前", lat: 35.79683, lng: 139.225096, timeToNext: 2 },
  { name: "二俣尾", lat: 35.803945, lng: 139.216161, timeToNext: 2 },
  { name: "軍畑", lat: 35.807580, lng: 139.207650, timeToNext: 2 },
  { name: "沢井", lat: 35.80594, lng: 139.193324, timeToNext: 2 },
  { name: "御嶽", lat: 35.801420, lng: 139.182752, timeToNext: 3 },
  { name: "川井", lat: 35.813697, lng: 139.16429, timeToNext: 2 },
  { name: "古里", lat: 35.816320, lng: 139.151140, timeToNext: 3 },
  { name: "鳩ノ巣", lat: 35.815127, lng: 139.128932, timeToNext: 3 },
  { name: "白丸", lat: 35.811735, lng: 139.114861, timeToNext: 3 },
  { name: "奥多摩", lat: 35.809357, lng: 139.096961 }
];
