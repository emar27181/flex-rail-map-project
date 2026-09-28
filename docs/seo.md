# SEO の仕組みと確認方法

## sitemap.xml は自動生成（手で書かない）

`npm run build` の最後に `src/integrations/seoSitemap.ts` が `dist/sitemap.xml` を作る。
新しいページを `src/pages/` に足せば、次のビルドで自動的に載る。

| 載せる | 載せない |
|---|---|
| canonical が自分自身を指すページ | `noindex` のページ（`/fullscreen`, `/demo`, `/diagram`） |
| | canonical が無いページ |
| | canonical が別URLを指すページ（重複） |
| | クエリ付きURL（`?lang=en` など） |

- **lastmod** は git の履歴から取る（`src/seo/gitLastModified.ts`）。
  ページのファイルと、そのページが import している `src/data` のファイルのうち
  最も新しいコミット日。レイアウト・設定の変更では日付を進めない（見た目の修正で
  全ページの日付が進むと lastmod が「内容の更新日」でなくなるため）。
  浅いクローンで確かめられない日付は書かない
- **hreflang** は別URLで実在する対応ページどうしだけに張る（`buildHreflangLinks`,
  `src/config/seo.ts`）。対応ページが無いときは張らない。
  `?lang=en` は同じHTMLを返し canonical がクエリ無しURLなので、hreflang の相手にしない
- `public/sitemap.xml`（手書き）は古い。ビルド時に dist 側で上書きされる

## ビルドで止まる検証

次のどれかに当てはまるとビルドが失敗する（`verifySeo`, `src/seo/sitemapCore.ts`）。

- sitemap のURLに対応するページが無い（404）
- noindex のページが sitemap にある
- canonical が sitemap のURLと違う
- sitemap に重複URL・クエリ付きURL
- index 対象なのに sitemap に無い
- hreflang に自分自身が無い・相手がクエリ付き・相手が sitemap に無い・相互になっていない
- title が無い・重複している
- H1 が0個・2個以上

## 確認コマンド

```bash
npm run build          # sitemap 生成と検証（失敗したらビルドが止まる）
npm run test:seo       # dist を読み直して同じ検証 + robots.txt の確認

# 実際のURLがすべて200か（Deploy Preview やローカルの preview に対して）
SEO_LIVE_BASE_URL=https://deploy-preview-<PR番号>--flex-railway-map.netlify.app npm run test:seo
```

## ページを足すときの決まり

- title・description は他のページと重ならないように書く
- H1 は1つだけ（`StaticPage` は `heading` を渡すと H1 を出す）
- 固定ページ・ガイド・記事には `SiteFooterNav` を置き、どこからもリンクされない
  孤立ページを作らない（リンク先は `src/config/siteNav.ts` で一元管理）
- 構造化データは実在する内容だけ。記事は `src/config/articleSeo.ts` の
  `articleJsonLd` / `articleBreadcrumbJsonLd` を使う。更新日を管理していない記事に
  `dateModified` を書かない
- 情報の薄いページは `<meta name="robots" content="noindex, follow">` にする
  （sitemap からは自動で外れる）
