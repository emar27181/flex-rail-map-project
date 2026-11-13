/** UIモードの拡張で同じ用途の操作部品を増殖させない回帰テスト。
 * 意図した新規UIが必要になったら、まず docs/ui-mode-extension-guide.md と規則表を更新する。
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), 'utf8');

describe('UIモード拡張時の二重操作禁止', () => {
  it('既存の駅検索パネルを1つだけ使い終電専用の別パネル/スライダーを禁止', () => {
    const selector = read('src/components/StationSelector.tsx');
    const map = read('src/components/RailwayMap.tsx');
    expect(selector).toContain("onLastTrainModeChange(!lastTrainModeEnabled)");
    expect(selector).toContain("onDepartureTimeChange(e.target.value)");
    // 到着駅が未選択のときの案内は下の帯（知らせ）で出し、入力欄にはカーソルを移さない
    expect(selector).not.toContain("arrivalRef.current?.querySelector('input')?.focus()");
    expect(selector).not.toContain('<Slider');
    expect(selector).not.toContain('extraContent');
    expect(map.match(/<StationSelector/g)?.length).toBe(3);
    for (const name of ['LastTrainModeControls', 'lastTrainTrialPanel', 'demoPlaying', 'demoInspectedStation']) {
      expect(map, name).not.toContain(name);
    }
    expect(existsSync(join(root, 'src/components/LastTrainModeControls.tsx'))).toBe(false);
    expect(existsSync(join(root, 'src/styles/last-train-demo.css'))).toBe(false);
  });
  it('UIモードのマニュアルがありCLAUDE/AGENTS/デザイン規則から参照できる', () => {
    const path = 'docs/ui-mode-extension-guide.md';
    const manual = read(path);
    expect(manual).toContain('既存の値を一元利用する');
    expect(manual).toContain('追加操作は、必要最小限');
    for (const name of ['CLAUDE.md', 'AGENTS.md', 'docs/design-system.md', '.claude/skills/design-tokens/SKILL.md']) {
      expect(read(name), name).toContain(path);
    }
  });
});
