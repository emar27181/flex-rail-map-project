/**
 * 終電モード用の「実際の終電・最終列車の時刻」の置き場。
 *
 * 【編集する前に `docs/data-editing-guide.md` の「終電の時刻（lastTrainTimetables.ts）」を読むこと】
 *
 * 現在は空。終電モードの時刻は、ここに実データが無い路線では架空のデモダイヤ
 * （`utils/lastTrainDemo.ts` の buildDemoLegs）で、駅名の下の時刻に「*」が付く。
 * ここに路線を足すと、その路線だけ実データに切り替わり、「*」が消える（アプリ側の変更は不要）。
 *
 * 書くときの決まり:
 * - 推測で書かない。公式の時刻表・終電案内で確認できた列車だけを書く。出典（名前・URL・確認日）は必須
 * - 駅名は路線データ（`src/data/<路線>.ts`）の表記に合わせる。列車は進行方向の順に駅を並べる
 * - 時刻は "HH:MM"。日付をまたぐ時刻は 24:10 のように24以上で書く（深夜0時台は 24:xx）
 * - 値だけを書く（計算で組み立てない）
 * - 全列車を書く必要はない。終電に近い数本（乗換の判定に足りる範囲）でよい。書いていない時間帯は「列車なし」として扱う
 * - 検証は `npm run test:data`（tests/unit/data/lastTrainTimetables.test.ts）
 */
import type { RouteKey } from './routes';

/** 列車が停まる駅と、その駅を出る時刻（終点は着く時刻） */
export interface LastTrainStop {
  station: string;
  /** "HH:MM"。日付をまたぐときは 24:10 のように24以上 */
  time: string;
}

export interface LastTrainTrip {
  /** 路線の中で一意な列車の名前（例: '下り-最終'）。同じ列車は同じ id でつなぐ */
  id: string;
  /** 進行方向の順に並べた停車駅（2駅以上） */
  stops: LastTrainStop[];
}

export interface LastTrainSource {
  name: string;
  url: string;
  /** 確認日 YYYY-MM-DD */
  retrievedAt: string;
}

export interface LineLastTrainTimetable {
  routeKey: RouteKey;
  source: LastTrainSource;
  trips: LastTrainTrip[];
}

/** 実データのある路線。空のあいだは、すべて架空のデモダイヤ */
export const LAST_TRAIN_TIMETABLES: LineLastTrainTimetable[] = [];
