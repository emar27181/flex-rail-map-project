# 駅ナンバリング・公式資料照合記録

参照日: **2026-10-16（Asia/Tokyo）**。全国全件の照合完了ではありません。

## 結果

- 照合済み: 28路線キー・518件（駅×路線の組。実駅数ではない）。
- mainからの番号修正: 438件。根拠のない合成・他社区間の番号除去: 7件。
- 山手線修正PR #78のコミットを取り込み、二次資料だけだった根拠を公式資料で再照合。
- ランタイムの定義元は `src/data/stationNumbers.ts` のまま。
- `verified.json` は公式資料から転記・照合した**テスト用の証拠スナップショット**。本番データから期待値を作らない。本番でこのJSONを重ね合わせない。

## 出典（全て公式）

| ID | 発行者・資料 | 参照日 |
|---|---|---|
| jr2016 | JR東日本：[首都圏エリアへ駅ナンバリングを導入します・別紙2](https://www.jreast.co.jp/press/2016/20160402.pdf) | 2026-10-16 |
| jy26 | JR東日本：[高輪ゲートウェイ駅・駅ナンバリング](https://www.jreast.co.jp/estation/station/info.aspx?StationCd=1750) | 2026-10-16 |
| toei | 東京都交通局：[各駅情報・都営地下鉄](https://www.kotsu.metro.tokyo.jp/subway/stations/) | 2026-10-16 |
| hibiya | 東京メトロ：[日比谷線・路線と駅の情報](https://www.tokyometro.jp/station/line_hibiya/index.html) | 2026-10-16 |
| odakyu | 小田急電鉄：[各駅のお子さま向け設備一覧・駅番号併記](https://www.odakyu.jp/oyako/facilities/) | 2026-10-16 |
| keikyu | 京浜急行電鉄：[路線図・各駅情報・駅番号付き一覧](https://www.keikyu.co.jp/ride/kakueki/) | 2026-10-16 |
| keio | 京王電鉄：[2023年会社要覧・路線の概要](https://www.keio.co.jp/company/corporate/summary/corporate_manual/pdf/2023/2023_p017_p018.pdf) | 2026-10-16 |
| rinkai | 東京臨海高速鉄道：[駅ナンバリングの導入について・全8駅の一覧](https://www.twr.co.jp/tabid/101/Default.aspx?dispmid=860&itemid=218) | 2026-10-16 |
| yurikamome | ゆりかもめ：[駅・時刻表・全駅の番号一覧](https://www.yurikamome.co.jp/?vm=r) | 2026-10-16 |
| blue | 横浜市交通局：[地下鉄路線図・Station Number](https://www.city.yokohama.lg.jp/kotsu/kigyo/anzen/sonotataisaku.files/0003_20210330.pdf?lang=pt) | 2026-10-16 |
| tobu | 東武鉄道：[各駅のお子さま向け設備一覧・日光線駅番号](https://www.tobu.co.jp/railway/guide/childcare_support/station/) | 2026-10-16 |
| monorail | 東京モノレール：[Monorail Guide・Fare table・駅番号併記](https://www.tokyo-monorail.co.jp/english/guidance/train_info.html) | 2026-10-16 |
| keikyu-rename | 京浜急行電鉄：[駅名変更を記念した企画・番号と新旧駅名の対応表](https://www.keikyu.co.jp/company/news/2019/20200309HP_19252TS.html) | 2026-10-16 |
| sr-akabane-iwabuchi | 埼玉高速鉄道：[赤羽岩淵・各駅案内（駅番号）](https://www.s-rail.co.jp/ticket/line/akabane-iwabuchi/) | 2026-10-16 |
| sr-kawaguchi-motogo | 埼玉高速鉄道：[川口元郷・各駅案内（駅番号）](https://www.s-rail.co.jp/ticket/line/kawaguchi-motogo/) | 2026-10-16 |
| sr-minami-hatogaya | 埼玉高速鉄道：[南鳩ヶ谷・各駅案内（駅番号）](https://www.s-rail.co.jp/ticket/line/minami-hatogaya/) | 2026-10-16 |
| sr-hatogaya | 埼玉高速鉄道：[鳩ヶ谷・各駅案内（駅番号）](https://www.s-rail.co.jp/ticket/line/hatogaya/) | 2026-10-16 |
| sr-araijuku | 埼玉高速鉄道：[新井宿・各駅案内（駅番号）](https://www.s-rail.co.jp/ticket/line/araijuku/) | 2026-10-16 |
| sr-tozuka-angyo | 埼玉高速鉄道：[戸塚安行・各駅案内（駅番号）](https://www.s-rail.co.jp/ticket/line/tozuka-angyo/) | 2026-10-16 |
| sr-higashi-kawaguchi | 埼玉高速鉄道：[東川口・各駅案内（駅番号）](https://www.s-rail.co.jp/ticket/line/higashi-kawaguchi/) | 2026-10-16 |
| sr-urawa-misono | 埼玉高速鉄道：[浦和美園・各駅案内（駅番号）](https://www.s-rail.co.jp/ticket/line/urawa-misono/) | 2026-10-16 |
| metro-ayase | 東京メトロ：[綾瀬駅/C19・路線と駅の情報](https://www.tokyometro.jp/station/ayase/index.html) | 2026-10-16 |

## 照合した範囲

| 路線キー | 照合件数 | 出典ID |
|---|---|---|
| yamanote | 30 | jy26, jr2016 |
| hibiyaLine | 22 | hibiya |
| toeiAsakusaLine | 19 | toei |
| toeiMitaLine | 27 | toei |
| toeiShinjukuLine | 20 | toei |
| toeiOedoLine | 37 | toei |
| odakyuEnoshimaLine | 17 | odakyu |
| odakyuTamaLine | 8 | odakyu |
| keioLine | 35 | keio |
| keikyuLine | 26 | keikyu, keikyu-rename, toei |
| keikyuAirportLine | 7 | keikyu |
| keikyuKurihamaLine | 6 | keikyu |
| rinkaiLine | 8 | rinkai |
| yurikamomeLine | 15 | yurikamome |
| yokohamaBlueLine | 31 | blue |
| tobuNikkoLine | 26 | tobu |
| tokyoMonorail | 8 | monorail |
| keioSagamiharaLine | 12 | keio |
| saitamaRailway | 8 | sr-akabane-iwabuchi, sr-kawaguchi-motogo, sr-minami-hatogaya, sr-hatogaya, sr-araijuku, sr-tozuka-angyo, sr-higashi-kawaguchi, sr-urawa-misono |
| chuo | 32 | jr2016 |
| jrSobuLine | 21 | jr2016 |
| jrJobanLine | 10 | jr2016 |
| yokosukaLine | 16 | jr2016 |
| jrYokohamaLine | 20 | jr2016 |
| jrNanbuLine | 21 | jr2016 |
| jrMusashinoLine | 27 | jr2016 |
| sotetsuJRLine | 6 | jr2016 |
| chiyodaLine | 3 | metro-ayase, jr2016 |

## 取り扱い

- JR東日本の2016年公式一覧は掲載されている駅だけに使用。高輪ゲートウェイは現行駅ページで補完。取手・大宮より先など掲載範囲外の既存番号は確認済みに含めず、推測で連番を作らない。
- 中央線データは快速・各停を含むため、快速駅のJCを優先し、快速にない駅はJBを使う。総武線も快速のJOを優先し、それ以外はJB。系統の分離はこのPRでは行わない。
- 千代田線データの亀有・金町はJR常磐各停のJL20・JL21。綾瀬はメトロC19を維持。相鉄JR直通のJR側はJS、武蔵野線の京葉線直通先はJEを使い、独自番号を作らない。
- 京王の相模原線はPDFの抽出テキストで駅名と番号が誤対応したため、**PDF画像で確認**した対応を採用。
- 花月園前・仲木戸は改称資料で同一駅と確認し、既存の路線データのキーを保ったままKK30・KK35に修正。駅名更新は別作業。
- 東京モノレールの「羽田空港第1・第2ターミナル」は実在の単一駅ではないため番号を除去。MO09は新整備場。MO10/11を1つにまとめない。路線の駅データの分離は別作業。
- 番号だけを直すPR。座標・駅順・所要時間は変更しない。
- PDFの字体（⻄/西、戶/戸など）やヶ/ケは同一駅と目視確認した表記に対応させた。番号を駅配列から計算しない。

## 未照合・保留

`verified.json` の `deferred` に残件を明記。元の登録1,753件全てが正確になった、という意味ではありません。確認対象外の既存値は変更していません。

## 検証

`tests/unit/data/stationNumberOfficialAudit.test.ts` が照合済み全件、除去した誤番号、公式URL・参照日・出典IDの存在と重複を検査。
既存の武蔵野線テストもJM01/JM25という誤った期待値だったため、公式一覧の府中本町JM35・西船橋JM10へ修正し、理由をテストに明記。
