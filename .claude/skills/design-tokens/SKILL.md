---
name: design-tokens
description: このプロジェクトのUIを書く・直すときに、色・フォントサイズ・余白・角丸・ボタン・タッチ領域を一元管理された定義から取るためのスキル。style={{...}} を書く、ボタンやバッジやパネルを追加する、配色やサイズを変える、ダークモード対応をする、駅マーカーやツールチップの見た目を触る、といった作業のときに使う。既存のベタ書きを共通化する作業や、一元管理の状況を点検する作業にも使う。
---

# デザインの一元管理

このプロジェクトは過去に「同じ規則を2箇所に書いて、片方だけ直して不整合が出る」
不具合を繰り返している（入力欄だけ色が変わる、駅アイコンの片方だけタッチ領域が
広がる、ツールチップのバッジだけ塗りつぶしにならない、など）。
UIを触るときは値を直接書かず、下の定義元から取る。

現状の詳しい調査結果は `docs/design-system.md` にある。

## 使う定義元

| 書こうとしているもの | 使うもの | import 元 |
|---|---|---|
| フォントサイズ | `FS.caption`(12) / `body`(14) / `input`・`title`(16) / `heading`(20) / `display`(24) | `src/constants/ui.ts` |
| 角の丸み | `L.r.control`(8) / `card`(12) / `pill`(999) | `src/components/legend/legendStyles.ts` |
| 操作要素の最小サイズ | `TARGET.min`(24) / `TARGET.touch`(44) | `src/constants/ui.ts` |
| ボタン | `<Button theme variant size>` | `src/components/ui/atoms/Button.tsx` |
| 色を持つ切り替え（路線など） | `<Chip color label selected>` | `src/components/ui/atoms/Chip.tsx` |
| アイコンだけのボタン | `<IconButton label icon>` | `src/components/ui/atoms/IconButton.tsx` |
| 画面遷移するボタン | `<LinkButton href>` | `src/components/ui/atoms/LinkButton.tsx` |
| チェック・ラジオの行 | `<Checkbox>` / `<Radio>` | `src/components/ui/atoms/` |
| 選択欄・複数行入力・スライダー | `<Select>` / `<TextArea>` / `<Slider>` | `src/components/ui/atoms/` |
| −／＋の増減行 | `<Stepper>` | `src/components/ui/molecules/Stepper.tsx` |
| 1行入力欄 | `<TextField theme size>` | `src/components/ui/atoms/TextField.tsx` |
| 操作部品の高さ・角丸・余白 | `CONTROL_SIZE[size]`（sm=24px / md=44px） | `src/components/ui/atoms/controlSize.ts` |
| 排他選択のボタン列 | `<SegmentedControl>` | `src/components/ui/molecules/SegmentedControl.tsx` |
| 出発/到着/primary の色 | `SEMANTIC.departure` / `arrival` / `primary` | `src/constants/ui.ts` |
| 白・黒 | `NEUTRAL.white` / `NEUTRAL.black`、半透明は `alphaWhite()` / `alphaBlack()` | `src/constants/ui.ts` |
| 文字色・背景・境界線 | `getThemeColors(theme)` | `src/contexts/ThemeContext.tsx` |
| 色の上に文字を載せる | `filledLabelColors(color, theme)` | `src/utils/contrast.ts` |
| 色付きの小ラベル | `<ColorChip color=... theme=... />` | `src/components/ui/ColorChip.tsx` |
| 選択できるカード・行 | `selectableCard(colors, { selected, accent })` | `src/components/legend/legendStyles.ts` |
| 色を薄く背景に敷く | `tintColor(color, alpha)` | `src/utils/contrast.ts` |
| 地図上の駅ラベルの寸法 | `stationLabelBox` | `src/components/RailwayMap.tsx` |
| 余白・角丸 | `L.sp` / `L.r` | `src/components/legend/legendStyles.ts` |
| 路線色 | `routeColors[routeKey]` + `adjustRouteColorForTheme` | `src/data/routes.ts` |

## 禁止

- `fontSize: '12px'` のような数値の直書き → `FS.caption`。**12px未満は作らない**
  （Apple HIG / Material / GOV.UK のいずれも12pxが下限。例外はふりがなのルビのみ）
- `#4CAF50`(出発) `#F44336`(到着) `#2196F3`(primary) の直書き → `SEMANTIC.*` を使う。
  `rgba(76,175,80,0.12)` のように同じ色をrgbaで書き直すのも禁止 → `tintColor(SEMANTIC.departure, 0.12)`。
  `tests/unit/constants/semanticColors.test.ts` が `constants/ui.ts` 以外での出現を落とす
- `color: '#fff'` / `'white'` / `backgroundColor: '#333'` の直書き → `getThemeColors(theme)`。
  塗った色の上の文字は `colors.onPrimary`。テーマではなく下の色で決まる白だけ `NEUTRAL.white`。
  `tests/unit/constants/semanticColors.test.ts` が直書きを落とす
- `<button>` `<input>` にインラインstyleで色や寸法を書く
  → `ui/atoms/` の `Button` / `Chip` / `TextField` を使い、`variant` / `size` で指定する
- 同じ行・同じグループに並ぶ操作で `size` を変える → 高さが揃わない。パネル単位で1つに決める
- アトムがアプリの概念（路線・駅）を知る → props で受け取る。層の判定は
  「路線」「駅」という語をその部品から消せるかで決める（消せないなら organism）
- 自前でのコントラスト判定（`theme === 'dark' ? white : black` のような分岐）
  → `filledLabelColors()`。この分岐は3箇所に重複していて実際に不整合が出た

## 寸法を揃える

見た目の状態を変えるときに**要素の外形が変わってはいけない**。並びがずれる。

- 選択・強調は**枠線の太さではなく、色と背景**で示す。
  枠線の太さは固定し、非選択時は `transparent` にして場所だけ確保する
- 大きさを明示する要素には `box-sizing: border-box` を付けて枠線を寸法に含める
- 同じ種類のものは同じ寸法にする。強調したいなら大きさではなく**背景色**を変える
  （地図の出発・到着駅がこれ。以前は他の駅より大きくて高さが揃っていなかった）

```ts
// ✗ 選択で外形が2px変わる
border: isSelected ? '2px solid #2196F3' : '1px solid #ccc'

// ✓ 太さは固定、色と背景で示す
...selectableCard(colors, { selected: isSelected })
```

## 判断のしかた

**同じ値・同じ規則を2箇所目に書こうとしたら、書く前に共通化する。**
1箇所目は直書きでよい。2箇所目が出た時点が切り出す時。

切り出し先の選び方:
- 色や寸法の**値** → `src/constants/ui.ts` の定数
- 値の**決め方**（分岐やコントラスト計算） → `src/utils/` の関数
- 見た目を持つ**部品** → `src/components/ui/` のコンポーネント

## モバイルで守ること

- 操作要素は最低 `TARGET.min`(24px) 四方。指で押すものは `TARGET.touch`(44px) を目標。
  ただし測る対象は「タップできる範囲」であって見た目の大きさではない。
  チェックボックスのように大きなラベル行の中に置くものは、行の方が基準を満たしていれば
  入力欄自体を大きくしなくてよい（大きくすると白い四角が目立って逆効果）
- テキスト入力欄は `FS.input`(16px) を下回らせない
  （iOS Safari が16px未満の入力欄でページを自動拡大するため）
- 見た目を変えずに当たり判定だけ広げたいときは透明な padding で包む
  （`RailwayMap.tsx` の `withTouchPadding` が実例）

## 変更後の確認

1. `npm run test:types` / `npm run test:unit` / `npm run build` を通す（CLAUDE.mdの必須手順）
2. 見た目が変わる変更は、ライト/ダーク両方とモバイル幅(390px)で確認する
3. 一元管理の状況を数え直したいときは `scripts/audit-design-tokens.mjs` を実行する

```bash
node scripts/audit-design-tokens.mjs
```

ベタ書きの箇所数・種類数・ファイル別の偏り・タッチ領域違反を出力する。
`docs/design-system.md` の数字はこのスクリプトの出力を元にしている。
数字を更新したときは同ファイルの表も更新する。
