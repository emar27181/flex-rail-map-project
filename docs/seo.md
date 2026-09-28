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

## 駅・路線・データのページ（/stations, /lines, /data）

路線データ・駅統計・観光地データから **自動生成** する。ページのファイルは
`src/pages/[...lang]/{stations,lines,data}/` にあり、日本語（`/stations/shinjuku`）と
英語（`/en/stations/shinjuku`）を1つのファイルから作る。中身は `src/seo/pageModel.ts`、
文言は `src/seo/pageText.ts`、どこまで作るかは `src/data/seoPages.ts`。

| 作るもの | 範囲 | index させる基準 |
|---|---|---|
| 路線ページ | `SEO_LINE_KEYS` の路線（PoC: 首都圏の20路線） | 駅が2つ以上 |
| 駅ページ | 上の路線の全駅＋観光地の最寄り駅 | **Tier A だけ** |
| データのページ | `SEO_DATA_METRICS` のうち実データ（`dataQuality: 'real'`）の指標 | 値のある駅が20以上 |
| 一覧（ハブ） | 駅・路線・データの3つ | 常に index |

### 駅ページの Tier（`STATION_TIER_RULES`）

- **A**（index）: 実データの周辺統計が5項目以上あり、かつ
  「実質の路線数が5以上の乗換駅」または「観光地の最寄り駅」
- **B**（noindex, follow）: 乗換駅、または周辺統計がある駅
- **C**（noindex, follow）: それ以外

B・C のページも作る（路線ページ・隣の駅からのリンク先として必要）が、
同じ型のページを何百も検索エンジンに出さないため noindex にし、sitemap にも載せない。
**基準を緩めるときは、1ページごとに固有の情報が増えたかを先に確かめること。**
`tests/unit/seo/pageModel.test.ts` は index する駅ページが40を超えると落ちる（歯止め）。

### 作らないもの（2026-09 時点）

- `/data/passengers`（乗降客数）・`/data/rent`（家賃）: 今のデータが推定値のため作らない。
  `stationStats.ts` で実データ（`'real'`）に置き換えれば、`SEO_DATA_METRICS` に
  書いてあるので自動で作られる

### 値の扱い

- 駅は「駅名＋座標」で識別する（`src/utils/sameStation.ts`）。同名の別駅を混ぜない
- 駅統計の座標は小数1桁に丸められているので、15km 以内なら同じ駅の統計とみなす
- 実データ（`'real'`）以外の統計は出さない。値の無い駅は0にせず「データなし」の件数だけ示す
- 英語ページに出す統計の範囲・時期・出典名は `pageText.ts` の `STAT_SCOPE_EN` /
  `SOURCE_TITLE_EN` に訳が無いとテストが落ちる

### 内部リンク（すべて自動）

- 駅 ⇔ 路線（駅ページの路線チップ、路線ページの駅一覧）
- 駅 → 隣の駅、近くの主要駅（index 対象の駅から10km以内の5駅）
- 駅 ⇔ 観光地（駅ページの「最寄りの観光地」、駅一覧の観光地表）
- データ → 駅・路線（ランキング表・路線ごとの中央値）、駅 → データ（統計の項目名）
- ガイド ⇔ 路線（ガイドの `ctaRoutes` にある路線を相互にリンク）
- 地図へ: `src/utils/mapDeepLink.ts`（駅は `?from=駅名`、路線は `?routes=略称`）

## 観光地と最寄り駅

`src/data/touristSpots.ts` に書く。

- 駅は **駅名と路線キーの組** で書く（`{ name: '長谷', route: 'enoshimaElectricRailway' }`）。
  駅名だけだと JR播但線の長谷のような同名の別駅と区別できない
- 載せるのは「その観光地の最寄り駅として一般に案内されている駅」だけ。
  徒歩分数・距離は確かめた出典が無いので書かない
- 駅名・路線キーが路線データに無いと `npm run test:unit` が落ちる
