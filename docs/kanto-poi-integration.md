# 首都圏800m POI統合（段階導入）

アップロードされた `flex-kanto-integration.zip` の **295駅分のfillデータ** を対象にする安全な統合スクリプトです。ZIP内の `new-stations.json` は29駅分ですが、路線・駅IDの紐付けを確認するまで自動追加しません。

## 実行

ZIPを展開し、リポジトリ直下から実行します。

```bash
python3 scripts/integrate_kanto_poi.py --source /path/to/flex-kanto-integration
python3 scripts/integrate_kanto_poi.py --source /path/to/flex-kanto-integration --apply
npm run check
npm test
```

デフォルトはドライランです。既存値は上書きせず、15カテゴリの未設定フィールドだけを追加します。座標・家賃・人口・犯罪・既存500m POIには触れません。

**注意:** 元資料の収集状況にあるfill=1,241駅/new=264駅と、提供された統合用データのfill=295駅/new=29駅は一致しません。残りデータの取得・出典・500m/800mの表示単位を確認するまで、全面統合・本番適用をしないでください。
