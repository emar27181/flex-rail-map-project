## RULES
- TODOからやったものはDONEに移動するように
- DONEに移動する際に以下のルールに基づくこと
    1. TODOの元の文章を記録する
    2. 変更点・修正点を記録すること
    3. 変更した日付・時刻を記録すること

## TODO

### 🐛 バグ修正

- 駅の位置情報がずれているものがある（例: 江ノ島電鉄の駅が海上に表示）
  - 江ノ島電鉄に限らず網羅的に緯度経度を調査・修正する
  - 駅座標整合性テスト（24〜46°N, 122〜154°E）も追加して検出できるようにする

### 🌐 多言語対応

- 新小金井など他言語対応できていない駅名・路線名を網羅的に調査する
  - 路線×言語のCSVで対応状況を管理する（今後の言語追加も考慮）

### 🎨 デザイン・UI統一

- 記事ページとマップUIのデザインを統一する
  - 共通アクセントカラーを記事側にも適用する
  - 共通フォントを使用する
  - 線・接続モチーフを記事デザインにも反映する
  - 「UIドキュメント」っぽい記事デザインへ寄せる
- 記事とアプリ間の導線を統一する
- iframe用軽量デモページを作成する
- 表示路線チェックボックスON色を青へ統一する

### 📱 スマホUX

- 入力時にキーボードで入力欄が隠れる問題を修正する（`visualViewport` 対応）
- 駅ツールチップの路線名が見切れる → 長い路線名は改行対応する

### 🖱️ ツールチップ・インタラクション

- PCでツールチップをクリック後に固定表示する（×ボタンまたは外クリックで閉じる）

### 🗺️ 地図表示・路線

- 路線クリック判定を緩くする（半透明路線のクリック幅を拡大、表示→非表示も同じ幅）
- 駅表示数の上限設定（フリーズ防止）: 画面中心に近い駅から最大100個だけ描画
- 出発駅を複数にして複数起点→1つのゴール駅へのルートを表示
  - 例: 藤沢・大磯・平塚・流山おおたかの森 それぞれから新橋

### ⏱️ 所要時間表示

- 始点設定時は出発駅からの累積所要時間を表示する（始点未設定時は駅間所要時間）
- 現在地または出発駅からの累積所要時間表示に対応する
- 路線数5本以下の時のみ所要時間表示を自動ON、多い場合は自動OFF
- 駅アイコン2行目に時刻または所要時間を表示する
- 所要時間の表示位置を駅間の中点にする

### 🚉 列車種別

- 快速急行・急行・各停ごとの停車駅表示切替を実装する
  - 小田急・京急・東急など主要路線に `isExpress: true` フラグを追加
  - stationVisibilityFilter で route recommendation と showExpressStationsOnly を組み合わせた場合の表示漏れを調査・修正
- 行き先吹き出し表示を実装する（「〇〇行き」がどこへ行くか可視化）

### 📍 現在地・方向

- 現在地または出発駅への方向矢印・「今どちら方向か」リマインダーを表示する

### 📅 時刻表・リアルタイム

- 時刻表を地図上へプロットする（「地図で見る時刻表」UI）
- リアルタイム列車位置表示を実装する
- 遅延・運休情報を反映する

### 📊 ヒートマップ

- 外れ値に引っ張られない表示スケール調整を行う
- 主要東京駅以外（神奈川・埼玉・千葉方面）の家賃データを収集する

### 🧪 テスト拡充

#### 高優先度
- [ ] **E2E モバイルクラッシュ回帰テスト**: Playwright でモバイル viewport（375×812）を使い LegendRouteList が正常表示されることを確認
- [ ] **TypeScript エラーの一括修正**: `tsc --noEmit` が src/ 全体でパスするよう pre-existing な 114 件のエラーを修正（implicit any、RouteKey に 'walking' が含まれない問題など）
- [ ] **StationSelector コンポーネント render テスト**: 出発駅・到着駅のセット、オートコンプリートが動作することを検証

#### 中優先度
- [ ] **HeatmapControl コンポーネント render テスト**: dead フラグ付きソースがリンクにならないことを検証
- [ ] **routeFinder 経路検索の網羅テスト**: 藤沢→新宿（小田急経由）など主要経路がすべて正常に返ることを確認

#### 低優先度
- [ ] **tsconfig.check.json の対象を src/components/legend/ に拡張**
- [ ] **スナップショットテスト**: 主要コンポーネントの render 結果をスナップショットで保存

---

## DONE

### 2026-06-17 セッション（追記）

- **同一名の駅でツールチップが誤動作する**
  - 元: 「同一名の駅のときに駅ツールチップが異なる駅のものを表示することがある」
  - 変更: `src/components/RailwayMap.tsx` トグル判定を `stationName` 文字列比較 → `station.lat/lng` 座標比較に変更（3箇所）
  - 日時: 2026-06-17

- **列車デモ再生バーが出発/到着UIと重なる**
  - 元: 「列車デモの再生バーUIが出発駅・到着駅センタUIと重なっているので下に移動する」
  - 変更: `src/components/RailwayMap.tsx` 再生バーの position を `top:10` → `bottom:10` に変更
  - 日時: 2026-06-17

---

### 2026-06-17 セッション

- **出発駅復元バグのリグレッションテスト**
  - 元: 「今ここで発生したバグが再発しないようにテストを設計して」
  - 変更: `tests/unit/components/departure-revert.test.tsx` 新規作成。6テストケースで useDepartureAutoSet フックを検証
  - 日時: 2026-06-17

- **スマホで路線並び替え時に文字選択が出る**
  - 元: 「スマホで路線並び替え時にコピー状態になる」
  - 変更: `src/components/legend/LegendRouteList.tsx` onTouchStart/Move/End を追加し `touchAction:'none'`, `WebkitUserSelect:'none'` で抑制
  - 日時: 2026-06-17

- **ヒートマップ駅名タップ精度改善（isDetailed ラベル）**
  - 元: 「ヒートマップ表示の時の駅名をクリックしてるつもりだけどツールチップがスマホで表示されにくい」
  - 変更: `src/components/RailwayMap.tsx` isDetailed ラベルアイコンにスマホ用 8px タッチパディングを追加
  - 日時: 2026-06-17

- **路線図表示と通常表示のロジックを統一（DiagramMap リファクタリング）**
  - 元: 「通常表示と路線図表示のロジックを同じに」
  - 変更: `src/components/DiagramMap.tsx` onRouteClick/onStationClick props 化、内部 tooltip 削除、スクリーン座標 hit circle 追加
  - 変更: `src/components/RailwayMap.tsx` dimmedMapTooltip を両モード共有
  - 日時: 2026-06-17

- **乗車路線リアルタイム検出機能**
  - 元: 「次の駅まで何分とかそういう情報を出したい、路線も色付きで」
  - 変更: `src/utils/trainDetector.ts` 新規（GPS→路線スコアリング）
  - 変更: `src/components/TrainStatusPanel.tsx` 新規（電光掲示板風UI）
  - 変更: `src/components/StationSelector.tsx`, `src/components/RailwayMap.tsx` に統合
  - 日時: 2026-06-17

---

### 2026-06-16 セッション

- **現在地から出発駅を自動設定（最寄り駅ベース）**
  - 元: 「現在地取得時に最寄り駅を出発駅に自動設定したい」
  - 変更: departure/arrival デフォルトを null に変更。isManualDeparture フラグで手動設定後の自動上書きを防止。handleManualSetDeparture 追加。
  - 変更: `src/components/RailwayMap.tsx`（2026-06-16）

- **現在地自動設定時は周辺5路線を表示・手動設定時はその駅の路線のみ**
  - 元: 「最初だけ5路線表示・自分で設定したときはその駅の路線のみ」
  - 変更: 路線表示制御 useEffect を改修。isManualDeparture=false 時のみ近隣路線まで拡張。availableRoutes は常に全路線に設定。
  - 変更: `src/components/RailwayMap.tsx`（2026-06-16）

- **ヒートマップ有効時も時刻表ツールチップを表示（統合）**
  - 元: 「ヒートマップ時も路線・時刻表ツールチップを表示」「通常モードにもヒートマップ情報を表示」
  - 変更: renderStationTimetableTooltip の early return 条件を緩和。ヒートマップデータをツールチップ内に常時表示。通常モード下部にコンパクトなヒートマップデータ概要を追加。
  - 変更: `src/components/RailwayMap.tsx`（2026-06-16）

- **現在地ピンアイコンを非表示**
  - 元: 「現在地のピンアイコンオフにして」
  - 変更: userLocation Marker の JSX を削除（位置情報取得自体は継続）
  - 変更: `src/components/RailwayMap.tsx`（2026-06-16）

- **スマホでの駅タッチ領域を44px以上に拡大**
  - 元: 「スマホで駅クリックしにくい」
  - 変更: createStationIcon / createTrainViewIcon で isMobile 時に透明ラッパーを min 44×44px に設定
  - 変更: `src/components/RailwayMap.tsx`（2026-06-16）

---

### 2026-06-11 セッション

- **居酒屋・ラーメン・書店・コワーキング・緑地率の実データ収集（977〜1541駅）**
  - 変更: `src/data/station-stats-data.json`、Overpass API（maps.mail.ru）で一括取得
- **推定データ/実データの切り替えUI（showEstimatedData）追加**
  - 変更: `src/components/RailwayMap.tsx`、`src/components/legend/LegendRouteList.tsx`
- **駅別データ一括収集スクリプト整備（collect-station-data.py）**
  - 変更: `scripts/collect-station-data.py`、`scripts/README.md`
- **CLAUDE.mdに実データ以外使用禁止ルールを明記**

---

### 2026-06-08 TODO実装（追加）

- **設定の路線順序をマップの前面/背面に反映**: ソート順を逆にして index 小（上）が最前面に描画されるよう修正。UIヒント文字列も「↑ 最前面 / 背面 ↓」に更新。
  - 変更: `src/components/RailwayMap.tsx` visibleRoutesData のソート順
  - 変更: `src/utils/translation.ts` layerOrderHint（ja/zh/ko）
- **ヒートマップ設定ドロップダウンがマップに反映されないバグ修正**: handleHeatmapParamChange を追加し heatmapParam・heatmapMultiParams・heatmapCustomRange を同時更新するよう修正。
  - 変更: `src/components/RailwayMap.tsx` handleHeatmapParamChange + LegendRouteList/MobileBottomPanel に適用

---

### 2026-06-08 TODO実装

- **ヒートマップツールチップのコントラスト改善**: pColorで色付けされた値テキストに text-shadow を追加（案3）。
  - 変更: `src/components/RailwayMap.tsx` renderHeatmapTooltip 内の値 span × 2箇所
- **翻訳キー完全性テスト**: uiChinese/uiKorean を export 化し、全キー網羅チェックテストを追加。重複キー（baseTime・swapStationsTitle）も修正。
  - 新規: `tests/unit/utils/translation.test.ts`
  - 変更: `src/utils/translation.ts`
- **多言語対応: 行き先「〇〇行き」英語化**: translateDestination に hasIki ブランチを追加。英語 "for X"・中国語 "开往X"・韓国語 "X행" で表示。
  - 変更: `src/utils/translation.ts` translateDestination 関数
- **多言語対応: toward括弧の言語切り替え**: 日本語は「（）」、それ以外は「()」を使用。
  - 変更: `src/components/RailwayMap.tsx` 時刻表ツールチップ行き先行
- **多言語対応: 設定パネル内のハードコード日本語を translateUI 化**: 乗換強調表示・路線の太さ・最大半径・路線図表示（実装中）・レイヤー順ヒント・カテゴリラベル。
  - 変更: `src/components/legend/LegendRouteList.tsx`・`src/utils/translation.ts` に14キー追加
- **スマホ設定パネルの「現在の駅を設定」セクション非表示**: MobileBottomPanel内の LegendStationMarkers を削除。
  - 変更: `src/components/RailwayMap.tsx`
- **SEO改善**: sitemap.xmlに全記事を追加（5記事＋記事一覧）、JSON-LDにkeywords/url/mainEntityOfPage追加。
  - 変更: `public/sitemap.xml`・`src/pages/articles/_ArticleLayout.astro`

---

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

---

### ヒートマップ Phase 1・2 完了（2026-06）

- **Phase 1: データ基盤**
  - StationStats 型定義と全駅CSVテンプレート生成スクリプト → 完了
  - 全1541駅のOverpass施設データ収集（50駅目標を大幅超過）→ 完了
  - CSV→TypeScript変換は `scripts/collect-station-data.py` で代替 → 完了

- **Phase 2: ヒートマップ表示**
  - DivIconベースのヒートマップ表示実装（leaflet.heat 代替）→ 完了
  - パラメータ選択ドロップダウンUI → 完了
  - 選択パラメータに応じたカラーマッピング → 完了
  - データ未入力駅の灰色（`#aaaaaa`）表示 → 完了
  - 上限・下限をGUIで調整（heatmapCustomRange min/max 入力） → 完了

---

### 2026-06-08 TODO実装（ヒートマップ）

- **[x] 翻訳キー完全性テスト** → 実装済み（2026-06-08）: `tests/unit/utils/translation.test.ts` に4テスト追加。
- **[x] ヒートマップツールチップの低コントラスト文字色を改善** → 実装済み（2026-06-08）: 案3採用。pColorで色付けされた値テキストに `text-shadow` を追加。
