import { describe, it, expect } from 'vitest';
import {
  DEMO_END, DEMO_START, DEMO_LINES, DEMO_STATIONS,
  availableDemoStations, buildDemoLegs, buildDestinationDemoNetwork, calculateDemoLastTrain, demoEdgeKey,
  formatDemoClock, parseDemoClock, toInputClock, getCurrentDemoClock, type DemoLeg,
} from '../../../src/utils/lastTrainDemo';

describe('終電到達マップ（架空ダイヤPoC）', () => {
  it('深夜24時台も同一営業日の連続した時刻として表示', () => {
    expect(formatDemoClock(23 * 60 + 58)).toBe('23:58');
    expect(formatDemoClock(24 * 60 + 7)).toBe('24:07');
    expect(formatDemoClock(25 * 60 + 30)).toBe('25:30');
  });

  it('通常の時刻入力と終電スライダーは現在時刻と深夜24時以降で同期する', () => {
    expect(parseDemoClock('21:42')).toBe(1302);
    expect(parseDemoClock('23:55')).toBe(1435);
    expect(parseDemoClock('00:05')).toBe(1445);
    expect(parseDemoClock('01:30')).toBe(1530);
    expect(parseDemoClock('28:00')).toBeNull();
    expect(toInputClock(25 * 60 + 30)).toBe('01:30');
    expect(getCurrentDemoClock(new Date(2026, 10, 10, 21, 42))).toBe(1302);
    expect(getCurrentDemoClock(new Date(2026, 10, 11, 1, 30))).toBe(1530);
  });

  it('路線データは駅名と駅位置だけを利用し、到達可能路線の試験セットを生成する', () => {
    const legs = buildDemoLegs();
    expect(legs.length).toBeGreaterThan(100);
    expect(DEMO_STATIONS.some(st => st.name === '渋谷')).toBe(true);
    expect(DEMO_STATIONS.some(st => st.name === '横浜')).toBe(false);
    expect(legs.every(leg => leg.arrive > leg.depart)).toBe(true);
    expect(DEMO_LINES.map(line => line.id)).toEqual(['yamanote', 'chuo', 'keihin']);
    expect(demoEdgeKey('yamanote', '東京', '神田')).toBe('yamanote:東京→神田');
  });

  it('路線図にある任意の到着駅から接続路線を試験計算し、収録路線の全駅を省略しない', () => {
    const station = '藤沢';
    const result = buildDestinationDemoNetwork(station);
    expect(result.lines.length).toBeGreaterThan(0);
    expect(result.lines.length).toBeLessThanOrEqual(30);
    expect(result.lines.some(line => line.stations.some(st => st.name === station))).toBe(true);
    const allStations = new Set(result.lines.flatMap(line => line.stations.map(st => st.name)));
    expect(result.stations.length).toBe(allStations.size);
    for (const name of allStations) {
      expect(result.stations.some(st => st.name === name)).toBe(true);
    }
    expect(result.legs.length).toBeGreaterThan(0);
    const smaller = buildDestinationDemoNetwork(station, 3);
    expect(smaller.lines.length).toBeLessThanOrEqual(3);
    expect(smaller.stations.length).toBe(new Set(smaller.lines.flatMap(line => line.stations.map(st => st.name))).size);
    expect(buildDestinationDemoNetwork('存在しない試験駅').lines).toEqual([]);
  });

  it('相模大野で路線名が変わっても同一の直通デモ便なら乗換0分で新宿までつながる', () => {
    const legs: DemoLeg[] = [
      { from: '藤沢', to: '相模大野', lineId: 'odakyuEnoshimaLine',
        tripId: 'through:odakyu-enoshima:reverse:1420', depart: 1420, arrive: 1440 },
      { from: '相模大野', to: '新宿', lineId: 'odakyuLine',
        tripId: 'through:odakyu-enoshima:reverse:1420', depart: 1440, arrive: 1480 },
      // こちらは相模大野止まり。既存の直通便に接続できないため到達扱いにしない。
      { from: '藤沢', to: '相模大野', lineId: 'odakyuEnoshimaLine',
        tripId: 'line:odakyuEnoshimaLine:1428', depart: 1428, arrive: 1450 },
    ];
    const result = calculateDemoLastTrain(legs, '新宿', 4);
    expect(result.latestDeparture.get('藤沢')).toBe(1420);
    expect(result.feasibleLegs.some(leg => leg.tripId === 'line:odakyuEnoshimaLine:1428')).toBe(false);
    expect(new Set(result.feasibleLegs.map(leg => leg.lineId))).toEqual(
      new Set(['odakyuEnoshimaLine', 'odakyuLine']),
    );
  });

  it('実際の直通運転定義を参照して小田急江ノ島線と小田原線の一体の架空便を生成する', () => {
    const network = buildDestinationDemoNetwork('新宿');
    const keys = network.lines.map(line => line.routeKey);
    expect(keys).toContain('odakyuLine');
    expect(keys).toContain('odakyuEnoshimaLine');
    const trains = network.legs.filter(leg =>
      leg.tripId?.startsWith('through:odakyu-enoshima:reverse:'));
    expect(trains.some(leg => leg.from === '藤沢')).toBe(true);
    const fullTrain = trains.filter(leg => leg.tripId === trains[0].tripId);
    expect(new Set(fullTrain.map(leg => leg.lineId))).toEqual(
      new Set(['odakyuEnoshimaLine', 'odakyuLine']),
    );
    const result = calculateDemoLastTrain(network.legs, '新宿');
    expect(result.latestDeparture.get('藤沢')).toBeDefined();
    expect(result.feasibleLegs.some(leg =>
      leg.lineId === 'odakyuEnoshimaLine'
      && leg.tripId?.startsWith('through:odakyu-enoshima:reverse:'))).toBe(true);
    expect(result.feasibleLegs.some(leg =>
      leg.lineId === 'odakyuLine'
      && leg.tripId?.startsWith('through:odakyu-enoshima:reverse:'))).toBe(true);
  });

  it('別路線への乗換で4分未満なら接続せず、同一路線は継続可能', () => {
    const legs: DemoLeg[] = [
      { from: 'A', to: 'B', lineId: 'red', depart: 1430, arrive: 1438 },
      { from: 'B', to: 'C', lineId: 'blue', depart: 1441, arrive: 1450 },
      { from: 'A', to: 'C', lineId: 'green', depart: 1420, arrive: 1450 },
    ];
    const res = calculateDemoLastTrain(legs, 'C', 4);
    expect(res.latestDeparture.get('B')).toBe(1441);
    expect(res.latestDeparture.get('A')).toBe(1420);
    const sameLine: DemoLeg[] = [
      { from: 'A', to: 'B', lineId: 'red', depart: 1430, arrive: 1438 },
      { from: 'B', to: 'C', lineId: 'red', depart: 1438, arrive: 1447 },
    ];
    expect(calculateDemoLastTrain(sameLine, 'C').latestDeparture.get('A')).toBe(1430);
  });

  it('乗換時間を確保できれば到着駅から前の駅まで最遅出発を逆算', () => {
    const legs: DemoLeg[] = [
      { from: 'A', to: 'B', lineId: 'red', depart: 1430, arrive: 1438 },
      { from: 'B', to: 'C', lineId: 'blue', depart: 1443, arrive: 1452 },
      { from: 'A', to: 'C', lineId: 'green', depart: 1420, arrive: 1450 },
    ];
    const res = calculateDemoLastTrain(legs, 'C', 4);
    expect(res.latestDeparture.get('A')).toBe(1430);
    expect(res.latestDeparture.get('B')).toBe(1443);
    expect(res.latestDeparture.has('C')).toBe(false);
    expect(availableDemoStations(res.latestDeparture, 'C', 1431)).toEqual(['B']);
  });

  it('時刻を進めた場合、到達できる駅の数は増えない', () => {
    for (const destination of ['渋谷', '東京', '新宿', '池袋']) {
      const { latestDeparture } = calculateDemoLastTrain(buildDemoLegs(), destination);
      let previous = Infinity;
      for (let minute = DEMO_START; minute <= DEMO_END; minute += 5) {
        const active = availableDemoStations(latestDeparture, destination, minute);
        expect(active.includes(destination)).toBe(false);
        expect(active.length).toBeLessThanOrEqual(previous);
        previous = active.length;
      }
    }
  });
});
