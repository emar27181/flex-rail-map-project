# Flex Railway Map — 駅周辺データセット PoC + 首都圏駅マスタ
(2026-09-24 更新)

## スコープ決定(本次)
- **第1優先: 首都圏**(東京・神奈川・埼玉・千葉)
- **第2優先: JR東日本**(乗車人員などのJR系項目を次フェーズで整備)

## 収録ファイル
| ファイル | 内容 |
|---|---|
| `schema.json` | 全45項目の定義・分類(observed / observed_community / derived / estimated / unavailable)・情報源・更新頻度 |
| `stations_poc.display.json` | 首都圏10駅の表示用データ(値 or null) |
| `stations_poc.meta.json` | 出典(sourceName/sourceUrl/sourceDate/retrievedAt)・status・reason 付きメタ |
| `stations_poc.csv` | 10駅×全項目フラット表(utf-8-sig, congestionSections は `|` 結合) |
| `stations_kanto_master.json` / `.csv` | 首都圏駅マスタ **1731駅**(OSM railway=station ノード, ODbL) |
| `jreast_targets.csv` | JR東日本対象駅 **365駅**(乗車人員照合対象。StationCDは一次確認済み4駅のみ記載、他は名称照合で要確認) |
| `flex-railway-dataset-poc.doc/index.html` | 設計レポート(単一HTML・画面読み用) |
| `scripts/` | 収集・構築スクリプト一式 |
| `raw/` | 国交省2025年度混雑率テキスト抽出・警視庁犯罪CSV(東京都2025, 町丁目集計) |

## データstatus(2026-09-24)
- **POI集計(駅代表点から半径800m直線円): 10/10駅 実測完了**(Overpass/OSM, ODbL)
- **混雑率**: 国交省2025年度主要区間実績(2026-07-28公表)を区間・時間帯付きで8駅に附与。藤沢/大宮/千葉は「主要31区間に該当なし」でnull
- **乗車人員**: null(JR東日本公式ページの乗車人員表が画像形式で機械読取不可・列定義も一次資料上未確定。誤記載防止のため未採用)
- **首都圏駅マスタ**: 1731駅(OSM, railway=station ノード)。未取得: なし
- その他(人口/事業所メッシュ・地価・犯罪・家賃): 取得方法は schema.json と設計レポート§4.4/§5 に文書化済み

### POI実測ハイライト(半径800m)
| 駅 | レストラン | カフェ | コンビニ | 公園 |
|---|---|---|---|---|
| 千葉 | 70 | 11 | 28 | 22 |
| 品川 | 52 | 25 | 23 | 29 |
| 大宮 | 120 | 22 | 41 | 14 |
| 川崎 | 128 | 31 | 58 | 30 |
| 新宿 | 533 | 163 | 91 | 9 |
| 東京 | 234 | 105 | 52 | 19 |
| 横浜 | 190 | 57 | 54 | 27 |
| 池袋 | 241 | 112 | 97 | 22 |
| 渋谷 | 449 | 163 | 76 | 32 |
| 藤沢 | 51 | 13 | 16 | 14 |

## データの鉄則(再掲)
1. 数値を推測で埋めない。取得不能は `null` + reason
2. 推定値(estimated)を実測扱いにしない
3. 全値に出典(sourceName/sourceUrl/sourceDate/retrievedAt)を付与
4. 情報源優先順位: 国・自治体OD > 鉄道事業者公式 > e-Stat > 国土数値情報 > OSM > 民間統計 > Web
5. スクレイピング/恒久保存が規約上問題の情報源(Google Maps 等)は使わない

## 次の一手(首都圏→JR東日本)
1. **首都圏POI全駅化**: 駅ごとクエリではなく「エリア一括取得+ローカル円集計」に切替(実証済み手法)。未取得bboxは `scripts/kanto_station_master.py` を時間帯を変えて再実行
2. **JR東日本乗車人員**: `jreast_targets.csv` の365駅を対象に、事業者公表値との名称照合(StationCDは一次確認済み4駅のみ)。国土数値情報S12は2011–2018年かつ非商用のため使用不可
3. **メッシュ結合**: e-Stat 人口/事業所メッシュ×円ポリゴン結合で population800 / officeWorkersMesh を全駅一括算出
4. **犯罪集計**: 警視庁CSV×町丁目ポリゴン結合(東京都分は raw/ に同梱済み)

## ライセンス
- OSM: **ODbL** (c) OpenStreetMap contributors
- 国交省2025年度混雑率PDF・警視庁オープンデータ: 出典明記の上利用
