# Flex Railway Map

必要な路線だけ表示できる、シンプルなインタラクティブ路線図です。出発駅・到着駅を選ぶと、その移動に関係する路線だけに絞り込んで地図に表示します。

A simple, interactive railway map that shows only the lines you need — pick a departure and destination, and it narrows the map down to the lines relevant to that trip.

## Live Demo

**https://flex-railway-map.netlify.app/**

## About

一般的な路線図は、すべての路線・駅を一枚に詰め込むため情報量が多く、自分に必要な路線やネットワーク構造を把握しづらいことがあります。特に運行イレギュラー時（遅延・運休など）は、乗り換えアプリの案内だけでは状況を自分で判断しにくい場面もあります。

Flex Railway Mapは、必要な路線だけを選んで表示することで、鉄道ネットワークを理解しやすくすることを目的としたWebアプリケーションです。

## Features

現在実装済みの主要機能です。

- **インタラクティブ路線図** — JR・私鉄・地下鉄など全国490路線、駅約6,000駅をカバー。路線ごとの表示/非表示切り替え、ズームレベルに応じた駅表示
- **経路検索** — 出発駅・到着駅を指定すると、所要時間・乗換回数を考慮した経路候補を複数表示
- **所要時間フィルター** — 出発駅から指定時間内に到達できる駅だけを地図上で絞り込み
- **駅クリック時刻表** — 地図上の駅アイコンをクリックすると、その駅を通る路線と次発列車（一部路線は始発まで遡って表示）を確認できる。時刻表データがある路線は現在98路線
- **駅まわりの統計（実データのみ）** — コンビニ・飲食店・カフェ・スーパー・病院の件数、公園面積を、OpenStreetMap（Overpass API）の実測データがある駅に限って表示。推定値では埋めない
- **多言語対応** — 日本語・English・中文・한국어
- **URLでの状態共有** — 表示路線・出発/到着/経由駅をURLパラメータとして共有できる

## Tech Stack

- [Astro](https://astro.build/) + [React](https://react.dev/) + TypeScript
- [Leaflet](https://leafletjs.com/) / [React-Leaflet](https://react-leaflet.js.org/) — 地図表示
- [Vitest](https://vitest.dev/) — ユニットテスト、[Playwright](https://playwright.dev/) — E2Eテスト

## Development

```bash
npm install
npm run dev      # 開発サーバー起動 (http://localhost:8080)
npm run build    # プロダクションビルド
npm run test:ci  # 型チェック + ユニットテスト
npm run test:e2e # E2Eテスト（Playwright）
```

### 環境変数（省略可）

GA4（Google Analytics 4）とGoogle Search Consoleの確認タグは任意設定です。未設定でもビルド・動作に支障はなく、該当するスクリプト/メタタグが出力されないだけです。

| 変数名 | 用途 |
|---|---|
| `VITE_GA_MEASUREMENT_ID` | GA4測定ID（例: `G-XXXXXXXXXX`） |
| `GOOGLE_SITE_VERIFICATION` | Search Console のHTMLタグ確認コード |

`.env` に設定するとローカルビルドに反映されます。GA4は[Consent Mode](https://developers.google.com/tag-platform/security/guides/consent)で既定「同意なし」で読み込まれ、Cookieバナーで分析を許可した場合のみ収集を開始します（`src/utils/gtagConsent.ts`）。

### 検索流入用ガイドページ（/guides, /en/guides）

目的別の検索流入ページです。`src/data/guides.ts` にコンテンツを追加すると `GuideLayout.astro` 経由で自動的にページが増える構造になっています。各ガイドには地図への導線（CTA）があり、既存の `?routes=...` / `?from=...&to=...` のURL状態管理でそのテーマに対応した地図を直接開きます。存在しない路線・駅・機能はガイドに書きません。

公開後は Search Console（インデックス登録・impressions・clicks・average position）と GA4（`seo_map_open` イベント、`guide_slug` / `language` / `source_page` パラメータ別）で流入状況を確認します。

## Status / Roadmap

- 時刻表データは現在98路線（全490路線中）。関西・中京の大手私鉄など未対応路線が多く残っています
- 駅まわりの統計データは首都圏主要路線が中心で、他地域は未収集です

上記以外の大きな新機能（リアルタイム運行情報連携など）は現時点で計画していません。

## License / Disclaimer

- 駅・路線データは独自作成、またはオープンデータ（国土交通省・各自治体公開データ等）を利用しています
- 本サービスは各鉄道事業者とは一切関係のない非公式サービスです
- 運行情報・正確な時刻・運賃は必ず公式情報をご確認ください

© 2025 Flex Railway Map — Made with [Claude Code](https://claude.com/claude-code)
