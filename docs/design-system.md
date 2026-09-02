# デザインの一元管理 — 現状と方針

UI の色・サイズ・余白・ボタンが「どこで決まっているか」をまとめた文書。
調査日: 2026-08-16 / 対象: `src/` 配下の `.ts` `.tsx` `.astro`（路線データ層を除く）

新しく UI を書くときは **「### 書くときの判断表」** だけ読めば足りる。
なぜそうなっているかを知りたいときに残りを読む。

---

## 結論（先に3行）

1. デザイントークンの定義が **3系統に分裂**していて、どれを使うかが決まっていない
2. ~~`<button>` は93個中91個がインラインstyle~~ → `ui/atoms/Button` を用意（2026-08-25）。既存の置き換えは順次
3. ~~「出発=緑 / 到着=赤」のような意味を持つ色にベタ書き~~ → `SEMANTIC` に一元化済み（2026-08-25）

---

## 1. トークン定義が3系統に分裂している

同じ「フォントサイズ」「余白」「角丸」を、3つのファイルが別々に定義している。

| 定義元 | 中身 | 参照ファイル数 | 使われている場所 |
|---|---|---|---|
| `src/constants/ui.ts` | `FS`（6段階）, `TARGET`（24/44px） | 7 | 地図・駅選択まわり |
| `src/components/legend/legendStyles.ts` | `L.fs`（5段階）, `L.sp`（6段階）, `L.r`（3段階） | 5 | 凡例・設定パネル |
| `src/design/tokens.ts` → `--v2-*` CSS変数 | 色・space・radius 一式 | 10 | `src/v2/` のみ |

**噛み合っていない点:**

- `FS` は6段階（9/10/11/12/13/14px）、`L.fs` は5段階（10/11/12/13/14px）。
  9px が `FS` にだけあり、同じ 10px が `FS.tiny` と `L.fs.xs` の2つの名前を持つ
- `FS` は**フォントサイズしか持たない**ため、余白と角丸は `constants/ui.ts` 圏では
  ベタ書きするしかない。これが下記の 413 箇所の主因
- `--v2-*` は `src/v2/` 専用で、本番表示に使われている v1 側からは参照できない

**方針:** `src/constants/ui.ts` を唯一の定義元に育てる。
`L` は `constants/ui.ts` を再輸出する薄い別名にして、値の二重定義をやめる。
`design/tokens.ts` は v2 実験用として現状維持（本番の v1 が参照しないことを明示する）。

---

## 2. ベタ書きの実測

`node scripts/audit-design-tokens.mjs` の出力（対象 82ファイル、`src/data/` を除く）。

| 対象 | ベタ書き箇所 | 異なる値の種類 | 定義済みの段階数 |
|---|---|---|---|
| `padding` / `margin` | 413 | **84種** | `L.sp` の6段階 |
| `fontSize` | 270 | 10種（9〜24px） | `FS` の6段階 |
| `borderRadius` | 170 | **11種**（1,2,3,4,5,6,8,10,12,20,999px） | `L.r` の3段階 |
| 16進の色 | 550 | **224種** | `getThemeColors` |
| `rgba()` | 94 | 61種 | — |

余白が84種類、色が224種類ある。定義済みの段階（6段階・3段階）がまったく機能していない。

**ファイル別の偏り（全項目の合計・上位8）:**

| ファイル | 箇所 | 備考 |
|---|---|---|
| `components/RailwayMap.tsx` | 393 | 要対応。全体の約3割 |
| `contexts/ThemeContext.tsx` | 81 | **正当**（ここが色の定義元） |
| `components/legend/LegendRouteList.tsx` | 79 | 要対応 |
| `utils/trainDemoUtils.ts` | 74 | **正当**（デモ用の路線色データ） |
| `pages/index.astro` | 72 | 要対応（ローディング画面のCSS） |
| `components/TrainTypeViewer.tsx` | 64 | 要対応 |
| `components/RouteRecommendations.tsx` | 52 | 要対応 |
| `components/TimetablePanel.tsx` | 52 | 要対応 |

`ThemeContext.tsx` と `trainDemoUtils.ts` は定義元なので、ここに実際の色があるのは正しい。
スクリプトは定義元と利用側を区別しないので、この2つは差し引いて読む。

`RailwayMap.tsx` だけで全体の約3割。ここを直すと数字は大きく動くが、
5000行超の単一ファイルなので一括置換は危険（過去に同じ理由で JSX 属性の重複を作った）。
**新規コードで増やさないことを先に固め、既存分は触る箇所から段階的に置き換える。**

### 角丸が11種類ある問題

コード上は `1,2,3,4,5,6,8,10,12,20,999px` の11種類。
モバイル幅で実際に描画されているものを数えると `2px`(46) `3px`(27) `4px`(7) `8px`(2) `10px` `12px`。
2px と 3px と 4px が同じ画面に混在していて、並べたときに角の丸みが揃わない。
`L.r` は3段階しか定義していないのに実際は11種類使われている＝定義が機能していない。

---

## 3. ボタンの共通化（2026-08-25 着手）

対応前は `<button>` 93個のうち91個がインラインstyleで、`backgroundColor` `padding`
`borderRadius` `fontSize` を毎回手書きしていた。同じ役割のボタンでも高さも色も違い、
「塗った色の上の文字」を `white` / `#fff` / `#ffffff` の3通りで書いていた。

`src/components/ui/atoms/Button.tsx` を作り、外から指定するのは
`variant`（primary / positive / danger / outline / ghost）と `size`（sm / md）だけにした。
**新規ボタンは必ずこれを使う。**

```tsx
<Button theme={theme} variant="positive" size="sm" onClick={...}>全表示</Button>
// トグルは pressed を渡す。押されていない間は塗らない
<Button theme={theme} variant="primary" pressed={on} onClick={...}>所要時間を表示</Button>
```

**v1 のコンポーネントからは生の `<button>` が0になった**（対応前は91個）。
padding は 2/3/5/6/8/10px、角丸は 3/4/6/8/10px とばらついていたものが規格の2段階に揃い、
ヒートマップの範囲調整（18px相当）など WCAG の下限を下回っていた当たり判定も直った。

---

## 3.1 アトミックデザインの規格

### 層の分け方

**どの層に置くかは「何を知っているか」で決める。** 見た目の複雑さではない。

| 層 | 置き場所 | 知ってよいこと | 知ってはいけないこと | 今あるもの |
|---|---|---|---|---|
| atoms | `ui/atoms/` | デザイントークン（`CONTROL_SIZE` `FS` `SEMANTIC` `getThemeColors`） | 路線・駅・経路といったアプリの概念、データの取得元 | `Button` `IconButton` `LinkButton` `Chip` `TextField` `TextArea` `Select` `Checkbox` `Radio` `ToggleMark` `Switch` `Slider` |
| molecules | `ui/molecules/` | アトムの並べ方・組み合わせ方 | 同上 | `SegmentedControl` `Stepper` |
| organisms | `components/`, `components/legend/` | アプリの概念とデータ、状態 | — | `RouteSwitchBoard` `LegendRouteList` `StationSelector` |

**アトム以外で `<button>` `<select>` `<textarea>` `<input>` を書くとテストが落ちる**
（`tests/unit/components/ui/noRawControls.test.ts`）。
除外しているのは3つだけで、いずれも理由を書いてある。
`src/v2/`（本番未使用の実験UI）、`src/design/`（開発者向けデバッグパネル）、
`display:none` のファイル選択欄（画面に出ず、実際に押されるのは別のボタン）。

### どの部品を使うか

| 書こうとしているもの | 使うアトム |
|---|---|
| 文字のボタン | `Button` |
| アイコンだけのボタン | `IconButton`（正方形。`label` 必須） |
| 押すと画面遷移する | `LinkButton`（要素は `<a>` のまま） |
| 色を持つ切り替え（路線など） | `Chip` |
| 1行入力・時刻・数値 | `TextField` |
| 複数行入力 | `TextArea` |
| 選択欄 | `Select` |
| チェックの行 | `Checkbox` |
| 排他選択の行 | `Radio` |
| 行の見た目は自前で、印だけ欲しい | `ToggleMark` |
| 横長のオン・オフ | `Switch` |
| つまみで数値を選ぶ | `Slider` |
| −／＋の増減行 | `Stepper`（molecule） |
| 排他選択のボタン列 | `SegmentedControl`（molecule） |

判定に迷ったら次を自問する。

- **「路線」「駅」という語をこの部品から消せるか？** 消せないなら organism
- **props を差し替えれば別のアプリでも使えるか？** 使えるなら atom / molecule

例: 路線チップは「色・ラベル・選択状態」だけを受け取る `Chip`（atom）にし、
「どの路線がどの色か」は呼び出し側（organism）が渡す。

### アトムの書き方（守ること）

1. **寸法は `ui/atoms/controlSize.ts` の `CONTROL_SIZE` から取る。** 部品ごとに
   高さや角丸を書かない
2. **色は `getThemeColors(theme)` / `SEMANTIC` / `filledLabelColors()` から取る。**
   直書きは `tests/unit/constants/semanticColors.test.ts` が落とす
3. **`theme` を props で受け取る。** アトムは context を読まない（テストしにくくなる）
4. **状態で外形を変えない。** 枠線の太さ・文字の太さ・大きさを選択状態で変えると、
   押すたびに並びが動く。状態は**塗り**で示す
5. **文言を持たない。** 表示する文字は props で受け取る。翻訳は organism の仕事
6. **アイコンは lucide-react のコンポーネント。** 絵文字は使わない

### 寸法の規格（`CONTROL_SIZE`）

段階は2つだけ。増やすと「どれを使うか」が決まらなくなる。

| 段階 | 高さ | 文字 | 使うところ | 根拠 |
|---|---|---|---|---|
| `md` | 44px | 12px | 指で何度も押すもの。パネルの主要な操作 | Apple HIG 44pt |
| `sm` | 24px | 11px | 補助操作。密なヘッダー、インラインのボタン | WCAG 2.2 AA 2.5.8 の下限 |

**同じ行・同じグループに並ぶ操作は必ず同じ段階にする。**
隣り合う部品で高さが違うのが「揃っていない」の主な原因だった
（例: 路線チップ44px の隣に全表示ボタン24px が並んでいた）。

パネル単位で段階を決め、そのパネルの中では定数にして使い回す
（`RouteSwitchBoard` の `BOARD_CONTROL_SIZE` が実例）。

入力欄だけは文字サイズが規格から外れて **16px 固定**。iOS Safari が
16px 未満の入力欄でページを自動拡大するため。

### 色の規格

| 用途 | 使うもの |
|---|---|
| 主操作 | `variant="primary"`（`SEMANTIC.primary`） |
| 出発・肯定 | `variant="positive"`（`SEMANTIC.departure`） |
| 到着・否定・削除 | `variant="danger"`（`SEMANTIC.arrival`） |
| 補助 | `variant="outline"`（枠線のみ） |
| 目立たせない | `variant="ghost"`（枠線も塗りもなし。太さは確保する） |
| それ自身の色を持つもの（路線） | `<Chip color={路線色}>` |

塗った色の上に載せる文字は `colors.onPrimary`、
路線色のように色が動くものは `filledLabelColors()` に決めさせる。

### 寸法の直書きは書けない

文字サイズ196箇所・余白322箇所・角丸85箇所を定数に置き換え、
`tests/unit/components/ui/noRawSizes.test.ts` で直書きを落とすようにした。

| 対象 | 使うもの | 段階 |
|---|---|---|
| 文字サイズ | `FS` | micro(9) tiny(10) helper(11) label(12) base(13) sectionTitle(14) input(16) emphasis(18) heading(20) display(24) |
| 余白・間隔 | `L.sp` | xxs(2) xs(4) sm(6) md(8) lg(10) xl(12) 2xl(16) 3xl(20) 4xl(24) 5xl(40) |
| 角丸 | `L.r` | sm(3) md(4) pill(8) |
| 操作部品の高さ | `CONTROL_SIZE` | sm(24) md(44) |

段階に無い値（1/3/5/7/14/18/22/26/28px など）は近い段階に丸めてある。
新しい段階を足す前に、既存の段階で足りないか確認すること。

除外は定義元2ファイル（`legendStyles.ts` `controlSize.ts`）と
`src/v2/`・`src/design/` だけ。

### テストで固定していること

`tests/unit/components/ui/atoms.test.tsx`

- 段階は2つだけ、`sm` < `md`
- `Button` と `Chip` は同じ段階なら高さ・角丸・枠線・文字サイズが一致する
- 選択・非選択で枠線と文字の太さが変わらない（塗りだけが変わる）
- 入力欄の文字は16pxを下回らない

---

## 3.5 白と黒（2026-08-25 対応済み）

`color: 'white'` `'#fff'` `'#ffffff'` が **76箇所** に散らばっていた。
同じ「塗った色の上に載せる文字」なのに3通りの書き方が混在し、
検索で取りこぼして「直したつもりで残る」ということが起きていた。

`src/constants/ui.ts` の `NEUTRAL.white` / `NEUTRAL.black` を唯一の定義元にし、
半透明は `alphaWhite(a)` / `alphaBlack(a)` を通す。`ThemeContext` の
`onPrimary` などもここから取る。

**使い分け:**

| 場面 | 使うもの |
|---|---|
| UIの文字色・背景・境界線 | `getThemeColors(theme)` |
| 塗った色の上に載せる文字 | `colors.onPrimary`（テーマ由来の白） |
| 路線色など「下の色」で決まる文字 | `filledLabelColors(color, theme)` |
| 地図アイコンの縁取りなど、テーマではなく下の色で決まる白 | `NEUTRAL.white` |

`tests/unit/constants/semanticColors.test.ts` が `constants/ui.ts` 以外での
白・黒の直書きを落とす。記事本文のSVG挿絵（`data/articleBodyI18n.ts`）だけは
UIのテーマと無関係なため明示的に除外している。

---

## 4. 意味を持つ色（2026-08-25 対応済み）

| 色 | 意味 | 対応前のベタ書き | 現在 |
|---|---|---|---|
| `#4CAF50` | 出発駅・確定・OK | 31箇所 / 10ファイル | `SEMANTIC.departure` |
| `#F44336` | 到着駅・警告 | 24箇所 / 9ファイル | `SEMANTIC.arrival` |
| `#2196F3` | primary（選択中・リンク） | 12箇所 / 5ファイル | `SEMANTIC.primary` |

「出発は緑」はアプリ全体の約束事なのに、各ファイルが自前で `#4CAF50` と書いていた。
色を変えるには全ファイルを直す必要があり、実際に過去、入力欄だけ色が変わって
ボタンが取り残される事故が起きている。大文字小文字も `#F44336` と `#f44336` が
混在しており、検索での取りこぼしを生んでいた。

67箇所すべてを `SEMANTIC.*` に置き換え、`tests/unit/constants/semanticColors.test.ts` で
**`constants/ui.ts` 以外にこの3色が現れたら失敗する**ようにした。以後は増やせない。

同じ色を `rgba()` で書き直していた4箇所（`rgba(76,175,80,0.12)` など）も
`tintColor(SEMANTIC.departure, 0.12)` に寄せた。16進とrgbaで別々に管理されていると
片方だけ変わる。

ダークモード用の値は `ThemeContext` が持ち、ライト側の値だけ `SEMANTIC` から取る。

また、インラインstyleを持つのにテーマから色を取っていないコンポーネントが **42中9**
（`DemoMap` `CoverageAnalysis` `SchematicMap` `SimpleMap` `ErrorBoundary` など）。
これらはダークモードで配色が崩れる可能性がある。
なお `map/HeatmapDots.tsx` と `map/HeatmapLayer.tsx` はどこからも import されていない
**未使用ファイル**なので、直すより消す方が筋が良い。

`SEMANTIC.departure` / `SEMANTIC.arrival` / `SEMANTIC.primary` が唯一の定義元。

---

## 5. 一元管理できている例（この方針の実物）

うまくいっている箇所は既にあるので、これを型にする。

| 仕組み | 場所 | 何を1箇所にまとめたか |
|---|---|---|
| `stationLabelBox` | `src/components/RailwayMap.tsx` | 駅ラベルの文字サイズ・高さ・角丸・余白（3つのアイコン生成関数で共有） |
| `selectableCard()` | `src/components/legend/legendStyles.ts` | 選択できるカード・行の枠線と背景（選択でずれない） |
| `tintColor()` | `src/utils/contrast.ts` | 色を薄い背景として敷くときの rgba 変換 |
| `filledLabelColors()` | `src/utils/contrast.ts` | 「色を背景にして文字を載せる」ときの背景色・文字色・縁取りの決め方 |
| `ColorChip` | `src/components/ui/ColorChip.tsx` | 色付き小ラベルの見た目（＋表示 / 件数 / 種別バッジ） |
| `renderStationMarker()` | `src/components/RailwayMap.tsx` | 駅マーカーの描画（通常・乗換ヒント・常時表示の3経路で共有） |
| `withTouchPadding()` | `src/components/RailwayMap.tsx` | タッチ領域を広げる余白の計算（2つのアイコン生成関数で共有） |

いずれも「同じ規則を2箇所に書いてしまい、片方だけ直して不整合が出た」ことが
きっかけで切り出したもの。**2箇所目を書く時が切り出す時。**

---

## 6. アクセシビリティ上の実測値

モバイル幅(390px / iPhone 13相当)で実際に描画された操作要素をブラウザ上で計測した結果。
この節だけは静的解析ではなく実描画の計測なので、`audit-design-tokens.mjs` には含まれない
（開発サーバを起動して Playwright で測る必要がある）。

| 基準 | 結果 |
|---|---|
| 操作要素の総数 | 71 |
| WCAG 2.2 AA 2.5.8（24×24px）未満 | **3**（地図フッタの Leaflet / OpenStreetMap / CARTO のリンク） |
| Apple HIG 44×44 未満 | 67 |

**チェックボックスについての注意（測り方を間違えやすい）:**

`<input type="checkbox">` の実寸はブラウザ既定の 13×13px だが、これは違反ではない。
2.5.8 が測る対象は「タップできる範囲」であり、このアプリのチェックボックスは
22個すべてがクリック可能なラベル行（実測 **257×40px**）の中にある。

調査中に一度 `checkboxInput` へ `width/height: 24px` を入れたが、
未チェック時に白い四角が目立つだけで見た目が悪化したため戻した。
**チェックボックスを単独で（クリック可能な行の外に）置く場合のみ**、
置く側で 24px 以上の当たり判定を用意すること。

フッタの3リンクは Leaflet と地図タイル提供元の帰属表示で、外部ライブラリが
生成しているもの。表示義務があるため消せないが、高さ14pxで基準を下回っている。

実描画のフォントサイズ分布は `9px`×49 / `12px`×146 / `16px`×49。
9px は地図上の駅名ラベルで、CLAUDE.md の「小さすぎる文字サイズ」に既出。

---

## 7. 寸法を揃える（2026-08-16 対応済み）

### 駅ラベルの高さが揃っていなかった

駅ラベルを作る関数が3つあり、それぞれが独自に文字サイズと高さを決めていた。

| 生成関数 | 修正前の文字サイズ | 修正前の高さ | 角丸 |
|---|---|---|---|
| `createStationIcon`（通常） | 9px | 15.5px | 3px |
| `createTrainTypeStationIcon`（列車種別） | 9px | 18/30px の独自値 | 2px |
| `createSpecialStationIcon`（出発/到着） | 12px | 24px | 5px |

地図上で出発・到着駅だけひと回り大きく、高さも揃っていなかった。
`stationLabelBox` に寸法をまとめて3つとも参照させ、**強調は大きさではなく背景色**で付ける方針にした。
修正後は通常 15.5px / 出発到着 16px（枠線ぶんの0.5px差のみ）。

### 選択すると行の大きさが変わっていた

選択状態を `border: isSelected ? '2px solid' : '1px solid'` で表す書き方が3箇所にあった。
`box-sizing` が `content-box` のままだと、選択した瞬間に外形が2px大きくなって並びがずれる。

`selectableCard()` にまとめ、次の3点を規則にした。

1. **枠線の太さは選択・非選択で変えない**（非選択時は色を `transparent` にして場所だけ確保）
2. **`box-sizing: border-box`** で枠線を寸法に含める
3. **選択は枠線の色だけでなく背景も塗る** — 枠線だけだと細くて気づきにくく、
   色覚特性によっては差が分かりにくい

路線一覧では accent にその路線の色を渡し、選択された路線が自分の色で塗られるようにした。
`tests/unit/components/legend/legendStyles.test.ts` でこの3点を固定している。

---

## 書くときの判断表

新しく UI コードを書くとき、この順で判断する。

| 書こうとしているもの | 使うもの | 直接書いてよいか |
|---|---|---|
| ボタン | `<Button theme variant size>` | ❌ `<button style={{...}}>` は禁止 |
| 色を持つ切り替え（路線など） | `<Chip color label selected>` | ❌ |
| 排他選択のボタン列 | `<SegmentedControl>` | ❌ |
| 1行入力欄 | `<TextField theme size>` | ❌ |
| 操作部品の高さ・角丸 | `CONTROL_SIZE[size]` | ❌ |
| フォントサイズ | `FS.base` など `src/constants/ui.ts` | ❌ `fontSize: '12px'` は禁止 |
| 操作要素の最小サイズ | `TARGET.min` / `TARGET.touch` | ❌ |
| 出発/到着/primary の色 | `SEMANTIC.*` | ❌ `#4CAF50` の直書きは禁止 |
| 文字色・背景・境界線 | `getThemeColors(theme)` | ❌ ダークモードが壊れる |
| 色の上に文字を載せる | `filledLabelColors(color, theme)` | ❌ 自前でコントラスト判定しない |
| 色付きの小ラベル | `<ColorChip>` | ❌ |
| 選択できるカード・行 | `selectableCard(colors, {selected, accent})` | ❌ 枠線の太さを選択で変えない |
| 色を薄く背景に敷く | `tintColor(color, alpha)` | ❌ |
| 地図上の駅ラベルの寸法 | `stationLabelBox` | ❌ 生成関数ごとに決めない |
| ボタン | `<Button>`（未作成。作るまでは `btn()`） | ⚠️ |
| 余白・角丸 | `L.sp` / `L.r` | ⚠️ 段階に無い値が要るなら段階を足す |

**同じ値を2箇所目に書こうとしたら、書く前に共通化する。**
これはこのプロジェクトで繰り返し起きた不具合の再発防止であって、様式美の話ではない。

---

## 着手する順番（費用対効果順）

1. ✅ **チェックボックスの style を `checkboxInput` に統一** — 済（2026-08-16）。
   6箇所が `accentColor` や `marginRight` を各自インラインで持っていたのを共通化した
2. **`SEMANTIC` 定数を追加**して `#4CAF50` `#F44336` `#2196F3` を置換 — 92箇所、機械的
3. **`Button` コンポーネントを作る** — 以後の新規ボタンが揃う（91箇所は追って移行）
4. **`L` を `constants/ui.ts` の再輸出にする** — 値の二重定義を解消
5. **角丸を3段階に寄せる** — 11種→3種
6. **未使用ファイルの削除** — `map/HeatmapDots.tsx` `map/HeatmapLayer.tsx`
7. `RailwayMap.tsx` の段階的置換 — 触る箇所から

2〜4・6 は影響範囲が明確で安全。5・7 は見た目が変わるため、
プレビューでの目視確認（CLAUDE.md の運用フロー）を挟む。
