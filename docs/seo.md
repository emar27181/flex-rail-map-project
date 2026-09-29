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
`src/pages/[...lang]/{stations,lines,data}/` にあり、日本語（`/stations/shinjuku`）・
英語（`/en/...`）・中国語簡体字（`/zh/...`）・韓国語（`/ko/...`）を1つのファイルから作る。
中身は `src/seo/pageModel.ts`、文言は `src/seo/pageText.ts`、どこまで作るかは `src/data/seoPages.ts`。

| 作るもの | 範囲 | 言語 | index させる基準 |
|---|---|---|---|
| 路線ページ | `SEO_CITIES` の各都市の路線（9都市・66路線） | 4言語 | 駅が2つ以上 |
| 駅ページ | 上の路線の全駅＋観光地の最寄り駅 | ja/en は全駅、zh/ko は Tier A のうち駅名の訳がある駅 | **Tier A だけ** |
| データのページ | `SEO_DATA_METRICS` のうち実データ（`dataQuality: 'real'`）の指標。対象は `SEO_DATA_CITIES`（東京・神奈川）の駅 | ja/en | 値のある駅が20以上 |
| 一覧（ハブ） | 駅・路線（都市ごとに並べる）・データ | 駅・路線は4言語、データは ja/en | 常に index |

### 都市（`SEO_CITIES`）

路線ページを作る路線は、都市ごとのまとまりで `src/data/seoPages.ts` に書く
（東京・首都圏 / 横浜・鎌倉・箱根 / 大阪 / 京都 / 奈良 / 札幌・北海道 / 名古屋 / 福岡 / 広島）。
路線を足すと、その路線の全駅の駅ページも自動でできる（index されるのは Tier A だけ）。

- 路線データに同じ路線が2つのキーで重複登録されているもの（大阪環状線 `osakaLoopLine` /
  `jrOsakaLoop` など）は、駅の多い方だけを書く。駅ページでは `SEO_ROUTE_ALIASES` で1本にまとめる
  （路線データ側の重複を解消したら、`SEO_ROUTE_ALIASES` から消す）

### 駅ページの Tier（`STATION_TIER_RULES`）

- **A**（index）: 「観光地の最寄り駅」、または「実質の路線数が5以上の乗換駅」で
  実データの周辺統計が5項目以上ある駅。周辺統計を集めていない地域（統計が0項目の駅。
  関西・札幌など）は統計の条件を問わない。統計が一部だけの駅（取得失敗の疑い）は乗換駅でも A にしない
- **B**（noindex, follow）: 乗換駅、または周辺統計がある駅
- **C**（noindex, follow）: それ以外

B・C のページも作る（路線ページ・隣の駅からのリンク先として必要）が、
同じ型のページを何百も検索エンジンに出さないため noindex にし、sitemap にも載せない。
**基準を緩めるときは、1ページごとに固有の情報が増えたかを先に確かめること。**
`tests/unit/seo/pageModel.test.ts` は index する駅ページが100を超えると落ちる（歯止め。2026-09 時点で73駅）。

### 言語（中国語・韓国語）

- URL は既存のガイドと同じ `/zh/`・`/ko/`。hreflang と `<html lang>` は中国語だけ `zh-CN`
  （`src/config/seo.ts` の `HREFLANG_CODE`。URL は変えない）
- **駅名・路線名・観光地名を推測で訳さない。** 駅名は `stationTranslationsCJK.ts` にある駅だけ
  その言語の駅ページを作る（韓国語は Tier A 73駅中45駅）。表の中の駅名で訳が無いものは、
  中国語は日本語表記、韓国語は英語表記を出す（地図アプリの `translateStation` と同じ）
- 路線名は中国語・韓国語の訳データが無いため英語名を出す
- 観光地名の zh/ko は `touristSpots.ts` に書いたものだけ（空なら英語名）
- hreflang・言語の切り替えは、実際に作っている言語版だけに張る（`SeoPageLayout` の `langPaths`）

### 作らないもの（2026-09 時点）

- `/data/passengers`（乗降客数）・`/data/rent`（家賃）: 今のデータが推定値のため作らない。
  `stationStats.ts` で実データ（`'real'`）に置き換えれば、`SEO_DATA_METRICS` に
  書いてあるので自動で作られる
- データのページの中国語・韓国語版（統計が首都圏だけのため）
- 観光地ごとの独立したページ（観光地は駅ページ・駅一覧の中に載せる）

### 値の扱い

- 駅は「駅名＋座標」で識別する（`src/utils/sameStation.ts`）。同名の別駅を混ぜない
- 駅統計の座標は小数1桁に丸められているので、15km 以内なら同じ駅の統計とみなす
- 実データ（`'real'`）以外の統計は出さない。値の無い駅は0にせず「データなし」の件数だけ示す
- 英語・中国語・韓国語ページに出す統計の範囲・時期は `pageText.ts` の `STAT_SCOPE_EN` /
  `STAT_SCOPE_ZH` / `STAT_SCOPE_KO`、出典名は `SOURCE_TITLE_EN` に訳が無いとテストが落ちる

### 内部リンク（すべて自動）

- 駅 ⇔ 路線（駅ページの路線チップ、路線ページの駅一覧）
- 駅 → 隣の駅、近くの主要駅（index 対象の駅から10km以内の5駅）
- 駅 ⇔ 観光地（駅ページの「最寄りの観光地」、駅一覧の都市ごとの観光地表）
- データ → 駅・路線（ランキング表・路線ごとの中央値）、駅 → データ（統計の項目名）
- ガイド ⇔ 路線・駅（ガイドの `ctaRoutes` と節ごとの `cta.routes` にある路線を相互にリンク）
- 中国語・韓国語ページからは、その言語版がある駅ページにだけリンクする（無い駅は文字だけ）
- ガイドの関連リンク先が実在するか（その言語版があるか）は `tests/unit/seo/guideLinks.test.ts` が確かめる

## 地図を開くCTA（設定済みの地図へのリンク）

`src/components/MapOpenCta.astro` だけで作る。URL は `src/utils/mapDeepLink.ts`
（地図側が読むパラメータと同じ定数）。

| パラメータ | 中身 | 地図側 |
|---|---|---|
| `routes` | 表示する路線（略称コード、`routeUrlCodes.ts`） | 既存 |
| `from` / `to` / `via` | 出発・到着・経由駅（駅名） | 既存 |
| `metric` | ヒートマップの指標（駅統計のキー。実データの指標だけ） | 2026-09 追加（`heatmapUrlParam.ts`） |
| `lang` | 地図の表示言語（ja は付けない） | 既存 |

- 地図（`/`）の canonical は常に `/`。パラメータ付きURLは index させない
  （sitemap にも載せない。hreflang の相手にもしない）
- ページの冒頭に1つ、関連する説明（通る路線・駅一覧・路線ごとの比較・ガイドの各節）の直後にも置く

### GA4 イベント

クリック時に2つ送る。

- `seo_map_open`: 検索向けページ全体からの地図遷移（以前からの集計。種類を問わず送る）
- `{種類}_map_open`: `guide_map_open` / `station_map_open` / `line_map_open` /
  `tourist_map_open` / `data_map_open`

パラメータ: `source_page`（パス）/ `locale` / `station` / `routes`（略称コード）/ `city` /
`tourist_spot` / `metric`、以前からの `guide_slug` / `language`。値は100文字まで。
GA4 の管理画面でレポートに使うには、これらをカスタムディメンションに登録する必要がある。

## 観光地と最寄り駅

`src/data/touristSpots.ts` に書く。

- 駅は **駅名と路線キーの組** で書く（`{ name: '長谷', route: 'enoshimaElectricRailway' }`）。
  駅名だけだと JR播但線の長谷のような同名の別駅と区別できない
- 載せるのは「その観光地の最寄り駅として一般に案内されている駅」だけ。
  徒歩分数・距離は確かめた出典が無いので書かない
- 駅名・路線キーが路線データに無いと `npm run test:unit` が落ちる
- 観光地には都市（`city`）を付ける（駅一覧で都市ごとに並ぶ）。zh/ko の名前は定着した表記が
  分かるものだけ書き、自信が無ければ空ける（英語名が出る）
- 駅名が改称されたのに路線データが古いままの駅（例: 名古屋市営地下鉄名城線「市役所」→「名古屋城」）は、
  路線データを直すまで観光地の最寄り駅に使わない
