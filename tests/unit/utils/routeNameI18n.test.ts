/**
 * 路線名が翻訳されずに画面へ出ていないかの検査。
 *
 * routeTranslations 側の網羅は translation.test.ts が見ているが、
 * 呼び出し側が translateRoute を通し忘れると英語表示でも日本語のまま出る。
 * 実際に地図の路線ツールチップ（表示中・非表示の2種）と地図上の路線切替
 * リスト、経路推薦の路線名が日本語のままになっていた。
 *
 * JSX へ直接 {routeNames[...]} を埋め込んでいる箇所を検出する。
 * 子コンポーネントへ prop として渡す形（routeName={routeNames[...]}）は
 * 受け取り側で translateRoute を通していれば正しいので、許可リストで除く。
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, statSync, readFileSync } from 'fs';
import { join, relative } from 'path';

const SRC = join(process.cwd(), 'src');

/** 受け取り側が translateRoute を通しているため素通しでよい箇所 */
const ALLOWED = new Set([
  // RouteToggleItem が label={translateRoute(routeName, language)} で翻訳する
  'src/components/legend/LegendRouteList.tsx:routeName={routeNames[routeKey as RouteKey]}',
]);

function collectTsx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...collectTsx(p));
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

describe('路線名の多言語対応', () => {
  it('JSX に翻訳前の路線名を直接埋め込んでいない', () => {
    const violations: string[] = [];
    for (const file of collectTsx(SRC)) {
      const rel = relative(process.cwd(), file);
      readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
        if (!line.includes('{routeNames[')) return;
        if (line.includes('translateRoute')) return;
        const key = `${rel}:${line.trim()}`;
        if (ALLOWED.has(key)) return;
        violations.push(`${rel}:${i + 1}  ${line.trim()}`);
      });
    }
    expect(violations).toEqual([]);
  });
});
