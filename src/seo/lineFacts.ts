/**
 * 路線ページの title・description・冒頭の文に入れる事実を、路線データ・観光地データから集める。
 * 文の形は pageText.ts（lineTitle / lineDescription / lineLede）、ここは値だけ。
 *
 * - 観光地は「その路線の駅が最寄り駅になっているもの」（touristSpots.ts にあるものだけ。推測で足さない）。
 *   並びは touristSpots.ts に書いた順（title には先頭の1つだけが入る。主な観光地を先に書いてある）
 * - 路線の端の駅名にすでに含まれる観光地（京急空港線の終点「羽田空港第1・第2ターミナル」と観光地「羽田空港」など）は、
 *   同じことを2回言うだけなので出さない。観光地名と駅名が同じもの（すすきの・すすきの駅）も同じ理由で出さない
 */
import { routeName, stationName, type SeoLang, type SeoLine } from './pageModel';
import { SEO_TEXT, type LineFacts } from './pageText';
import { TOURIST_SPOTS } from '../data/touristSpots';

export function lineFacts(line: SeoLine, lang: SeoLang): LineFacts {
  const t = SEO_TEXT[lang];
  const from = stationName(line.stops[0].station, lang);
  const to = stationName(line.stops[line.stops.length - 1].station, lang);
  const ends = [line.stops[0].station.name, line.stops[line.stops.length - 1].station.name];
  const endsText = `${from} ${to} ${ends.join(' ')}`;
  const seen = new Set<string>();
  const found: Array<{ order: number; spot: string; station: string }> = [];
  for (const stop of line.stops) {
    for (const spot of stop.station.touristSpots) {
      if (seen.has(spot.id)) continue;
      seen.add(spot.id);
      const spotText = t.spotName(spot);
      const station = stationName(stop.station, lang);
      if (endsText.includes(spotText) || endsText.includes(spot.name.ja) || spotText === station) continue;
      found.push({ order: TOURIST_SPOTS.indexOf(spot), spot: spotText, station });
    }
  }
  const spots = found.sort((a, b) => a.order - b.order).map(({ spot, station }) => ({ spot, station }));
  const through = [...new Set(line.throughPartners.flat())].map(r => routeName(r, lang));
  return {
    name: routeName(line.key, lang),
    n: line.stops.length,
    from,
    to,
    transfers: line.stops.filter(s => s.station.effectiveLines >= 2).length,
    through,
    spots,
  };
}
