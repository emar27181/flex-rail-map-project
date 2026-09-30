/**
 * 記事1本分のデータの形（src/data/articles/{slug}.ts が従う）。
 *
 * 記事は「1記事1ファイル」。タイトル・説明・本文（ブロックの並び）・地図の状態・
 * スクリーンショットの撮り方を、4言語ぶん1つのファイルに値だけで書く。
 * HTML にするのは src/utils/articleRender.ts、画面を撮るのは scripts/capture-article-screenshots.mts。
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
}

/** スクリーンショットの撮り方（言語は撮影スクリプトが4言語ぶん回す） */
export interface ArticleShotSpec {
  /** 地図の状態（maps のキー、または状態そのもの） */
  map?: string | ArticleMapState;
  /** 地図以外のページ（日本語版のパス。他の言語は /en /zh /ko を前に付けて撮る） */
  page?: string;
  /** 駅選択・路線切替のパネルを畳んで地図を広く見せる */
  collapsePanels?: boolean;
  /** 押すボタン（translation.ts の UI 文言のキー） */
  clickUi?: string[];
  /** ページ内で見せる見出し（src/seo/pageText.ts の SEO_TEXT のキー） */
  scrollToHeading?: string;
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
  /** スクリーンショット（shots のキー。別の記事の画像を使うときは article に slug） */
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
  /** この記事のスクリーンショット（キーが画像の名前: /images/articles/{slug}/{key}-{lang}.webp） */
  shots: Record<string, ArticleShotSpec>;
  content: Record<ArticleLang, { meta: ArticleMeta; blocks: ArticleBlock[] }>;
}
