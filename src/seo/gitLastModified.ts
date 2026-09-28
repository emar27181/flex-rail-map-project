/**
 * ページの最終更新日（sitemap の lastmod）を git の履歴から求める。ビルド時だけ使う（Node）。
 *
 * - ページのソース（src/pages/*.astro、動的ルートは [slug].astro など）と、そのページが
 *   （レイアウト・設定・src/seo を経由して）import している src/data のファイルのうち、
 *   最も新しいコミット日を使う
 *   （ガイドや記事の本文はデータファイルにあるため、ページファイルだけでは足りない）
 * - レイアウト・設定（src/layouts, src/config）の変更は数えない。見た目や共通設定を
 *   直すたびに全ページの日付が進み、lastmod が「内容の更新日」でなくなるため
 * - 確かめられない日付は書かない。浅いクローン（shallow clone）では、履歴の境界の
 *   コミットは「そのファイルが最後に変わった日」ではないので、その場合は undefined を返す
 * - 共有データ（guides.ts など複数ページ分の本文を持つファイル）が変わると、
 *   それを使う全ページの日付が進む。ページごとの厳密な更新日は取れないため、
 *   少なくとも「内容が古いのに新しい日付」にはならない側（変更があった日）に寄せている
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const git = (root: string, args: string[]): string | undefined => {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return undefined;
  }
};

/** 浅いクローンの境界コミット（そこから先の履歴が無い）。浅くなければ空 */
function shallowBoundaries(root: string): Set<string> {
  if (git(root, ['rev-parse', '--is-shallow-repository']) !== 'true') return new Set();
  const file = git(root, ['rev-parse', '--git-path', 'shallow']);
  if (!file) return new Set();
  const abs = resolve(root, file);
  return existsSync(abs) ? new Set(readFileSync(abs, 'utf8').split('\n').filter(Boolean)) : new Set();
}

const IMPORT_RE = /import\s[^'"]*['"](\.{1,2}\/[^'"]+)['"]/g;
const CANDIDATE_EXT = ['', '.ts', '.tsx', '.astro', '.js', '.mjs', '/index.ts'];

function resolveImport(fromFile: string, spec: string): string | undefined {
  const base = resolve(dirname(fromFile), spec.split('?')[0]);
  for (const ext of CANDIDATE_EXT) {
    const p = base + ext;
    if (existsSync(p) && !p.endsWith('/')) {
      try { readFileSync(p); return p; } catch { /* ディレクトリ */ }
    }
  }
  return undefined;
}

/** import をたどるディレクトリ（データファイルを見つけるために通る） */
const TRAVERSE_DIRS = ['src/data/', 'src/config/', 'src/layouts/', 'src/pages/', 'src/seo/'];
/** 更新日として数えるディレクトリ（内容そのもの） */
const COUNTED_DIRS = ['src/data/'];

/** ページのソースと、内容（src/data）の import 先（3段まで） */
export function contentSourcesOf(root: string, pageFile: string): string[] {
  const visited = new Set<string>([pageFile]);
  const out = new Set<string>([pageFile]);
  let frontier = [pageFile];
  for (let depth = 0; depth < 3; depth++) {
    const next: string[] = [];
    for (const f of frontier) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(IMPORT_RE)) {
        const r = resolveImport(f, m[1]);
        if (!r) continue;
        const rel = relative(root, r).replace(/\\/g, '/');
        if (!TRAVERSE_DIRS.some(d => rel.startsWith(d)) || visited.has(r)) continue;
        visited.add(r);
        if (COUNTED_DIRS.some(d => rel.startsWith(d))) out.add(r);
        next.push(r);
      }
    }
    frontier = next;
  }
  return [...out];
}

/** src/pages 以下の .astro（_ で始まるものを除く）をサイト内のルートとして列挙 */
function listPageFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      if (name.startsWith('_')) continue;
      const abs = join(dir, name);
      if (statSync(abs).isDirectory()) walk(abs);
      else if (name.endsWith('.astro')) out.push(abs);
    }
  };
  walk(join(root, 'src/pages'));
  return out;
}

/** "src/pages/[...lang]/stations/[slug].astro" → /stations/x・/en/stations/x に一致する正規表現 */
function routePattern(root: string, file: string): RegExp {
  const rel = relative(join(root, 'src/pages'), file).replace(/\\/g, '/').replace(/\.astro$/, '');
  const segs = rel.split('/').filter(s => s !== 'index');
  const body = segs.map(seg => {
    if (/^\[\.\.\.[^\]]+\]$/.test(seg)) return '(?:/.+)?';
    if (/^\[[^\]]+\]$/.test(seg)) return '/[^/]+';
    return '/' + seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }).join('');
  return new RegExp(`^${body || '/'}$`);
}

/**
 * "/about" → src/pages/about.astro など。静的なファイルを優先し、
 * 無ければ動的ルート（[slug].astro など）から探す（見つからなければ undefined）
 */
export function pageSourceFile(root: string, path: string): string | undefined {
  const rel = path === '/' ? 'index' : path.replace(/^\//, '');
  for (const c of [`src/pages/${rel}.astro`, `src/pages/${rel}/index.astro`]) {
    const abs = join(root, c);
    if (existsSync(abs)) return abs;
  }
  const dynamic = listPageFiles(root).filter(f => f.includes('['));
  return dynamic.find(f => routePattern(root, f).test(path));
}

export function createLastModified(root: string): (path: string) => string | undefined {
  const boundaries = shallowBoundaries(root);
  const cache = new Map<string, string | undefined>();
  return (path: string) => {
    if (cache.has(path)) return cache.get(path);
    let result: string | undefined;
    const page = pageSourceFile(root, path);
    if (page) {
      const files = contentSourcesOf(root, page).map(f => relative(root, f));
      const out = git(root, ['log', '-1', '--format=%H %cs', '--', ...files]);
      const [hash, date] = (out ?? '').split(' ');
      if (hash && date && !boundaries.has(hash)) result = date;
    }
    cache.set(path, result);
    return result;
  };
}
