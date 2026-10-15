/**
 * 記事: 駅番号（駅ナンバリング）の読み方。訪日旅行者向け（英語を主に、4言語）。
 *
 * - 駅番号・駅名・路線名は手で書かず、差し込み（{stationNumber:路線:駅} など、src/utils/articleFacts.ts）で
 *   路線データの値を出す。データに無い番号を書くとビルドが止まる
 * - 例に使うのは、出典で確かめた路線だけ（山手線・東京メトロ・東急・京王・埼京線の渋谷、丸ノ内線・御堂筋線の M）。
 *   東武日光線・湘南新宿ラインは駅番号の照合が済んでいないので使わない（docs/data-maintenance-ledger.md）
 * - 書き方の決まりは docs/article-writing.md
 */
import type { ArticleSource } from './types';

const SHIBUYA = { name: '渋谷', route: 'yamanote' } as const;

export const howToReadStationNumbers: ArticleSource = {
  slug: 'how-to-read-station-numbers',
  publishedDate: '2026-10-15',
  related: ['tokyo-train-map-beginner', 'tokyo-sightseeing-routes', 'flex-rail-map-introduction'],
  keywordsJa: '駅ナンバリング 見方, 駅番号 読み方, JY 駅番号, 東京 駅番号, 外国人 駅 案内',
  sources: [
    {
      title: 'Subway Map',
      url: 'https://www.tokyometro.jp/en/subwaymap/',
      publisher: 'Tokyo Metro',
      checkedAt: '2026-10-15',
    },
    {
      title: 'JR East to introduce numbering system at all stations in Tokyo',
      url: 'https://japantoday.com/category/national/jr-east-to-introduce-numbering-system-at-all-stations-in-tokyo',
      publisher: 'Japan Today',
      checkedAt: '2026-10-15',
    },
    {
      title: 'JR East to introduce numbering system at all stations in Tokyo',
      url: 'https://soranews24.com/2016/04/08/jr-east-to-introduce-numbering-system-at-all-stations-in-tokyo/',
      publisher: 'SoraNews24',
      checkedAt: '2026-10-15',
    },
    {
      title: 'Shibuya Station',
      url: 'https://en.wikipedia.org/wiki/Shibuya_Station',
      publisher: 'Wikipedia',
      checkedAt: '2026-10-15',
    },
    {
      title: 'Midōsuji Line',
      url: 'https://en.wikipedia.org/wiki/Mid%C5%8Dsuji_Line',
      publisher: 'Wikipedia',
      checkedAt: '2026-10-15',
    },
  ],
  relatedRoutes: ['yamanote', 'ginzaLine', 'hanzomonLine', 'fukutoshinLine', 'tokyuToyokoLine', 'tokyuDenEnToshiLine', 'keioInokashiraLine', 'jrSaikyoLine'],
  relatedStations: [SHIBUYA, { name: '東京', route: 'yamanote' }],

  maps: {
    // 冒頭のデモ: 山手線だけ・駅番号つきで渋谷を中心に。縮小すると番号が環状に続くのが見える
    main: { routes: ['yamanote'], focus: SHIBUYA, zoom: 13, stationNumbers: true },
  },
  shots: {
    // 東京（JY01）のまわり。番号の始まりと増える向き
    'tokyo-start': { map: { routes: ['yamanote'], focus: { name: '東京', route: 'yamanote' }, zoom: 13, stationNumbers: true } },
    // 渋谷に乗り入れる路線と、路線ごとの記号（隣の駅に出る）
    'shibuya-transfer': {
      map: {
        routes: ['yamanote', 'jrSaikyoLine', 'ginzaLine', 'hanzomonLine', 'fukutoshinLine', 'tokyuToyokoLine', 'tokyuDenEnToshiLine', 'keioInokashiraLine'],
        // 渋谷のラベルは1つにまとまるので、隣の駅（路線ごとの記号）が見える拡大率にする
        focus: SHIBUYA, zoom: 14, stationNumbers: true,
      },
    },
  },

  content: {
    en: {
      meta: {
        title: 'How to Read Japanese Train Station Numbers: A Practical Guide',
        description: 'Station signs in Tokyo show short codes next to each name. Learn what the letters and numbers mean, how to use them at transfer stations, and where they stop helping, with a live map you can try.',
        category: 'Travel basics',
        kicker: 'Travel basics',
        readTime: 'About 5 min read',
        tag: 'Travel basics',
      },
      blocks: [
        { type: 'points', items: [
          'A station number is a line code plus a number: {station:yamanote:渋谷} on the {line:yamanote} is <span class="mono">{stationNumber:yamanote:渋谷}</span>.',
          'The letters tell you the line and the number tells you the order of the stations, so you can follow the line even if you cannot read Japanese.',
          'A station served by several lines has a different number for each line. Look for the code of the line you are about to board.',
        ] },
        { type: 'embed', map: 'main', title: 'The {line:yamanote} around {station:yamanote:渋谷} with station numbers', caption: 'The live map with station numbers shown. Zoom out to see the numbers continue around the loop.' },

        { type: 'h2', text: 'What a station number is' },
        { type: 'p', text: 'In the Tokyo area, signs, maps and announcements show a short code next to each station name. Tokyo Metro describes its codes as a letter for the line and a number for the station, circled in the color of the line.' },
        { type: 'p', text: 'JR East added the same kind of code to its Tokyo-area stations in 2016, with two letters for the line. Because the code uses only letters and numbers, you can match it on a map, a sign and a ticket gate display without reading the Japanese name.' },

        { type: 'h2', text: 'How to read the letters and the number' },
        { type: 'table', head: ['Code', 'Line', 'Station'], kinds: ['title', 'text', 'text'], rows: [
          ['<span class="mono">{stationNumber:yamanote:東京}</span>', '{line:yamanote}', '{station:yamanote:東京}'],
          ['<span class="mono">{stationNumber:yamanote:渋谷}</span>', '{line:yamanote}', '{station:yamanote:渋谷}'],
          ['<span class="mono">{stationNumber:ginzaLine:渋谷}</span>', '{line:ginzaLine}', '{station:ginzaLine:渋谷}'],
          ['<span class="mono">{stationNumber:tokyuToyokoLine:渋谷}</span>', '{line:tokyuToyokoLine}', '{station:tokyuToyokoLine:渋谷}'],
        ] },
        { type: 'p', text: 'The number changes by one from station to station. On the {line:yamanote}, {station:yamanote:東京} is <span class="mono">{stationNumber:yamanote:東京}</span>, and the numbers rise through {station:yamanote:上野} (<span class="mono">{stationNumber:yamanote:上野}</span>) and {station:yamanote:新宿} (<span class="mono">{stationNumber:yamanote:新宿}</span>) to {station:yamanote:渋谷} (<span class="mono">{stationNumber:yamanote:渋谷}</span>).' },
        { type: 'shot', shot: 'tokyo-start', alt: 'The {line:yamanote} around {station:yamanote:東京} with station numbers', caption: 'Numbering starts at {station:yamanote:東京}. Follow the numbers from one station to the next.' },
        { type: 'p', text: 'On a line with two ends, compare the number of your station with the number of your destination to tell which way to go, then check that the platform sign shows a train heading that way.' },

        { type: 'h2', text: 'Transfer stations have more than one number' },
        { type: 'p', text: '{station:yamanote:渋谷} is served by several lines, and each line gives the station its own number:' },
        { type: 'ul', items: [
          '{line:yamanote}: <span class="mono">{stationNumber:yamanote:渋谷}</span>',
          '{line:jrSaikyoLine}: <span class="mono">{stationNumber:jrSaikyoLine:渋谷}</span>',
          '{line:ginzaLine}: <span class="mono">{stationNumber:ginzaLine:渋谷}</span>',
          '{line:hanzomonLine}: <span class="mono">{stationNumber:hanzomonLine:渋谷}</span>',
          '{line:fukutoshinLine}: <span class="mono">{stationNumber:fukutoshinLine:渋谷}</span>',
          '{line:tokyuToyokoLine}: <span class="mono">{stationNumber:tokyuToyokoLine:渋谷}</span>',
          '{line:tokyuDenEnToshiLine}: <span class="mono">{stationNumber:tokyuDenEnToshiLine:渋谷}</span>',
          '{line:keioInokashiraLine}: <span class="mono">{stationNumber:keioInokashiraLine:渋谷}</span>',
        ] },
        { type: 'shot', shot: 'shibuya-transfer', alt: 'Lines at {station:yamanote:渋谷} with their station numbers', caption: 'Eight lines meet at {station:yamanote:渋谷}. The next station along each line carries that line\'s code, such as <span class="mono">{stationNumber:ginzaLine:表参道}</span> {station:ginzaLine:表参道} or <span class="mono">{stationNumber:tokyuToyokoLine:代官山}</span> {station:tokyuToyokoLine:代官山}.' },
        { type: 'p', text: 'When you change trains, follow the signs for the code of the line you are changing to. The number of the station you arrived at belongs to the line you just left.' },

        { type: 'h2', text: 'Where station numbers stop helping' },
        { type: 'p', text: 'The same letter can mean different lines in different cities. Tokyo Metro\'s {line:marunouchiLine} uses M ({station:marunouchiLine:新中野} is <span class="mono">{stationNumber:marunouchiLine:新中野}</span>), and the Osaka Metro {line:midosujiLine} also uses M ({station:midosujiLine:梅田} is <span class="mono">{stationNumber:midosujiLine:梅田}</span>). Check the line name and the city as well as the code.' },
        { type: 'p', text: 'Not every line uses station numbers. On this map, a station without a number shows only its name. Use the number together with the station name and the destination shown on the platform.' },
        { type: 'cta', map: 'main', title: 'Follow the numbers on the map', text: 'Open the {line:yamanote} with station numbers and follow them around the loop.' },
      ],
    },
    ja: {
      meta: {
        title: '駅ナンバリングの見方｜記号と数字の読み方・乗り換えでの使い方',
        description: '駅名の横にある「アルファベット＋数字」の記号は、路線と駅の順番を表します。読み方、乗換駅で番号が複数ある理由、番号だけでは分からないことを、実際に動かせる地図で紹介します。',
        category: '初心者ガイド',
        kicker: '初心者ガイド',
        readTime: '読了 約5分',
        tag: '初心者ガイド',
      },
      blocks: [
        { type: 'points', items: [
          '駅ナンバリングは「路線の記号＋数字」。{line:yamanote}の{station:yamanote:渋谷}は <span class="mono">{stationNumber:yamanote:渋谷}</span> です。',
          'アルファベットが路線、数字が駅の順番を表すので、駅名が読めなくても路線をたどれます。',
          '乗換駅には路線ごとに別の番号があります。これから乗る路線の記号を探します。',
        ] },
        { type: 'embed', map: 'main', title: '駅番号を出した{station:yamanote:渋谷}付近の{line:yamanote}', caption: '駅番号を表示した実際の地図です。縮小すると、番号が環状に続いていくのが見えます。' },

        { type: 'h2', text: '駅ナンバリングとは' },
        { type: 'p', text: '首都圏の駅では、案内板・路線図・車内の表示で、駅名の横に短い記号が出ています。東京メトロは、路線を表すアルファベットと駅を表す数字を、路線の色の丸で囲んだものと説明しています。' },
        { type: 'p', text: 'JR東日本も2016年に首都圏の駅に同じ考え方の番号を付けました（路線はアルファベット2文字）。アルファベットと数字だけなので、駅名が読めなくても、地図・案内板・改札の表示を突き合わせられます。' },

        { type: 'h2', text: '記号と数字の読み方' },
        { type: 'table', head: ['駅番号', '路線', '駅'], kinds: ['title', 'text', 'text'], rows: [
          ['<span class="mono">{stationNumber:yamanote:東京}</span>', '{line:yamanote}', '{station:yamanote:東京}'],
          ['<span class="mono">{stationNumber:yamanote:渋谷}</span>', '{line:yamanote}', '{station:yamanote:渋谷}'],
          ['<span class="mono">{stationNumber:ginzaLine:渋谷}</span>', '{line:ginzaLine}', '{station:ginzaLine:渋谷}'],
          ['<span class="mono">{stationNumber:tokyuToyokoLine:渋谷}</span>', '{line:tokyuToyokoLine}', '{station:tokyuToyokoLine:渋谷}'],
        ] },
        { type: 'p', text: '数字は隣の駅へ1つずつ変わります。{line:yamanote}は{station:yamanote:東京}が <span class="mono">{stationNumber:yamanote:東京}</span> で、{station:yamanote:上野}（<span class="mono">{stationNumber:yamanote:上野}</span>）、{station:yamanote:新宿}（<span class="mono">{stationNumber:yamanote:新宿}</span>）と増えて、{station:yamanote:渋谷}は <span class="mono">{stationNumber:yamanote:渋谷}</span> です。' },
        { type: 'shot', shot: 'tokyo-start', alt: '駅番号を出した{station:yamanote:東京}付近の{line:yamanote}', caption: '番号は{station:yamanote:東京}から始まります。隣の駅へ数字をたどってみてください。' },
        { type: 'p', text: '両端がある路線では、いまいる駅と行きたい駅の番号を比べると進む向きが分かります。そのうえで、ホームの案内でその向きの電車かを確かめます。' },

        { type: 'h2', text: '乗換駅には番号が複数ある' },
        { type: 'p', text: '{station:yamanote:渋谷}にはいくつもの路線が乗り入れていて、路線ごとに別の番号が付いています。' },
        { type: 'ul', items: [
          '{line:yamanote}: <span class="mono">{stationNumber:yamanote:渋谷}</span>',
          '{line:jrSaikyoLine}: <span class="mono">{stationNumber:jrSaikyoLine:渋谷}</span>',
          '{line:ginzaLine}: <span class="mono">{stationNumber:ginzaLine:渋谷}</span>',
          '{line:hanzomonLine}: <span class="mono">{stationNumber:hanzomonLine:渋谷}</span>',
          '{line:fukutoshinLine}: <span class="mono">{stationNumber:fukutoshinLine:渋谷}</span>',
          '{line:tokyuToyokoLine}: <span class="mono">{stationNumber:tokyuToyokoLine:渋谷}</span>',
          '{line:tokyuDenEnToshiLine}: <span class="mono">{stationNumber:tokyuDenEnToshiLine:渋谷}</span>',
          '{line:keioInokashiraLine}: <span class="mono">{stationNumber:keioInokashiraLine:渋谷}</span>',
        ] },
        { type: 'shot', shot: 'shibuya-transfer', alt: '{station:yamanote:渋谷}に乗り入れる路線と駅番号', caption: '{station:yamanote:渋谷}には8路線が乗り入れています。隣の駅には、その路線の記号が付いた番号が出ます（<span class="mono">{stationNumber:ginzaLine:表参道}</span> {station:ginzaLine:表参道}、<span class="mono">{stationNumber:tokyuToyokoLine:代官山}</span> {station:tokyuToyokoLine:代官山} など）。' },
        { type: 'p', text: '乗り換えるときは、これから乗る路線の記号の案内をたどります。降りた駅の番号は、いま降りた路線のものです。' },

        { type: 'h2', text: '番号だけでは分からないこと' },
        { type: 'p', text: '同じアルファベットが、都市によって別の路線を指すことがあります。東京メトロ{line:marunouchiLine}は M（{station:marunouchiLine:新中野}は <span class="mono">{stationNumber:marunouchiLine:新中野}</span>）、大阪メトロ{line:midosujiLine}も M（{station:midosujiLine:梅田}は <span class="mono">{stationNumber:midosujiLine:梅田}</span>）です。記号だけでなく、路線名と都市も確かめます。' },
        { type: 'p', text: '駅番号の無い路線もあります。この地図では、番号の無い駅は駅名だけを出します。番号は、駅名やホームに出る行き先と合わせて使います。' },
        { type: 'cta', map: 'main', title: '地図で番号をたどる', text: '駅番号を出した{line:yamanote}を開いて、環状に続く番号をたどってみてください。' },
      ],
    },
    zh: {
      meta: {
        title: '日本车站编号怎么看：字母和数字的含义与换乘用法',
        description: '东京车站的站名旁边有“字母＋数字”的编号，表示线路和车站的顺序。本文用可以操作的地图介绍编号的读法、换乘站为什么有多个编号，以及只看编号时需要注意的地方。',
        category: '出行基础',
        kicker: '出行基础',
        readTime: '约5分钟',
        tag: '出行基础',
      },
      blocks: [
        { type: 'points', items: [
          '车站编号是“线路代码＋数字”。{line:yamanote}的{station:yamanote:渋谷}是 <span class="mono">{stationNumber:yamanote:渋谷}</span>。',
          '字母表示线路，数字表示车站的顺序，看不懂日文站名也能顺着线路找到车站。',
          '多条线路经过的车站，每条线路有各自的编号。请找你要乘坐的线路的代码。',
        ] },
        { type: 'embed', map: 'main', title: '显示车站编号的{station:yamanote:渋谷}附近的{line:yamanote}', caption: '显示车站编号的实际地图。缩小后可以看到编号沿环线继续。' },

        { type: 'h2', text: '什么是车站编号' },
        { type: 'p', text: '在东京地区，站内指示牌、线路图和车内显示都会在站名旁边标出简短的代码。东京Metro说明，其编号由表示线路的字母和表示车站的数字组成，并用线路颜色的圆圈围起来。' },
        { type: 'p', text: 'JR东日本也在2016年为东京地区的车站加上了同类编号（线路为两个字母）。编号只由字母和数字组成，即使看不懂日文站名，也能把地图、指示牌和检票口的显示对应起来。' },

        { type: 'h2', text: '字母和数字的读法' },
        { type: 'table', head: ['编号', '线路', '车站'], kinds: ['title', 'text', 'text'], rows: [
          ['<span class="mono">{stationNumber:yamanote:東京}</span>', '{line:yamanote}', '{station:yamanote:東京}'],
          ['<span class="mono">{stationNumber:yamanote:渋谷}</span>', '{line:yamanote}', '{station:yamanote:渋谷}'],
          ['<span class="mono">{stationNumber:ginzaLine:渋谷}</span>', '{line:ginzaLine}', '{station:ginzaLine:渋谷}'],
          ['<span class="mono">{stationNumber:tokyuToyokoLine:渋谷}</span>', '{line:tokyuToyokoLine}', '{station:tokyuToyokoLine:渋谷}'],
        ] },
        { type: 'p', text: '数字每到下一站变化1。{line:yamanote}的{station:yamanote:東京}是 <span class="mono">{stationNumber:yamanote:東京}</span>，经过{station:yamanote:上野}（<span class="mono">{stationNumber:yamanote:上野}</span>）、{station:yamanote:新宿}（<span class="mono">{stationNumber:yamanote:新宿}</span>）逐渐增大，到{station:yamanote:渋谷}是 <span class="mono">{stationNumber:yamanote:渋谷}</span>。' },
        { type: 'shot', shot: 'tokyo-start', alt: '显示车站编号的{station:yamanote:東京}附近的{line:yamanote}', caption: '编号从{station:yamanote:東京}开始。请顺着数字看到下一站。' },
        { type: 'p', text: '在有两个终点的线路上，比较所在车站和目的地的编号就能知道前进方向，然后再确认站台显示的列车是开往那个方向的。' },

        { type: 'h2', text: '换乘站有多个编号' },
        { type: 'p', text: '{station:yamanote:渋谷}有多条线路经过，每条线路都有自己的编号：' },
        { type: 'ul', items: [
          '{line:yamanote}: <span class="mono">{stationNumber:yamanote:渋谷}</span>',
          '{line:jrSaikyoLine}: <span class="mono">{stationNumber:jrSaikyoLine:渋谷}</span>',
          '{line:ginzaLine}: <span class="mono">{stationNumber:ginzaLine:渋谷}</span>',
          '{line:hanzomonLine}: <span class="mono">{stationNumber:hanzomonLine:渋谷}</span>',
          '{line:fukutoshinLine}: <span class="mono">{stationNumber:fukutoshinLine:渋谷}</span>',
          '{line:tokyuToyokoLine}: <span class="mono">{stationNumber:tokyuToyokoLine:渋谷}</span>',
          '{line:tokyuDenEnToshiLine}: <span class="mono">{stationNumber:tokyuDenEnToshiLine:渋谷}</span>',
          '{line:keioInokashiraLine}: <span class="mono">{stationNumber:keioInokashiraLine:渋谷}</span>',
        ] },
        { type: 'shot', shot: 'shibuya-transfer', alt: '经过{station:yamanote:渋谷}的线路和车站编号', caption: '{station:yamanote:渋谷}有8条线路经过。沿着每条线路的下一站会显示该线路代码的编号，例如 <span class="mono">{stationNumber:ginzaLine:表参道}</span> {station:ginzaLine:表参道}、<span class="mono">{stationNumber:tokyuToyokoLine:代官山}</span> {station:tokyuToyokoLine:代官山}。' },
        { type: 'p', text: '换乘时，请按照你要换乘的线路代码的指示牌走。到站时看到的编号属于你刚下车的线路。' },

        { type: 'h2', text: '只看编号时需要注意的地方' },
        { type: 'p', text: '同一个字母在不同城市可能代表不同的线路。东京Metro{line:marunouchiLine}用 M（{station:marunouchiLine:新中野}是 <span class="mono">{stationNumber:marunouchiLine:新中野}</span>），大阪Metro{line:midosujiLine}也用 M（{station:midosujiLine:梅田}是 <span class="mono">{stationNumber:midosujiLine:梅田}</span>）。除了代码，也请确认线路名和城市。' },
        { type: 'p', text: '并不是所有线路都有车站编号。在这张地图上，没有编号的车站只显示站名。请把编号和站名、站台显示的终点站一起使用。' },
        { type: 'cta', map: 'main', title: '在地图上顺着编号看', text: '打开显示车站编号的{line:yamanote}，沿着环线看编号的变化。' },
      ],
    },
    ko: {
      meta: {
        title: '일본 역 번호 읽는 법: 알파벳과 숫자의 의미와 환승할 때 쓰는 법',
        description: '도쿄의 역 이름 옆에 있는 ‘알파벳＋숫자’ 기호는 노선과 역의 순서를 나타냅니다. 읽는 법, 환승역에 번호가 여러 개인 이유, 번호만으로는 알 수 없는 점을 직접 움직일 수 있는 지도로 소개합니다.',
        category: '여행 기초',
        kicker: '여행 기초',
        readTime: '약 5분',
        tag: '여행 기초',
      },
      blocks: [
        { type: 'points', items: [
          '역 번호는 ‘노선 기호＋숫자’입니다. {line:yamanote}의 {station:yamanote:渋谷}는 <span class="mono">{stationNumber:yamanote:渋谷}</span>입니다.',
          '알파벳은 노선, 숫자는 역의 순서를 나타내므로 일본어 역 이름을 못 읽어도 노선을 따라갈 수 있습니다.',
          '여러 노선이 지나는 역에는 노선마다 다른 번호가 있습니다. 이제 탈 노선의 기호를 찾으세요.',
        ] },
        { type: 'embed', map: 'main', title: '역 번호를 표시한 {station:yamanote:渋谷} 주변의 {line:yamanote}', caption: '역 번호를 표시한 실제 지도입니다. 축소하면 번호가 순환선을 따라 이어지는 것을 볼 수 있습니다.' },

        { type: 'h2', text: '역 번호란' },
        { type: 'p', text: '도쿄권 역에서는 안내판, 노선도, 차내 표시에서 역 이름 옆에 짧은 기호를 보여 줍니다. 도쿄메트로는 노선을 나타내는 알파벳과 역을 나타내는 숫자를 노선 색의 원으로 둘러싼 것이라고 설명합니다.' },
        { type: 'p', text: 'JR동일본도 2016년에 도쿄권 역에 같은 방식의 번호를 붙였습니다(노선은 알파벳 2글자). 알파벳과 숫자만 쓰기 때문에 일본어 역 이름을 못 읽어도 지도, 안내판, 개찰구 표시를 서로 맞춰 볼 수 있습니다.' },

        { type: 'h2', text: '알파벳과 숫자 읽는 법' },
        { type: 'table', head: ['역 번호', '노선', '역'], kinds: ['title', 'text', 'text'], rows: [
          ['<span class="mono">{stationNumber:yamanote:東京}</span>', '{line:yamanote}', '{station:yamanote:東京}'],
          ['<span class="mono">{stationNumber:yamanote:渋谷}</span>', '{line:yamanote}', '{station:yamanote:渋谷}'],
          ['<span class="mono">{stationNumber:ginzaLine:渋谷}</span>', '{line:ginzaLine}', '{station:ginzaLine:渋谷}'],
          ['<span class="mono">{stationNumber:tokyuToyokoLine:渋谷}</span>', '{line:tokyuToyokoLine}', '{station:tokyuToyokoLine:渋谷}'],
        ] },
        { type: 'p', text: '숫자는 다음 역으로 갈 때마다 하나씩 바뀝니다. {line:yamanote}는 {station:yamanote:東京}가 <span class="mono">{stationNumber:yamanote:東京}</span>이고, {station:yamanote:上野}(<span class="mono">{stationNumber:yamanote:上野}</span>), {station:yamanote:新宿}(<span class="mono">{stationNumber:yamanote:新宿}</span>)를 지나 {station:yamanote:渋谷}는 <span class="mono">{stationNumber:yamanote:渋谷}</span>입니다.' },
        { type: 'shot', shot: 'tokyo-start', alt: '역 번호를 표시한 {station:yamanote:東京} 주변의 {line:yamanote}', caption: '번호는 {station:yamanote:東京}에서 시작합니다. 다음 역으로 숫자를 따라가 보세요.' },
        { type: 'p', text: '양 끝이 있는 노선에서는 지금 있는 역과 가려는 역의 번호를 비교하면 가는 방향을 알 수 있습니다. 그다음 승강장 안내에서 그 방향으로 가는 열차인지 확인합니다.' },

        { type: 'h2', text: '환승역에는 번호가 여러 개 있습니다' },
        { type: 'p', text: '{station:yamanote:渋谷}에는 여러 노선이 지나고, 노선마다 다른 번호가 붙어 있습니다.' },
        { type: 'ul', items: [
          '{line:yamanote}: <span class="mono">{stationNumber:yamanote:渋谷}</span>',
          '{line:jrSaikyoLine}: <span class="mono">{stationNumber:jrSaikyoLine:渋谷}</span>',
          '{line:ginzaLine}: <span class="mono">{stationNumber:ginzaLine:渋谷}</span>',
          '{line:hanzomonLine}: <span class="mono">{stationNumber:hanzomonLine:渋谷}</span>',
          '{line:fukutoshinLine}: <span class="mono">{stationNumber:fukutoshinLine:渋谷}</span>',
          '{line:tokyuToyokoLine}: <span class="mono">{stationNumber:tokyuToyokoLine:渋谷}</span>',
          '{line:tokyuDenEnToshiLine}: <span class="mono">{stationNumber:tokyuDenEnToshiLine:渋谷}</span>',
          '{line:keioInokashiraLine}: <span class="mono">{stationNumber:keioInokashiraLine:渋谷}</span>',
        ] },
        { type: 'shot', shot: 'shibuya-transfer', alt: '{station:yamanote:渋谷}를 지나는 노선과 역 번호', caption: '{station:yamanote:渋谷}에는 8개 노선이 지납니다. 각 노선의 다음 역에는 그 노선 기호가 붙은 번호가 표시됩니다(<span class="mono">{stationNumber:ginzaLine:表参道}</span> {station:ginzaLine:表参道}, <span class="mono">{stationNumber:tokyuToyokoLine:代官山}</span> {station:tokyuToyokoLine:代官山} 등).' },
        { type: 'p', text: '환승할 때는 이제 탈 노선의 기호가 적힌 안내를 따라가세요. 도착한 역의 번호는 방금 내린 노선의 번호입니다.' },

        { type: 'h2', text: '번호만으로는 알 수 없는 것' },
        { type: 'p', text: '같은 알파벳이 도시마다 다른 노선을 가리키기도 합니다. 도쿄메트로 {line:marunouchiLine}는 M({station:marunouchiLine:新中野}는 <span class="mono">{stationNumber:marunouchiLine:新中野}</span>), 오사카메트로 {line:midosujiLine}도 M({station:midosujiLine:梅田}는 <span class="mono">{stationNumber:midosujiLine:梅田}</span>)입니다. 기호뿐 아니라 노선 이름과 도시도 확인하세요.' },
        { type: 'p', text: '역 번호가 없는 노선도 있습니다. 이 지도에서는 번호가 없는 역은 역 이름만 보여 줍니다. 번호는 역 이름, 승강장에 표시되는 행선지와 함께 쓰세요.' },
        { type: 'cta', map: 'main', title: '지도에서 번호 따라가기', text: '역 번호를 표시한 {line:yamanote}를 열고 순환선을 따라 이어지는 번호를 확인해 보세요.' },
      ],
    },
  },
};
