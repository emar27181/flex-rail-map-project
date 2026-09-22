# Flex Rail Map Project

> 🚃 日本全国の鉄道路線図をインタラクティブに表示するWebアプリケーション

[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://flex-rail-map.netlify.app)

---

## 概要

出発駅と到着駅に関連する路線のみを絞って表示できる「インタラクティブ路線図サービス」です。
運行イレギュラー時（遅延・運休など）にも、自分で判断できる簡略化された路線図を提供します。

## 路線カバレッジ

| 項目 | 値 |
|------|-----|
| 登録路線数 | **394路線** |
| 登録駅数（ユニーク） | **約5,200駅** |
| 全国カバー率（路線数） | **約 56%**（日本全国の鉄道路線 約700線に対して） |
| 対象エリア | 北海道〜沖縄（全国） |
| 駅座標データ最終更新 | **2026-05-19** |

> カバー率は日本の鉄道路線総数の推計値（約700線）に基づく目安です。

## 主要機能

- **インタラクティブ路線図**: ズームレベル対応、路線の表示/非表示切り替え
- **経路検索**: 出発駅・到着駅を指定して最適経路を推薦（最短時間・乗換回数考慮）
- **所要時間フィルター**: 出発駅から指定時間内の駅のみ表示
- **駅クリック時刻表**: 地図上の駅をクリックして次発列車を確認
- **多言語対応**: 日本語 / 英語切り替え

## 技術スタック

- **フレームワーク**: Astro + React + TypeScript
- **地図**: Leaflet + React-Leaflet
- **スタイリング**: インラインスタイル（CSS-in-JS）

## セットアップ

```bash
npm install
npm run dev      # 開発サーバー起動 (localhost:8080)
npm run build    # プロダクションビルド
```

### SEO関連の環境変数

Search ConsoleのHTMLタグ確認とGA4（Google Analytics 4）は、値をソースコードに
直接書かず、ビルド環境の環境変数（`.env`、またはNetlifyのSite configuration →
Environment variables）から読み込む。未設定の場合はそれぞれのタグ/スクリプトが
出力されないだけで、ビルド自体は失敗しない。

| 変数名 | 用途 | 値の入手方法 |
|---|---|---|
| `VITE_GA_MEASUREMENT_ID` | GA4の測定ID（例: `G-XXXXXXXXXX`） | Google Analyticsの管理画面 → データストリーム |
| `GOOGLE_SITE_VERIFICATION` | Search ConsoleのHTMLタグ確認用コード（`content`属性の値のみ、`<meta ...>`は不要） | Search Console → 所有権の確認 → HTMLタグ |

ローカルでは `.env` にこの2つを書けば `npm run build` に反映される。
本番（Netlify）で有効にするには、Netlifyのビルド環境変数に同名で設定すること。
GA4は [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent)
で既定「同意なし」で読み込まれ、サイト内のCookieバナーで分析Cookieを許可した
場合のみ収集を開始する（`src/utils/gtagConsent.ts`）。

### 検索流入用ガイドページ（/guides, /en/guides）

「検索される → ガイドページへ流入する → Flex Railway Mapを実際に触る → 別ページ・
地図へ回遊する」という導線を作るための、検索流入向けコンテンツページ。

- ページ本体: `/guides/{slug}`（日本語）、`/en/guides/{slug}`（英語） — `src/data/guides.ts` に
  コンテンツを追加すると `GuideLayout.astro` 経由で自動的にページが増える構造
- 各ガイドには「Flex Railway Mapで見る」CTA（`MapOpenCta.astro`）があり、既存の
  `?routes=...`（表示路線）・`?lang=...`（言語）のURL状態管理でそのテーマに対応した
  地図を直接開く。存在しない路線・駅・機能はガイドからハードコードして案内しない
- CTAクリックは GA4 イベント `seo_map_open`（`guide_slug`, `language`）として計測される
  （GA4未設定の環境ではエラーにならず何もしない）

公開後、Search Console・GA4で以下を確認する:

- [ ] Search Console にプロパティが登録され、`https://flex-railway-map.netlify.app/sitemap.xml` が
      認識されている（新規ページ分を含め再送信が必要な場合は手動でリクエスト）
- [ ] `/guides`, `/guides/simple-tokyo-railway-map`, `/en/guides`,
      `/en/guides/tokyo-train-map`, `/en/guides/tokyo-train-network` がインデックス登録されている
      （Search Console → ページ、またはURL検査ツール）
- [ ] 上記ページで impressions（表示回数）・clicks（クリック数）・CTR・average position が
      発生し始めているか（Search Console → 検索パフォーマンス、ページ別にフィルタ）
- [ ] GA4で `seo_map_open` イベントが記録されているか（GA4 → イベント、または探索レポートで
      `guide_slug` / `language` パラメータ別に内訳を見る）
- [ ] （最終的な成功指標）AdSense収益ではなく、GA4のユーザー・セッションが
      自分以外の実ユーザーの検索流入から発生し始めているか

## 利用規約

- 駅・路線データは独自作成またはオープンデータを利用しています
- 本サービスは各鉄道事業者とは一切関係ありません
- 運行情報・正確な時刻は必ず公式情報をご確認ください

© 2025 Flex Rail Map Project — Made with [Claude Code](https://claude.ai/claude-code)

---

<details>
<summary>🌐 English Version</summary>

## Flex Rail Map Project

An interactive railway map web application covering railways across Japan.

### About

A service that displays only the railway lines related to the user's selected departure and arrival stations. It provides a simplified railway map that helps passengers make their own decisions during service disruptions (delays, cancellations, etc.).

### Coverage

| Item | Value |
|------|-------|
| Registered lines | **394 lines** |
| Unique stations | **~5,200 stations** |
| National coverage (by line count) | **~56%** (out of approx. 700 lines in Japan) |
| Coverage area | Hokkaido to Okinawa (nationwide) |
| Station coordinate last updated | **2026-05-19** |

### Features

- **Interactive map**: Zoom-responsive station display, line visibility toggle
- **Route search**: Find optimal routes between departure and arrival stations
- **Time filter**: Show only stations reachable within a specified travel time
- **Station timetable**: Click a station on the map to see upcoming departures
- **Multilingual**: Japanese / English

### Tech Stack

- **Framework**: Astro + React + TypeScript
- **Map**: Leaflet + React-Leaflet

### Setup

```bash
npm install
npm run dev      # Start dev server (localhost:8080)
npm run build    # Production build
```

### Disclaimer

- Station and route data is independently created or sourced from open data
- This service is not affiliated with any railway operators
- Always check official sources for actual service status and timetables

© 2025 Flex Rail Map Project — Made with [Claude Code](https://claude.ai/claude-code)

</details>
