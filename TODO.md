## RULES
- TODOからやったものはDONEに移動するように
- DONEに移動する際に以下のルールに基づくこと
    1. TODOの元の文章を記録する
    2. 変更点・修正点を記録すること
    3. 変更した日付・時刻を記録すること

## TODO

### 🧪 テスト拡充（優先度順）

#### 高優先度
- [ ] **E2E モバイルクラッシュ回帰テスト**: Playwright でモバイル viewport（375×812）を使い、フルスクリーンモードで LegendRouteList が正常表示されることを確認するテストを追加（今回のクラッシュバグの回帰防止）
- [ ] **TypeScript エラーの一括修正**: `tsc --noEmit` が src/ 全体でパスするよう、pre-existing な 114 件のエラーを修正する（implicit any、RouteKey に 'walking' が含まれない問題、`stationTrainTypeAnalysis.ts` の `Partial<Record<RouteKey>>` 化など）
- [ ] **StationSelector コンポーネント render テスト**: 出発駅・到着駅のセット、オートコンプリートが動作することを検証

#### 中優先度
- [ ] **HeatmapControl コンポーネント render テスト**: dead フラグ付きソースがリンクにならないことを検証
- [ ] **routeFinder 経路検索の網羅テスト**: 藤沢→新宿（小田急経由）、新宿→渋谷（山手線・中央線・京王線）など主要経路がすべて正常に返ることを確認
- [ ] **翻訳キー完全性テスト**: `translation.ts` の ja/en/zh/ko で同じキーが全言語に存在することをテスト（重複キー警告が出ているものを修正）
- [ ] **駅座標整合性テスト**: 全路線の全駅について緯度（24〜46°）・経度（122〜154°）が日本国内範囲に収まることを検証（江ノ島電鉄の座標ズレ問題などを検出）

#### 低優先度（将来対応）
- [ ] **tsconfig.check.json の対象を src/components/legend/ に拡張**: LegendRouteList・HeatmapControl 等の legend コンポーネントを型チェック対象に追加
- [ ] **スナップショットテスト**: 主要コンポーネントの render 結果をスナップショットで保存し、意図しないUI変更を検出

---

### 🖱️ UI 改善

- [x] **駅ツールチップの路線タップで「この路線を表示」** → **実装済み（2026-06-06）**: 非表示路線に「＋表示」バッジを追加。タップで即 visibleRoutes + availableRoutes に追加。

### 手書きで追加（後で修正しておいて）
- （完了済み→DONEに移動）


### 🗺️ 駅統計ヒートマップ機能（新機能ロードマップ）
Phase 1 - データ基盤（済）:
- [x] `StationStats` 型定義と主要駅サンプルデータ作成（`src/data/stationStats.ts`）
- [x] 全駅CSVテンプレート生成スクリプト（`scripts/generate-station-stats.ts`、出力: `data/station-stats.csv`）
- [ ] 主要東京駅（山手線・主要ターミナル駅等50駅程度）の統計データをCSVに入力する
- [ ] `scripts/import-station-stats.ts` を実装し、CSV→TypeScript自動変換できるようにする

Phase 2 - ヒートマップ表示:
- [ ] `leaflet.heat` プラグインを追加してヒートマップレイヤーを実装する
  - パッケージ: `@types/leaflet.heat` + `leaflet.heat`
  - 参照: `src/components/RailwayMap.tsx`
- [ ] パラメータ選択ドロップダウンUI（「家賃」「治安」「コンビニ数」等から選択）
- [ ] 選択パラメータに応じてヒートマップの色を動的更新する
- [ ] データ未入力駅はヒートマップから除外（またはグレー表示）する

Phase 3 - カスタム評価式:
- [ ] 式エディターUIを作成する
  - 各パラメータにスライダーで重みを設定（例: 治安 +0.4、家賃 -0.3）
  - プリセット式の選択（「住みやすさ」「飲み好き」「仕事バランス」等）
- [ ] 合成スコアを駅ごとに計算しヒートマップ表示する
- [ ] 上位N駅をリストで表示するサイドパネルを追加する

アイデアメモ（追加したいパラメータ）:
- 教育環境: 学校・塾の数（子育て向け）
- 外食コスパ: ランチ平均価格
- 健康: ジム・スポーツ施設数
- 災害リスク: 洪水・液状化リスクスコア（ハザードマップ連携）
- 24h対応: 24時間営業コンビニ数
- コミュニティ: 市区町村の外国人居住比率（国際的な環境）

- 路線クリック判定を緩くする: 半透明（非表示）の路線を表示/非表示に切り替えるクリック判定の幅を広くする（現在細すぎて操作しにくい）。表示中を非表示にするときも同じ幅に統一。
- 駅表示数の上限設定（フリーズ防止）: 大量路線表示時、画面中心に近い駅から最大100個だけ描画するように制限する。現状は全駅を描画しようとしてブラウザがフリーズする。
- 大阪，東京の切り替えボタンの表示をなくして．常にどちらの駅も表示するように
- 出発駅を複数にして，あるゴールの駅に向かうまでのルートを表示
    - 例えば藤沢，大磯，平塚，流山おおたかの森それぞれから新橋に向かうルートの表示とか
- 所要時間をルートごとの合計で表示する機能の実装
- 駅の位置情報がずれてるものがある（例えば江ノ島電鉄の駅が海の上に表示されてる）から修正して
    - 江ノ島電鉄に限らず網羅的に調査して緯度経度が合っているか，表示がずれていないかを調査して修正して
- 急行駅のみ表示で駅名が表示されていない → **部分修正済み（2026-06-06）**: 中央線の急行駅は名前強制表示に修正。小田急など isExpress フラグ未設定の路線は未対応。
    - [ ] 小田急・京急・東急など主要路線に `isExpress: true` フラグを追加して急行駅を明示する
    - [ ] stationVisibilityFilter で route recommendation と showExpressStationsOnly を組み合わせた場合の表示漏れを調査・修正
- 所要時間の表示を間隔の駅の中点を指すようにしてほしい
- 紹介用のデモビデオの作成
- 位置情報を動的に更新する（例えば1分に一回）機能の追加
- 時刻表？自分が今載ってる電車と時刻を入れたらその位置時点を基に各駅の到着時間が可視化される機能の実装

## DONE

### 2026-06-06 TODO実装

- **駅ツールチップの路線タップで「この路線を表示」**: 左カラムの路線一覧で非表示路線に「＋表示」バッジを追加。タップで即 visibleRoutes + availableRoutes に追加するインタラクションを実装。
  - 変更: `src/components/RailwayMap.tsx` 路線リスト onClick ロジック
- **路線クリック判定を拡大**: 表示中路線の透明ヒット線 (weight:36) を色線の前面に移動し opacity:0.001 に変更。SVG の `pointer-events: visiblePainted` で透明stroke が hit-test されない問題を修正。非表示(dimmed)路線も同様に修正。
  - 変更: `src/components/RailwayMap.tsx` 表示/非表示両路線の Polyline 描画順と opacity
- **急行駅のみ表示モードで駅名を強制表示**: `showExpressStationsOnly && station.isExpress` のとき `isDetailed = true` に設定。
  - 変更: `src/components/RailwayMap.tsx` isDetailed の計算式
- **allowedStationNames のバグ修正**: 非表示路線の駅も 400 件枠に含まれ表示 ON 路線の駅が押し出される問題を修正。`visibleRoutes.has()` でフィルター。
  - 変更: `src/components/RailwayMap.tsx` allowedStationNames useMemo

---

### 2026-06-05 手書きTODOの対応
- **ヒートマップの数値入力でゼロクリア許可**: 空欄 → `setHeatmapCustomRange(undefined)` でデフォルト値にリセット
  - 変更: `src/components/RailwayMap.tsx` ヒートマップ min/max onChange
- **駅ツールチップの出発時刻UIをシンプル化**: 余白削減・時計アイコン削除・入力とボタンの縦幅を24pxに統一
  - 変更: `src/components/RailwayMap.tsx` 時刻入力・現在時刻ボタン
- **時刻表を最初からスクロール可能に**: 「すべて表示」ボタン廃止、最大50件を即表示しスクロール
  - 変更: `src/components/RailwayMap.tsx` activeDeps取得数・展開ボタン削除
- **駅ツールチップをドラッグで移動可能に**: 上端ピルを掴んでドラッグ移動（Pointer Capture API使用）
  - 変更: `src/components/RailwayMap.tsx` tooltipDragOffset state・dragHandleProps