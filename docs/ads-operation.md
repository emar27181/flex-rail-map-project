# Google AdSense 広告設定・調整マニュアル

## 基本方針
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
| クローラー向けの公開情報 | `public/ads.txt` |
| 本番URLの判定 | `src/utils/siteHost.ts` |

## 広告ユニットを設定する
1. Google AdSense管理画面でサイトの広告配信状態を確認する。
2. 「広告」から実際に利用できる広告ユニットを作成し、広告コードの `data-ad-slot`（数字のユニットID）と形式を確認する。
3. リポジトリの `src/config/ads.ts` の `ADSENSE_SLOTS.articleInline` に、管理画面で**実在を確認した**ユニットIDを設定する。
4. `src/components/ui/atoms/adSlot.ts` の `data-ad-format`・`data-ad-layout` が作成した広告ユニットの形式と整合することを確認する。記事本文と記事トップで別の広告形式を使う場合は、スロット名と共通部品の設定を追加して使い分ける。
5. PRを作成し、CIとNetlify Deploy Previewで位置・崩れ・モバイル表示を確認する。**プレビューでは実広告を配信しない**。本番に反映後、実際の広告枠の表示状況を確認する。
6. テスト: `npm run test:unit`、`npm run build`、必要に応じて `npm run test:seo`。

### 現状の注意点（2026-10）
- `ADSENSE_CLIENT` は設定済み。
- `ADSENSE_SLOTS.articleInline` は空文字のため、該当する広告枠は**本番では表示されない**。
- 地図下部の固定広告に関する過去の仮IDは実在を確認できていない。推測の広告IDを有効化しない。
- 広告の空きスペースや `data-ad-status="unfilled"` は配信・在庫の問題もあり、必ずしも表示コードのバグではない。

## 表示位置・数・余白を調整する
- 記事トップのカテゴリ間は `ArticleIndexCategories.astro`。現状は**4カテゴリ間のうち2か所**を使用し、カテゴリの見出しと最初の記事の間に広告を挟まない。
- 記事本文は `articleRender.ts` の広告節配置ロジックを調整する。見出し直前・操作ボタン近傍・地図デモ操作のすぐそばは避ける。
- 枠の表記・スタイルは `adSlot.ts` と既存トークン `L` / `FS` を使用し、色・IDを個別に直書きしない。
- 広告密度を上げる前に、可読性・誤クリック・ページ速度・スマホの余白・コンテンツとの区別を確認する。

## 横長広告・画面上の自動広告の調整（2026-10）

- 記事本文は `src/config/ads.ts` の `AD_PLACEMENT` から設定し、最大1枠・幅600px上限の横長広告リクエストにする。広告の実際の縦横比や配信内容はGoogleに依存する。
- 横長広告にはAdSense管理画面で作った対応するレスポンシブのディスプレイ広告ユニットを使う。従来の「記事内広告」専用ユニットをそのまま流用する前に形式が一致するか確認する。
- **ロゴ・ナビを隠すアンカー広告**は、AdSense > 広告 > 対象サイトの編集 > オーバーレイ フォーマット > 詳細設定 > アンカー広告の位置で **「下部のみ」** にする。ヘッダーが下側の場合は上部のみ等を選び直す。
- **全画面広告（Vignette）**は同じオーバーレイ設定の詳細から間隔を変更。現在10分なら20分などに延ばす。これは最短表示間隔であり「出現確率を50%に固定する」機能ではない。追加のトリガーも不要ならオフ。
- **重要:** AdSense管理画面の自動広告設定は `AD_PLACEMENT.preferredAnchorPosition` や `suggestedVignetteIntervalMinutes` を変更しても自動連携されない。値は運用方針の記録であり、管理画面で人が設定する。
- ソースコードでGoogleの広告iframeを強制移動・非表示にせず、公式の自動広告設定を使う。

## 記事本文を覆う広告を禁止する運用

記事のテキストや地図デモの**上に重なる広告**は利用しない。記事には、コンテンツを押し下げる通常の広告枠のみ配置する。

**AdSenseの操作（コードだけでは変更不可）**

1. AdSense → 広告 → 対象サイトの編集 → **ページ除外** → 管理。
2. 次の各セクションを **「このセクションのすべてのページ」** として追加する。
   - `https://flex-railway-map.netlify.app/articles`
   - `https://flex-railway-map.netlify.app/en/articles`
   - `https://flex-railway-map.netlify.app/zh/articles`
   - `https://flex-railway-map.netlify.app/ko/articles`
3. **「サイトに適用」** を押す。反映には最大1時間ほどかかる場合がある。
4. これにより記事一覧・記事詳細の**自動広告全体**（アンカー、全画面、ページ内の自動挿入）が対象外になる。一方、`adSlotHtml` から指定した手動広告ユニットは別系統であり、広告ユニットIDが有効なら掲載できる。
5. 記事ではない地図トップでもロゴと重なる場合は、サイト全体の「オーバーレイ フォーマット」からアンカー広告の下部表示またはオフを選ぶ。**「除外エリア」だけではオーバーレイ広告を止められない**。

[公式: ページ除外](https://support.google.com/adsense/answer/9262311?hl=ja) / [公式: 自動広告設定](https://support.google.com/adsense/answer/9305577?hl=ja) / [公式: 除外エリアの制約](https://support.google.com/adsense/answer/12626543?hl=ja)

## 継続運用・分析
- AdSenseで広告配信・ポリシーセンター・収益指標を確認する。
- Search Consoleで検索表示・クリックとページのインデックス状態、GA4で記事閲覧や地図遷移を確認し、配置の変更前後を同条件で比較する。
- 変更記録に、広告枠の位置、広告ユニット種類、確認した画面幅と日付を残す。
- Googleが広告内容と配信可否を決定するため、サイト側で特定の広告の表示は保証できない。

参考: [Google AdSense ヘルプ](https://support.google.com/adsense/)、[AdSense プログラム ポリシー](https://support.google.com/adsense/answer/48182)
