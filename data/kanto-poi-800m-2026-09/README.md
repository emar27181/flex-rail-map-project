# kanto-poi-800m-2026-09 — 首都圏駅周辺POI(半径800m・OSM実測)

## これは何
`src/data/stationStats.ts` の `StationStats` のうち**PoC(2026-09-24)で新設された半径800m系フィールド**を、
PoCの10駅以外に拡張収集したもの。形式は `src/data/station-stats-data.json` と同じ
キー(駅名)・同じフィールド名の**マージ可能な断片**。

- 収集日: 2026-09-29
- 方法: OpenStreetMap / Overpass API(mirror: overpass.private.coffee)、駅代表点(OSM `railway=station` ノード)から**半径800m直線円**内をカテゴリ集計
- ライセンス: ODbL (c) OpenStreetMap contributors
- 対象フィールド(15種, `dataQuality: 'real'`): fastFoodCount / mallCount / bankCount / postOfficeCount / pharmacyCount / nurseryCount / schoolCount / universityCount / libraryCount / clinicCount / cinemaCount / gymCount / hotelCount / attractionCount / parkCount
- 推定値は一切含まない。収集できなかった駅はこのファイルに存在しない(グレー表示フォールバックは既存どおり)

## ファイル
| ファイル | 内容 |
|---|---|
| `station-stats-data.kanto800.fill.json` | **既存エントリあり**の駅に足りない800mフィールドだけを抽出(キー=駅名) |
| `station-stats-data.kanto800.new-stations.json` | アプリ未登録の駅(stationName/lat/lng + 800mフィールド)。登録判断はプロジェクト側で |
| `coverage.csv` | 首都圏マスタ全ユニーク駅の収集有無(collected=1が取得済み) |
| `validation.json` | 取り込みの検証結果（取り込んだ駅・保留した駅と理由） |

## 取り込み（2026-09-29 実施）

```bash
npx tsx scripts/merge-kanto-poi-800m.mts
# → input=295 applied=0 alreadyApplied=267 held=28（取り込み済みの状態で実行した場合）
```

- 受け取った `merge-kanto800.py` は使わない（駅名が同じなら位置を確かめずに取り込むため）。
  代わりに `scripts/merge-kanto-poi-800m.mts` が位置を照合してから取り込む
- 検証結果は `validation.json`。**取り込み 267駅・保留 28駅**
  - 保留の理由はすべて「同じ名前の駅がアプリに複数あり、2km 以上離れている」（春日・赤坂・大塚・中野など）。
    駅統計は駅名だけで引くため、取り込むと別の地域の同名駅にも首都圏の値が出る。駅統計を位置でも引けるようにしてから取り込む
  - 取り込んだ駅は、数えた位置とアプリの駅の距離が最大 0.25km（中央値 0.02km）
  - 全項目が 0 の駅は無かった
- 既存の値は1つも変えていない（足りないフィールドだけ足した）
- 未確認: サンドボックスから Overpass に接続できず（プロキシが 403）、値の抜き取り照合はしていない。
  セル単位の取得で一部のセルだけ失敗した駅は少なめに数えられている可能性がある

## 既存500m系フィールドについて(重要)
`restaurantCount` / `cafeCount` / `convenienceStoreCount` / `supermarketCount` / `hospitalCount` /
`izakayaCount` / `ramenCount` / `bookstoreCount` / `officeCount` / `coworkingCount` は
既存の**半径500m**データと同一名フィールドのため、**本データ(800m)では提供しない**。
(`stationStats.ts` の設計どおり: 半径が異なるデータで既存値を上書きしない)

## 収集状況
- マスタ(首都圏4県・OSM `railway=station` ノード): 1731駅(ユニーク名 1516駅)
- 収集完了(800m集計まで): 331駅
- 継続方法: 収集スクリプトは逐次保存のため再実行で続きから集計可能
  (スクリプト: `data/kanto-station-poc-2026-09/scripts/`、集計結果: `poi_kanto_full.json`)
