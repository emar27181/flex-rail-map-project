import { describe, it, expect } from 'vitest';
import { LAST_TRAIN_TIMETABLES } from '../../../src/data/lastTrainTimetables';
import { routes } from '../../../src/data/routes';
import { parseTimetableClock } from '../../../src/utils/lastTrainDemo';

/**
 * 終電モードの実データ（src/data/lastTrainTimetables.ts）の整合性。
 * 今は空なので何も検査しないが、路線を足した瞬間に、駅名・時刻・出典の書き間違いをここで落とす。
 */
describe('終電の実データ（lastTrainTimetables.ts）', () => {
  it('同じ路線を2回書かない', () => {
    const keys = LAST_TRAIN_TIMETABLES.map(t => t.routeKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  for (const timetable of LAST_TRAIN_TIMETABLES) {
    describe(timetable.routeKey, () => {
      const stations = new Set((routes[timetable.routeKey] ?? []).map(st => st.name));

      it('路線データに存在する路線で、出典（名前・URL・確認日）がある', () => {
        expect(stations.size).toBeGreaterThan(0);
        expect(timetable.source.name.trim()).not.toBe('');
        expect(timetable.source.url).toMatch(/^https?:\/\//);
        expect(timetable.source.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      it('列車の id は一意で、2駅以上、駅名は路線データの表記、時刻は書式どおりで進むほど遅くなる', () => {
        const ids = timetable.trips.map(t => t.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const trip of timetable.trips) {
          expect(trip.stops.length, `${trip.id} は2駅以上`).toBeGreaterThanOrEqual(2);
          let previous = -1;
          for (const stop of trip.stops) {
            expect(stations.has(stop.station), `${trip.id}: ${stop.station} が路線データに無い`).toBe(true);
            const minutes = parseTimetableClock(stop.time);
            expect(minutes, `${trip.id}: ${stop.station} の時刻 ${stop.time} の書式`).not.toBeNull();
            expect(minutes!, `${trip.id}: ${stop.station} の時刻が戻っている`).toBeGreaterThanOrEqual(previous);
            previous = minutes!;
          }
        }
      });
    });
  }
});
