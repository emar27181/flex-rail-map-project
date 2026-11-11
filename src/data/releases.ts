/**
 * サイトのバージョンと更新履歴（設定パネルのいちばん下「バージョン」に出す）。
 *
 * **編集する前に docs/release-process.md を読むこと。**
 *
 * - 新しい順に並べる。先頭がいま公開している（これから公開する）バージョン
 * - 番号の付け方: 1.0.0 は最初に PR でまとめて公開した版（PR #1, 2026-05-24）。
 *   新しい機能を含むリリースは真ん中（1.x.0）、修正・改善・文書だけのリリースは右端（1.x.y）を1つ上げる。
 *   2026-11 に、それまでに main へ入った PR（1つ = 1リリース）の種類から番号を振り直した
 * - releasedAt は main に入った時刻（GitHub の merged_at, UTC）。まだ main に入っていない版は null にし、
 *   画面ではそのビルドの時刻を出す。次のリリースを用意するときに、main に入った時刻で埋める
 * - notes は画面に出す短い説明。日本語（ja）と英語（en）を書く（中国語・韓国語の画面では英語を出す）。推測で書かない
 * - データファイルなので値だけを書く（計算で組み立てない）
 */

export type ReleaseKind = 'feat' | 'improve' | 'fix' | 'data' | 'docs' | 'ci';

export interface Release {
  /** バージョン番号（major.minor.patch） */
  version: string;
  /** main に入った時刻（ISO 8601, UTC）。まだ入っていなければ null */
  releasedAt: string | null;
  /** いちばん大きい変更の種類。'feat' なら真ん中の番号を上げる */
  kind: ReleaseKind;
  /** このリリースに入った PR の番号 */
  prs: number[];
  /** 画面に出す変更点 */
  notes: { ja: string[]; en: string[] };
}

export const RELEASES: Release[] = [
  {
    version: '1.34.0',
    releasedAt: null,
    kind: 'feat',
    prs: [104, 105, 107, 108, 112, 113, 114],
    notes: {
      ja: [
        '設定のいちばん下にバージョンと更新履歴、更新の確認',
        '地図の線をタップして路線を切り替えたら、路線名を画面の下に1行で知らせる',
        '路線の一覧を、全部ではなく少しずつ広げる「さらに表示」に',
        '凡例を開いた状態で始める',
        'スマホで2本指の操作（拡大・縮小・回転）が止まる・カクつくのを修正。少しひねっただけでは回らない',
        '現在地の向き（進行方向の扇形）の表示をやめる',
        'アプリ化の企画書・仕様書（画面の変更なし）',
      ],
      en: [
        'Version, update history and update check at the bottom of the settings',
        'A one-line notice with the line name when you tap a line on the map to toggle it',
        'Line lists grow a little at a time with "Show more" instead of all at once',
        'The legend starts open',
        'Two-finger zoom and rotate on phones no longer freezes or stutters; a small twist no longer rotates the map',
        'The current location no longer shows a heading cone',
        'App plan and specification (no visible changes)',
      ],
    },
  },
  { version: '1.33.6', releasedAt: '2026-11-09T13:20:34Z', kind: 'improve', prs: [103], notes: { ja: ["広告は決めた位置にだけ出し、自動広告・全画面広告を出さない"], en: ["Ads only in chosen spots; no auto or full-screen ads"] } },
  { version: '1.33.5', releasedAt: '2026-11-09T13:09:15Z', kind: 'improve', prs: [102], notes: { ja: ["路線の切り替えパネルの見出しをなくし、余白で区切る"], en: ["Line switcher groups separated by spacing instead of headings"] } },
  { version: '1.33.4', releasedAt: '2026-11-04T21:57:59Z', kind: 'fix', prs: [100], notes: { ja: ["スマホで地図の線をタップしても路線が切り替わらない問題を修正"], en: ["Fix tapping a line on phones not toggling it"] } },
  { version: '1.33.3', releasedAt: '2026-11-04T21:46:59Z', kind: 'ci', prs: [101], notes: { ja: ["テスト環境の修正（画面の変更なし）"], en: ["Fix test environment (no visible changes)"] } },
  { version: '1.33.2', releasedAt: '2026-10-19T04:51:54Z', kind: 'improve', prs: [98], notes: { ja: ["画像検索で見つかりやすく"], en: ["Easier to find in image search"] } },
  { version: '1.33.1', releasedAt: '2026-10-19T04:44:07Z', kind: 'ci', prs: [99], notes: { ja: ["プレビューの作り方を変更（画面の変更なし）"], en: ["Change how previews are built (no visible changes)"] } },
  { version: '1.33.0', releasedAt: '2026-10-19T04:36:32Z', kind: 'feat', prs: [91], notes: { ja: ["メニューから記事一覧へ"], en: ["Article list from the menu"] } },
  { version: '1.32.1', releasedAt: '2026-10-19T01:56:33Z', kind: 'improve', prs: [97], notes: { ja: ["路線の絞り込み・記事の共有をアクセス解析で数える"], en: ["Measure line filters and article shares in analytics"] } },
  { version: '1.32.0', releasedAt: '2026-10-19T01:56:13Z', kind: 'feat', prs: [96], notes: { ja: ["路線ページと関連記事を相互リンク"], en: ["Links between line pages and related articles"] } },
  { version: '1.31.1', releasedAt: '2026-10-19T01:55:34Z', kind: 'improve', prs: [95], notes: { ja: ["記事のタイトル・説明文を改善"], en: ["Better article titles and descriptions"] } },
  { version: '1.31.0', releasedAt: '2026-10-18T11:30:07Z', kind: 'feat', prs: [90], notes: { ja: ["今の表示のまま地図をコピーして共有"], en: ["Copy and share the map as currently shown"] } },
  { version: '1.30.2', releasedAt: '2026-10-18T07:34:41Z', kind: 'improve', prs: [94], notes: { ja: ["記事の広告をコンパクトに"], en: ["Compact article ads"] } },
  { version: '1.30.1', releasedAt: '2026-10-18T06:50:29Z', kind: 'docs', prs: [93], notes: { ja: ["運用手順と検索結果のアイコン"], en: ["Operation guides and search result icon"] } },
  { version: '1.30.0', releasedAt: '2026-10-18T06:00:17Z', kind: 'feat', prs: [92], notes: { ja: ["地図の情報ボタンから記事・使い方へ"], en: ["Articles and how-to from the map info button"] } },
  { version: '1.29.3', releasedAt: '2026-10-16T22:02:04Z', kind: 'docs', prs: [88], notes: { ja: ["出典とクレジットの方針（画面の変更なし）"], en: ["Source and credit policy (no visible changes)"] } },
  { version: '1.29.2', releasedAt: '2026-10-16T13:39:13Z', kind: 'docs', prs: [87], notes: { ja: ["今後の予定を追加（画面の変更なし）"], en: ["Add plans (no visible changes)"] } },
  { version: '1.29.1', releasedAt: '2026-10-16T13:32:24Z', kind: 'improve', prs: [85], notes: { ja: ["記事の広告を1つに減らす"], en: ["One ad per article"] } },
  { version: '1.29.0', releasedAt: '2026-10-16T13:32:08Z', kind: 'feat', prs: [86], notes: { ja: ["出発駅を選ぶと累積所要時間を表示"], en: ["Show cumulative travel time after choosing a departure"] } },
  { version: '1.28.2', releasedAt: '2026-10-16T08:46:42Z', kind: 'fix', prs: [76], notes: { ja: ["英語で文字が切れていた4か所を修正"], en: ["Fix 4 places where English text was cut off"] } },
  { version: '1.28.1', releasedAt: '2026-10-16T07:14:12Z', kind: 'improve', prs: [84], notes: { ja: ["記事・ガイド・駅/路線ページでも Cookie の確認"], en: ["Cookie consent on articles, guides and station/line pages"] } },
  { version: '1.28.0', releasedAt: '2026-10-16T04:21:55Z', kind: 'feat', prs: [83], notes: { ja: ["記事に広告枠"], en: ["Ad slots in articles"] } },
  { version: '1.27.0', releasedAt: '2026-10-16T03:44:26Z', kind: 'feat', prs: [81], notes: { ja: ["訪日観光客向けの鉄道ガイド30本"], en: ["30 railway guides for visitors to Japan"] } },
  { version: '1.26.0', releasedAt: '2026-10-15T15:56:22Z', kind: 'feat', prs: [79], notes: { ja: ["記事と地図デモの仕組み、記事「駅番号の読み方」"], en: ["Article and map demo system; article on reading station numbers"] } },
  { version: '1.25.7', releasedAt: '2026-10-15T15:50:29Z', kind: 'docs', prs: [74], notes: { ja: ["観光客向けガイドの企画を追加（画面の変更なし）"], en: ["Add guide plans for visitors (no visible changes)"] } },
  { version: '1.25.6', releasedAt: '2026-10-15T15:37:15Z', kind: 'data', prs: [75], notes: { ja: ["江ノ電・世田谷線の駅番号を追加"], en: ["Station numbers for Enoden and Setagaya Line"] } },
  { version: '1.25.5', releasedAt: '2026-10-15T15:36:32Z', kind: 'data', prs: [78], notes: { ja: ["山手線の駅番号を東京 JY01 起点に修正"], en: ["Yamanote Line station numbers start at Tokyo JY01"] } },
  { version: '1.25.4', releasedAt: '2026-10-15T15:36:30Z', kind: 'fix', prs: [80], notes: { ja: ["公式資料に基づき駅番号438件を修正"], en: ["Fix 438 station numbers from official sources"] } },
  { version: '1.25.3', releasedAt: '2026-10-15T15:13:28Z', kind: 'docs', prs: [77], notes: { ja: ["記事の企画を追加（画面の変更なし）"], en: ["Add article plans (no visible changes)"] } },
  { version: '1.25.2', releasedAt: '2026-10-15T15:11:52Z', kind: 'improve', prs: [73], notes: { ja: ["路線ページ・ガイドのタイトルと説明"], en: ["Titles and descriptions of line pages and guides"] } },
  { version: '1.25.1', releasedAt: '2026-10-15T02:49:43Z', kind: 'improve', prs: [72], notes: { ja: ["立体表示の拡大縮小の感度を上げる"], en: ["More responsive 3D zoom"] } },
  { version: '1.25.0', releasedAt: '2026-10-15T02:27:45Z', kind: 'feat', prs: [71], notes: { ja: ["立体表示の駅の印を縮尺に合わせ、路線色・駅名の切替"], en: ["3D station marks scale with zoom; line colors and name toggle"] } },
  { version: '1.24.1', releasedAt: '2026-10-14T13:52:05Z', kind: 'ci', prs: [70], notes: { ja: ["地図の描画を実際のブラウザで確かめるテスト（画面の変更なし）"], en: ["Rendering tests in a real browser (no visible changes)"] } },
  { version: '1.24.0', releasedAt: '2026-10-14T13:06:01Z', kind: 'feat', prs: [69], notes: { ja: ["立体表示に駅の点と駅名"], en: ["Station dots and names in 3D view"] } },
  { version: '1.23.0', releasedAt: '2026-10-14T12:32:21Z', kind: 'feat', prs: [68], notes: { ja: ["立体表示の設定を「表示切替」の横から開く・ちらつきを修正"], en: ["Open 3D settings next to Display Toggles; fix flicker"] } },
  { version: '1.22.0', releasedAt: '2026-10-14T05:43:59Z', kind: 'feat', prs: [66], notes: { ja: ["立体表示の拡大縮小の改善・表示モードを URL で指定"], en: ["Better 3D zoom; view mode in URL"] } },
  { version: '1.21.2', releasedAt: '2026-10-14T04:03:49Z', kind: 'improve', prs: [65], notes: { ja: ["立体表示の駅の印・地面の色・視点の保持"], en: ["3D station marks, terrain color, keep viewpoint"] } },
  { version: '1.21.1', releasedAt: '2026-10-14T01:37:57Z', kind: 'fix', prs: [64], notes: { ja: ["立体表示の見出し・パネル・地面のつなぎ目を修正"], en: ["Fix 3D view headings, panels and terrain seams"] } },
  { version: '1.21.0', releasedAt: '2026-10-14T00:56:05Z', kind: 'feat', prs: [63], notes: { ja: ["立体表示に地上・高架・地下の区別"], en: ["Ground, elevated and underground sections in 3D view"] } },
  { version: '1.20.0', releasedAt: '2026-10-14T00:49:34Z', kind: 'feat', prs: [62], notes: { ja: ["立体表示に地面（標高の面）"], en: ["Terrain surface in 3D view"] } },
  { version: '1.19.0', releasedAt: '2026-10-13T16:19:52Z', kind: 'feat', prs: [61], notes: { ja: ["立体表示の操作（1本指で移動・2本指で回転）"], en: ["3D controls: one finger to move, two to rotate"] } },
  { version: '1.18.0', releasedAt: '2026-10-13T11:38:30Z', kind: 'feat', prs: [60], notes: { ja: ["路線の立体（標高）表示"], en: ["3D (elevation) view of lines"] } },
  { version: '1.17.9', releasedAt: '2026-10-13T02:20:31Z', kind: 'improve', prs: [59], notes: { ja: ["位置情報が無いときは東京駅を中心に開く"], en: ["Open centered on Tokyo Station without location"] } },
  { version: '1.17.8', releasedAt: '2026-10-13T02:04:30Z', kind: 'improve', prs: [58], notes: { ja: ["表示路線の切替を閉じた状態で5行まで"], en: ["Line switcher groups show 5 rows when closed"] } },
  { version: '1.17.7', releasedAt: '2026-10-13T01:59:12Z', kind: 'improve', prs: [51], notes: { ja: ["記事・ガイドで説明の前に地図デモを表示"], en: ["Map demo first in articles and guides"] } },
  { version: '1.17.6', releasedAt: '2026-10-11T05:18:48Z', kind: 'fix', prs: [56], notes: { ja: ["推定データの切り替えを非表示に"], en: ["Hide the estimated data switch"] } },
  { version: '1.17.5', releasedAt: '2026-10-11T04:21:29Z', kind: 'data', prs: [55], notes: { ja: ["首都圏1,516駅の周辺施設データの準備"], en: ["Prepare facility data for 1,516 stations"] } },
  { version: '1.17.4', releasedAt: '2026-10-09T05:10:17Z', kind: 'fix', prs: [52], notes: { ja: ["出発駅からの累積時間と所要時間ラベルの位置を修正"], en: ["Fix cumulative times from departure and travel time label positions"] } },
  { version: '1.17.3', releasedAt: '2026-10-08T01:54:14Z', kind: 'improve', prs: [50], notes: { ja: ["URL の駅名を英語表記に"], en: ["Station names in URLs in English"] } },
  { version: '1.17.2', releasedAt: '2026-10-07T15:44:35Z', kind: 'fix', prs: [48], notes: { ja: ["検索エンジンの確認タグを設定"], en: ["Search engine verification tag"] } },
  { version: '1.17.1', releasedAt: '2026-10-07T15:27:54Z', kind: 'fix', prs: [47], notes: { ja: ["アクセス解析の設定"], en: ["Analytics settings"] } },
  { version: '1.17.0', releasedAt: '2026-10-07T11:43:33Z', kind: 'feat', prs: [46], notes: { ja: ["地図の操作をアクセス解析で数える"], en: ["Measure map usage in analytics"] } },
  { version: '1.16.2', releasedAt: '2026-10-07T04:58:31Z', kind: 'fix', prs: [45], notes: { ja: ["アクセス解析の読み込みと Cookie の確認を修正"], en: ["Fix analytics loading and cookie consent"] } },
  { version: '1.16.1', releasedAt: '2026-10-07T04:06:48Z', kind: 'improve', prs: [44], notes: { ja: ["路線の多い駅ほど上に描く"], en: ["Busier stations are drawn on top"] } },
  { version: '1.16.0', releasedAt: '2026-10-07T04:03:24Z', kind: 'feat', prs: [43], notes: { ja: ["直通運転を経路検索に組み込む（乗り換えなしで行ける経路を出す）"], en: ["Route search includes through services (routes without changing trains)"] } },
  { version: '1.15.0', releasedAt: '2026-10-06T23:47:22Z', kind: 'feat', prs: [33], notes: { ja: ["駅の時刻表を十字キーで移動"], en: ["Move between stations in the timetable with arrow keys"] } },
  { version: '1.14.0', releasedAt: '2026-10-06T22:57:16Z', kind: 'feat', prs: [42], notes: { ja: ["読み込み画面・設定を閉じて開始・方位磁針の震えを修正"], en: ["Loading screen, settings start closed, steadier compass"] } },
  { version: '1.13.1', releasedAt: '2026-10-06T11:44:44Z', kind: 'improve', prs: [36], notes: { ja: ["凡例を1枚の開閉パネルに"], en: ["Legend as a single collapsible panel"] } },
  { version: '1.13.0', releasedAt: '2026-10-06T05:02:01Z', kind: 'feat', prs: [35], notes: { ja: ["埋め込み地図をそのまま操作・地図上のボタンを統一・凡例から路線を出し入れ"], en: ["Interactive embedded maps, unified map buttons, toggle lines from the legend"] } },
  { version: '1.12.0', releasedAt: '2026-10-06T03:15:25Z', kind: 'feat', prs: [34], notes: { ja: ["記事に実際の画面を埋め込み、路線/駅ページに路線色と駅番号"], en: ["Live screens in articles; line colors and station numbers on line/station pages"] } },
  { version: '1.11.0', releasedAt: '2026-09-30T06:09:35Z', kind: 'feat', prs: [32], notes: { ja: ["地図の配色の見直しと、スマホ・タブレット・PCに合わせた表示"], en: ["New map colors and layouts for phone, tablet and PC"] } },
  { version: '1.10.2', releasedAt: '2026-09-30T05:23:18Z', kind: 'data', prs: [31], notes: { ja: ["路線の形のデータを整える仕組み"], en: ["Tooling for line shape data"] } },
  { version: '1.10.1', releasedAt: '2026-09-30T05:10:04Z', kind: 'data', prs: [30], notes: { ja: ["駅周辺の施設数を267駅に拡大"], en: ["Facility counts around stations expanded to 267 stations"] } },
  { version: '1.10.0', releasedAt: '2026-09-30T05:04:37Z', kind: 'feat', prs: [29], notes: { ja: ["9都市・観光地38か所のページ"], en: ["Pages for 9 cities and 38 sightseeing spots"] } },
  { version: '1.9.0', releasedAt: '2026-09-30T05:03:37Z', kind: 'feat', prs: [28], notes: { ja: ["駅の時刻表の改善（方向切替・前の便）と路線の凡例"], en: ["Better station timetables (direction switch, previous trains) and line legend"] } },
  { version: '1.8.0', releasedAt: '2026-09-29T00:32:53Z', kind: 'feat', prs: [24], notes: { ja: ["路線データの修正・駅/路線のページ・記事への導線"], en: ["Line data fixes, station/line pages, links to articles"] } },
  { version: '1.7.0', releasedAt: '2026-09-28T13:18:53Z', kind: 'feat', prs: [22], notes: { ja: ["直通運転の表示・方位磁針・中国語/韓国語ページ"], en: ["Through-service display, compass, Chinese/Korean pages"] } },
  { version: '1.6.4', releasedAt: '2026-09-23T21:24:09Z', kind: 'improve', prs: [21], notes: { ja: ["スマホの画面の並びを整理"], en: ["Cleaner phone layout"] } },
  { version: '1.6.3', releasedAt: '2026-09-23T05:34:00Z', kind: 'fix', prs: [20], notes: { ja: ["「現在地から」ボタンが最初から青くならないように"], en: ["\"From current location\" button no longer starts highlighted"] } },
  { version: '1.6.2', releasedAt: '2026-09-22T13:07:36Z', kind: 'fix', prs: [19], notes: { ja: ["乗換駅だけ表示でも出発・到着駅を残す、現在地アイコンの向きを修正"], en: ["Keep departure/arrival with transfer-only filter; fix current location heading"] } },
  { version: '1.6.1', releasedAt: '2026-09-15T20:19:41Z', kind: 'improve', prs: [16], notes: { ja: ["駅選択パネルを畳んだときの余白を上下対称に"], en: ["Even spacing when the station panel is collapsed"] } },
  { version: '1.6.0', releasedAt: '2026-09-15T17:09:53Z', kind: 'feat', prs: [15], notes: { ja: ["駅選択パネルに「乗換駅のみ表示」ボタン"], en: ["\"Transfer stations only\" button in the station panel"] } },
  { version: '1.5.0', releasedAt: '2026-09-15T08:14:50Z', kind: 'feat', prs: [14], notes: { ja: ["所要時間・駅アイコンの色を個別に変えられるように"], en: ["Customize colors of travel times and station icons"] } },
  { version: '1.4.2', releasedAt: '2026-09-09T14:15:31Z', kind: 'docs', prs: [13], notes: { ja: ["今後の予定を追加（画面の変更なし）"], en: ["Add plans (no visible changes)"] } },
  { version: '1.4.1', releasedAt: '2026-09-09T14:13:33Z', kind: 'fix', prs: [12], notes: { ja: ["日本の輪郭の外に路線が見える問題を修正"], en: ["Fix lines showing outside the outline of Japan"] } },
  { version: '1.4.0', releasedAt: '2026-09-09T10:49:23Z', kind: 'feat', prs: [11], notes: { ja: ["駅のタップ・地図操作の改善、首都圏の時刻表を拡充"], en: ["Better station tapping and map controls; more timetables in the Tokyo area"] } },
  { version: '1.3.2', releasedAt: '2026-08-15T11:06:55Z', kind: 'fix', prs: [10], notes: { ja: ["本番で現在地が取れない問題を修正し、地図の表示・読み込みを改善"], en: ["Fix current location not working in production; faster map loading"] } },
  { version: '1.3.1', releasedAt: '2026-08-15T04:24:31Z', kind: 'fix', prs: [9], notes: { ja: ["アプリとして開いたときダークモードで上部が白くなる問題と、出発駅候補のスクロールを修正"], en: ["Fix white top bar in dark mode when installed as an app, and departure suggestions scrolling"] } },
  { version: '1.3.0', releasedAt: '2026-08-12T09:16:59Z', kind: 'feat', prs: [8], notes: { ja: ["新しい画面の土台（v2 UI）"], en: ["New UI foundation (v2)"] } },
  { version: '1.2.1', releasedAt: '2026-08-05T21:54:40Z', kind: 'docs', prs: [7], notes: { ja: ["開発の進め方を変更（画面の変更なし）"], en: ["Change development workflow (no visible changes)"] } },
  { version: '1.2.0', releasedAt: '2026-08-05T21:50:28Z', kind: 'feat', prs: [6], notes: { ja: ["使い勝手・アクセシビリティ・多言語対応をまとめて改善"], en: ["Usability, accessibility and multilingual improvements"] } },
  { version: '1.1.3', releasedAt: '2026-08-04T10:07:13Z', kind: 'fix', prs: [5], notes: { ja: ["京浜東北線の表示切替・路線の判定・アクセシビリティ・横スライドを修正"], en: ["Fix Keihin-Tohoku toggle, line detection, accessibility and horizontal swipe"] } },
  { version: '1.1.2', releasedAt: '2026-08-03T23:01:08Z', kind: 'fix', prs: [4], notes: { ja: ["ビルドの失敗を解消"], en: ["Fix build failures"] } },
  { version: '1.1.1', releasedAt: '2026-07-31T16:45:47Z', kind: 'fix', prs: [3], notes: { ja: ["本番で404になる問題を修正"], en: ["Fix 404 errors in production"] } },
  { version: '1.1.0', releasedAt: '2026-07-05T03:43:04Z', kind: 'feat', prs: [2], notes: { ja: ["現在地から乗っている路線を判定して表示"], en: ["Detect and show the line you are riding from your location"] } },
  { version: '1.0.0', releasedAt: '2026-05-24T05:53:13Z', kind: 'feat', prs: [1], notes: { ja: ["出発駅・到着駅に関係する路線だけを絞って見られる路線図"], en: ["Route map that narrows lines to those relevant to your departure and arrival"] } },

];
