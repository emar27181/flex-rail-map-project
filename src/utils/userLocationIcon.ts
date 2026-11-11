/**
 * 地図の現在地マーカー（青い点）の HTML。
 *
 * 向き（進行方向の扇形）の表示は 2026-11 にオフにした。端末によって向きが合わず（GPS の heading は
 * 歩いているとき以外 null で、取れても大きくずれる）、うまく動いていないと指摘されたため。
 * 戻すときは SHOW_USER_HEADING を true にする（向きの計算・取得はそのまま残してある）。
 */

/** 現在地マーカーに向き（進行方向の扇形）を重ねるか */
export const SHOW_USER_HEADING = false;

export interface UserLocationIconOptions {
  /** 進行方向（度、北が 0）。分からないときは null */
  heading: number | null;
  /** 点の縁の影（shadow() で作ったもの） */
  dotShadow: string;
  /** 向きを重ねるか（既定は SHOW_USER_HEADING） */
  showHeading?: boolean;
}

export function userLocationIconHtml({ heading, dotShadow, showHeading = SHOW_USER_HEADING }: UserLocationIconOptions): string {
  // 向きが取れているときだけ、進行方向を示す矢印を点の上に重ねる。静止中は heading が null になる
  const headingCone = showHeading && heading !== null
    ? `<div data-heading-cone style="position:absolute;left:0;top:0;width:36px;height:36px;transform:rotate(${heading}deg);">
           <div style="position:absolute;left:13px;top:16px;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:14px solid rgba(66,133,244,0.45);"></div>
         </div>`
    : '';
  return `<div style="position:relative;width:36px;height:36px;">
        ${headingCone}
        <div style="
          position:absolute; left:12.5px; top:12.5px;
          width: 11px; height: 11px;
          background: #4285F4;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: ${dotShadow};
        "></div>
      </div>`;
}
