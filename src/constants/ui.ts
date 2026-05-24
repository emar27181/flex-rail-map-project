/**
 * UI パネル内フォントサイズ規約
 *
 * すべてのコントロールパネル（凡例・駅選択・路線切替）はこの定数を参照すること。
 * インラインで数値リテラルを直接書かない。
 *
 * 階層:
 *   sectionTitle (14px bold) > base (13px) > label (12px)
 *                            > helper (11px) > tiny (10px) > micro (9px)
 */
export const FS = {
  /** パネルセクション見出し (h3 に明示指定。bold 必須) */
  sectionTitle: '14px',
  /** 標準テキスト・入力フィールド・ドロップダウン項目・路線名 */
  base: '13px',
  /** フィールドラベル・小ボタン・折り畳み ▼ */
  label: '12px',
  /** 補助テキスト・説明文・現在地ボタン */
  helper: '11px',
  /** 最小テキスト・バッジ・時刻数字 */
  tiny: '10px',
  /** 極小ラベル */
  micro: '9px',
} as const;
