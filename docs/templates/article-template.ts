/**
 * 記事のひな形。src/data/articles/{slug}.ts にコピーして使う（手順は docs/article-writing.md）。
 *
 * - 1記事1テーマ。結論（points 3行）→ まず地図デモ（embed）→ 見出し4つ（起・承・転・結）→ 地図を開くボタン
 * - 1セクションに1つ、このサイトの実際の画面（shot）を iframe で埋め込む。記事の言語の画面が開く
 * - 値だけを書く（計算で組み立てない）。サービス名は {siteName} と書く
 * - 4言語でブロックの並び（種類）を同じにする（テストで確認）
 * - 駅名・路線名の英中韓は translation.ts の訳に合わせる。訳が無い名前は出さない書き方にする
 * - 数字は、このサイトのデータか出典のある公開情報だけ。時点を書く
 */
import type { ArticleSource } from './types';

export const exampleArticle: ArticleSource = {
  // URL になる（/articles/{slug}）。英小文字・数字・ハイフンだけ
  slug: 'example-article',
  publishedDate: '2026-10-01',
  // 関連記事（3本）。記事の最後に出る。ほかのテーマはここで案内し、本文には書かない
  related: ['tokyo-train-map-beginner', 'flex-rail-map-introduction', 'tokyo-sightseeing-routes'],
  // 日本語の検索語（カンマ区切り）
  keywordsJa: '検索語1, 検索語2, 検索語3',

  // 地図の状態。embed / cta の map、shots の map から名前で使う
  // routes は src/data/routes.ts のキー、from/to は路線データの駅名、metric は実データの指標だけ
  maps: {
    main: { routes: ['yamanote', 'ginzaLine'] },
  },

  // 埋め込む画面（本文の { type: 'shot', shot: 'キー' } で使う）
  // 地図: map に状態（center と zoom で見せる範囲を決める。所要時間の表示は travelTimes: true）
  // 地図以外: page に日本語版のパス、anchor に開く位置（ページ内の id）
  shots: {
    'overview': { map: { routes: ['yamanote', 'ginzaLine'], center: [35.69, 139.745], zoom: 12 } },
    // 'station-page': { page: '/stations/shibuya', anchor: 'around-stats' },
    // 'travel-times': { map: { from: '東京', center: [35.68, 139.7], zoom: 11, travelTimes: true } },
  },

  content: {
    ja: {
      meta: {
        // 検索する人が使う言葉を前に。「｜」の後ろで何が分かるかを言う
        title: '〇〇の方法｜〇〇で迷わない',
        // 読者の困りごと → この記事で分かること（2〜3文）
        description: '〇〇で困るのは〇〇だからです。この記事では〇〇を実際の画面で紹介します。',
        category: '初心者ガイド',
        kicker: '初心者ガイド',
        readTime: '読了 約4分',
        tag: '初心者ガイド',
      },
      blocks: [
        // 結論を3行で先に言う
        { type: 'points', items: ['結論1', '結論2', '結論3'] },
        // 説明を読む前に、この記事の主題に合う実際の地図をまず触ってもらう
        { type: 'embed', map: 'main', view: { center: [35.69, 139.745], zoom: 12 }, title: '{siteName}の地図（〇〇を表示した状態）', caption: '実際の地図（〇〇を表示した状態）。枠の中で拡大・移動できます。' },
        // 01 起: なぜ困るのか・よくある間違い
        { type: 'h2', text: '〇〇が分かりにくい理由' },
        { type: 'p', text: '本文。1段落は3〜4文まで。' },
        // 02 承: 基本のやり方（サイトの操作を画面つきで）
        { type: 'h2', text: '〇〇する' },
        { type: 'p', text: '{siteName}の「〇〇」で〇〇します。' },
        { type: 'shot', shot: 'overview', alt: '画面に写っているもの', caption: 'この図で何を見るか（1文）' },
        // 03 転: 見落としやすい点・数字の読み方の注意
        { type: 'h2', text: '〇〇に気をつける' },
        { type: 'p', text: '本文。' },
        // 04 結: 次にやること
        { type: 'h2', text: '〇〇から始める' },
        { type: 'steps', items: ['手順1', '手順2', '手順3'] },
        { type: 'cta', map: 'main', title: '〇〇を表示した地図を開く', text: '〇〇の状態で開きます。' },
      ],
    },
    // en / zh / ko も同じ並びで書く（ここでは省略。実際の記事では4言語そろえないとテストが落ちる）
    en: { meta: { title: '', description: '', category: '', kicker: '', readTime: '', tag: '' }, blocks: [] },
    zh: { meta: { title: '', description: '', category: '', kicker: '', readTime: '', tag: '' }, blocks: [] },
    ko: { meta: { title: '', description: '', category: '', kicker: '', readTime: '', tag: '' }, blocks: [] },
  },
};
