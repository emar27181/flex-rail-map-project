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
| `docs/templates/article-template.ts` | ひな形 |

ページのファイル（`.astro`）は作らなくてよい。記事データを足せば日本語・英語・中国語・韓国語のページ、
記事一覧、sitemap、関連記事が自動でできる。

## 記事を足す手順

1. `docs/templates/article-template.ts` を `src/data/articles/{slug}.ts` にコピーして書く（4言語）
2. `src/data/articles/index.ts` に1行足す
3. 開発サーバーを起動し（`npm run dev`）、`/articles/{slug}` と英中韓の版を開く
4. 埋め込んだ画面（iframe）が説明文と合っているか目で確かめる（ライト・ダークの両方）
5. `npm run test:types` → `npm run test:unit` → `npm run build`
   （形の決まりは `tests/unit/data/articleSources.test.ts` が確かめる）

## 何を書くか

- **1記事1テーマ。** 読者の1つの問い（「路線図の読み方」「通勤時間から駅を探す」など）にだけ答える。
  ほかのテーマに触れたくなったら、本文に書かずに関連記事（`ARTICLES` の `related`）で案内する
- **このサイトで実際にできることを、実際の画面で見せる。** できないこと（家賃のデータなど）は
  「できない」と書く。推定値を根拠にしない（CLAUDE.md「データに関する絶対ルール」）
- **数字・固有名詞は確かめてから書く。** 駅数・路線数はサイトのデータで数え、時点を書く
  （例:「13路線（2026年9月時点の{siteName}のデータ）」）。
  英語・中国語・韓国語の駅名は `translateStation` の値に合わせ、訳が無いものは名前を出さない書き方にする

## 構成（結論 → 起承転結）

| 部分 | 中身 |
|---|---|
| リード（`description`） | 読者の困りごとと、この記事で分かることを2〜3文で |
| 結論（`.points`） | 答えを3行で先に言う（PREP の Point） |
| 01 起 | なぜ困るのか・よくある間違い |
| 02 承 | 基本のやり方（サイトの操作を画面つきで） |
| 03 転 | 見落としやすい点・数字の読み方の注意・一歩進んだ使い方 |
| 04 結 | 次にやること（手順・チェックリスト）と、地図を開くボタン（`.cta`） |

- 見出し（h2）は4つが目安。見出しだけ読んでも話の流れが分かるように書く
- 見出しとタイトルには、検索する人が使う言葉（「路線図 読み方」「通勤時間」など）を入れる
- 関連記事は本文に書かない（`ArticleLayout.astro` が `related` の3本を記事の最後に出す）

## 実際の画面（1セクション1つが目安）

2026-10 にスクリーンショット（画像）をやめ、**このサイトの実際の画面を iframe で埋め込む**形にした
（画像は小さくて読みにくく、地図や UI を変えるたびに撮り直しが要ったため）。

- 記事データの `shots` に画面を書く:
  - 地図: `map` に状態（`routes` `from` `to` `metric` `center` `zoom`、所要時間の表示は `travelTimes: true`）
  - 駅・路線のページ: `page` に日本語版のパス、`anchor` に開く位置（ページ内の id。例: 路線の駅一覧 `station-list`、駅の周辺データ `around-stats`）
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

## テスト（`tests/unit/data/articleSources.test.ts`, `articleI18n.test.ts`）

- 4言語とも結論3行で始まり、見出しは3〜5個、埋め込みがあり、最後が地図を開くボタン
- ブロックの並び（種類）が4言語で同じ
- 参照している画面（`shots`）が実在し、`alt` と説明があり、記事の言語で開く
- 地図の状態の路線・指標が地図側で読めるもの
- 関連記事が3本で、実在する別の記事
- サービス名を直書きしていない（`{siteName}`）
- 地図へのリンクの `lang` がその記事の言語と一致する

## 参考にした資料

- Google 検索セントラル「有用で信頼性の高い、ユーザー第一のコンテンツの作成」
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google 検索セントラル「Google 画像検索の SEO に関するベスト プラクティス」（画像は関連する文章の近くに置く、alt・キャプション・ファイル名）
  https://developers.google.com/search/docs/appearance/google-images
- PREP 法（結論を先に言う）: https://tcd-theme.com/2021/11/prep.html
- 起承転結で記事を組み立てる: https://note.com/aquaescape/n/nb96ff5723c83
