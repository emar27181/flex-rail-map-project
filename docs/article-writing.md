# 記事の書き方（/articles）

記事（`/articles/*` と `/{en,zh,ko}/articles/*`）を書く・直すときの決まり。
2026-09-29 に6記事×4言語をこの形に書き直した。

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

## 画像（1セクション1枚が目安）

- 画像は作り物の図ではなく、**このサイトの実際の画面**にする。
  `scripts/capture-article-screenshots.mts` の `SHOTS` に地図の状態（`routes` `from` `to` `metric` `center` `zoom`）を書き、
  開発サーバーを起動して `npx tsx scripts/capture-article-screenshots.mts [--only <slug>] [--id <shot>]` で4言語分撮る
- 出力は `public/images/articles/{slug}/{shot}-{lang}.webp`（幅1200px）。その言語の画面をその言語の記事に使う
- 画像は説明している段落のすぐ下に置き、`figcaption` に「何を見る図か」を1文で書く。`alt` には画面に写っているものを書く
- 本文では `<figure class="shot"><a href="画像"><img ... width="1200" height="768" loading="lazy" decoding="async" alt="..."></a><figcaption>...</figcaption></figure>`
  （狭い画面では押すと原寸で開く）
- 地図や UI を変えたら撮り直す

## 地図を開くボタン

- 記事の内容をそのまま再現した状態で開くリンクにする（例: 観光の記事は4路線だけ表示、治安の記事は犯罪件数の色分け）
- URL は `mapDeepLink.ts` と同じパラメータ（`routes` `from` `to` `metric`）。日本語以外は `lang=xx` を付ける（テストで確認）

## テスト（`tests/unit/data/articleI18n.test.ts`）

- 4言語すべてにタイトル・説明・本文がある
- 図（`<figure`）と見出し（`<h2`）の数が言語ごとにそろっている
- 画像が実在し、`alt` があり、その言語の画面を使っている
- 関連記事が3本で、実在する別の記事を指す
- 地図へのリンクの `lang` がその記事の言語と一致する

## 参考にした資料

- Google 検索セントラル「有用で信頼性の高い、ユーザー第一のコンテンツの作成」
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google 検索セントラル「Google 画像検索の SEO に関するベスト プラクティス」（画像は関連する文章の近くに置く、alt・キャプション・ファイル名）
  https://developers.google.com/search/docs/appearance/google-images
- PREP 法（結論を先に言う）: https://tcd-theme.com/2021/11/prep.html
- 起承転結で記事を組み立てる: https://note.com/aquaescape/n/nb96ff5723c83
