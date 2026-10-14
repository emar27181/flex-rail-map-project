# 首都圏の線形 v2（区間の構造つき, 2026-10-14）

地図の「立体（標高）」表示の線形データ v2。**既定は v2**（画面の「線形データの版」で v1 に切り替えられる）。
2026-10-14 にユーザーから受け取った `flex3d-data-kanto.zip` の一部を置いた。

## v1 との違い

| | v1（`data/kanto-line-geometry-2026-10/`） | v2（ここ） |
|---|---|---|
| 線形 | OSM relation 100本（Overpass, 2026-10-11） | OSM relation 669本（Geofabrik 関東抽出, 2026-10-14） |
| 区間の構造 | なし | 地上（at_grade）・高架（elevated）・地下（underground） |
| 高さ | 線形の頂点ごとの地面の標高（Copernicus DEM） | **持たない**（すべて null）。画面で地面の格子の高さに載せる |
| 対応した路線 | 45 | 80（v1 の45路線をすべて含む） |

- 区間の構造は OSM の `tunnel` / `bridge` / `layer` などのタグから分けたもの。**深さ・高さ（m）ではない**。
  元データも `layer` を高さに変換していない（`notes`）。画面でも地下を地面の下に沈めず、地面の位置に破線で描く
- 元データの標高（`groundElevationM` / `trackElevationM` / `depthBelowGroundM`）はすべて null。推測で埋めない

## ファイル

| ファイル | 中身 |
|---|---|
| `data/routes-index.json` | 669本の一覧（名前・事業者・構造ごとの長さ・停車駅） |
| `data/routes/rel-*.geojson` | **対応付けに使った80本だけ**（全669本は約55MB のため置かない） |
| `data/mapping/route-mapping.csv` | 元データ付属の対応表。v1 の名前による対応を写したもの（100件）なので**使っていない** |
| `data/quality/*.json` | 元データ付属の検証結果・国土数値情報との突き合わせ |
| `data/sample/` | 元データ付属の千代田線・大江戸線の駅の地面の標高（国土地理院 DEM5A, T.P.）。今は表示に使っていない |
| `terrain3d-v2-match-report.json` | `build-terrain3d-v2.mts` が書く、アプリの路線との対応付けの結果 |

ZIP の `data/structures-kanto.json`（構造が変わる地点 45,116点, 約14MB）は置いていない。

## 表示用ファイルの作り方

```bash
npx tsx scripts/line-geometry/build-terrain3d-v2.mts
# → public/data/terrain3d-lines-v2.json（約360KB）と terrain3d-v2-match-report.json
# 全669本から選び直すときは、ZIP を展開した data フォルダを渡す
npx tsx scripts/line-geometry/build-terrain3d-v2.mts --src <展開先>/data
```

- アプリの路線との対応は v1 と同じく**駅の位置**で決める（駅の90%以上が線形から200m以内。同じくらいなら短い relation）。
  ここにある80本だけから作っても、全669本から作ったのと同じファイルになることを確かめた（2026-10-14）
- その路線の駅の範囲だけを切り出し、構造が同じ区間ごとに 8m で間引く（トンネルの出入口・高架の端は残る）
- 特急・直通列車の relation（踊り子・ひたち・しおさい など）に対応した路線がある。走る線路は同じなので、
  駅の範囲で切り出せば線形は変わらない
- 地面の格子（`public/data/terrain3d-ground.*`）は v1 と v2 の両方の範囲を覆うように作る
  （`scripts/line-geometry/terrain_ground_build.py`）。テストですべての点が格子の中にあることを確かめる

## 出典

- 線形・区間の構造: © OpenStreetMap contributors（ODbL-1.0）。Geofabrik の関東抽出（`kanto-latest.osm.pbf`, 2026-10-14）
- 高さ（画面）: Copernicus DEM GLO-90（`data/kanto-line-geometry-2026-10/README.md`「地面」）
