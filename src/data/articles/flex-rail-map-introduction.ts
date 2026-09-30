/**
 * 記事「Flex Railway Mapとは｜必要な路線だけを表示する路線図」（/articles/flex-rail-map-introduction）。
 * 書き方: docs/article-writing.md ／ 形: ./types.ts ／ 画像を撮る: npx tsx scripts/capture-article-screenshots.mts --only flex-rail-map-introduction
 * 値だけを書く（計算で組み立てない）。文章中のサービス名は {siteName} と書く。
 */
import type { ArticleSource } from './types';

export const flexRailMapIntroduction: ArticleSource = {
  "slug": "flex-rail-map-introduction",
  "publishedDate": "2025-06-06",
  "modifiedDate": "2026-09-29",
  "related": [
    "tokyo-train-map-beginner",
    "tokyo-sightseeing-routes",
    "commute-30min-cheap-rent"
  ],
  "keywordsJa": "フレックス路線図, 路線図 見にくい, 路線図 複雑, 必要な路線だけ, インタラクティブ路線図, 乗り換え 分かりやすい",
  "maps": {
    "main": {
      "from": "新宿",
      "to": "東京"
    }
  },
  "shots": {
    "all-lines": {
      "map": {
        "routes": [
          "yamanote",
          "chuo",
          "keihinTohoku",
          "jrSobuLine",
          "ginzaLine",
          "marunouchiLine",
          "hibiyaLine",
          "tozaiLine",
          "chiyodaLine",
          "yurakuchoLine",
          "hanzomonLine",
          "nambokuLine",
          "fukutoshinLine",
          "toeiAsakusaLine",
          "toeiOedoLine"
        ],
        "center": [
          35.683,
          139.745
        ],
        "zoom": 13
      },
      "collapsePanels": true
    },
    "route-only": {
      "map": {
        "from": "新宿",
        "to": "東京",
        "center": [
          35.684,
          139.735
        ],
        "zoom": 13
      }
    },
    "parallel": {
      "map": {
        "from": "藤沢",
        "to": "東京",
        "center": [
          35.52,
          139.6
        ],
        "zoom": 11
      },
      "collapsePanels": true
    }
  },
  "content": {
    "ja": {
      "meta": {
        "title": "{siteName}とは｜必要な路線だけを表示する路線図",
        "description": "東京の路線図は線が多すぎて、自分に関係する線を探すだけで疲れます。{siteName}は出発駅と到着駅を選ぶと、その移動に関係する路線だけを残す路線図です。実際の画面で、できることと使いどころを紹介します。",
        "category": "サービス紹介",
        "kicker": "サービス紹介",
        "readTime": "読了 約4分",
        "tag": "サービス紹介"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "東京の路線図が読みにくいのは、全路線が同時に出ているから",
            "{siteName}は出発駅と到着駅を選ぶと、その移動に関係する路線だけを残す",
            "乗換案内の「答え」と違い、同じ方向へ走る別の路線も自分の目で比べられる"
          ]
        },
        {
          "type": "h2",
          "text": "全部の路線が出ていると、自分の線が見つからない"
        },
        {
          "type": "p",
          "text": "都心の主要15路線を同時に表示すると、下の図のようになります。山手線の内側では線と駅名が重なり、どの色がどこへ向かうのかを追うだけで時間がかかります。駅の案内図が分かりにくいのも同じ理由です。情報が足りないのではなく、今の自分に関係のない情報が多すぎるのです。"
        },
        {
          "type": "shot",
          "shot": "all-lines",
          "alt": "都心の主要15路線をすべて表示した{siteName}の地図。山手線の内側で線と駅名が重なっている",
          "caption": "都心の主要15路線を同時に表示した状態。線と駅名が重なり、1本の線を追いにくい"
        },
        {
          "type": "h2",
          "text": "出発駅と到着駅を選ぶと、関係する路線だけが残る"
        },
        {
          "type": "p",
          "text": "{siteName}では、画面左上の「出発駅・到着駅を選択」に2つの駅を入れます。すると、2駅を結ぶ経路に使う路線と、2駅を通る路線だけが色付きで残り、それ以外は薄くなります。経路上の駅には、到着する時刻の目安も並びます。"
        },
        {
          "type": "shot",
          "shot": "route-only",
          "alt": "出発駅に新宿、到着駅に東京を選んだ画面。経路の丸ノ内線と、新宿・東京を通る路線だけが色付きで残っている",
          "caption": "新宿から東京を選んだところ。経路に使う丸ノ内線と、2駅を通る路線だけが残る"
        },
        {
          "type": "h2",
          "text": "答えを1つ出すのではなく、別の行き方も見える"
        },
        {
          "type": "p",
          "text": "乗換案内アプリは最適な経路を1つ出してくれますが、遅延や運休でその経路が使えなくなると、次にどうすればよいかまでは教えてくれません。路線だけを残した地図なら、同じ方向へ走る別の路線が目で見えます。"
        },
        {
          "type": "p",
          "text": "藤沢から東京の例では、東海道線のほかに、武蔵小杉を通る横須賀線や、蒲田を通る京浜東北線も同じ方向へ走っていることが分かります。1本が止まっても、どこで別の線に移れるかを自分で判断できます。"
        },
        {
          "type": "shot",
          "shot": "parallel",
          "alt": "出発駅に藤沢、到着駅に東京を選んだ地図。藤沢から東京まで複数の路線が並んで走っている",
          "caption": "藤沢から東京。1つの答えではなく、同じ方向へ走る路線がまとめて見える"
        },
        {
          "type": "h2",
          "text": "こんなときに使う"
        },
        {
          "type": "uses",
          "items": [
            {
              "title": "初めて乗る路線",
              "text": "土地勘がなくても、使う路線だけを表示して流れを追えます。"
            },
            {
              "title": "遅延・運休のとき",
              "text": "並んで走る路線と乗り換えられる駅を見ながら、迂回の道を選べます。"
            },
            {
              "title": "毎日の通勤",
              "text": "いつもの路線だけに絞って、分岐や行き先を素早く確かめられます。"
            },
            {
              "title": "駅名が読めないとき",
              "text": "英語・中国語・韓国語で表示でき、線の流れから進む方向をつかめます。"
            }
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.684,
              139.735
            ],
            "zoom": 13
          },
          "title": "{siteName}の地図（新宿から東京を選んだ状態）",
          "caption": "実際の地図（新宿から東京を選んだ状態）。枠の中で拡大・移動できます。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "新宿から東京の例をそのまま開く",
          "text": "出発駅と到着駅を入れた状態で地図が開きます。駅を変えて、自分の移動で試してください。"
        }
      ]
    },
    "en": {
      "meta": {
        "title": "What Is {siteName}? A Rail Map That Shows Only the Lines You Need",
        "description": "Tokyo rail maps show so many lines that finding yours is tiring. {siteName} keeps only the lines related to your trip once you pick a departure and arrival station. Real screenshots show what it does and when it helps.",
        "category": "Product Intro",
        "kicker": "Product Intro",
        "readTime": "About 4 min read",
        "tag": "Product Intro"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "Tokyo rail maps are hard to read because every line is shown at once",
            "Pick a departure and arrival station, and {siteName} keeps only the lines related to that trip",
            "Unlike a route-search answer, you can compare other lines running the same way with your own eyes"
          ]
        },
        {
          "type": "h2",
          "text": "With every line on screen, you cannot find yours"
        },
        {
          "type": "p",
          "text": "Showing 15 major central Tokyo lines at once looks like the image below. Inside the Yamanote Line loop, lines and station names overlap, and just following one color takes time. Station maps are hard for the same reason: the problem is not missing information, but too much information that has nothing to do with your trip."
        },
        {
          "type": "shot",
          "shot": "all-lines",
          "alt": "{siteName} map showing 15 major central Tokyo lines at once, with lines and station names overlapping inside the Yamanote Line loop",
          "caption": "Fifteen central lines shown together. Lines and names overlap, making a single line hard to follow"
        },
        {
          "type": "h2",
          "text": "Pick two stations and only the related lines remain"
        },
        {
          "type": "p",
          "text": "In {siteName}, enter two stations in \"Select Departure &amp; Arrival Stations\" at the top left. The lines used on the route between them and the lines passing through the two stations stay in color, and everything else fades. Stations on the route also show estimated arrival times."
        },
        {
          "type": "shot",
          "shot": "route-only",
          "alt": "Screen with Shinjuku as departure and Tokyo as arrival. Only the Marunouchi Line on the route and the lines through both stations stay in color",
          "caption": "Shinjuku to Tokyo. Only the Marunouchi Line used on the route and lines through the two stations remain"
        },
        {
          "type": "h2",
          "text": "Not one answer, but the other ways to go"
        },
        {
          "type": "p",
          "text": "Route-search apps give you one best route, but when a delay or suspension makes it unusable, they do not tell you what to do next. A map that keeps only the relevant lines lets you see other lines running in the same direction."
        },
        {
          "type": "p",
          "text": "From Fujisawa to Tokyo, you can see that besides the Tokaido Line, the Yokosuka Line through Musashi-kosugi and the Keihin-Tohoku Line through Kamata also run the same way. If one line stops, you can judge for yourself where to switch."
        },
        {
          "type": "shot",
          "shot": "parallel",
          "alt": "Map with Fujisawa as departure and Tokyo as arrival, showing several lines running side by side between them",
          "caption": "Fujisawa to Tokyo. Instead of a single answer, you see all the lines heading the same way"
        },
        {
          "type": "h2",
          "text": "When to use it"
        },
        {
          "type": "uses",
          "items": [
            {
              "title": "Unfamiliar lines",
              "text": "Even without local knowledge, you can follow only the lines you will use."
            },
            {
              "title": "Delays and suspensions",
              "text": "See the parallel lines and transfer stations, and choose a detour."
            },
            {
              "title": "Daily commuting",
              "text": "Keep only your usual lines and check branches and destinations quickly."
            },
            {
              "title": "When station names are hard to read",
              "text": "Switch to English, Chinese or Korean, and read direction from the flow of the line."
            }
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.684,
              139.735
            ],
            "zoom": 13
          },
          "title": "{siteName} map (Shinjuku to Tokyo selected)",
          "caption": "The live map (Shinjuku to Tokyo selected). You can zoom and pan inside the frame."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "Open the Shinjuku to Tokyo example",
          "text": "The map opens with the departure and arrival stations already set. Change the stations and try your own trip."
        }
      ]
    },
    "zh": {
      "meta": {
        "title": "{siteName}是什么：只显示需要线路的路线图",
        "description": "东京路线图的线路太多，光是找到和自己有关的线路就很累。{siteName}在选择出发站和到达站后，只保留与这次移动有关的线路。本文用实际画面介绍它能做什么、什么时候好用。",
        "category": "服务介绍",
        "kicker": "服务介绍",
        "readTime": "约 4 分钟阅读",
        "tag": "服务介绍"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "东京路线图难读，是因为所有线路同时显示",
            "选择出发站和到达站后，{siteName}只保留与这次移动有关的线路",
            "与换乘 App 给出的“答案”不同，可以亲眼比较同方向的其他线路"
          ]
        },
        {
          "type": "h2",
          "text": "所有线路都显示时，找不到自己的线"
        },
        {
          "type": "p",
          "text": "同时显示东京市中心的15条主要线路，就是下图的样子。山手线环内的线路和站名重叠，光是追踪某个颜色通往哪里就要花时间。车站的线路图难懂也是同样的原因：不是信息不够，而是与现在的自己无关的信息太多。"
        },
        {
          "type": "shot",
          "shot": "all-lines",
          "alt": "{siteName}同时显示东京市中心15条主要线路的地图，山手线环内线路和站名重叠",
          "caption": "同时显示15条市中心线路。线路和站名重叠，很难追踪一条线"
        },
        {
          "type": "h2",
          "text": "选择出发站和到达站，只留下相关线路"
        },
        {
          "type": "p",
          "text": "在{siteName}中，在左上角的“选择出发站和到达站”输入两个车站。连接两站的路线所用的线路，以及经过这两站的线路会保留颜色，其他线路会变淡。路线上的车站还会显示预计到达时间。"
        },
        {
          "type": "shot",
          "shot": "route-only",
          "alt": "出发站选新宿、到达站选东京的画面，只有路线上的丸之内线和经过两站的线路保留颜色",
          "caption": "从新宿到东京。只留下路线所用的丸之内线和经过两站的线路"
        },
        {
          "type": "h2",
          "text": "不只给出一个答案，也能看到其他走法"
        },
        {
          "type": "p",
          "text": "换乘 App 会给出一条最佳路线，但当延误或停运让这条路线无法使用时，它不会告诉你接下来该怎么办。只保留相关线路的地图，可以直接看到同方向的其他线路。"
        },
        {
          "type": "p",
          "text": "以藤泽到东京为例，除了东海道线，还能看到经过武藏小杉的横须贺线和经过蒲田的京滨东北线也朝同一方向行驶。即使一条线停运，也能自己判断在哪里换到别的线。"
        },
        {
          "type": "shot",
          "shot": "parallel",
          "alt": "出发站选藤泽、到达站选东京的地图，两站之间有多条线路并行",
          "caption": "藤泽到东京。看到的不是一个答案，而是同方向的所有线路"
        },
        {
          "type": "h2",
          "text": "适合使用的场景"
        },
        {
          "type": "uses",
          "items": [
            {
              "title": "第一次乘坐的线路",
              "text": "即使不熟悉当地，也能只显示要用的线路来追踪走向。"
            },
            {
              "title": "延误或停运时",
              "text": "看着并行线路和可换乘的车站，选择绕行路线。"
            },
            {
              "title": "日常通勤",
              "text": "只保留常用线路，快速确认分岔和目的地。"
            },
            {
              "title": "看不懂站名时",
              "text": "可切换为英语、中文或韩语，从线路走向判断方向。"
            }
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.684,
              139.735
            ],
            "zoom": 13
          },
          "title": "{siteName}地图（已选择新宿到东京）",
          "caption": "实际的地图（已选择新宿到东京）。可以在框内缩放和移动。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "直接打开新宿到东京的示例",
          "text": "地图会在已填好出发站和到达站的状态下打开。请换成自己的车站试试。"
        }
      ]
    },
    "ko": {
      "meta": {
        "title": "{siteName}란? 필요한 노선만 보여 주는 노선도",
        "description": "도쿄 노선도는 선이 너무 많아서 내게 필요한 선을 찾는 것만으로도 지칩니다. {siteName}은 출발역과 도착역을 고르면 그 이동에 관련된 노선만 남겨 줍니다. 실제 화면으로 할 수 있는 일과 쓰기 좋은 상황을 소개합니다.",
        "category": "서비스 소개",
        "kicker": "서비스 소개",
        "readTime": "약 4분 읽기",
        "tag": "서비스 소개"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "도쿄 노선도가 읽기 어려운 이유는 모든 노선이 한꺼번에 나오기 때문",
            "출발역과 도착역을 고르면 {siteName}이 그 이동에 관련된 노선만 남김",
            "환승 앱의 “정답”과 달리, 같은 방향으로 달리는 다른 노선도 직접 비교할 수 있음"
          ]
        },
        {
          "type": "h2",
          "text": "모든 노선이 나와 있으면 내 노선을 찾을 수 없다"
        },
        {
          "type": "p",
          "text": "도쿄 도심의 주요 15개 노선을 한꺼번에 표시하면 아래 그림처럼 됩니다. 야마노테선 안쪽은 선과 역 이름이 겹쳐서, 어떤 색이 어디로 가는지 따라가는 데만 시간이 걸립니다. 역의 노선 안내도가 어려운 것도 같은 이유입니다. 정보가 부족한 것이 아니라, 지금의 나와 상관없는 정보가 너무 많은 것입니다."
        },
        {
          "type": "shot",
          "shot": "all-lines",
          "alt": "도쿄 도심 주요 15개 노선을 모두 표시한 {siteName} 지도. 야마노테선 안쪽에서 선과 역 이름이 겹쳐 있다",
          "caption": "도심 15개 노선을 동시에 표시한 상태. 선과 역 이름이 겹쳐 한 노선을 따라가기 어렵다"
        },
        {
          "type": "h2",
          "text": "출발역과 도착역을 고르면 관련 노선만 남는다"
        },
        {
          "type": "p",
          "text": "{siteName}에서는 화면 왼쪽 위의 “출발역·도착역 선택”에 두 역을 입력합니다. 그러면 두 역을 잇는 경로에 쓰는 노선과 두 역을 지나는 노선만 색이 남고, 나머지는 흐려집니다. 경로 위의 역에는 도착 예상 시각도 표시됩니다."
        },
        {
          "type": "shot",
          "shot": "route-only",
          "alt": "출발역에 신주쿠, 도착역에 도쿄를 고른 화면. 경로의 마루노우치선과 두 역을 지나는 노선만 색이 남아 있다",
          "caption": "신주쿠에서 도쿄. 경로에 쓰는 마루노우치선과 두 역을 지나는 노선만 남는다"
        },
        {
          "type": "h2",
          "text": "정답 하나가 아니라 다른 길도 보인다"
        },
        {
          "type": "p",
          "text": "환승 앱은 최적 경로 하나를 알려 주지만, 지연이나 운휴로 그 경로를 쓸 수 없게 되면 다음에 어떻게 해야 할지는 알려 주지 않습니다. 관련 노선만 남긴 지도라면 같은 방향으로 달리는 다른 노선이 눈에 보입니다."
        },
        {
          "type": "p",
          "text": "후지사와에서 도쿄로 가는 예에서는 도카이도선 외에도 무사시고스기를 지나는 요코스카선, 가마타를 지나는 게이힌도호쿠선이 같은 방향으로 달린다는 것을 알 수 있습니다. 한 노선이 멈춰도 어디서 다른 노선으로 갈아탈지 스스로 판단할 수 있습니다."
        },
        {
          "type": "shot",
          "shot": "parallel",
          "alt": "출발역에 후지사와, 도착역에 도쿄를 고른 지도. 두 역 사이에 여러 노선이 나란히 달리고 있다",
          "caption": "후지사와에서 도쿄. 정답 하나가 아니라 같은 방향으로 가는 노선이 한눈에 보인다"
        },
        {
          "type": "h2",
          "text": "이럴 때 쓴다"
        },
        {
          "type": "uses",
          "items": [
            {
              "title": "처음 타는 노선",
              "text": "지리를 몰라도 쓸 노선만 표시해 흐름을 따라갈 수 있습니다."
            },
            {
              "title": "지연·운휴 때",
              "text": "나란히 달리는 노선과 환승역을 보면서 우회 경로를 고를 수 있습니다."
            },
            {
              "title": "매일 통근",
              "text": "평소 노선만 남겨 분기와 행선지를 빠르게 확인할 수 있습니다."
            },
            {
              "title": "역 이름을 읽기 어려울 때",
              "text": "영어·중국어·한국어로 바꿀 수 있고, 선의 흐름으로 방향을 잡을 수 있습니다."
            }
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.684,
              139.735
            ],
            "zoom": 13
          },
          "title": "{siteName} 지도(신주쿠→도쿄를 고른 상태)",
          "caption": "실제 지도(신주쿠→도쿄를 고른 상태). 틀 안에서 확대·이동할 수 있습니다."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "신주쿠→도쿄 예시를 그대로 열기",
          "text": "출발역과 도착역이 입력된 상태로 지도가 열립니다. 역을 바꿔 내 이동으로 시험해 보세요."
        }
      ]
    }
  }
};
