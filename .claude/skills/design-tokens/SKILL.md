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
| フォントサイズ | `FS.sectionTitle` / `base` / `label` / `helper` / `tiny` / `micro` / `input` | `src/constants/ui.ts` |
| 操作要素の最小サイズ | `TARGET.min`(24) / `TARGET.touch`(44) | `src/constants/ui.ts` |
| 文字色・背景・境界線 | `getThemeColors(theme)` | `src/contexts/ThemeContext.tsx` |
| 色の上に文字を載せる | `filledLabelColors(color, theme)` | `src/utils/contrast.ts` |
| 色付きの小ラベル | `<ColorChip color=... theme=... />` | `src/components/ui/ColorChip.tsx` |
| 余白・角丸 | `L.sp` / `L.r` | `src/components/legend/legendStyles.ts` |
| 路線色 | `routeColors[routeKey]` + `adjustRouteColorForTheme` | `src/data/routes.ts` |

## 禁止

- `fontSize: '12px'` のような数値の直書き → `FS.label`
- `#4CAF50`(出発) `#F44336`(到着) `#2196F3`(primary) の直書き → 意味付きの定数を使う。
  定数がまだ無ければ `src/constants/ui.ts` に追加してから使う
- `color: '#fff'` / `backgroundColor: '#333'` の直書き → `getThemeColors(theme)`
- 自前でのコントラスト判定（`theme === 'dark' ? white : black` のような分岐）
  → `filledLabelColors()`。この分岐は3箇所に重複していて実際に不整合が出た

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
