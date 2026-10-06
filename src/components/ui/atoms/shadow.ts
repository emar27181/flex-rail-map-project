/**
 * 影（ドロップシャドウ）と文字の縁取り（ハロー）の規格。影はすべてここから取る。
 *
 * **方針: 影は付けない（2026-10-06 ユーザー決定）。** 所要時間の丸・駅ラベル・浮かぶボタンなどに
 * 場所ごとに影を書いていて、濃さ・広がりがばらばらだった。役割ごとに `enabled` を持たせ、
 * 戻すときは下の SHADOW のその役割を `enabled: true` にするだけでよい（呼び出し側は直さない）。
 *
 * 影ではないもの（ここで消さない）:
 * - 文字の縁取り（TEXT_HALO）: 明るい路線色の上の白字を読めるようにするためのもの。既定でオン
 * - 広がりだけの輪（`0 0 0 2px 色`）: 駅の二重・三重枠や現在地の縁取り。枠線の一種なので各所に残す
 */
import { getThemeColors } from '../../../contexts/ThemeContext';
import { alphaBlack } from '../../../constants/ui';

/**
 * 影の役割。
 * - marker: 地図の上の印（駅ラベル・駅の点・所要時間の丸・現在地・列車の向き）
 * - floating: 地図の上に浮かぶ箱・ボタン（floatingSurface.ts）
 * - raised: ページに置くバー・カード（ナビゲーション・広告・候補ルート・記事の囲み）
 * - overlay: 画面を覆うメニュー・ポップアップ・お知らせ
 */
export type ShadowRole = 'marker' | 'floating' | 'raised' | 'overlay';

export interface ShadowSpec {
  /** false のとき影を付けない（'none' を返す） */
  enabled: boolean;
  /** 下へのずれ(px) */
  offsetY: number;
  /** ぼかし(px) */
  blur: number;
  /** 濃さ: normal は colors.shadow、heavy は colors.shadowHeavy */
  strength: 'normal' | 'heavy';
}

/** 影の一覧。値を変えるときはここだけを直す */
export const SHADOW: Record<ShadowRole, ShadowSpec> = {
  marker:   { enabled: false, offsetY: 1, blur: 3,  strength: 'heavy' },
  floating: { enabled: false, offsetY: 2, blur: 8,  strength: 'normal' },
  raised:   { enabled: false, offsetY: 2, blur: 6,  strength: 'normal' },
  overlay:  { enabled: false, offsetY: 4, blur: 16, strength: 'normal' },
};

export interface ShadowOptions {
  /** 上向きに落とす（画面の下端に貼り付くバーなど） */
  upward?: boolean;
  /** 影の色を変える（選択中のカードを主操作の色でにじませるなど） */
  color?: string;
}

/** 有効・無効によらず、指定どおりの影の CSS 値を作る（テストと SHADOW の確認用） */
export function buildShadow(spec: ShadowSpec, theme: 'light' | 'dark', options: ShadowOptions = {}): string {
  const colors = getThemeColors(theme);
  const color = options.color ?? (spec.strength === 'heavy' ? colors.shadowHeavy : colors.shadow);
  const y = options.upward ? -spec.offsetY : spec.offsetY;
  return `0 ${y}px ${spec.blur}px ${color}`;
}

/** 役割の影（box-shadow の値）。無効なら 'none' */
export function shadow(role: ShadowRole, theme: 'light' | 'dark', options?: ShadowOptions): string {
  const spec = SHADOW[role];
  return spec.enabled ? buildShadow(spec, theme, options) : 'none';
}

/** filter: drop-shadow(...) の値。無効なら 'none'（SVG や三角形のように形どおりの影が要るもの） */
export function dropShadowFilter(role: ShadowRole, theme: 'light' | 'dark'): string {
  const spec = SHADOW[role];
  return spec.enabled ? `drop-shadow(${buildShadow(spec, theme)})` : 'none';
}

/**
 * 輪（広がりだけの縁取り）と影を1つの box-shadow にまとめる。
 * 'none' や空は除き、何も残らなければ 'none'（`輪, none` は不正な値になるため）。
 */
export function joinShadows(...parts: (string | undefined | null | false)[]): string {
  const kept = parts.filter((p): p is string => !!p && p !== 'none');
  return kept.length > 0 ? kept.join(', ') : 'none';
}

/**
 * 文字の縁取り（text-shadow）。影ではなく可読性のためのものなので既定でオン。
 * - strong: 路線色で塗った駅ラベル・チップの白字（黄色など明るい色の上）
 * - soft: 数値や記号に添える弱い縁取り
 */
export const TEXT_HALO = {
  enabled: true,
  strong: `0 0 2px ${alphaBlack(0.95)}, 0 1px 2px ${alphaBlack(0.9)}`,
  soft: `0 0 3px ${alphaBlack(0.55)}, 0 0 1px ${alphaBlack(0.4)}`,
} as const;

/** 文字の縁取りの値。無効なら undefined（style にそのまま渡せる） */
export function textHalo(strength: 'strong' | 'soft' = 'strong'): string | undefined {
  return TEXT_HALO.enabled ? TEXT_HALO[strength] : undefined;
}

/** HTML 文字列に埋め込む用の `text-shadow:...;`（無効なら空文字） */
export function textHaloCss(strength: 'strong' | 'soft' = 'strong'): string {
  const v = textHalo(strength);
  return v ? `text-shadow:${v};` : '';
}
