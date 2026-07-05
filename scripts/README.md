# scripts/ - データ収集・整備ツール

## collect-station-data.py ⭐

駅別統計データ（ヒートマップ用）を各種APIから収集して `src/data/station-stats-data.json` に書き込む。

### 前提

```bash
pip install requests   # なければ標準ライブラリにフォールバック
```

スクリプトは `scripts/` ディレクトリから実行しても、プロジェクトルートから実行してもどちらでも動く。

---

### モード1: Overpass（施設系）

**何が集まるか:** 居酒屋・バー / ラーメン屋 / 書店 / コワーキングスペース

**APIキー不要・今すぐ動く。**

```bash
python3 scripts/collect-station-data.py overpass
```

- 東京広域の施設を一括取得 → 各駅500m圏内でカウント（per-駅クエリではなく一括）
- 所要時間: 約2〜3分
- 出力: `scripts/output/collected-overpass-YYYY-MM-DD.json`
- `station-stats-data.json` に自動マージ（バックアップも作成）

---

### モード2: 人口密度（e-stat 国勢調査）

**手順:**

1. 以下のURLから「小地域（町丁・字等）別 人口密度」CSVをDL  
   <https://www.e-stat.go.jp/gis/statmap-search?page=1&type=1&toukei=00200521>
   - 都道府県: 東京・神奈川・埼玉・千葉を選択してDL
   - ファイル名例: `r2ka13.csv`（東京）

2. スクリプト実行:

```bash
python3 scripts/collect-station-data.py population --population-csv ./r2ka13.csv
```

---

### モード3: 乗降客数（国土数値情報 N05）

**手順:**

1. 以下のURLから N05（鉄道）のZIPをDL  
   <https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N05.html>
   - 「令和4年」→「N05-22_GML.zip」をDL

2. スクリプト実行:

```bash
python3 scripts/collect-station-data.py passengers --passengers-zip ./N05-22_GML.zip
```

---

### モード4: 家賃（国土交通省 不動産取引価格情報）

```bash
python3 scripts/collect-station-data.py rent
```

- 国土交通省 不動産取引価格情報APIに自動アクセス（登録不要）
- 注意: このAPIは「売買価格」が主。賃貸月額は件数が少なく精度が低い
- より精度の高い賃貸データは SUUMO/HOMES からの収集が必要（現状Bot対策で困難）

---

### 全モードを順番に実行

```bash
python3 scripts/collect-station-data.py all
```

---

### オプション一覧

| オプション | 説明 |
|---|---|
| `--no-merge` | `station-stats-data.json` を更新せず収集結果JSONのみ出力 |
| `--population-csv PATH` | 人口密度CSVのパス |
| `--passengers-zip PATH` | 国土数値情報N05 ZIPのパス |

---

### 収集済みデータの状況（2026年6月時点）

| フィールド | 収集状況 | ソース |
|---|---|---|
| restaurantCount | ✅ 1541駅 | Overpass API (2026-06) |
| cafeCount | ✅ 1541駅 | Overpass API (2026-06) |
| convenienceStoreCount | ✅ 1541駅 | Overpass API (2026-06) |
| supermarketCount | ✅ 1541駅 | Overpass API (2026-06) |
| hospitalCount | ✅ 1541駅 | Overpass API (2026-06) |
| parkAreaM2 | ✅ 1541駅 | Overpass API (2026-06) |
| greenRatioPct | ✅ 1541駅 | parkAreaM2 から算出 |
| crimeIndex | ✅ 438駅（東京都内のみ） | 警視庁 R5年 |
| izakayaCount | ✅ 977駅 | Overpass API (2026-06) |
| ramenCount | ✅ 977駅 | Overpass API (2026-06) |
| bookstoreCount | ✅ 977駅 | Overpass API (2026-06) |
| coworkingCount | ✅ 977駅 | Overpass API (2026-06) |
| avgRent1K | ⚠️ 推定値 | SUUMO参考の目算 |
| avgRent1LDK | ⚠️ 推定値 | SUUMO参考の目算 |
| dailyPassengers | ⚠️ 推定値 | 路線規模から推計 |
| morningCongestion | ⚠️ 推定値 | 乗降客数から推計 |
| populationDensity | ⚠️ 推定値 | 国勢調査ベース推計 |
| noiseScore | ⚠️ 推定値 | 飲食店密度から推計 |
| officeCount | ⚠️ 推定値 | 都心分布から推計 |

---

## collect-heatmap-data.py

旧版。Overpassを駅ごとに個別クエリする方式（低速・現在は非推奨）。  
新規収集は `collect-station-data.py` を使うこと。

---

## その他のスクリプト

| ファイル | 用途 |
|---|---|
| `export-coordinates.ts` | 駅座標をCSVエクスポート |
| `analyze-missing-stations.js` | 未登録駅の調査 |
| `generate-station-stats.ts` | 旧・統計データ生成（非推奨） |
| `article-generation-prompt.md` | 記事生成用プロンプトメモ |
