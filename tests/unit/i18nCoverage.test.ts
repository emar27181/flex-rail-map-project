/**
 * コンポーネントの多言語対応漏れを検出するテスト
 *
 * 過去に起きた問題:
 * - TrainStatusPanel.tsx が language プロパティを一切受け取っておらず、
 *   「路線を検出中」「手動設定」等のUI文言が全て日本語ハードコードだった
 * - 言語切り替えボタンで他の言語にしても、このパネルだけ日本語のまま表示され続けた
 *
 * 検出方法:
 * - src/components 配下の .tsx で、コメントを除いた行に日本語文字を含み、
 *   かつ translateUI / translateStation / translateRoute のいずれも
 *   使っていないファイルを「未対応」として洗い出す
 * - 既知の未対応（デバッグ専用コンポーネント等、判断が必要なもの）は
 *   KNOWN_UNTRANSLATED に列挙し、それ以外の新規混入だけを失敗にする
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const COMPONENTS_DIR = join(process.cwd(), 'src/components');

const JAPANESE = /[぀-ヿ一-鿿]/;
const COMMENT_LINE = /^\s*(\/\/|\/\*|\*|\{\/\*)/;
const I18N_MARKERS = ['translateUI', 'translateStation', 'translateRoute'];

/**
 * 既知の未対応コンポーネント。
 *
 * - CoverageAnalysis.tsx / TrainTypeViewer.tsx: 内部データ定義(路線名マップ等)が
 *   大半で、UI文言そのものは少ない。要判断のため未着手
 * - DataTest.tsx / SimpleMap.tsx: 開発用の動作確認コンポーネント（本番未使用）
 * - DemoMap.tsx: デモ用の固定データ（駅名の座標定義）
 * - MobileBottomPanel.tsx / StickyBottomAd.tsx: aria-label 等の補助文言のみ
 * - map/HeatmapDots.tsx: ツールチップの単位表示のみ
 *
 * 新しいコンポーネントをこのリストに追加する前に、本当に翻訳不要か確認すること。
 */
const KNOWN_UNTRANSLATED = new Set([
  'CoverageAnalysis.tsx',
  'DataTest.tsx',
  'DemoMap.tsx',
  'MobileBottomPanel.tsx',
  'SimpleMap.tsx',
  'StickyBottomAd.tsx',
  'TrainTypeViewer.tsx',
  'map/HeatmapDots.tsx',
]);

function listTsxFiles(dir: string, base = ''): string[] {
  return readdirSync(dir).flatMap((name) => {
    const abs = join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    if (statSync(abs).isDirectory()) return listTsxFiles(abs, rel);
    return name.endsWith('.tsx') ? [rel] : [];
  });
}

function hasUntranslatedJapanese(relPath: string): boolean {
  const text = readFileSync(join(COMPONENTS_DIR, relPath), 'utf-8');
  if (I18N_MARKERS.some((m) => text.includes(m))) return false;

  return text.split('\n').some((line) => {
    if (COMMENT_LINE.test(line)) return false;
    if (line.includes('console.')) return false;
    return JAPANESE.test(line);
  });
}

describe('コンポーネントの多言語対応漏れ', () => {
  it('新規に「日本語ハードコード・翻訳関数未使用」のコンポーネントが増えていない', () => {
    const found = listTsxFiles(COMPONENTS_DIR).filter(hasUntranslatedJapanese);
    const unexpected = found.filter((f) => !KNOWN_UNTRANSLATED.has(f));

    expect(unexpected, `未対応コンポーネント: ${unexpected.join(', ')}`).toEqual([]);
  });

  it('既知リストの項目が実際に存在する（リストの陳腐化防止）', () => {
    const all = new Set(listTsxFiles(COMPONENTS_DIR));
    for (const known of KNOWN_UNTRANSLATED) {
      expect(all.has(known), `${known} が見つからない`).toBe(true);
    }
  });
});
