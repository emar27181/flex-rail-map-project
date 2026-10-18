# 記事制作・サイトマップ・Search Console 運用ガイド

## 記事の作成マニュアルは既存
- **書き方の正本**: [docs/article-writing.md](./article-writing.md)
- 記事データ: `src/data/articles/{slug}.ts`（1記事1ファイル、ja/en/zh/ko）
- AI向け執筆指示: [docs/templates/article-prompt.md](./templates/article-prompt.md)
- 記事テンプレート: [docs/templates/article-template.ts](./templates/article-template.ts)
- 記事・地図基盤: [docs/article-platform.md](./article-platform.md)
- 広告の設定: [docs/ads-operation.md](./ads-operation.md)
- SEO全般: [docs/seo.md](./seo.md)

### 新規記事の手順（簡易版）
1. Search Consoleの検索クエリから1記事1検索意図を決定し、既存記事と重複しないか確認する。
2. 鉄道会社・自治体・施設の**公式一次情報**で事実を検証し、参照URLと確認日を残す。確認できない数字は使わない。
3. `npm run article:new -- --slug <slug>` でひな形と一覧登録を生成する。
4. 4言語のメタ・本文と、既存の地図データを使った `maps` / `shots` を埋める。駅番号・駅名・路線名の差し込み方式を利用する。
5. `npm run article:validate`、`npm run test:types`、`npm run test:unit`、`npm run build`。PRを出して全言語とスマホのプレビューを確認する。
6. マージ・本番デプロイ後、Search Consoleで表示回数・CTR・インデックス状況を定期確認する。
7. 記事トップのジャンル別表示は `src/data/articleIndexGroups.ts` で分類・優先順を一元管理。実測の「人気順」ではなく編集上のおすすめ順。

## サイトマップの正本と作り方
- サイトマップURL: **https://flex-railway-map.netlify.app/sitemap.xml**
- Search Consoleには上記のURL、または登録プロパティ内の `sitemap.xml` を送信する。
- `public/robots.txt` に `Sitemap:` が記載済み。
- `npm run build` の末尾で `src/integrations/seoSitemap.ts` が **`dist/sitemap.xml` を自動生成**する。記事の追加時も通常は手動登録不要。
- **`public/sitemap.xml` は旧式のファイル。編集しない。** 本番配信の対象はビルド生成物であり、必ず本番URLとビルド結果を優先する。
- 生成・チェック: `npm run build` → `npm run test:seo`。
- canonicalが自己参照でindex可の実在ページを収録し、noindexや重複URLは除外する。hreflang・title重複などに不整合がある場合はビルドで検出する。

## Search Consoleで見るポイント
1. 「サイトマップ」→送信結果が「成功しました」か確認する。
2. **検出されたページ数はインデックス登録数ではない**。検索結果に出るかは「ページのインデックス登録」で確認する。
3. 新記事公開後は該当URLを「URL検査」し、canonical・クロール・インデックス状況を確認する。必要な場合のみ「インデックス登録をリクエスト」。
4. 「検索パフォーマンス」でページ・検索クエリ・国・言語を分けて確認する。公開直後に成果を断定せず、数週間単位で比較する。
5. sitemapにURLが無い場合は、対象ページの `robots`・canonical・ビルドの生成ログ・デプロイ先を先に確認する。

### 現状メモ（2026-10-18、ユーザー提供のSearch Console画面）
- 送信済みサイトマップの状態: **成功**
- 検出されたページ数: **599**
- 最終読み込み表示: **2026-10-15**
- これはユーザーの画面で確認できる送信時点の数値で、現在のインデックス登録数とは異なる。

## Google検索結果の画像とサイトアイコン
- **favicon** は検索結果でサイト名の横に出る小アイコン。`src/components/seo/FaviconLinks.astro` と `src/config/seo.ts` の `APP_ICON_PATH` を確認する。
- **検索結果のサムネイル画像**はGoogleが検索意図・端末・ページの画像から判断して表示するもので、`og:image` の設定だけで必ず表示されるわけではない。
- 記事の画像は `src/seo/mapPreview.ts` のプレビューと `npm run og:capture` を確認。取得可能な画像URL・適切なalt・十分な大きさ・ページ内容との関連・画像のクロール許可を確認する。
- Search ConsoleのURL検査でGoogleのクロール・レンダリング状況を確認し、更新後は再クロールを待つ。表示時期・結果への掲載は保証できない。
