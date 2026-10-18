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

### 路線ページの title・description（2026-10-15）

Search Console（2026-09-15〜10-12）で、英語の路線ページ（JR奈良線 249表示・0クリック、京急空港線 144表示・2クリック）が
表示されるのに押されていなかった。title が「All 21 Stations, Transfers and Through Services」で、
検索する人が探す「Map」も、その路線で行ける観光地も見えなかった。

- 文の形は `src/seo/pageText.ts` の `lineTitle` / `lineDescription` / `lineLede`、値は `src/seo/lineFacts.ts`（路線データ・観光地データだけ）
- title は「路線名 + Map（路線図）+ 駅数 + 両端 + 主な観光地の最寄り駅（あれば1つ）」。例:
  `JR Nara Line Map: 21 Stations from Kyoto to Nara (Inari for Fushimi Inari Taisha)`
- 観光地は `touristSpots.ts` にあり、その路線の駅が最寄り駅のものだけ。並びは `touristSpots.ts` の順
  （主な観光地を先に書く）。終点の駅名に含まれる観光地（羽田空港）・駅名と同じ観光地（すすきの）は書かない
- 直通運転は `throughServices.ts` に登録がある路線だけ書く
- 中国語・韓国語は路線名の訳が無いので、観光地を title に入れない（英語名が混ざって長くなる）
- すべての路線・言語で title・description が重複しないことを `tests/unit/seo/lineFacts.test.ts` が確かめる
- **効果は Search Console で改稿前後の28日を比べて判断する**（表示回数・クリック・CTR・平均掲載順位）。改稿日は 2026-10-15

### 内部リンク（すべて自動）

- 駅 ⇔ 路線（駅ページの路線チップ、路線ページの駅一覧）
- 駅 → 隣の駅、近くの主要駅（index 対象の駅から10km以内の5駅）
- 駅 ⇔ 観光地（駅ページの「最寄りの観光地」、駅一覧の都市ごとの観光地表）
- データ → 駅・路線（ランキング表・路線ごとの中央値）、駅 → データ（統計の項目名）
- ガイド ⇔ 路線・駅（ガイドの `ctaRoutes` と節ごとの `cta.routes` にある路線を相互にリンク）
- 中国語・韓国語ページからは、その言語版がある駅ページにだけリンクする（無い駅は文字だけ）
- ガイドの関連リンク先が実在するか（その言語版があるか）は `tests/unit/seo/guideLinks.test.ts` が確かめる
- ビルドした全ページの `<a href="/...">` の行き先が dist にあるか（リンク切れ）と、sitemap に載るページの description が
  互いに重複していないかは `npm run test:seo`（`tests/seo/built.test.ts`）が確かめる。CI の `checks` ジョブでビルドの後に動く

## 多言語（言語ごとの別URL・言語の切り替え）

記事・ガイド・駅/路線/データのページは、**言語ごとに別URL** で書き出す（検索エンジンが
各言語版を別々に見られるように。1つのURLの中でJSで文字を差し替えると最初の言語しか見えない）。

| ページ | 日本語 | 英語・中国語・韓国語 | 実装 |
|---|---|---|---|
| 記事 | `/articles/{slug}` | `/{en,zh,ko}/articles/{slug}` | `src/components/articles/ArticleLayout.astro`（日本語は `src/pages/articles/`、他は `src/pages/[...lang]/articles/`） |
| ガイド | `/guides/{slug}` | `/{en,zh,ko}/guides/{slug}` | `GuideLayout.astro`（同じ slug が各言語版） |
| 駅・路線・データ | `/stations/...` など | `/{en,zh,ko}/stations/...` | `SeoPageLayout.astro` |

- canonical は各言語の自分自身、hreflang は実在する言語版すべて＋x-default（日本語）
- 右上の言語切り替えは `src/components/LanguageSwitcher.astro`。その言語版が無いときは押せない表示にする
- **閲覧者の言語で自動リダイレクトしない。** `LanguageSuggestion.astro` が、以前選んだ言語
  （地図アプリと共通の `frm-language`）かブラウザの言語にこのページの版があるときだけ、閉じられる案内を出す
- 記事の旧URL（`/articles/...?lang=en`）は `netlify.toml` で新URLへ301転送する（ページ側にも同じ移動の保険がある）
- 記事を足すときは `articleI18n.ts` の `ARTICLES` に1行足し、4言語のタイトル（`ARTICLE_PAGE_TRANSLATIONS`）と
  本文（`articleBodyI18n.ts`）を書く。そろっていないと `tests/unit/data/articleI18n.test.ts` が落ちる
  （日本語版のページファイル `src/pages/articles/{slug}.astro` も1つ作る）
- 本文の記事リンクは同じ言語の記事URL、地図へのリンクは `/?lang=xx` にする（テストで確かめる）

## ガイドの冒頭の地図デモ（2026-10-12）

ガイド（`/guides/*` とその各言語版。京都・大阪・札幌・小田急・東京すべて）は、記事と同じく
**検索意図への答え（結論）→ 実際に触れる地図 → 詳しい説明** の順にする。以前は「地図を開く」ボタンだけだった。

- 地図は `GuideLayout.astro` が `MapEmbed` で自動で置く（各ガイドのデータに書く必要は無い）。URL は `src/utils/guideDemo.ts`
- 表示する路線はガイドの `ctaRoutes`（無ければ最初の節の `cta.routes`、それも無ければ山手線）
- 範囲: 都市のガイド（`city` あり）は路線の駅の中央値から 8km 以内の駅に合わせる（京都で大阪・奈良まで広がらない）。
  路線のガイド（小田急など `city` なし）は路線全体
- 東京のガイドにも `city: 'tokyo'` を付けた（GA4 の `city` にも送られる）
- 埋め込んだ駅・路線のページの中で開く位置は `?section=id`（`#id` は記事のページごと動くので使わない。`EMBED_SECTION_SCRIPT`）

## プレビュー画像（検索結果・SNS のサムネイル, 2026-10-15）

以前はどのページも og:image がアプリのアイコンで、検索結果や SNS で見ても「どんな画面なのか」が分からなかった。
**ページ冒頭に埋め込んである地図の実際の画面**（同じ URL・同じ範囲・そのページの言語の UI）を撮った画像を使う。作り物の図は使わない。

| 使う所 | 中身 |
|---|---|
| `og:image`・`twitter:image`（`summary_large_image`） | `SeoHead.astro`（駅・路線・データ・ガイド）と `ArticleLayout.astro`（記事）が、画像があれば自動で使う |
| 記事の構造化データ `Article.image` | 記事だけ（本文に同じ画面を出しているので） |
| 冒頭の埋め込み地図の下に敷く画像（読み込むまで見える） | `ui/atoms/mapEmbed.ts`（`poster`）。最初の埋め込みにだけ付ける |

- 画像は `public/og/{ページのパス}.jpg`（1200×630）。パスの決まりは `src/seo/mapPreview.ts`
- 撮り方: `npm run build` → `npm run og:capture`（`scripts/capture-map-previews.mts`）→ もう一度 `npm run build`
  - sitemap に載っている路線・ガイド・記事・駅のページのうち、冒頭に地図を埋め込んでいるページを撮る
  - `-- --only /en/lines/` で絞る、`-- --missing` でまだ画像が無いページだけ撮る
  - 撮影条件は描画テストと同じ（サービスワーカーと外部への通信を止める・ダークテーマ）。800×420 を 1.5 倍で撮る
- **画像が無いページはアプリのアイコンのまま**（壊れた画像を出さない）。新しい路線・記事を足したら `--missing` で撮る
- **地図の見た目・UI の文言を変えたら撮り直す**（画像が古い画面のままになるため）
- og:image・埋め込みの画像が dist に実在するかは `npm run test:seo` が確かめる

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

### GA4 の読み込み範囲（2026-10-07）

- **すべてのページ**で読み込む（地図・記事・ガイド・駅/路線/データ・静的ページ・全画面・デモ）。
  `<head>` に `FaviconLinks` を置く所には必ず `GA4Loader`（または `SeoHead`）を置く。
  抜けは `tests/unit/config/ga4Coverage.test.ts` が検出する（以前は記事・静的ページが計測されていなかった）
- 測定ID は `VITE_GA_MEASUREMENT_ID`（リポジトリの `.env.production` にあり、Netlify の本番ビルドにも入る）。未設定ならどのページでも読み込まない
- **本番サイト（`SITE_URL` のオリジン）でだけ**読み込む。PR のプレビュー・ローカルのアクセスは数えない（`src/utils/siteHost.ts`）
- Cookie の確認（`CookieBanner`）も本番でだけ、1回だけ出す。回答はブラウザに保存し、次からは出さない
  （プレビューはURLごとに保存領域が別で、開くたびに確認が出ていた）。同じオリジンなので、地図で答えた内容は記事・ガイドでも使われる
- 既定は「同意なし」（Consent Mode）
- **地図のページ以外（記事・ガイド・駅/路線/データ・静的ページ・図・デモ）でも Cookie の確認を出す**（2026-10-16）。
  `GA4Loader consentBanner`（`src/components/consent/staticConsentBanner.ts`）。以前は確認が地図のページにしか無く、
  検索から記事に来た人は同意する手段が無いため、GA4 の通常のレポートにほとんど数えられていなかった
- 確認を出すページでは、**答えが出るまで GA4 の閲覧の送信（`config`）を始めない**。許可なら Cookie 付き、
  「必要なもののみ」なら Cookie 無しで、そのページの閲覧を1回だけ送る（同意の後に二重に数えない）。答えないまま
  離れた人は送らない。地図のページ（`index` / `fullscreen`）は地図のバナー（`CookieBanner`）が聞き、今までどおりすぐ始める
- Search Console の確認コードは `GOOGLE_SITE_VERIFICATION`（`.env.production`）だけから出す。ページに直接書かない
  （`tests/unit/config/ga4Coverage.test.ts`）

### 地図アプリの中の GA4 イベント（2026-10-07）

名前とパラメータは `src/utils/appAnalytics.ts` だけに書く。

- `map_departure_select`: 出発駅を選んだ。`station` / `source`（`manual` 手で選んだ・`auto` URL や現在地から）
- `map_arrival_select`: 到着駅を選んだ。`station` / `source`
- `map_route_search`: 出発・到着がそろって経路候補を出した（同じ組み合わせでは1回だけ）。
  `from_station` / `to_station` / `result_count` / `waypoints` / `best_minutes` / `best_transfers` / `has_through`（直通を使う候補があるか）
- `map_view_switch`: 表示方式（`realistic` 実際の地図・`schematic` 路線図風・`bubble`・`terrain3d` 立体）を設定パネルで切り替えた。
  `view`（切り替え先）/ `from_view`（切り替え前）。URL（`?view=terrain3d`）や保存した設定で開いたときは送らない（2026-10-15）
- 記事に埋め込んだ地図（`?embed=1`）では GA4 を読み込まない（記事の閲覧が地図の閲覧として二重に数えられるため）

### 記事の中の GA4 イベント（2026-10-15）

`src/utils/articleAnalytics.ts` だけに書く。`article_demo_view` / `article_demo_interact` / `article_demo_fullscreen` /
`article_map_open`（`source`: `demo` / `cta`）/ `article_related_click`。パラメータは `article`（slug）・`locale`・`demo_id`。
中身と使い方は `docs/article-writing.md` の「計測」。

2026-10-17: iframe が先に読み込み済みでも操作リスナーを付ける。再読み込み後もデモごとに1回だけ数え、矢印・Enter・Space・ズームキーによる操作も対象にする（Tab のフォーカス移動だけでは数えない）。
実ブラウザの `consent.render.ts` では、本番URLをローカルビルドへ振り向け、地図の移動・記事側の操作イベント・埋め込み側のGA4未読込・地図を開く遷移を確認する。Googleへの送信は遮断するため、GA4管理画面での受信確認とは区別する。

#### 増減の評価時の注意

- 2026-10-16に静的ページの同意UIを変更している。変更前後の閲覧増は集客と計測条件変更の両方の影響を受け得る。
- 本番を開く運営者本人は、現在のコードでは自動除外しない。GA4管理画面の内部トラフィックフィルターの設定状態は別途確認する。プレビュー除外と混同しない。
- `article_demo_interact` は「地図に触った」イベントであり、経路が見つかったことや満足度を証明しない。記事・言語・検索流入を揃え、イベント回数ではなく利用セッション/ユーザーの割合を見る。

### 計測したい操作と既存のイベント（2026-10-15 に確認）

集客の改善指示で候補に挙がった名前と、実際に送っているイベントの対応。同じ操作を別の名前で二重に送らない。

| 候補 | 送っているイベント | 備考 |
|---|---|---|
| open_railway_map（路線ページ → 地図） | `line_map_open`（＋全ページ共通の `seo_map_open`） | 駅・ガイド・観光地・データのページは `{種類}_map_open` |
| select_departure_station | `map_departure_select` | `source` で手動・自動を区別 |
| select_arrival_station | `map_arrival_select` | |
| display_route | `map_route_search` | 同じ組み合わせは1回だけ |
| switch_3d_view | `map_view_switch`（`view=terrain3d`） | 3D 以外の切り替えも同じイベントで数える |

- 駅名は送るが、現在地の緯度経度・個人を特定する情報は送らない
- 本番サイトでだけ GA4 を読み込む（プレビュー・ローカルは数えない）。GA4 が無いときは何も送らず、地図は普通に動く

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
