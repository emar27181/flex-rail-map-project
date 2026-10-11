# 2026-10-11 首都圏 POI 完全版データ統合

Gensparkから受領した `flex-railway-map-full-export_20261011_1207.zip` を対象とします。

実ファイルを確認した結果:
- `VERIFICATION.json`: 1,516 / 1,516駅収集済み、検証PASS
- `poi-800m/station-stats-data.kanto800.fill.json`: 1,242駅
- `poi-800m/station-stats-data.kanto800.new-stations.json`: 264駅
- `raw-poi-800m/poi_kanto_full.json`: 1,730 OSM駅レコード
- 800mの15項目はすべて非負整数、500mの既存10項目は更新対象外

## 適用方法

完全版ZIPをローカルで展開し、まずドライランで検証します。

```bash
python3 scripts/import_kanto_poi_full_export.py /path/to/full-export_20261011_1207
python3 scripts/import_kanto_poi_full_export.py /path/to/full-export_20261011_1207 --apply
npm run check
npm test
```

既存の値は上書きしません。既存駅の欠損している15項目のみ補完し、未登録駅264件は路線紐付けと駅IDの検証まで保留します。

**注意:** このPRには完全版ZIPの大容量実データをまだコミットしていません。実データ反映とプレビュー検証が終わるまではマージしないでください。OSM由来データの公開時には ODbL / © OpenStreetMap contributors の帰属表示も確認してください。
