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
