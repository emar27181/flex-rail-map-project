# Google AdSense 広告設定・調整マニュアル

## 基本方針
- **広告はこちらで決めた位置にだけ出す（2026-11 ユーザー決定）。** 自動広告・全画面広告（Vignette）・アンカー広告は使わない（下の「自動広告をオフにする」）。
- 広告は記事や地図の操作を妨げず、広告とコンテンツを明確に区別する。Googleの現行AdSenseポリシーを優先。
- 広告関連のID・外観は共通部品・設定に集約する。記事や画面ごとにIDを直書きしない。
- 広告クリックや表示を自分で発生させてテストしない。

## 管理箇所
| 対象 | 設定・実装 |
|---|---|
| サイト運営者ID・広告ユニットID | `src/config/ads.ts` |
| 広告のHTML・スタイル・本番/プレビューの切替 | `src/components/ui/atoms/adSlot.ts` |
| 記事本文への挿入判定 | `src/utils/articleRender.ts` |
| 記事トップのジャンル間の広告 | `src/components/articles/ArticleIndexCategories.astro` |
| 地図の画面の下の広告（閉じるボタン付き） | `src/components/StickyBottomAd.tsx`（`ADSENSE_SLOTS.mapBottom`） |
| 広告スクリプトを読むか | `hasManualAdSlot`（`src/config/ads.ts`）。地図は `src/pages/index.astro`、記事は `ArticleLayout.astro` |
| クローラー向けの公開情報 | `public/ads.txt` |
| 本番URLの判定 | `src/utils/siteHost.ts` |

## 広告ユニットを設定する
1. Google AdSense管理画面でサイトの広告配信状態を確認する。
2. 「広告」から実際に利用できる広告ユニットを作成し、広告コードの `data-ad-slot`（数字のユニットID）と形式を確認する。
3. リポジトリの `src/config/ads.ts` の `ADSENSE_SLOTS.articleInline` に、管理画面で**実在を確認した**ユニットIDを設定する。
4. `src/components/ui/atoms/adSlot.ts` の `data-ad-format`・`data-ad-layout` が作成した広告ユニットの形式と整合することを確認する。記事本文と記事トップで別の広告形式を使う場合は、スロット名と共通部品の設定を追加して使い分ける。
5. PRを作成し、CIとNetlify Deploy Previewで位置・崩れ・モバイル表示を確認する。**プレビューでは実広告を配信しない**。本番に反映後、実際の広告枠の表示状況を確認する。
6. テスト: `npm run test:unit`、`npm run build`、必要に応じて `npm run test:seo`。

### 現状の注意点（2026-11）
- `ADSENSE_CLIENT` は設定済み。
- `ADSENSE_SLOTS.articleInline` と `ADSENSE_SLOTS.mapBottom` は空文字のため、どの広告枠も**本番では表示されず、広告スクリプトも読まない**。
- 地図下部の固定広告に直接書かれていた仮ID `0987654321` は実在を確認できていないため、2026-11 に空へ戻した。推測の広告IDを有効化しない。
- 広告の空きスペースや `data-ad-status="unfilled"` は配信・在庫の問題もあり、必ずしも表示コードのバグではない。

## 表示位置・数・余白を調整する
- 記事トップのカテゴリ間は `ArticleIndexCategories.astro`。現状は**4カテゴリ間のうち2か所**を使用し、カテゴリの見出しと最初の記事の間に広告を挟まない。
- 記事本文は `articleRender.ts` の広告節配置ロジックを調整する。見出し直前・操作ボタン近傍・地図デモ操作のすぐそばは避ける。
- 枠の表記・スタイルは `adSlot.ts` と既存トークン `L` / `FS` を使用し、色・IDを個別に直書きしない。
- 広告密度を上げる前に、可読性・誤クリック・ページ速度・スマホの余白・コンテンツとの区別を確認する。

## 自動広告をオフにする（2026-11）

自動広告は、Google がページを見て位置を選び、広告を差し込む仕組み。全画面広告（Vignette。ページを移るときに画面いっぱいに出る）や、
画面の上下に貼り付くアンカー広告もこれに含まれる。読む人の操作を止めるため使わない。

**コード側（済）**
- 広告スクリプト（`ADSENSE_SCRIPT_SRC`）は、そのページに有効な広告ユニット ID の枠があるときだけ読む（`hasManualAdSlot`）。
  スクリプトを読まないページには、管理画面の設定にかかわらず自動広告は出ない。静的ページ（プライバシーポリシー等）では読まない
- サイトの所有確認は `<meta name="google-adsense-account">` で行う（全ページに残す）
- 自動広告を有効にするコード（`enable_page_level_ads` 等）・広告ユニット ID の直書きは `tests/unit/config/ads.test.ts` が落とす

**AdSense の管理画面（人が操作する。コードからは変えられない）**

広告ユニット ID を入れて広告スクリプトを読むようになると、そのページでは管理画面の自動広告の設定が効く。ID を入れる前に次をオフにする。

1. AdSense → **広告** → **サイトごと** → 対象サイト（flex-railway-map.netlify.app）の編集（鉛筆）を開く。
2. 右側の **「自動広告」をオフ** にする。
3. 同じ画面の「オーバーレイ フォーマット」で **アンカー広告** と **全画面広告（Vignette）** がオフになっていることを確かめる
   （自動広告をオフにすれば出ないが、後で自動広告を戻したときのために両方オフにしておく）。
4. **「サイトに適用」** を押す。反映には最大1時間ほどかかる。
5. 以前に設定した「ページ除外」（記事の4セクション）は、自動広告をオフにした後は不要。残しておいても害はない。

[公式: 自動広告設定](https://support.google.com/adsense/answer/9305577?hl=ja) / [公式: ページ除外](https://support.google.com/adsense/answer/9262311?hl=ja)

## 広告を出す位置（こちらで決める）

| 位置 | 広告ユニット ID | 出し方 |
|---|---|---|
| 記事の本文の間 | `articleInline` | 4つ目の見出しの前に1つ（`articleRender.ts` の `articleAdSections`）。地図のデモ・地図を開くボタンのすぐ下には置かない |
| 記事一覧のジャンルの間 | `articleInline` | 4つのジャンルの間のうち2か所（`ArticleIndexCategories.astro`） |
| 地図の画面の下 | `mapBottom` | 閉じるボタン付き。配信があるときだけ出る。全画面表示・記事への埋め込みでは出さない（`ThemeWrapper.tsx`） |

位置を足すときは、`ADSENSE_SLOTS` にキーを足し、描画側は `hasManualAdSlot` で ID があるときだけ枠とスクリプトを出す。
横長の広告は、AdSense 管理画面で作ったレスポンシブのディスプレイ広告ユニットを使う（記事の本文の間は `AD_PLACEMENT` で最大1枠・幅600px上限）。
ソースコードで Google の広告 iframe を強制的に動かしたり隠したりしない。

## 継続運用・分析
- AdSenseで広告配信・ポリシーセンター・収益指標を確認する。
- Search Consoleで検索表示・クリックとページのインデックス状態、GA4で記事閲覧や地図遷移を確認し、配置の変更前後を同条件で比較する。
- 変更記録に、広告枠の位置、広告ユニット種類、確認した画面幅と日付を残す。
- Googleが広告内容と配信可否を決定するため、サイト側で特定の広告の表示は保証できない。

参考: [Google AdSense ヘルプ](https://support.google.com/adsense/)、[AdSense プログラム ポリシー](https://support.google.com/adsense/answer/48182)
