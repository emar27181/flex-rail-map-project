# 記事 × 地図デモの基盤（設計判断, 2026-10-15）

訪日旅行者向けの実用記事と、それに対応する操作できる路線図デモをセットで、少ない手間で足していくための仕組み。
書き方の決まりは `docs/article-writing.md`、AI に書いてもらう指示文は `docs/templates/article-prompt.md`。

## 調べた既存の仕組みと、どうしたか

| 項目 | 既存 | 判断 |
|---|---|---|
| 記事の管理 | `src/data/articles/{slug}.ts`（1記事1ファイル・4言語・型付き・値だけ）。ページは自動で生成（`src/pages/articles/[slug].astro` と各言語版） | **これを広げる。** Markdown / MDX・CMS は入れない（型とテストで決まりを守らせられているため） |
| 記事のスキーマ | `src/data/articles/types.ts`（`ArticleSource`）と `tests/unit/data/articleSources.test.ts` | Zod は入れず、型＋テストに項目と検査を足した |
| 地図デモ | `embed` / `shot` ブロック → `ui/atoms/mapEmbed.ts` の iframe（地図ページの `?embed=1`）。URL は `mapDeepLink.ts` | 同じ部品に「地図を大きく開く」「全画面」・読み込み中の文を足した。記事ごとの React 部品は作らない |
| 地図の URL | `routes` `from` `to` `metric` `center` `zoom` `travelTimes` `lang` `embed`。`view`（2D/3D）は地図側だけ読んでいた | `numbers`（駅番号）を足し、`view` を `buildMapHref` から出せるようにした |
| 駅番号 | `src/data/stationNumbers.ts`（路線キー → 駅名 → 番号） | 記事の文章へは差し込みで出す（`src/utils/articleFacts.ts`）。照合で山手線の誤りが見つかり、別の PR で直した |
| SEO | 言語ごとの URL・canonical・hreflang・sitemap・パンくず・Article の構造化データはすでに自動 | 変えていない。目次・出典・関連する路線と駅を本文の HTML に足した |
| GA4 | 記事の中の操作は送っていなかった（地図のページ・検索向けページだけ） | `src/utils/articleAnalytics.ts` に記事のイベントを足した |
| CI | `test:design` → `test:unit` → `build`（＋ `test:seo`）、`render` ジョブ | 記事の検査はユニットテストと `tests/render/article.render.ts` に足した。重いジョブは増やしていない |

## 依頼で挙がった名前との対応

| 依頼の名前 | この基盤での名前 | 理由 |
|---|---|---|
| `src/content/guides/{slug}/{en,ja}.md` ＋ `metadata.json` | `src/data/articles/{slug}.ts`（4言語を1ファイル） | 既存の記事と同じ形。言語ごとにブロックの並びをそろえる検査が1ファイルなら書ける |
| `id` / `slug` | `slug`（言語に依らない記事の ID を兼ねる） | URL も言語に依らず同じ slug |
| `locale` | `content.{ja,en,zh,ko}` のキー | |
| `title` `description` `summary` `category` `tags` | `meta.title` `meta.description` `points`（結論3行）`meta.category` `meta.tag` | |
| `publishedAt` / `updatedAt` | `publishedDate` / `modifiedDate` | |
| `sources` | `sources`（新しく足した） | |
| `relatedGuides` | `related`（3本） | |
| `relatedRoutes` / `relatedStations` | 同じ名前（新しく足した。駅は路線と組） | |
| `demoIds` | `maps` / `shots` のキー（記事の中のデモの名前。GA4 の `demo_id` は `{slug}/{キー}`） | |
| デモの `focus` `visibleRoutes` `showStationNumbers` `view` | `focus` `routes` `stationNumbers` `view` | |
| `guide_view` | GA4 の `page_view` | 別のイベントにすると数え方が2つになる |
| `guide_demo_open` / `guide_demo_interact` / `guide_map_fullscreen` / `guide_to_map_click` / `guide_related_article_click` | `article_demo_view` / `article_demo_interact` / `article_demo_fullscreen` / `article_map_open` / `article_related_click` | このサイトでは「ガイド」（`/guides`）は別のページの種類のため `article_` にした |
| `npm run guide:new` / `guide:validate` | `npm run article:new` / `article:validate` | 同上 |

## 同じ名前の別の駅

駅は「駅名＋路線キー」の組で書く（`{ name: '渋谷', route: 'yamanote' }`、差し込みは `{stationNumber:yamanote:渋谷}`）。
駅名だけだと、長谷（江ノ電）と長谷（播但線）のような別の駅を取り違える。全路線で一意の駅 ID ができたら、
`ArticleStationRef` に `id` を足して置き換える（差し込みの書き方も `{stationNumber:id}` を足す）。

## 最初の記事（PoC）で確かめたこと

`how-to-read-station-numbers`（駅番号の読み方。英語を主に4言語）。

- 記事データを1ファイル足すだけで、4言語のページ・一覧・sitemap・関連記事・目次・出典・デモができた
- 駅番号は差し込みで、地図に出る番号と記事の番号が必ず同じになる
- 照合の途中で、山手線の駅番号が大崎起点の逆向きになっていたのが見つかった（データの PR で修正）。
  東武日光線・湘南新宿ラインにも疑いがあり、照合が済むまで記事の例に使わない（`docs/data-maintenance-ledger.md`）
- 2本目以降は `npm run article:new` → 原稿 → `npm run article:validate` で足せる（CLI で作ったひな形が、
  書きかけの「〇〇」を消すまでテストで止まることを確かめた）

## まだやっていないこと

- デモを押すまで読み込まない形（今は画面に近づくと読み込む `loading="lazy"`。記事の表示は速いので見送った）
- 全路線の駅番号の公式資料との照合（このサンドボックスからは鉄道会社の公式サイトを開けない）
- 記事の効果の測定（公開後 2〜4週間。Search Console と上の GA4 イベント）

## 観光客向け30記事の公開前確認（2026-10-16）

追加した記事は `src/data/articles/index.ts` で登録し、各言語のページと実地図デモを同じ構造で生成する。公開前に Netlify Deploy Preview で各記事のURLとデモを確認し、英語・日本語など4言語の表示、事実関係、公式出典との対応、各記事の独自性を個別にレビューする。30記事を一括公開する前に検索意図と内容の重複も精査する。
