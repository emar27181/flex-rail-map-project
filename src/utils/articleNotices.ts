/**
 * 記事の注意書き（試作・架空のデータ・推定を含む）。
 *
 * 試作の機能や推定の値を使った地図デモを載せる記事には、**必ず**注意書きを付ける。書き忘れを防ぐため、
 * 記事の地図の状態（maps / shots）から必要な注意書きを決め、結論の次（最初の地図デモの直後）に自動で入れる
 * （articleRender.ts の articleBlocksForRender）。本文の途中に足したいときだけ `{ type: 'notice' }` を書く。
 *
 * 決まり（docs/article-writing.md「試作・推定を含む記事」）:
 * - 試作の機能（終電モードなど）→ prototype。架空のデータを含む機能 → fictional
 * - 推定値を含む表示（所要時間は路線データの駅間時間による目安）→ estimated
 * - 文言はここ1か所。記事ごとに言い回しを変えない（言い回しがずれると、どれが試作か読者に伝わらない）
 */
import type { ArticleBlock, ArticleLang, ArticleMapState, ArticleSource } from '../data/articles/types';

export type NoticeKind = Extract<ArticleBlock, { type: 'notice' }>['kind'];
export const NOTICE_KINDS: readonly NoticeKind[] = ['prototype', 'fictional', 'estimated'];

/** モードごとに必要な注意書き（並びは表示の順） */
export const MODE_NOTICE_KINDS: Record<NonNullable<ArticleMapState['mode']>, NoticeKind[]> = {
  'last-train': ['prototype', 'fictional'],
  meeting: ['estimated'],
};
/** 所要時間を出す地図（travelTimes）に必要な注意書き */
export const TRAVEL_TIMES_NOTICE_KINDS: NoticeKind[] = ['estimated'];

export const NOTICE_LABELS: Record<ArticleLang, Record<NoticeKind, string>> = {
  ja: { prototype: '試作機能', fictional: '架空のデータ', estimated: '推定を含みます' },
  en: { prototype: 'Prototype feature', fictional: 'Fictional data', estimated: 'Includes estimates' },
  zh: { prototype: '试验功能', fictional: '虚构数据', estimated: '含估算值' },
  ko: { prototype: '시험 기능', fictional: '가상 데이터', estimated: '추정 포함' },
};

export const NOTICE_TEXTS: Record<ArticleLang, Record<NoticeKind, string>> = {
  ja: {
    prototype: 'この機能は試作です。予告なく変わったり、なくなったりすることがあります。画面の表示や動きは、正式版と異なる場合があります。',
    fictional: '画面に出る終電時刻は、実際のダイヤではなく架空の試験ダイヤから作った値です（時刻に * が付きます）。実際の乗車の判断には使わないでください。',
    estimated: '所要時間は、路線データの駅間時間と乗換のペナルティから出した目安です。実際のダイヤ・遅延・混雑は反映していません。出発前に各社の公式の時刻表・運行情報で確認してください。',
  },
  en: {
    prototype: 'This feature is a prototype. It may change or be removed without notice, and what you see may differ from a final version.',
    fictional: 'The last-train times shown come from a fictional test timetable, not the real timetable (times are marked with *). Do not use them to plan an actual trip.',
    estimated: "Travel times are estimates from the line data (time between stations plus a transfer penalty). They do not reflect actual timetables, delays or crowding. Check each operator's official timetable and service information before you travel.",
  },
  zh: {
    prototype: '此功能为试验版，可能在不另行通知的情况下变更或取消，显示和操作也可能与正式版不同。',
    fictional: '画面上显示的末班车时间来自虚构的测试时刻表，并非实际时刻表（时间后带有 *）。请勿用于实际乘车判断。',
    estimated: '所需时间是根据线路数据中的站间时间和换乘时间估算的，并未反映实际时刻表、延误和拥挤情况。出发前请在各铁路公司的官方时刻表和运行信息中确认。',
  },
  ko: {
    prototype: '이 기능은 시험 버전입니다. 예고 없이 바뀌거나 없어질 수 있으며, 화면과 동작이 정식 버전과 다를 수 있습니다.',
    fictional: '화면에 표시되는 막차 시각은 실제 시각표가 아닌 가상의 시험 시각표로 만든 값입니다(시각에 *가 붙습니다). 실제 이동 판단에는 사용하지 마세요.',
    estimated: '소요 시간은 노선 데이터의 역간 시간과 환승 시간으로 계산한 추정치이며 실제 시각표·지연·혼잡은 반영하지 않습니다. 출발 전에 각 사의 공식 시각표와 운행 정보를 확인하세요.',
  },
};

/** 記事で使っている地図の状態（maps と、shots に直接書いた地図の状態） */
export function articleMapStates(source: ArticleSource): ArticleMapState[] {
  const states = Object.values(source.maps);
  for (const spec of Object.values(source.shots)) {
    if (spec.map && typeof spec.map !== 'string') states.push(spec.map);
  }
  return states;
}

/** その記事に必要な注意書きの種類（表示の順。重複なし） */
export function requiredNoticeKinds(source: ArticleSource): NoticeKind[] {
  const need = new Set<NoticeKind>();
  for (const state of articleMapStates(source)) {
    if (state.mode) MODE_NOTICE_KINDS[state.mode].forEach(k => need.add(k));
    if (state.travelTimes) TRAVEL_TIMES_NOTICE_KINDS.forEach(k => need.add(k));
  }
  return NOTICE_KINDS.filter(k => need.has(k));
}

/** 注意書きの HTML（見た目は article-layout.css の .notice） */
export function noticeHtml(kind: NoticeKind, lang: ArticleLang, extra?: string): string {
  const label = NOTICE_LABELS[lang][kind];
  const text = NOTICE_TEXTS[lang][kind] + (extra ? ` ${extra}` : '');
  return `<aside class="notice notice-${kind}" role="note" data-notice="${kind}"><span class="lbl">${label}</span><p>${text}</p></aside>`;
}
