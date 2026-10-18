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

## 継続運用・分析
- AdSenseで広告配信・ポリシーセンター・収益指標を確認する。
- Search Consoleで検索表示・クリックとページのインデックス状態、GA4で記事閲覧や地図遷移を確認し、配置の変更前後を同条件で比較する。
- 変更記録に、広告枠の位置、広告ユニット種類、確認した画面幅と日付を残す。
- Googleが広告内容と配信可否を決定するため、サイト側で特定の広告の表示は保証できない。

参考: [Google AdSense ヘルプ](https://support.google.com/adsense/)、[AdSense プログラム ポリシー](https://support.google.com/adsense/answer/48182)
