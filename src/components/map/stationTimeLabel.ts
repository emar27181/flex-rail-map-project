/**
 * 地図の駅ラベルの2行目以降に出す時刻（時刻表示モード）。
 *
 * 通常の駅・種別表示の駅・出発/到着駅の3種類のラベルが、それぞれ別に時刻行の HTML を
 * 組み立てていた。出発・到着駅には時刻が出ず、1駅に1路線分しか出せなかったため、
 * 行の組み立てをここにまとめ、路線が複数あるときは路線色の印を付けて1路線1行で並べる。
 */

export interface StationTimeLine {
  time: string;
  /** 路線が複数あるときの路線色（1路線だけなら付けない） */
  color?: string;
}

/** 時刻1行の高さ（px） */
export const STATION_TIME_LINE_HEIGHT = 12;
/** 路線色の印の直径と、時刻との間隔（px） */
const DOT_SIZE = 6;
const DOT_GAP = 2;

/** 文字列1つ（従来の時刻ラベル）も行の配列として扱う */
export function toTimeLines(label?: string | StationTimeLine[]): StationTimeLine[] {
  if (!label) return [];
  return typeof label === 'string' ? [{ time: label }] : label;
}

/** 印の分を含めた1行の幅（px）。文字幅の見積もりは各ラベルのものを渡す */
export function timeLineWidth(line: StationTimeLine, estimateText: (text: string) => number): number {
  return estimateText(line.time) + (line.color ? DOT_SIZE + DOT_GAP : 0);
}

export function stationTimeLinesHtml(lines: StationTimeLine[], fontSizePx: number): string {
  return lines.map(l => {
    const dot = l.color
      ? `<span style="display:inline-block;width:${DOT_SIZE}px;height:${DOT_SIZE}px;border-radius:999px;background:${l.color};box-shadow:0 0 0 1px rgba(255,255,255,0.85);flex-shrink:0"></span>`
      : '';
    return `<div style="font-size:${fontSizePx}px;line-height:1;margin-top:1px;font-weight:normal;opacity:0.9;display:flex;align-items:center;justify-content:center;gap:${DOT_GAP}px">${dot}${l.time}</div>`;
  }).join('');
}

/**
 * 複数の時刻（"HH:MM"）の平均。路線ごとの時刻を1つにまとめて表示するときに使う。
 * 0時をまたぐ時刻（23:58 と 00:02）でも平均が 00:00 になるよう、最初の時刻からの差で数える。
 */
export function averageTime(times: string[]): string | undefined {
  if (times.length === 0) return undefined;
  const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const base = toMin(times[0]);
  const offsets = times.map(t => {
    let d = toMin(t) - base;
    if (d > 720) d -= 1440;
    if (d < -720) d += 1440;
    return d;
  });
  const avg = ((base + Math.round(offsets.reduce((a, b) => a + b, 0) / offsets.length)) % 1440 + 1440) % 1440;
  return `${String(Math.floor(avg / 60)).padStart(2, '0')}:${String(avg % 60).padStart(2, '0')}`;
}
