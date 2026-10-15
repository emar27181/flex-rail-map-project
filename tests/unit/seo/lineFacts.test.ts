/**
 * 路線ページの title・description・冒頭の文（src/seo/lineFacts.ts と pageText.ts の lineTitle など）。
 *
 * 2026-10 の Search Console で、英語の路線ページ（JR奈良線・京急空港線）は表示されるのにほとんど押されていなかった。
 * title が「All 21 Stations, Transfers and Through Services」で、検索した人が探す「map」や、
 * その路線で行ける観光地（伏見稲荷大社の最寄りの稲荷駅など）が見えなかった。
 * ここでは、データにある事実だけで title が作られ、重複も推測の文言も無いことを確かめる。
 */
import { describe, it, expect } from 'vitest';
import { getSeoModel, SEO_LANGS } from '../../../src/seo/pageModel';
import { SEO_TEXT } from '../../../src/seo/pageText';
import { lineFacts } from '../../../src/seo/lineFacts';

const line = (key: string) => getSeoModel().lines.find(l => l.key === key)!;

describe('路線ページの title・description', () => {
  it('JR奈良線（英語）: 地図であること・両端・観光地の最寄り駅が title に入る', () => {
    const f = lineFacts(line('jrNaraLine'), 'en');
    const title = SEO_TEXT.en.lineTitle(f);
    expect(title).toMatch(/^JR Nara Line Map: \d+ Stations from Kyoto to Nara/);
    expect(title).toContain('Inari for Fushimi Inari Taisha');
    // 直通運転の登録が無い路線では直通の文を出さない
    expect(f.through).toEqual([]);
    expect(SEO_TEXT.en.lineDescription(f)).not.toContain('Through trains');
  });

  it('京急空港線（英語）: 終点の駅名と同じ観光地（羽田空港）は繰り返さず、直通先を書く', () => {
    const f = lineFacts(line('keikyuAirportLine'), 'en');
    expect(f.spots).toEqual([]);
    expect(f.through).toEqual(expect.arrayContaining(['Keikyu Main Line', 'Toei Asakusa Line']));
    expect(SEO_TEXT.en.lineTitle(f)).toMatch(/^Keikyu Airport Line Map: \d+ Stations from .+ to Haneda Airport/);
    expect(SEO_TEXT.en.lineDescription(f)).toContain('Through trains continue onto the Keikyu Main Line, Toei Asakusa Line and other lines.');
  });

  it('札幌市営地下鉄南北線（日本語）: 「路線図」と観光地の最寄り駅が title に入る', () => {
    const title = SEO_TEXT.ja.lineTitle(lineFacts(line('sapporoNambokuLine'), 'ja'));
    expect(title).toMatch(/^札幌市営地下鉄南北線の路線図・駅一覧（麻生〜真駒内・\d+駅）/);
    expect(title).toMatch(/は(大通|すすきの)駅/);
  });

  it('どの言語でも、路線ページの title・description は重複せず、値の抜け（undefined など）が無い', () => {
    for (const lang of SEO_LANGS) {
      const t = SEO_TEXT[lang];
      const facts = getSeoModel().lines.map(l => lineFacts(l, lang));
      const titles = facts.map(f => t.lineTitle(f));
      const descriptions = facts.map(f => t.lineDescription(f));
      expect(new Set(titles).size, `${lang} の title が重複`).toBe(titles.length);
      expect(new Set(descriptions).size, `${lang} の description が重複`).toBe(descriptions.length);
      for (const text of [...titles, ...descriptions, ...facts.map(f => t.lineLede(f))]) {
        expect(text).not.toMatch(/undefined|NaN|\[object/);
      }
    }
  });

  it('観光地名と駅名が同じもの（すすきの・すすきの駅）は書かない', () => {
    const f = lineFacts(line('sapporoNambokuLine'), 'ja');
    expect(f.spots.map(s => s.spot)).toContain('大通公園');
    expect(f.spots.map(s => s.spot)).not.toContain('すすきの');
  });

  it('観光地は touristSpots.ts にあり、その路線の駅が最寄り駅のものだけ', () => {
    for (const l of getSeoModel().lines) {
      const f = lineFacts(l, 'ja');
      const stops = l.stops.map(s => s.station.name);
      for (const s of f.spots) expect(stops).toContain(s.station);
    }
  });
});
