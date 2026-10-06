/**
 * 記事「東京の路線図の読み方｜初めてでも迷わない3つのコツ」（/articles/tokyo-train-map-beginner）。
 * 書き方: docs/article-writing.md ／ 形: ./types.ts ／ 画面はプレビューで確認する（iframe で埋め込む）
 * 値だけを書く（計算で組み立てない）。文章中のサービス名は {siteName} と書く。
 */
import type { ArticleSource } from './types';

export const tokyoTrainMapBeginner: ArticleSource = {
  "slug": "tokyo-train-map-beginner",
  "publishedDate": "2025-06-06",
  "modifiedDate": "2026-09-29",
  "related": [
    "flex-rail-map-introduction",
    "tokyo-sightseeing-routes",
    "commute-30min-cheap-rent"
  ],
  "keywordsJa": "東京 路線図 読み方, 乗り換え 初めて, 駅ナンバリング, 上京 電車, 訪日 電車, {siteName}",
  "maps": {
    "main": {
      "routes": [
        "yamanote"
      ]
    }
  },
  "shots": {
    "one-line": {
      "map": {
        "routes": [
          "yamanote"
        ],
        "center": [
          35.69,
          139.735
        ],
        "zoom": 12
      },
      "collapsePanels": true
    },
    "three-lines": {
      "map": {
        "routes": [
          "yamanote",
          "chuo",
          "marunouchiLine"
        ],
        "center": [
          35.69,
          139.72
        ],
        "zoom": 12
      },
      "collapsePanels": true
    }
  },
  "content": {
    "ja": {
      "meta": {
        "title": "東京の路線図の読み方｜初めてでも迷わない3つのコツ",
        "description": "東京の路線図が複雑に見えるのは、複数の会社の路線が1枚に重なっているからです。1本の色だけを追う、駅ナンバリングを見る、乗換駅で方面を確かめる。この3つのコツを実際の画面で説明します。",
        "category": "初心者ガイド",
        "kicker": "はじめての東京の電車",
        "readTime": "読了 約5分",
        "tag": "初心者ガイド"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "路線図は全体を読まず、使う1本の色だけを追う",
            "駅名が読めなくても、駅ナンバリング（例: <span class=\"mono\">JY01</span>）で路線と順番が分かる",
            "乗り換えでは、路線名より先に「どちら方面か」を確かめる"
          ]
        },
        {
          "type": "h2",
          "text": "東京の路線図が複雑に見える理由"
        },
        {
          "type": "p",
          "text": "JR、東京メトロ、都営地下鉄、私鉄と、複数の会社の路線が1枚の図に重なっているからです。さらに相互直通運転で、1本の電車が途中から別の会社の路線に入ることもあります。すべてを一度に理解しようとすると、どこから見ればよいか分からなくなります。"
        },
        {
          "type": "shot",
          "shot": "all-lines",
          "article": "flex-rail-map-introduction",
          "alt": "都心の主要15路線をすべて表示した地図。線と駅名が重なっている",
          "caption": "都心の主要路線を全部表示した状態。線が重なり、1本を追いにくい"
        },
        {
          "type": "h2",
          "text": "コツ1　使う1本の色だけを追う"
        },
        {
          "type": "p",
          "text": "乗る路線を1本決めたら、その色の線だけを目で追います。{siteName}の「表示路線の切替」で山手線だけを残すと、下のように緑色の1本の環になります。駅の並びと、どの駅でほかの路線と交わるかが読み取れます。"
        },
        {
          "type": "shot",
          "shot": "one-line",
          "alt": "山手線だけを表示した地図。緑色の環状の線に沿って駅名が並んでいる",
          "caption": "山手線だけを表示。1本だけなら駅の並びがそのまま読める"
        },
        {
          "type": "h2",
          "text": "コツ2・3　駅ナンバリングと乗換駅を見る"
        },
        {
          "type": "p",
          "text": "駅ナンバリングは、アルファベットが路線、数字が駅の順番を表します。たとえば山手線の東京駅は <span class=\"mono\">JY01</span> です。数字が増える向きか減る向きかで、進む方向が分かります。"
        },
        {
          "type": "p",
          "text": "線と線が交わる駅が乗換駅です。山手線・中央線・丸ノ内線の3本に増やすと、新宿や東京などで線が交わるのが見えます。表示する路線は、実際に乗り換える路線だけにとどめるのがコツです。"
        },
        {
          "type": "shot",
          "shot": "three-lines",
          "alt": "山手線・中央線・丸ノ内線の3路線だけを表示した地図。新宿や東京で線が交わっている",
          "caption": "3路線に増やすと、線が交わる駅（乗換駅）が分かる"
        },
        {
          "type": "h2",
          "text": "乗り換えは「方面」を確かめてから"
        },
        {
          "type": "steps",
          "items": [
            "乗り換える路線の色と記号を、構内の案内サインで探す。",
            "ホームの案内で、行き先（方面）が目的地の側かを確かめる。",
            "電車の行き先表示を見てから乗る。"
          ]
        },
        {
          "type": "p",
          "text": "下の図では、路線を消したり戻したりして、線が減ると読みやすくなる様子を試せます。"
        },
        {
          "type": "html",
          "html": "<figure class=\"map\"><div class=\"map-head\"><div class=\"cap\">図：<b>必要な路線だけ</b>表示してみる</div><p class=\"sub\">チップをタップして路線を消したり戻したりできます。</p></div><div class=\"chips\" id=\"chips\" role=\"group\" aria-label=\"表示する路線の切り替え\"></div><div class=\"map-stage\"><svg viewBox=\"0 0 640 440\" role=\"img\" aria-label=\"東京の主要路線を簡略化した概念図\"><g id=\"g-yamanote\" class=\"ln\" data-line=\"yamanote\"><polygon points=\"210,95 420,110 470,250 380,365 200,345 150,205\" fill=\"none\" stroke=\"#7FBF3F\" stroke-width=\"7\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-chuo\" class=\"ln\" data-line=\"chuo\"><polyline points=\"150,205 300,225 400,205 470,250\" fill=\"none\" stroke=\"#E8542A\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-marunouchi\" class=\"ln\" data-line=\"marunouchi\"><polyline points=\"210,95 330,160 420,215 470,250\" fill=\"none\" stroke=\"#D9362C\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-ginza\" class=\"ln\" data-line=\"ginza\"><polyline points=\"200,345 275,302 450,302 440,200 420,110\" fill=\"none\" stroke=\"#F5A623\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-odakyu\" class=\"ln\" data-line=\"odakyu\"><polyline points=\"150,205 78,262 40,332\" fill=\"none\" stroke=\"#1F7FC4\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-tozai\" class=\"ln\" data-line=\"tozai\"><polyline points=\"70,168 250,196 420,215 575,215\" fill=\"none\" stroke=\"#16A7CE\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"nodes\"><g><circle cx=\"210\" cy=\"95\" r=\"7.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"2.6\"/><text class=\"st-label\" x=\"210\" y=\"78\" text-anchor=\"middle\">池袋</text></g><g><circle cx=\"470\" cy=\"250\" r=\"8.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"3\"/><text class=\"st-label\" x=\"484\" y=\"254\">東京</text></g><g><circle cx=\"200\" cy=\"345\" r=\"8.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"3\"/><text class=\"st-label\" x=\"186\" y=\"366\" text-anchor=\"end\">渋谷</text></g><g><circle cx=\"150\" cy=\"205\" r=\"8.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"3\"/><text class=\"st-label\" x=\"136\" y=\"200\" text-anchor=\"end\">新宿</text></g></g></svg></div><div class=\"readout\" id=\"readout\">表示中の路線：<b>6</b> / 6</div><div class=\"map-note\">※ これは概念図です。</div></figure>"
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.69,
              139.735
            ],
            "zoom": 12
          },
          "title": "{siteName}の地図（山手線だけを表示した状態）",
          "caption": "実際の地図（山手線だけを表示した状態）。枠の中で拡大・移動できます。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "山手線だけを表示した地図を開く",
          "text": "山手線だけが出た状態で開きます。乗り換える路線を1本ずつ足してみてください。"
        }
      ]
    },
    "en": {
      "meta": {
        "title": "How to Read a Tokyo Train Map: 3 Tips for First-Time Riders",
        "description": "Tokyo rail maps look complex because lines from several companies are drawn on one sheet. Follow one color, read station numbers, and check the direction at transfer stations. Real screenshots explain each tip.",
        "category": "Beginner Guide",
        "kicker": "Tokyo Trains for Beginners",
        "readTime": "About 5 min read",
        "tag": "Beginner Guide"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "Do not read the whole map; follow only the color of the one line you use",
            "Even if you cannot read a station name, the station number (e.g. <span class=\"mono\">JY01</span>) tells you the line and order",
            "When transferring, check the direction before the line name"
          ]
        },
        {
          "type": "h2",
          "text": "Why Tokyo rail maps look complicated"
        },
        {
          "type": "p",
          "text": "Lines from several companies — JR, Tokyo Metro, Toei Subway and private railways — are drawn on one sheet. Through services also mean one train can continue onto another company's line partway. Trying to understand everything at once leaves you unsure where to start."
        },
        {
          "type": "shot",
          "shot": "all-lines",
          "article": "flex-rail-map-introduction",
          "alt": "Map showing all 15 major central Tokyo lines, with lines and station names overlapping",
          "caption": "All major central lines shown. Lines overlap, making it hard to follow one"
        },
        {
          "type": "h2",
          "text": "Tip 1: follow only the color of your line"
        },
        {
          "type": "p",
          "text": "Once you decide which line to ride, follow only that color. In {siteName}, keep only the Yamanote Line in \"Route Display Toggle\" and it becomes a single green loop, as below. You can read the order of stations and where other lines cross it."
        },
        {
          "type": "shot",
          "shot": "one-line",
          "alt": "Map showing only the Yamanote Line, with station names along a green loop",
          "caption": "Only the Yamanote Line. With one line, the station order is easy to read"
        },
        {
          "type": "h2",
          "text": "Tips 2 and 3: station numbers and transfer stations"
        },
        {
          "type": "p",
          "text": "In a station number, the letters stand for the line and the number for the station's order. For example, Tokyo Station on the Yamanote Line is <span class=\"mono\">JY01</span>. Whether the numbers go up or down tells you which way you are heading."
        },
        {
          "type": "p",
          "text": "Stations where lines cross are transfer stations. Add the Chuo Line and the Marunouchi Line, and you can see the three lines meet at stations such as Shinjuku and Tokyo. The trick is to show only the lines you will actually transfer to."
        },
        {
          "type": "shot",
          "shot": "three-lines",
          "alt": "Map showing only the Yamanote, Chuo and Marunouchi lines, crossing at Shinjuku and Tokyo",
          "caption": "With three lines, you can see where they cross — the transfer stations"
        },
        {
          "type": "h2",
          "text": "Check the direction before you transfer"
        },
        {
          "type": "steps",
          "items": [
            "Find the color and symbol of the next line on the station signs.",
            "On the platform, check that the direction is toward your destination.",
            "Check the destination shown on the train before boarding."
          ]
        },
        {
          "type": "p",
          "text": "In the figure below, you can hide and show lines to see how fewer lines make the map easier to read."
        },
        {
          "type": "html",
          "html": "<figure class=\"map\"><div class=\"map-head\"><div class=\"cap\">Figure: show <b>only the lines you need</b></div><p class=\"sub\">Tap a chip to hide or show a line.</p></div><div class=\"chips\" id=\"chips\" role=\"group\" aria-label=\"Choose which lines to show\"></div><div class=\"map-stage\"><svg viewBox=\"0 0 640 440\" role=\"img\" aria-label=\"Simplified concept map of major Tokyo lines\"><g id=\"g-yamanote\" class=\"ln\" data-line=\"yamanote\"><polygon points=\"210,95 420,110 470,250 380,365 200,345 150,205\" fill=\"none\" stroke=\"#7FBF3F\" stroke-width=\"7\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-chuo\" class=\"ln\" data-line=\"chuo\"><polyline points=\"150,205 300,225 400,205 470,250\" fill=\"none\" stroke=\"#E8542A\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-marunouchi\" class=\"ln\" data-line=\"marunouchi\"><polyline points=\"210,95 330,160 420,215 470,250\" fill=\"none\" stroke=\"#D9362C\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-ginza\" class=\"ln\" data-line=\"ginza\"><polyline points=\"200,345 275,302 450,302 440,200 420,110\" fill=\"none\" stroke=\"#F5A623\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-odakyu\" class=\"ln\" data-line=\"odakyu\"><polyline points=\"150,205 78,262 40,332\" fill=\"none\" stroke=\"#1F7FC4\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-tozai\" class=\"ln\" data-line=\"tozai\"><polyline points=\"70,168 250,196 420,215 575,215\" fill=\"none\" stroke=\"#16A7CE\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"nodes\"><g><circle cx=\"210\" cy=\"95\" r=\"7.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"2.6\"/><text class=\"st-label\" x=\"210\" y=\"78\" text-anchor=\"middle\">Ikebukuro</text></g><g><circle cx=\"470\" cy=\"250\" r=\"8.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"3\"/><text class=\"st-label\" x=\"484\" y=\"254\">Tokyo</text></g><g><circle cx=\"200\" cy=\"345\" r=\"8.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"3\"/><text class=\"st-label\" x=\"186\" y=\"366\" text-anchor=\"end\">Shibuya</text></g><g><circle cx=\"150\" cy=\"205\" r=\"8.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"3\"/><text class=\"st-label\" x=\"136\" y=\"200\" text-anchor=\"end\">Shinjuku</text></g></g></svg></div><div class=\"readout\" id=\"readout\">Lines shown: <b>6</b> / 6</div><div class=\"map-note\">This is a conceptual diagram.</div></figure>"
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.69,
              139.735
            ],
            "zoom": 12
          },
          "title": "{siteName} map (only the Yamanote Line shown)",
          "caption": "The live map (only the Yamanote Line shown). You can zoom and pan inside the frame."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "Open a map with only the Yamanote Line",
          "text": "The map opens with only the Yamanote Line. Add the lines you transfer to, one at a time."
        }
      ]
    },
    "zh": {
      "meta": {
        "title": "东京路线图怎么看：第一次坐也不迷路的3个诀窍",
        "description": "东京路线图看起来复杂，是因为多家公司的线路重叠在一张图上。只追一条线的颜色、看车站编号、在换乘站确认方向。本文用实际画面说明这3个诀窍。",
        "category": "新手指南",
        "kicker": "第一次坐东京电车",
        "readTime": "约 5 分钟阅读",
        "tag": "新手指南"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "不要读整张图，只追要坐的那一条线的颜色",
            "即使看不懂站名，也能从车站编号（例：<span class=\"mono\">JY01</span>）知道线路和顺序",
            "换乘时，先确认“往哪个方向”，再看线路名"
          ]
        },
        {
          "type": "h2",
          "text": "东京路线图看起来复杂的原因"
        },
        {
          "type": "p",
          "text": "JR、东京地铁、都营地铁和私铁等多家公司的线路重叠在一张图上。再加上直通运行，一趟列车可能中途驶入另一家公司的线路。想一次理解全部，就会不知道从哪里看起。"
        },
        {
          "type": "shot",
          "shot": "all-lines",
          "article": "flex-rail-map-introduction",
          "alt": "显示东京市中心全部15条主要线路的地图，线路和站名重叠",
          "caption": "显示全部市中心主要线路。线路重叠，很难追踪一条"
        },
        {
          "type": "h2",
          "text": "诀窍1：只追要坐的那一条线的颜色"
        },
        {
          "type": "p",
          "text": "决定要坐的线路后，只用眼睛追那个颜色。在{siteName}的“显示路线切换”中只保留山手线，就会像下图一样变成一个绿色的环。可以读出车站的顺序，以及在哪些站与其他线路相交。"
        },
        {
          "type": "shot",
          "shot": "one-line",
          "alt": "只显示山手线的地图，站名沿绿色环线排列",
          "caption": "只显示山手线。只有一条线时，车站顺序一目了然"
        },
        {
          "type": "h2",
          "text": "诀窍2和3：看车站编号和换乘站"
        },
        {
          "type": "p",
          "text": "车站编号中，字母代表线路，数字代表车站的顺序。例如山手线的东京站是 <span class=\"mono\">JY01</span>。看数字是变大还是变小，就知道前进的方向。"
        },
        {
          "type": "p",
          "text": "线路相交的车站就是换乘站。增加到山手线、中央线、丸之内线3条后，可以看到它们在新宿、东京等站相交。诀窍是只显示实际要换乘的线路。"
        },
        {
          "type": "shot",
          "shot": "three-lines",
          "alt": "只显示山手线、中央线、丸之内线3条线路的地图，在新宿和东京相交",
          "caption": "增加到3条线路后，能看出线路相交的车站（换乘站）"
        },
        {
          "type": "h2",
          "text": "换乘前先确认方向"
        },
        {
          "type": "steps",
          "items": [
            "在站内指示牌上找要换乘线路的颜色和符号。",
            "在站台确认列车的方向是否朝着目的地。",
            "看列车的终点站显示后再上车。"
          ]
        },
        {
          "type": "p",
          "text": "在下图中可以隐藏或显示线路，体会线路减少后地图变得好读。"
        },
        {
          "type": "html",
          "html": "<figure class=\"map\"><div class=\"map-head\"><div class=\"cap\">图：只显示<b>需要的线路</b></div><p class=\"sub\">点击标签可以隐藏或重新显示线路。</p></div><div class=\"chips\" id=\"chips\" role=\"group\" aria-label=\"切换显示的线路\"></div><div class=\"map-stage\"><svg viewBox=\"0 0 640 440\" role=\"img\" aria-label=\"东京主要线路的简化概念图\"><g id=\"g-yamanote\" class=\"ln\" data-line=\"yamanote\"><polygon points=\"210,95 420,110 470,250 380,365 200,345 150,205\" fill=\"none\" stroke=\"#7FBF3F\" stroke-width=\"7\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-chuo\" class=\"ln\" data-line=\"chuo\"><polyline points=\"150,205 300,225 400,205 470,250\" fill=\"none\" stroke=\"#E8542A\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-marunouchi\" class=\"ln\" data-line=\"marunouchi\"><polyline points=\"210,95 330,160 420,215 470,250\" fill=\"none\" stroke=\"#D9362C\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-ginza\" class=\"ln\" data-line=\"ginza\"><polyline points=\"200,345 275,302 450,302 440,200 420,110\" fill=\"none\" stroke=\"#F5A623\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-odakyu\" class=\"ln\" data-line=\"odakyu\"><polyline points=\"150,205 78,262 40,332\" fill=\"none\" stroke=\"#1F7FC4\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-tozai\" class=\"ln\" data-line=\"tozai\"><polyline points=\"70,168 250,196 420,215 575,215\" fill=\"none\" stroke=\"#16A7CE\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"nodes\"><g><circle cx=\"210\" cy=\"95\" r=\"7.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"2.6\"/><text class=\"st-label\" x=\"210\" y=\"78\" text-anchor=\"middle\">池袋</text></g><g><circle cx=\"470\" cy=\"250\" r=\"8.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"3\"/><text class=\"st-label\" x=\"484\" y=\"254\">东京</text></g><g><circle cx=\"200\" cy=\"345\" r=\"8.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"3\"/><text class=\"st-label\" x=\"186\" y=\"366\" text-anchor=\"end\">涩谷</text></g><g><circle cx=\"150\" cy=\"205\" r=\"8.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"3\"/><text class=\"st-label\" x=\"136\" y=\"200\" text-anchor=\"end\">新宿</text></g></g></svg></div><div class=\"readout\" id=\"readout\">显示中的线路：<b>6</b> / 6</div><div class=\"map-note\">※ 这是概念图。</div></figure>"
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.69,
              139.735
            ],
            "zoom": 12
          },
          "title": "{siteName}地图（只显示山手线）",
          "caption": "实际的地图（只显示山手线）。可以在框内缩放和移动。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "打开只显示山手线的地图",
          "text": "地图会以只显示山手线的状态打开。请逐条加上要换乘的线路。"
        }
      ]
    },
    "ko": {
      "meta": {
        "title": "도쿄 노선도 읽는 법: 처음이어도 헤매지 않는 3가지 요령",
        "description": "도쿄 노선도가 복잡해 보이는 이유는 여러 회사의 노선이 한 장에 겹쳐 있기 때문입니다. 한 노선의 색만 따라가기, 역 번호 보기, 환승역에서 방면 확인하기. 이 3가지 요령을 실제 화면으로 설명합니다.",
        "category": "초보자 가이드",
        "kicker": "처음 만나는 도쿄 전철",
        "readTime": "약 5분 읽기",
        "tag": "초보자 가이드"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "노선도 전체를 읽지 말고, 탈 노선 하나의 색만 따라간다",
            "역 이름을 못 읽어도 역 번호(예: <span class=\"mono\">JY01</span>)로 노선과 순서를 알 수 있다",
            "환승할 때는 노선 이름보다 먼저 “어느 방면인지”를 확인한다"
          ]
        },
        {
          "type": "h2",
          "text": "도쿄 노선도가 복잡해 보이는 이유"
        },
        {
          "type": "p",
          "text": "JR, 도쿄메트로, 도에이 지하철, 사철 등 여러 회사의 노선이 한 장의 그림에 겹쳐 있기 때문입니다. 게다가 직통 운행으로 한 열차가 도중에 다른 회사의 노선으로 들어가기도 합니다. 모든 것을 한 번에 이해하려 하면 어디서부터 봐야 할지 모르게 됩니다."
        },
        {
          "type": "shot",
          "shot": "all-lines",
          "article": "flex-rail-map-introduction",
          "alt": "도쿄 도심 주요 15개 노선을 모두 표시한 지도. 선과 역 이름이 겹쳐 있다",
          "caption": "도심 주요 노선을 모두 표시한 상태. 선이 겹쳐 하나를 따라가기 어렵다"
        },
        {
          "type": "h2",
          "text": "요령 1: 탈 노선 하나의 색만 따라간다"
        },
        {
          "type": "p",
          "text": "탈 노선을 하나 정했다면 그 색의 선만 눈으로 따라갑니다. {siteName}의 “표시 노선 전환”에서 야마노테선만 남기면 아래처럼 초록색 고리 하나가 됩니다. 역의 순서와 어느 역에서 다른 노선과 만나는지 읽을 수 있습니다."
        },
        {
          "type": "shot",
          "shot": "one-line",
          "alt": "야마노테선만 표시한 지도. 초록색 순환선을 따라 역 이름이 늘어서 있다",
          "caption": "야마노테선만 표시. 노선이 하나면 역 순서가 그대로 읽힌다"
        },
        {
          "type": "h2",
          "text": "요령 2·3: 역 번호와 환승역을 본다"
        },
        {
          "type": "p",
          "text": "역 번호에서 알파벳은 노선, 숫자는 역의 순서를 나타냅니다. 예를 들어 야마노테선의 도쿄역은 <span class=\"mono\">JY01</span>입니다. 숫자가 커지는 쪽인지 작아지는 쪽인지로 진행 방향을 알 수 있습니다."
        },
        {
          "type": "p",
          "text": "선과 선이 만나는 역이 환승역입니다. 야마노테선·주오선·마루노우치선 3개로 늘리면 신주쿠, 도쿄 등에서 선이 만나는 것이 보입니다. 표시할 노선은 실제로 갈아탈 노선만으로 줄이는 것이 요령입니다."
        },
        {
          "type": "shot",
          "shot": "three-lines",
          "alt": "야마노테선·주오선·마루노우치선 3개 노선만 표시한 지도. 신주쿠와 도쿄에서 선이 만난다",
          "caption": "3개 노선으로 늘리면 선이 만나는 역(환승역)을 알 수 있다"
        },
        {
          "type": "h2",
          "text": "환승은 “방면”을 확인한 뒤에"
        },
        {
          "type": "steps",
          "items": [
            "갈아탈 노선의 색과 기호를 역 안의 안내판에서 찾는다.",
            "승강장에서 행선지(방면)가 목적지 쪽인지 확인한다.",
            "열차의 행선지 표시를 보고 탄다."
          ]
        },
        {
          "type": "p",
          "text": "아래 그림에서 노선을 숨기거나 다시 표시하면서, 선이 줄면 읽기 쉬워지는 것을 직접 확인할 수 있습니다."
        },
        {
          "type": "html",
          "html": "<figure class=\"map\"><div class=\"map-head\"><div class=\"cap\">그림: <b>필요한 노선만</b> 표시해 보기</div><p class=\"sub\">칩을 누르면 노선을 숨기거나 다시 표시할 수 있습니다.</p></div><div class=\"chips\" id=\"chips\" role=\"group\" aria-label=\"표시할 노선 전환\"></div><div class=\"map-stage\"><svg viewBox=\"0 0 640 440\" role=\"img\" aria-label=\"도쿄 주요 노선을 단순화한 개념도\"><g id=\"g-yamanote\" class=\"ln\" data-line=\"yamanote\"><polygon points=\"210,95 420,110 470,250 380,365 200,345 150,205\" fill=\"none\" stroke=\"#7FBF3F\" stroke-width=\"7\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-chuo\" class=\"ln\" data-line=\"chuo\"><polyline points=\"150,205 300,225 400,205 470,250\" fill=\"none\" stroke=\"#E8542A\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-marunouchi\" class=\"ln\" data-line=\"marunouchi\"><polyline points=\"210,95 330,160 420,215 470,250\" fill=\"none\" stroke=\"#D9362C\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-ginza\" class=\"ln\" data-line=\"ginza\"><polyline points=\"200,345 275,302 450,302 440,200 420,110\" fill=\"none\" stroke=\"#F5A623\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-odakyu\" class=\"ln\" data-line=\"odakyu\"><polyline points=\"150,205 78,262 40,332\" fill=\"none\" stroke=\"#1F7FC4\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"g-tozai\" class=\"ln\" data-line=\"tozai\"><polyline points=\"70,168 250,196 420,215 575,215\" fill=\"none\" stroke=\"#16A7CE\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></g><g id=\"nodes\"><g><circle cx=\"210\" cy=\"95\" r=\"7.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"2.6\"/><text class=\"st-label\" x=\"210\" y=\"78\" text-anchor=\"middle\">이케부쿠로</text></g><g><circle cx=\"470\" cy=\"250\" r=\"8.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"3\"/><text class=\"st-label\" x=\"484\" y=\"254\">도쿄</text></g><g><circle cx=\"200\" cy=\"345\" r=\"8.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"3\"/><text class=\"st-label\" x=\"186\" y=\"366\" text-anchor=\"end\">시부야</text></g><g><circle cx=\"150\" cy=\"205\" r=\"8.5\" fill=\"#fff\" stroke=\"#211E18\" stroke-width=\"3\"/><text class=\"st-label\" x=\"136\" y=\"200\" text-anchor=\"end\">신주쿠</text></g></g></svg></div><div class=\"readout\" id=\"readout\">표시 중인 노선: <b>6</b> / 6</div><div class=\"map-note\">※ 개념도입니다.</div></figure>"
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.69,
              139.735
            ],
            "zoom": 12
          },
          "title": "{siteName} 지도(야마노테선만 표시한 상태)",
          "caption": "실제 지도(야마노테선만 표시한 상태). 틀 안에서 확대·이동할 수 있습니다."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "야마노테선만 표시한 지도 열기",
          "text": "야마노테선만 나온 상태로 열립니다. 갈아탈 노선을 하나씩 더해 보세요."
        }
      ]
    }
  }
};
