/**
 * 記事1本分のデータの形（src/data/articles/{slug}.ts が従う）。
 *
 * 記事は「1記事1ファイル」。タイトル・説明・本文（ブロックの並び）・地図の状態・
 * 埋め込む画面（shots）を、4言語ぶん1つのファイルに値だけで書く。
 * HTML にするのは src/utils/articleRender.ts。shots は記事の中に実際の画面として iframe で埋め込む
 * （2026-10: スクリーンショットは小さくて読みにくかったため置き換えた）。
 * 書き方の決まりは docs/article-writing.md、ひな形は docs/templates/article-template.ts。
 */
import type { RouteKey } from '../routes';
import type { StationStats } from '../stationStats';
import type { ColumnKind } from '../../components/ui/atoms/responsiveTable';

export type ArticleLang = 'ja' | 'en' | 'zh' | 'ko';

/** 地図の状態（mapDeepLink.ts の buildMapHref にそのまま渡す。言語・埋め込みは描画側で付ける） */
export interface ArticleMapState {
  routes?: RouteKey[];
  /** 出発駅・到着駅（日本語の駅名。路線データの表記に合わせる） */
  from?: string;
  to?: string;
  /** ヒートマップの指標（実データの指標だけ） */
  metric?: keyof StationStats;
  center?: [number, number];
  zoom?: number;
  /** 駅間の所要時間を開いたときから出す */
  travelTimes?: boolean;
}

/** 埋め込む画面。記事の言語の画面を iframe で開く（articleRender.ts の shotEmbedSrc） */
export interface ArticleShotSpec {
  /** 地図の状態（maps のキー、または状態そのもの） */
  map?: string | ArticleMapState;
  /** 地図以外のページ（日本語版のパス。他の言語は /en /zh /ko を前に付けて開く） */
  page?: string;
  /** 以前の撮影スクリプト用（埋め込み表示はパネルを畳んで始まるので使わない） */
  collapsePanels?: boolean;
  /** 以前の撮影スクリプト用。埋め込みでは押せないので、見せたい状態は map の値（travelTimes など）で書く */
  clickUi?: string[];
  /** 以前の撮影スクリプト用。埋め込みで開く位置は anchor で書く */
  scrollToHeading?: string;
  /** 埋め込むときに開く位置（ページ内の id。駅・路線のページの節の id） */
  anchor?: string;
}

export type ArticleBlock =
  /** 冒頭の結論（3行） */
  | { type: 'points'; items: string[] }
  /** 見出し（番号は自動で 01, 02… と付く） */
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  /** 番号付きの手順 */
  | { type: 'steps'; items: string[] }
  /** 表。kinds で列の種類（ui/atoms/responsiveTable.ts）。省略時は1列目が見出し、ほかは文章 */
  | { type: 'table'; head: string[]; rows: string[][]; kinds?: ColumnKind[] }
  /** 使う場面のカード */
  | { type: 'uses'; items: { title: string; text: string }[] }
  /** 実際の画面の埋め込み（shots のキーの状態を iframe で見せる。別の記事の shots を使うときは article に slug）。
   *  alt は iframe の title（何の画面か）、caption は下に添える説明 */
  | { type: 'shot'; shot: string; article?: string; alt: string; caption: string }
  /** 実際の地図の埋め込み（maps のキー。view で開く範囲を決める） */
  | { type: 'embed'; map: string; view?: { center: [number, number]; zoom: number }; title: string; caption: string }
  /** 地図を開くボタン（maps のキー） */
  | { type: 'cta'; map: string; title: string; text: string }
  /** 上の型で書けない図（初心者記事の操作できる図など）。新しく使う前に型を足せないか考える */
  | { type: 'html'; html: string };

export interface ArticleMeta {
  title: string;
  description: string;
  category: string;
  kicker: string;
  readTime: string;
  tag: string;
}

export interface ArticleSource {
  slug: string;
  publishedDate: string;
  /** 本文を実際に直した日だけ書く */
  modifiedDate?: string;
  /** 記事の最後に出す関連記事（3本） */
  related: string[];
  /** 日本語の meta keywords */
  keywordsJa: string;
  /** 地図の状態（本文の embed / cta と、撮影の map から名前で参照する） */
  maps: Record<string, ArticleMapState>;
  /** この記事で埋め込む画面（本文の { type: 'shot', shot: キー } から使う） */
  shots: Record<string, ArticleShotSpec>;
  content: Record<ArticleLang, { meta: ArticleMeta; blocks: ArticleBlock[] }>;
}
