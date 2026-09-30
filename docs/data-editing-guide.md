# データ編集の取扱説明書

Flex Railway Map のデータ（路線・駅・直通運転・運行系統・駅統計・時刻表・ガイド）を
**人・Claude Code・ChatGPT・Genspark など、誰が編集しても同じ結果になるように**するための手順書。

**データファイルを1行でも変える前に、この文書の「共通ルール」と、該当ファイルの節を読むこと。**
各データファイルの冒頭にも「ここを読んでから更新」と書いてある。

---

## 0. 共通ルール（全データ共通）

1. **推測で書かない。** 駅名・区間・直通先・行先・統計値は、確認できた一次情報
   （各社の公式案内・時刻表・公的統計・OpenStreetMap など）があるものだけを書く。
   「それっぽい値」「概算」「AIによる推計」は禁止（CLAUDE.md「データに関する絶対ルール」）
2. **出典を残す。** 追加・変更した値の出典（URL と確認日）を、そのファイルの決まった場所
   （`sources` フィールド、`PARAM_DATA_SOURCES`、`docs/through-services.md` など）に書く
3. **分からないものは空けておく。** データが無い駅・路線は、ゼロや推定値で埋めずに
   「項目を書かない」。画面は「データなし」（灰色）と表示する
4. **駅名は路線データの表記に合わせる。** `ヶ` と `ケ`、`之` と `ノ` などの表記ゆれで
   別の駅扱いになる。迷ったら `src/data/` を検索して既存の表記を使う
5. **値だけを書く。** データファイルでは、定数の参照・`.map`・関数呼び出しなどの計算を
   使わずに値をそのまま書く（1か所を見れば全部分かるように）。例外は路線データの
   組み立てファイル（`jr-shonan-shinjuku-line.ts`）のように、座標の書き写しを避けるための
   ものだけで、その理由をファイル冒頭に書く
6. **同じ値を2か所に書かない。** 色・名前・座標などを2か所目に書きたくなったら、
   既存の定義を参照する（例: 湘南新宿ラインの色は `SHONAN_SHINJUKU_COLOR` 1か所）
7. **編集したら必ず検証する。**

   ```bash
   npm run test:data     # データの整合性テスト（数秒）
   npm run test:types    # 型チェック
   npm run test:unit     # 全ユニットテスト
   npm run build         # ビルド
   ```

   `test:data` が落ちたら、エラーメッセージに「どのデータの・どの値が・なぜ」だめかが出る。
   値を直す。**テストの期待値の方を書き換えて通すのは禁止**（理由がある場合は、そのテストの
   コメントに理由を書いたうえで変える）
8. **記録する。** 変更は `CHANGE.log` に、分かったが直さなかった問題は `TODO.md` に書く

---

## 1. ファイル一覧（どこを直すか）

| 直したいもの | ファイル | 検証するテスト |
|---|---|---|
| 路線の駅（駅名・座標・次の駅までの分） | `src/data/<路線>.ts`（例: `jr-tokaido-main-line.ts`） | `tests/unit/data/routeDuplication.test.ts` ほか |
| 路線の登録・色・日本語名 | `src/data/routes.ts`（`routes` / `routeColors` / `routeNames`） | 同上 |
| 路線名の英語 | `src/utils/translation.ts` の路線名の表 | `tests/unit/utils/translation.test.ts` |
| 直通運転（乗り換えなしで行ける範囲） | `src/data/throughServices.ts` | `tests/unit/data/throughServices.test.ts` |
| 運行系統名と主な始発・行先 | `src/data/serviceSystems.ts` | `tests/unit/data/serviceSystems.test.ts` |
| 並走区間（色を見分けられるようにする組） | `src/data/sharedCorridors.ts` | `tests/unit/data/sharedCorridors.test.ts` |
| 駅統計（ヒートマップ）の値 | `src/data/station-stats-data.json` | `tests/unit/data/stationStats.test.ts` |
| 駅統計の項目・出典・実データか推定か | `src/data/stationStats.ts` | 同上 |
| 時刻表 | `src/data/timetableData.ts` | `tests/unit/data/timetableData.test.ts` |
| ガイド記事（/guides/*） | `src/data/guides.ts` | ビルド |

---

## 2. ファイルごとの書き方

### 路線データ（`src/data/<路線>.ts`）

```ts
export const jrExampleLine: Station[] = [
  { name: '駅A', lat: 35.0, lng: 139.0, timeToNext: 3 },  // 次の駅Bまで3分
  { name: '駅B', lat: 35.1, lng: 139.1 },                  // 終点は timeToNext を書かない
];
```

- 並び順は線路の順。**途中の駅を飛ばさない**（過去に常滑線の太田川などが欠落していた）
- `timeToNext` は各駅停車ではなく、その路線の主な列車（急行等）の平均所要分でよいが、
  路線ごとに方式をそろえる（CLAUDE.md「小田急線の経路推薦」の経緯を参照）
- 新しい路線は `routes.ts` の `routes`・`routeColors`・`routeNames` の3か所に登録し、
  `translation.ts` に英語名を足す

### 直通運転（`src/data/throughServices.ts`）

```ts
{
  id: 'odakyu-enoshima',                     // 半角英小文字とハイフン。重複禁止
  name: '小田急江ノ島線⇔小田原線（…）',        // 記録用の説明
  sections: [
    { route: 'odakyuLine', from: '新宿', to: '相模大野' },  // 列車が走る区間
    { route: 'odakyuEnoshimaLine' },                         // from/to 省略 = 路線データの端まで
  ],
},
```

- **1本の列車が実際に通る路線だけを1つにまとめる。** 「A⇔B」「B⇔C」があっても
  A⇔C の定期列車が無ければ、A・B・C を1つにしない
- 特急（座席指定が必要な列車）だけの直通、臨時列車は入れない
- 出典は `docs/through-services.md` の「調べ方と出典」に URL を足す

### 運行系統と始発・行先（`src/data/serviceSystems.ts`）

```ts
{
  route: 'jrTokaidoMainLine',          // この系統を描いている路線キー
  brand: 'uenoTokyoLine',              // 系統名（表示名は translation.ts の serviceBrand*）
  head: [                              // 路線データの「先頭側」の主な始発・行先
    { via: 'jrUtsunomiyaLine', stations: ['宇都宮', '小金井'] },  // via = 直通先の路線
  ],
  tail: [{ stations: ['熱海'] }],      // 路線データの「末尾側」
  sources: ['https://…'],              // 確認した出典（1つ以上）
},
```

- `head` / `tail` は路線データの駅の並び（先頭・末尾）の向き。路線ファイルを開いて確認する
- `stations` の駅は `via` の路線（無ければ `route` の路線）に実在すること（テストで検証）。
  路線データに駅が無いときは、テストの `KNOWN_MISSING_TERMINI` に理由付きで足す
- 新しい系統名を使うときは `ServiceBrand` と `SERVICE_BRAND_LABEL_KEY`、
  `translation.ts` の4言語を足す
- **上野東京ライン・湘南新宿ラインの路線名は「系統名（路線名）」で書く**
  （`routes.ts` の `routeNames`）。例: `上野東京ライン（東海道線）`、`湘南新宿ライン（高崎線・東海道線）`。
  「東海道本線」＋下に系統名、のような別の書き方を混ぜない。時刻表（`timetableData.ts`）の `name` も
  同じ文字列にし、`translation.ts` の `routeTranslations` に英語名を足す（テストで検証）

### 並走区間（`src/data/sharedCorridors.ts`）

- 同じ線路・並行する線路を走る別の路線を1区間ずつ書く。テストが色の見分けやすさ
  （色差 ΔE 20 以上）を検証する
- 案内上同じ名前で、わざと同じ色にしている組は `SAME_BRAND_ROUTES` に書く

### 駅統計（`src/data/station-stats-data.json` と `stationStats.ts`）

- **実データのみ。** 項目が実データか推定値かは `STAT_PARAMS` の `dataQuality` で管理し、
  実データには `PARAM_DATA_SOURCES` に出典（名前・URL・取得日）が必須
- JSON は1行に詰めた形式のまま保存する（整形し直すと差分が数万行になる）。
  Python なら `json.dump(data, f, ensure_ascii=False, separators=(',', ':'))`
- 一部の駅にしか無いデータは、対象駅数を出典に書く

### 駅周辺の施設数（800m）を新しいデータで更新する

外部（ChatGPT / Genspark など）で集めた「駅から半径800mの施設数」の新しい版を受け取ったときの手順。
2026-09-29 の首都圏拡張（`data/kanto-poi-800m-2026-09/`）がこの手順の実例。

1. 受け取ったフォルダを `data/<名前>-<年>-<月>/` に置く。中身は次の2つが要る
   - 駅名 → 値の JSON（`station-stats-data.json` と同じフィールド名。**既存の 500m 系フィールドと同じ名前の値は入れない**）
   - 各駅を数えた位置（駅名・緯度・経度）の CSV（`coverage.csv` と同じ列名）
2. 出典・収集日・半径・ライセンス・対象駅数を、そのフォルダの `README.md` に書く
3. 取り込みスクリプトで検証して取り込む（何度実行しても同じ結果になる）:
   `npx tsx scripts/merge-kanto-poi-800m.mts`
   （別のフォルダなら、スクリプト冒頭の `DIR` を変えたコピーを作る）
   - 取り込まない（保留にする）のは、(a) 数えた位置がアプリの同じ名前の駅から 800m より離れている、
     (b) 同じ名前の駅がアプリに 2km 以上離れて複数ある（駅統計は駅名だけで引くので別の駅にも値が出る）、
     (c) 全項目が 0（取得失敗の疑い）の駅
   - 結果は `validation.json` に残る。保留の駅は推測で直さず、理由と一緒に報告する
4. `src/data/stationStats.ts` の `KANTO_POC_SOURCE`（出典）に、収集日と対象駅数を書き足す
5. `npm run test:data` → `test:types` → `test:unit` → `build`

**収集スクリプトを直すとき**: Overpass はタイムアウトでも `elements: []` と `remark` を返す。
これを 0 件として保存しない（`data/kanto-station-poc-2026-09/scripts/kanto_poi_scale.py` の `fetch_cell` が実例）。

### 時刻表（`src/data/timetableData.ts`）

- 各路線の `directions` は `[下り（片方向）, 上り（逆方向）]` の2要素
- 公式時刻表から写したものは `dataQuality: 'official'`、運行間隔からの概算は書かない
  （既定で「推定」扱いになり、画面に注意書きが出る）

### ガイド（`src/data/guides.ts`）

- **同じ `slug` のガイドは互いの翻訳として扱われる**（hreflang で結ばれる）。
  翻訳ではない別内容のガイドは、別の `slug` にする
- `faq` は構造化データにもそのまま使うので、実装されていない機能の回答を書かない

---

## 3. よくある失敗

| 失敗 | 何が起きるか | 防ぎ方 |
|---|---|---|
| 駅名の表記ゆれ（`保土ヶ谷` と `保土ケ谷`） | 乗換駅・直通が効かない | 既存表記を検索して合わせる |
| 同名の別駅（大宮〈埼玉〉と大宮〈京都〉） | 別の地域の路線が混ざる | 座標で区別される（5km 以上離れていれば別駅）。座標を正しく書く |
| 出典なしの値 | 誤情報で利用者が判断を誤る | 出典が無いなら書かない |
| JSON の整形し直し | 差分が巨大になりレビュー不能 | 1行形式のまま保存 |
| テストの期待値を書き換えて通す | 不具合を隠す | 値の方を直す |
