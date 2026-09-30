/**
 * 端末の区分（スマホ・タブレット・PC）の境目。**値はここだけに書く。**
 *
 * 以前は 768（< と <= が混在）・500・480・560・600・620px がファイルごとにばらばらで、
 * 同じ幅でもページによってスマホ扱いになったりならなかったりした。
 *
 * 区分（一般的な Web の区切り: Bootstrap / Tailwind の md=768・lg=1024 と同じ）:
 * - mobile  : 768px 未満。1列、指で押す大きさ（44px）、下から出るパネル、表は行ごとのカード
 * - tablet  : 768〜1023px。2列にできる所は2列、指で押す前提は残す、横のパネルは細め
 * - desktop : 1024px 以上。横にパネル、密度を上げる、ホバーで補足
 *
 * 「指で操作するか」は幅では決めない（大きいタブレット・小さいPCがある）。
 * ホバーの有無・ポインターの細さは MEDIA.touch / MEDIA.mouse（pointer / hover メディア特性）で判断する。
 * 決まりと根拠は docs/design-system.md の「端末ごとの設計」。
 */
export const BREAKPOINT = {
  /** これ以上がタブレット */
  tablet: 768,
  /** これ以上がPC */
  desktop: 1024,
} as const;

export type DeviceClass = 'mobile' | 'tablet' | 'desktop';

export function deviceClassOf(width: number): DeviceClass {
  if (width < BREAKPOINT.tablet) return 'mobile';
  if (width < BREAKPOINT.desktop) return 'tablet';
  return 'desktop';
}

/** CSS のメディアクエリ（TS で CSS を組み立てる所・matchMedia から使う） */
export const MEDIA = {
  mobile: `(max-width: ${BREAKPOINT.tablet - 0.02}px)`,
  tablet: `(min-width: ${BREAKPOINT.tablet}px) and (max-width: ${BREAKPOINT.desktop - 0.02}px)`,
  desktop: `(min-width: ${BREAKPOINT.desktop}px)`,
  /** タブレット以上 */
  notMobile: `(min-width: ${BREAKPOINT.tablet}px)`,
  /** 指で操作する（ホバーできない・ポインターが太い） */
  touch: '(hover: none), (pointer: coarse)',
  /** マウスで操作する */
  mouse: '(hover: hover) and (pointer: fine)',
} as const;
