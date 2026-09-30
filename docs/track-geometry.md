# 線形（実際の線路に沿った座標列）

路線データ（`src/data/<路線>.ts`）は駅の座標しか持たず、地図では駅と駅を直線で結んでいる。
線形のデータがある路線は、駅と駅の間を実際の線路の形（カーブ・分岐の手前の曲がり）で描く。
担当範囲と進め方は `docs/operating-scope.md` の「2. 路線データ整備」。

## 仕組み

| 置き場所 | 中身 |
|---|---|
| `src/data/trackGeometry/types.ts` | データの形（区間・構造・標高・出典） |
| `src/data/trackGeometry/{routeKey}.json` | 1路線の線形（収集スクリプトが書く。手で座標を書かない） |
| `src/data/trackGeometry/index.ts` | 線形のある路線の一覧（ここに1行足すと地図に反映） |
| `src/utils/trackGeometry.ts` | つなぐ・駅で区切る・間引く・検証する・描くときに差し込む（純粋関数） |
| `scripts/track-geometry/collect-osm.mts` | OSM から集めて検証し、通ったときだけ書き出す |
| `data/track-geometry/{routeKey}.overpass.json` / `.report.json` | 取得した応答そのものと検証結果（監査・再処理用） |
| `tests/unit/data/trackGeometry.test.ts` | 登録された線形を路線データと突き合わせる |

地図側は `RailwayMap.tsx` の `offsetPositions` だけが線形を読む。線形の無い路線は今までどおり直線（重なり回避のずらしもそのまま）。

### データの形

- 隣り合う2駅ごとに1区間（`from` → `to` は路線データの並び順）。`points` は駅と駅の**途中の点だけ**（両端の駅は含めない）
- 座標は WGS84（EPSG:4326）、`[緯度, 経度]`、小数6桁（約0.1m）。3m の許容誤差で間引く
- `structures`: 区間の中の構造。OSM の `bridge` → `bridge`、`tunnel` → `tunnel`、どちらも無い → `untagged`（**地上とは限らない**）。`layer` は OSM の値そのまま

### 高さの決まり

- **地形の標高（`terrainElevationM`）と線路自体の標高（`trackElevationM`）は別に持つ**
- **上下関係だけ分かる情報（OSM の `layer`、`bridge`、`tunnel`）をメートルの高さに変換しない**
- 標高は出典のあるときだけ書く。書くときは `heightReference`（例: T.P.）が必須（テストで確認）
- 分からない値は書かない（欠損）。推測で埋めない

## データソースの比較（2026-09-29）

| ソース | 線形の精度 | 構造（高架・地下） | 利用条件 | 接続 |
|---|---|---|---|---|
| **OpenStreetMap**（Overpass API） | 線路1本ごと・分岐やカーブまで。都市部は航空写真からの手入力で数m | `bridge` / `tunnel` / `layer` のタグ（上下関係のみ） | ODbL 1.0。出典表示「© OpenStreetMap contributors」。線形を集めたデータベースは ODbL のまま扱う | **サンドボックスから不可**（403） |
| 国土数値情報 鉄道（N02） | 路線ごとの中心線。1/25,000 相当 | なし | 国土数値情報の利用規約（**年度・データごとに条件が違うため要確認**） | **不可**（`nlftp.mlit.go.jp`） |
| 公共交通オープンデータ（ODPT） | 線形は原則提供なし（駅・時刻が中心） | なし | 公共交通オープンデータ基本ライセンス等 | 未確認 |

**最初は OSM を使う**: 線路の形の精度が高く、分岐・構造のタグがあり、利用条件（ODbL）が明確なため。
N02 は利用条件を一次情報で確かめてから、OSM で欠ける地域の補完に使うか判断する。

## 最初の1路線: 小田急小田原線（`odakyuLine`）

候補（東海道線・湘南新宿ライン・小田急線）のうち、小田急小田原線を選んだ。

- 1事業者・1路線で、OSM の `route=train` リレーションが路線単位でまとまっている
- 駅名が路線データと1対1で対応し、同じ線路を別の系統が共用する区間（湘南新宿ラインのような）が少ない
- 東海道線・湘南新宿ラインは共用区間・直通系統が多く、線形を系統にどう割り当てるかの判断が先に要るので2本目以降にする

## 手順（Overpass に接続できる環境で）

```bash
# 1. リレーションを探す（候補が表示されて止まる。上り・下りで別なら片方を選ぶ）
npx tsx scripts/track-geometry/collect-osm.mts --route odakyuLine --name "小田急小田原線"
# 2. 取得して検証。通ったときだけ src/data/trackGeometry/odakyuLine.json を書く
npx tsx scripts/track-geometry/collect-osm.mts --route odakyuLine --relation <ID>
# 3. src/data/trackGeometry/index.ts に登録して、テスト・ビルド
#    import odakyuLine from './odakyuLine.json'; → TRACK_GEOMETRY = { odakyuLine: odakyuLine as TrackGeometry }
npm run test:data && npm run test:types && npm run test:unit && npm run build
```

取得した応答は `data/track-geometry/odakyuLine.overpass.json` に残る。処理だけやり直すときは `--input` にそのファイルを渡す（ネットワーク不要）。
ほかの AI（ChatGPT / Genspark など）の環境で取得し、`.overpass.json` だけを受け取って `--input` で処理してもよい。

## 検証の基準（スクリプトとテストで同じ値）

| 項目 | 基準 | 外れたとき |
|---|---|---|
| 駅と線の距離 | 150m 以内（駅の座標は駅舎・ホームの中心なので線路から少し離れる） | 書き出さない。リレーションの選び直しか、路線データの駅の座標を確認 |
| 線上の駅の順番 | 路線データの並びどおりに進む | 書き出さない（リレーションが往復を含む・別の路線を含むなど） |
| way のつながり | 端点が 1m 以内 | 書き出さない（途切れを勝手に補わない） |
| 点の間の距離 | 3,000m 以内 | 書き出さない |
| 区間の数 | 駅の数 − 1 | 書き出さない |
| 標高 | 出典と高さの基準があるときだけ | テストが落ちる |

## 状態（2026-09-29）

- 仕組み（型・計算・収集スクリプト・地図への反映・テスト）はできている。合成データで、つなぐ〜区切る〜検証〜書き出しまで通ることを確認した
- **線形のデータはまだ無い。** サンドボックスから Overpass・OSM・Geofabrik・国土数値情報に接続できない（プロキシが 403）ため
- 再開に必要なこと: 環境の設定で `overpass-api.de`（または `overpass.private.coffee`）への接続を許可する。上の手順1〜3で小田急小田原線を取り込める
