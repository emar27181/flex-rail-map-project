# 首都圏の線形＋地面の標高（2026-10）

地図の「立体（標高）」表示（`src/components/Terrain3DView.tsx`）の元データ。
2026-10-13 にユーザーから受け取った収集結果（`flex-railway-linegeo_20261013_0219.zip`）のうち、データとスクリプトを置いた。
同梱の README は古い内容だったため取り込んでいない（この README が置き換え）。

## ファイル

| ファイル | 中身 |
|---|---|
| `kanto-lines-3d_20261013_0219.json` | OSM の路線 relation 100本の線形（チェーンごとの `[緯度, 経度, 標高m]`）と出典 |
| `stations-elevation_20261013_0219.json` | 駅の地面の標高（同じ DEM）。今は表示に使っていない |
| `coverage-matching.csv` | 収集時の relation 一覧。`appRouteKeys` は名前の部分一致で付けたもので**使っていない**（下記） |
| `terrain3d-match-report.json` | `build-terrain3d.mts` が書く、アプリの路線との対応付けの結果 |

## 出典とライセンス

- 線形: © OpenStreetMap contributors（ODbL）。Overpass API（overpass.private.coffee）で 2026-10-11 取得
- 標高: Copernicus DEM GLO-90（Open-Meteo Elevation API 経由）、2026-10-11 取得。EGM2008 ジオイド基準
  - 90m 解像度なので国土地理院 10m DEM より粗い
  - OSM の頂点ごとに取得した値。頂点の間に足した点は、隣の値を直線で按分したもの（元データの `definition` に明記）
  - 取得できなかった点は null（今回は 0 点）。推測で埋めない
- 画面の下に両方の出典を表示している

## 高さの意味（重要）

**高さは線路の下の地面の標高で、線路自体の高さではない。** 地下鉄は地下を、高架は地面より上を走る。
`docs/track-geometry.md`「高さの決まり」のとおり、地形の標高と線路の標高は混ぜない。
OSM の `layer` / `bridge` / `tunnel` から高さを作ることもしない。画面にも「地面の標高」と書いている。

## 表示用ファイルの作り方

```bash
npx tsx scripts/line-geometry/build-terrain3d.mts
# → public/data/terrain3d-lines.json（約100KB）と terrain3d-match-report.json
```

- アプリの路線（`src/data/routes`）と OSM の relation は、名前ではなく**駅の位置**で対応付ける
  - 駅の 90% 以上が線形の頂点から 200m 以内にある relation を選ぶ。同じくらいなら短い relation（直通運転の長い relation より、その路線に近い）
  - 元データの `appRouteKeys` は湘南新宿ラインの2系統の取り違えや、小田急小田原線などの付け漏れがあったので使わない
- 端が 50m 以内で接するチェーンはつなぐ。駅を1つだけ含む 2km 以下のチェーン（終点駅の構内だけの way）は丸ごと使う
- その路線の駅の範囲だけを切り出し、3次元の Douglas-Peucker（8m）で間引く
- `tests/unit/data/terrain3d.test.ts` が、対応付けた路線の駅の 9 割以上が線形から 300m 以内にあることを確かめる

## 対応付けの結果（2026-10-13）

45路線。山手線・中央線・総武線・京葉線・埼京線・高崎線・宇都宮線・武蔵野線・八高線・外房線、
東京メトロ銀座線・日比谷線・東西線・有楽町線・南北線・副都心線、都営浅草線・三田線、小田急小田原線・多摩線、東急東横線・田園都市線・目黒線・大井町線、
京成本線・押上線、北総線、新京成、つくばエクスプレス、りんかい線、ゆりかもめ、東京モノレール、多摩モノレール、
横浜市営ブルーライン・グリーンライン、相鉄いずみ野線、都電荒川線、日暮里・舎人ライナー、東武大師線・亀戸線、
湘南新宿ライン（2系統）、京急空港線、ニューシャトル、伊豆箱根大雄山線。一覧は `terrain3d-match-report.json`。

対応しなかった路線（relation が収集範囲に無い、または駅の 90% に届かない）は立体表示に出ない。
画面には「表示中 N 路線のうち M 路線」と出る。

## 収集スクリプト

`scripts/line-geometry/*.py` は収集に使ったスクリプト（受け取った ZIP のもの）。サンドボックスからは
Overpass・Open-Meteo に接続できないため、ここでは実行していない。
