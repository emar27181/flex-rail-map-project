# 記事の書き方（/articles）

記事（`/articles/*` と `/{en,zh,ko}/articles/*`）を書く・直すときの決まり。
2026-09-29 に6記事×4言語をこの形に書き直し、1記事1ファイルで量産できる仕組みにした。
ほかの AI（ChatGPT / Genspark など）に書いてもらうときは `docs/templates/article-prompt.md` を渡す。

## 仕組み（1記事1ファイル）

| 置き場所 | 中身 |
|---|---|
| `src/data/articles/{slug}.ts` | 記事1本の全部（4言語のタイトル・説明・本文ブロック、地図の状態、埋め込む画面、関連記事）。値だけ |
| `src/data/articles/index.ts` | 記事の一覧（並び順＝記事一覧ページの順）。記事を足したら1行足す |
| `src/data/articles/types.ts` | 記事データの形（使えるブロックの種類） |
| `src/utils/articleRender.ts` | ブロック → HTML。部品の HTML はここだけで作る |
| `src/styles/article-layout.css` | 見た目（角丸・ボタンはデザイントークンの CSS 変数だけ） |
| `src/components/ui/atoms/mapEmbed.ts` | 実際の画面の埋め込み（iframe）の部品。記事と駅・路線のページで共通 |
| `docs/templates/article-template.ts` | ひな形（`npm run article:new -- --slug {slug}` で写せる） |
| `docs/templates/article-prompt.md` | ChatGPT / Claude などに記事を書いてもらう指示文（入力・出力・守ること） |
| `src/utils/articleFacts.ts` | 駅番号・駅名・路線名の差し込み（`{stationNumber:路線:駅}` など）。データに無いと止まる |
| `src/utils/articleAnalytics.ts` | 記事の中の操作の GA4 イベント（デモを見た・触った・地図へ移った） |
| `docs/article-platform.md` | 記事 × 地図デモの基盤の設計判断（なぜ既存の仕組みを広げたか・名前の対応） |

ページのファイル（`.astro`）は作らなくてよい。記事データを足せば日本語・英語・中国語・韓国語のページ、
記事一覧、sitemap、関連記事が自動でできる。

## 記事を足す手順

1. テーマと検索意図を決める（Search Console の検索語・訪日旅行者の困りごと）
2. 既存の記事と重ならないか確かめる（`src/data/articles/index.ts`）
3. 出典（公式資料）で事実を確かめる。確かめられないことは書かない
4. `npm run article:new -- --slug {slug}` でひな形を作る（4言語・`index.ts` への追加まで）。
   ほかの AI に書いてもらうときは `docs/templates/article-prompt.md` を渡す
5. 本文・メタ情報を書く。駅番号・駅名・路線名は差し込み（下の「駅番号・駅名の差し込み」）
6. デモ（`maps` / `shots`）を書く（下の「地図デモの書き方」）
7. `npm run article:validate`（差し込み・駅と路線の組・出典・4言語の並び・書きかけを確かめる）
8. `npm run dev` で4言語のページを開き、デモが説明と合っているか目で確かめる（ライト・ダーク、スマホ幅）
9. `npm run test:types` → `npm run test:unit` → `npm run build`（`test:render` に記事の描画テストもある）
10. PR を作り、Netlify のプレビューで確認する
11. 承認されたら公開（マージ）
12. 公開後 2〜4週間、Search Console（記事ごとの表示回数・クリック・CTR・平均掲載順位・国と言語）と
    GA4（下の「計測」）で様子を見る。少ないデータで効果を決めつけない

## 何を書くか

- **1記事1テーマ。** 読者の1つの問い（「路線図の読み方」「通勤時間から駅を探す」など）にだけ答える。
  ほかのテーマに触れたくなったら、本文に書かずに関連記事（`ARTICLES` の `related`）で案内する
- **このサイトで実際にできることを、実際の画面で見せる。** できないこと（家賃のデータなど）は
  「できない」と書く。推定値を根拠にしない（CLAUDE.md「データに関する絶対ルール」）
- **数字・固有名詞は確かめてから書く。** 駅数・路線数はサイトのデータで数え、時点を書く
  （例:「13路線（2026年9月時点の{siteName}のデータ）」）。
  英語・中国語・韓国語の駅名は `translateStation` の値に合わせ、訳が無いものは名前を出さない書き方にする

## 構成（結論 → デモ → 起承転結）

| 部分 | 中身 |
|---|---|
| リード（`description`） | 読者の困りごとと、この記事で分かることを2〜3文で |
| 結論（`.points`） | 答えを3行で先に言う（PREP の Point） |
| デモ（`.embed`） | **詳しい説明の前に、この記事の主題に合う実際の地図をまず触ってもらう** |
| 01 起 | なぜ困るのか・よくある間違い |
| 02 承 | 基本のやり方（サイトの操作を画面つきで） |
| 03 転 | 見落としやすい点・数字の読み方の注意・一歩進んだ使い方 |
| 04 結 | 次にやること（手順・チェックリスト）と、地図を開くボタン（`.cta`） |

- **デモ先行が必須。** 全記事・全言語で結論の直後に操作可能な地図デモを出し、説明を読む前に「何ができるか」を体感してもらう。`articleRender.ts` が最初の `embed` を自動で結論直後へ移動するため、既存記事と新規記事に共通適用する
- 地図や画面の機能を本文で説明したら、その説明の近くにも `shot` を置く。文章だけで操作・違いを説明しない
- 見出し（h2）は4つが目安。見出しだけ読んでも話の流れが分かるように書く
- 見出しとタイトルには、検索する人が使う言葉（「路線図 読み方」「通勤時間」など）を入れる
- 関連記事は本文に書かない（`ArticleLayout.astro` が `related` の3本を記事の最後に出す）

## 実際の画面（1セクション1つが目安）

2026-10 にスクリーンショット（画像）をやめ、**このサイトの実際の画面を iframe で埋め込む**形にした
（画像は小さくて読みにくく、地図や UI を変えるたびに撮り直しが要ったため）。
冒頭の埋め込みだけは、読み込むまで同じ画面を撮った画像を下に敷き、検索結果・SNS のサムネイル（og:image）にも使う
（`npm run og:capture`。docs/seo.md の「プレビュー画像」）。本文の画面は iframe のまま。

- 記事データの `shots` に画面を書く:
  - 地図: `map` に状態（`routes` `from` `to` `metric` `center` `zoom`、所要時間の表示は `travelTimes: true`）
  - 駅・路線のページ: `page` に日本語版のパス、`anchor` に開く位置（ページ内の id。例: 路線の駅一覧 `station-list`、駅の周辺データ `around-stats`）
    - 埋め込みのURLでは `#id` ではなく `?section=id` になる（`shotEmbedSrc`）。`#id` だとブラウザが記事のページごとその位置まで
      スクロールし、記事が途中から表示されて冒頭のデモが見えなかった（2026-10-12）
  - 冒頭のデモと同じ画面を本文でもう一度埋め込まない。同じ URL の2つ目は描画時に外す（`articleBlocksForRender`）
- 本文では `{ type: 'shot', shot: 'キー', alt, caption }`。説明している段落のすぐ下に置く。
  `alt` は iframe の title（読み上げ用に、何の画面か）、`caption` に「何を見る画面か」を1文
- 埋め込みは記事の言語・テーマ（ライト/ダーク）で開く。ボタン（「表示路線の切替」など）は押した状態で始められないので、
  見せたい状態は `map` の値で書き、操作が要るときは `caption` で「右上の〜を開く」と案内する
- 最初から中の地図を動かせる（押して有効にする手順は無い）。部品は `ui/atoms/mapEmbed.ts`
- 以前の画像（`public/images/articles/`）と撮影スクリプト（`scripts/capture-article-screenshots.mts`）は使っていない

## 実際の地図の埋め込みと、地図を開くボタン

- `{ type: 'embed', map: 'main', view: { center, zoom } }` で、記事の内容の状態の地図を iframe で見せる
  （地図ページの `?embed=1`。ナビ・広告・Cookie の案内を出さず、パネルを閉じて始まる。
  記事側でも最初から地図を動かせる）
- `{ type: 'cta', map: 'main' }` は同じ状態の地図を全画面で開くボタン。記事の最後に置く
- 地図の状態は `maps` に名前を付けて1回だけ書く。URL は `mapDeepLink.ts` が作る（パラメータ名を書かない）

## 駅番号・駅名の差し込み（2026-10-15）

記事に駅番号を手で書くと、データと食い違う（記事は「東京は JY01」、地図は「JY24」だった）。
生成 AI の原稿に存在しない番号が紛れ込むのも防ぐため、駅番号・駅名・路線名は次の書き方で書く。

| 書き方 | 出るもの |
|---|---|
| `{stationNumber:yamanote:渋谷}` | その路線でのその駅の番号（`src/data/stationNumbers.ts`） |
| `{station:yamanote:渋谷}` | 記事の言語の駅名（`translateStation`） |
| `{line:yamanote}` | 記事の言語の路線名（駅・路線のページと同じ） |

- 駅は「路線キー:駅名」の組で書く（同じ名前の別の駅と区別するため）。将来、全路線で一意の駅 ID ができたらそれに替える
- データに無い駅・番号を書くとビルドとテストが止まる。タイトル・説明（meta）では使わない（検索結果に出る文はそのまま書く）
- 駅番号を書いた記事は `sources`（出典）が必須。照合が済んでいない路線（`docs/data-maintenance-ledger.md`）は例に使わない

## 地図デモの書き方（`maps` / `shots`）

| 項目 | 中身 |
|---|---|
| `routes` | 表示する路線 |
| `focus: { name, route }` | その駅を中心に開く（`zoom` を省くと駅を見る拡大率 `ARTICLE_FOCUS_ZOOM`） |
| `stationNumbers: true` | 駅番号を出す（URL の `?numbers=1`。日本語の地図は既定で出さない） |
| `view: '3d'` | 立体表示で開く（URL の `?view=terrain3d`） |
| `center` `zoom` / `from` `to` / `metric` / `travelTimes` | 以前からの指定 |

- 1つの記事にデモはいくつでも置ける（冒頭の `embed` と、本文の `shot`）。同じ状態を2回は置かない
- 記事の中の地図は最初から操作できる。下に「地図を大きく開く」（同じ状態の地図のページへ）と「全画面」
  （対応していないブラウザでは出ない）が付き、読み込むまでは案内の文が出る（`ui/atoms/mapEmbed.ts`）

## 出典・この記事の路線と駅・目次

- `sources`: 記事の最後に「出典」として一覧で出る（題名・発行元・確認日）
- `relatedRoutes` / `relatedStations`: 記事の最後に路線・駅のページへのリンクを出す（その言語のページがあるものだけリンク）
- 目次は `h2` から自動で作る（見出しに `section-1` などの id が付く）

## 広告（2026-10-16, `ui/atoms/adSlot.ts`）

記事データに広告を書かない。描画（`src/utils/articleRender.ts`）がすべての記事・言語に同じ決まりで置く。

| 位置 | 決まり |
|---|---|
| 本文の間 | 3つ目の見出しの前から3節ごとに1つ（`articleAdSections`）。4節の記事は1つ、7節なら2つ。結論と冒頭のデモの近くには置かない |
| 読み終わった後 | 出典の後・関連記事の前に1つ（`articleEndAdHtml`） |

- 地図を開くボタン・説明文の無い地図のデモのすぐ下には置かない（後ろの節へずらす。押し間違えを誘わない）
- 広告は本番のサイトだけで読み込む。プレビューでは点線の「広告枠」の箱で位置だけ見せる
- 広告ユニット ID は `src/config/ads.ts` の `ADSENSE_SLOTS.articleInline`（AdSense の管理画面で作った「記事内広告」の ID）。
  空のあいだは本番に何も出ない
- どの広告が出るかは AdSense がページの内容（言語・地名・話題）と閲覧者から選ぶ。記事の話題がはっきりしているほど
  記事に合った広告になりやすい（1記事1テーマにする理由の1つ）。広告主をこちらで指定することはできない

## 計測（GA4, `src/utils/articleAnalytics.ts`）

| イベント | いつ |
|---|---|
| `article_demo_view` | デモが画面に入った（デモごとに1回） |
| `article_demo_interact` | デモの中を初めて触った（デモごとに1回） |
| `article_demo_fullscreen` | デモを全画面にした |
| `article_map_open` | デモの「地図を大きく開く」・最後のボタンで地図へ移った（`source`: `demo` / `cta`） |
| `article_related_click` | 関連記事を開いた |

パラメータは `article`（slug）・`locale`・`demo_id`。記事の閲覧そのものは GA4 の `page_view` で数える。
GA4 は本番サイトでだけ読み込む（プレビューの操作は数えない）。

## テスト（`tests/unit/data/articleSources.test.ts`, `articleI18n.test.ts`）

- 4言語とも結論3行で始まり、**描画時はその直後に地図デモが来てから説明が始まり**、見出しは3〜5個、最後が地図を開くボタン
- ブロックの並び（種類）が4言語で同じ
- 参照している画面（`shots`）が実在し、`alt` と説明があり、記事の言語で開く
- 地図の状態の路線・指標が地図側で読めるもの
- 関連記事が3本で、実在する別の記事
- サービス名を直書きしていない（`{siteName}`）
- 差し込みがすべて路線データの値になる（無い駅・番号は落ちる）。メタ情報に差し込みを使っていない
- `focus`・`relatedStations` の駅が、その路線に実在する。`relatedRoutes` の路線が実在する
- 出典の URL・題名・発行元・確認日がそろう。駅番号を書いた記事は出典が必須
- ひな形の書きかけ（「〇〇」）が残っていない
- 描画テスト（`tests/render/article.render.ts`）: 本文が HTML にあり、デモに駅番号が出て、「地図を大きく開く」で同じ状態に移る
- 地図へのリンクの `lang` がその記事の言語と一致する

## 参考にした資料

- Google 検索セントラル「有用で信頼性の高い、ユーザー第一のコンテンツの作成」
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google 検索セントラル「Google 画像検索の SEO に関するベスト プラクティス」（画像は関連する文章の近くに置く、alt・キャプション・ファイル名）
  https://developers.google.com/search/docs/appearance/google-images
- PREP 法（結論を先に言う）: https://tcd-theme.com/2021/11/prep.html
- 起承転結で記事を組み立てる: https://note.com/aquaescape/n/nb96ff5723c83

## 記事プレビュー画像と公開前確認

- 記事一覧・関連記事・OG / Twitter / Article構造化データは、同じ `public/og/{言語}/articles/{slug}.jpg` を再利用する。
- 画像の撮影は `npm run build && npm run og:capture -- --only /articles/`。路線フィルタが変わったら再撮影し、再ビルドする。
- 画像が無い記事は壊れた画像を出さない。検索結果のサムネイル表示は検索エンジン側の判断であり保証されない。
- **マージ前に必ず最新headのCI成功、Netlifyプレビュー成功を確認する。** 自動生成画像のコミットでCIが承認待ちになった場合はグリーン扱いしない。
