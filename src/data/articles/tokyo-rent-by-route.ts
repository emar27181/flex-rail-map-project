/**
 * 記事「家賃を沿線で比べる方法｜候補駅を絞って条件をそろえる」（/articles/tokyo-rent-by-route）。
 * 書き方: docs/article-writing.md ／ 形: ./types.ts ／ 画面はプレビューで確認する（iframe で埋め込む）
 * 値だけを書く（計算で組み立てない）。文章中のサービス名は {siteName} と書く。
 */
import type { ArticleSource } from './types';

export const tokyoRentByRoute: ArticleSource = {
  "slug": "tokyo-rent-by-route",
  "publishedDate": "2025-06-06",
  "modifiedDate": "2026-09-29",
  "related": [
    "commute-30min-cheap-rent",
    "tokyo-safe-area-by-route",
    "tokyo-train-map-beginner"
  ],
  "keywordsJa": "東京 家賃 沿線 比較, 家賃 比べ方, 住む駅 選び方, 東急東横線 駅, 1K 家賃 条件",
  "maps": {
    "main": {
      "from": "渋谷"
    }
  },
  "shots": {
    "from-shibuya": {
      "map": {
        "from": "渋谷",
        "center": [
          35.62,
          139.67
        ],
        "zoom": 12
      }
    },
    "line-stations": {
      "page": "/lines/tokyu-toyoko-line",
      "scrollToHeading": "stationList",
      "anchor": "station-list"
    }
  },
  "content": {
    "ja": {
      "meta": {
        "title": "家賃を沿線で比べる方法｜候補駅を絞って条件をそろえる",
        "description": "「◯◯線は家賃が安い」といった沿線単位の比較では、住む駅は決まりません。通える駅を地図で絞り、沿線の駅を順に並べ、同じ条件の募集物件で比べる手順を紹介します。",
        "category": "引っ越し・沿線比較",
        "kicker": "住まいガイド",
        "readTime": "読了 約5分",
        "tag": "家賃ガイド"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "家賃は沿線ではなく駅ごとに違う。沿線名で比べない",
            "通える駅を地図で絞ってから、沿線の駅を順に並べて候補を出す",
            "家賃は、間取り・面積・築年数・駅徒歩をそろえた募集物件で比べる"
          ]
        },
        {
          "type": "h2",
          "text": "沿線名で比べても住む駅は決まらない"
        },
        {
          "type": "p",
          "text": "1本の沿線には、ターミナル駅のそばの駅から郊外の駅まで並んでいて、家賃も街の様子も駅ごとに違います。「◯◯線は高い」「△△線は安い」といった沿線単位の話は、どの駅を比べたかで結論が変わります。比べる単位は、沿線ではなく駅です。"
        },
        {
          "type": "h2",
          "text": "通える駅を地図で絞る"
        },
        {
          "type": "p",
          "text": "まず、職場や学校の最寄り駅を{siteName}の出発駅に入れ、そこから伸びる路線を見ます。渋谷なら、東急東横線・東急田園都市線・京王井の頭線などが西から南西へ伸びているのが分かります。乗り換えなしで通える路線から候補にすると、通勤の負担もそろえて比べられます。"
        },
        {
          "type": "shot",
          "shot": "from-shibuya",
          "alt": "出発駅に渋谷を選んだ地図。東急東横線・東急田園都市線・京王井の頭線などが西から南西へ伸びている",
          "caption": "渋谷を出発駅にした状態。渋谷を通る路線がどの方向へ伸びるかが分かる"
        },
        {
          "type": "h2",
          "text": "沿線の駅を順に並べる"
        },
        {
          "type": "p",
          "text": "候補の路線が決まったら、路線のページで駅を順番に確かめます。東急東横線のページには、渋谷から横浜までの21駅が順に並び、それぞれの駅で乗り換えられる路線も書いてあります。乗り換えられる駅と、その隣の駅とでは通勤の選択肢が変わるので、両方を候補に入れて比べます。"
        },
        {
          "type": "shot",
          "shot": "line-stations",
          "alt": "東急東横線のページ。渋谷から順に、駅と乗り換えられる路線が並んだ表",
          "caption": "東急東横線のページ。駅の順番と、乗り換えられる路線が一覧で分かる"
        },
        {
          "type": "h2",
          "text": "条件をそろえて家賃を比べる"
        },
        {
          "type": "p",
          "text": "候補の駅が決まったら、不動産サイトで駅ごとに募集物件を探し、次の条件をそろえて比べます。1件だけ極端に安い物件を、その駅の相場と考えないようにします。"
        },
        {
          "type": "table",
          "head": [
            "項目",
            "そろえ方"
          ],
          "rows": [
            [
              "間取り・面積",
              "同じ1Kでも広さが違うので、両方を指定する"
            ],
            [
              "築年数・設備",
              "範囲を決め、譲れない設備を決めておく"
            ],
            [
              "駅徒歩",
              "表示の分数に加え、使う出口と実際の道を確かめる"
            ],
            [
              "毎月の費用",
              "家賃に管理費・共益費を足した額で比べる"
            ],
            [
              "初期・更新の費用",
              "毎月の費用とは分けて記録する"
            ],
            [
              "時点",
              "掲載日・確認日と物件のURLを残す"
            ]
          ]
        },
        {
          "type": "p",
          "text": "{siteName}では家賃を比較の材料として出していません。手元にあるのは推定値だけで、確かな公開データが無いためです（推定値は既定で表示しません）。家賃は、必ず募集中の物件の情報で確かめてください。"
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.62,
              139.67
            ],
            "zoom": 12
          },
          "title": "{siteName}の地図（渋谷を出発駅にした状態）",
          "caption": "実際の地図（渋谷を出発駅にした状態）。枠の中で拡大・移動できます。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "渋谷を出発駅にした地図を開く",
          "text": "出発駅を、自分の職場や学校の最寄り駅に変えて使ってください。"
        }
      ]
    },
    "en": {
      "meta": {
        "title": "How to Compare Rent Along Rail Lines: Shortlist Stations and Match the Conditions",
        "description": "Saying \"this line has cheap rent\" will not pick a station for you. Shortlist stations you can commute from on the map, list the stations along each line in order, and compare listings with matching conditions.",
        "category": "Moving / Line Comparison",
        "kicker": "Living Guide",
        "readTime": "About 5 min read",
        "tag": "Rent Guide"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "Rent differs by station, not by line. Do not compare line names",
            "Shortlist commutable stations on the map, then list the stations along each line",
            "Compare rent using listings with the same layout, floor area, building age and walking time"
          ]
        },
        {
          "type": "h2",
          "text": "Comparing line names will not pick your station"
        },
        {
          "type": "p",
          "text": "A single line runs from stations next to a big terminal out to the suburbs, and rent and atmosphere change station by station. Claims such as \"this line is expensive\" or \"that line is cheap\" depend on which stations were compared. Compare stations, not lines."
        },
        {
          "type": "h2",
          "text": "Shortlist commutable stations on the map"
        },
        {
          "type": "p",
          "text": "First, enter the station nearest your work or school as the departure in {siteName} and look at the lines leaving it. From Shibuya, you can see the Tokyu Toyoko Line, Tokyu Den-en-toshi Line, Keio Inokashira Line and others heading west and southwest. Starting from lines with no transfer keeps commuting effort comparable too."
        },
        {
          "type": "shot",
          "shot": "from-shibuya",
          "alt": "Map with Shibuya as the departure. The Tokyu Toyoko, Tokyu Den-en-toshi and Keio Inokashira lines and others head west and southwest",
          "caption": "Shibuya set as the departure. You can see which way each line through Shibuya heads"
        },
        {
          "type": "h2",
          "text": "List the stations along the line in order"
        },
        {
          "type": "p",
          "text": "Once you have candidate lines, check their stations in order on the line pages. The Tokyu Toyoko Line page lists 21 stations from Shibuya to Yokohama in order, with the lines you can transfer to at each. A transfer station and the station next to it offer different commuting options, so include both as candidates."
        },
        {
          "type": "shot",
          "shot": "line-stations",
          "alt": "The Tokyu Toyoko Line page, with a table of stations from Shibuya in order and their transfer lines",
          "caption": "The Tokyu Toyoko Line page. Station order and transfer lines at a glance"
        },
        {
          "type": "h2",
          "text": "Compare rent with matching conditions"
        },
        {
          "type": "p",
          "text": "With your candidate stations set, search listings for each station on real estate sites and match the conditions below. Do not treat a single unusually cheap listing as the going rate for that station."
        },
        {
          "type": "table",
          "head": [
            "Item",
            "How to match"
          ],
          "rows": [
            [
              "Layout and floor area",
              "Two 1K units can differ in size, so specify both"
            ],
            [
              "Building age and features",
              "Set a range and decide your must-have features"
            ],
            [
              "Walk to station",
              "Besides the listed minutes, check the exit you will use and the actual route"
            ],
            [
              "Monthly cost",
              "Compare rent plus management and common fees"
            ],
            [
              "Move-in and renewal costs",
              "Record them separately from monthly costs"
            ],
            [
              "Date",
              "Keep the listing date, the date you checked, and the listing URL"
            ]
          ]
        },
        {
          "type": "p",
          "text": "{siteName} does not provide rent as a basis for comparison. We only have estimated values and no reliable public data (estimates are hidden by default). Always check rent against current listings."
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.62,
              139.67
            ],
            "zoom": 12
          },
          "title": "{siteName} map (Shibuya set as the departure)",
          "caption": "The live map (Shibuya set as the departure). You can zoom and pan inside the frame."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "Open a map with Shibuya as the departure",
          "text": "Change the departure to the station nearest your work or school."
        }
      ]
    },
    "zh": {
      "meta": {
        "title": "按沿线比较租金的方法：先缩小候选车站，再统一条件",
        "description": "“某某线租金便宜”这种按沿线的比较，无法决定要住的车站。本文介绍在地图上筛选能通勤的车站、按顺序列出沿线车站、再用相同条件的房源比较的步骤。",
        "category": "搬家・沿线比较",
        "kicker": "居住指南",
        "readTime": "约 5 分钟阅读",
        "tag": "租金指南"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "租金按车站不同，而不是按沿线。不要用线路名比较",
            "先在地图上筛选能通勤的车站，再按顺序列出沿线车站作为候选",
            "用户型、面积、楼龄、步行时间相同的房源比较租金"
          ]
        },
        {
          "type": "h2",
          "text": "用线路名比较，决定不了要住的车站"
        },
        {
          "type": "p",
          "text": "一条线路上既有靠近枢纽站的车站，也有郊外的车站，租金和街区氛围逐站不同。“某某线贵”“某某线便宜”这类按沿线的说法，结论取决于比较了哪些车站。比较的单位应该是车站，而不是线路。"
        },
        {
          "type": "h2",
          "text": "在地图上筛选能通勤的车站"
        },
        {
          "type": "p",
          "text": "首先，把公司或学校最近的车站填入{siteName}的出发站，看从那里延伸出去的线路。以涩谷为例，可以看到东急东横线、东急田园都市线、京王井之头线等向西和西南方向延伸。先从不用换乘就能通勤的线路选候选，通勤负担也能放在同一条件下比较。"
        },
        {
          "type": "shot",
          "shot": "from-shibuya",
          "alt": "出发站选涩谷的地图，东急东横线、东急田园都市线、京王井之头线等向西和西南延伸",
          "caption": "把涩谷设为出发站。可以看出经过涩谷的各线路往哪个方向延伸"
        },
        {
          "type": "h2",
          "text": "按顺序列出沿线车站"
        },
        {
          "type": "p",
          "text": "确定候选线路后，在线路页面按顺序确认车站。东急东横线的页面按顺序列出从涩谷到横滨的21个车站，并写明每站可换乘的线路。可换乘的车站和它旁边的车站，通勤选择不同，所以两者都列入候选比较。"
        },
        {
          "type": "shot",
          "shot": "line-stations",
          "alt": "东急东横线的页面，表格从涩谷起按顺序列出车站和可换乘的线路",
          "caption": "东急东横线的页面。车站顺序和可换乘的线路一目了然"
        },
        {
          "type": "h2",
          "text": "统一条件后比较租金"
        },
        {
          "type": "p",
          "text": "确定候选车站后，在房产网站上按车站搜索出租房源，并统一以下条件进行比较。不要把某一套特别便宜的房子当成该站的行情。"
        },
        {
          "type": "table",
          "head": [
            "项目",
            "统一方法"
          ],
          "rows": [
            [
              "户型・面积",
              "同样是1K，面积也不同，两者都要指定"
            ],
            [
              "楼龄・设备",
              "定好范围，并确定不能妥协的设备"
            ],
            [
              "步行到车站",
              "除了标注的分钟数，还要确认要用的出口和实际道路"
            ],
            [
              "每月费用",
              "用租金加管理费・共益费的金额比较"
            ],
            [
              "入住・续约费用",
              "与每月费用分开记录"
            ],
            [
              "时间",
              "保留刊登日期、确认日期和房源网址"
            ]
          ]
        },
        {
          "type": "p",
          "text": "{siteName}不提供租金作为比较依据。因为我们手上只有推算值，没有可靠的公开数据（推算值默认不显示）。租金请务必以正在招租的房源信息为准。"
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.62,
              139.67
            ],
            "zoom": 12
          },
          "title": "{siteName}地图（把涩谷设为出发站）",
          "caption": "实际的地图（把涩谷设为出发站）。可以在框内缩放和移动。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "打开以涩谷为出发站的地图",
          "text": "请把出发站换成自己公司或学校最近的车站。"
        }
      ]
    },
    "ko": {
      "meta": {
        "title": "노선별로 월세 비교하는 법: 후보 역을 좁히고 조건을 맞춘다",
        "description": "“○○선은 월세가 싸다” 같은 노선 단위 비교로는 살 역이 정해지지 않습니다. 지도에서 통근 가능한 역을 좁히고, 노선의 역을 순서대로 늘어놓고, 같은 조건의 매물로 비교하는 순서를 소개합니다.",
        "category": "이사・노선 비교",
        "kicker": "주거 가이드",
        "readTime": "약 5분 읽기",
        "tag": "월세 가이드"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "월세는 노선이 아니라 역마다 다르다. 노선 이름으로 비교하지 않는다",
            "통근 가능한 역을 지도에서 좁힌 뒤, 노선의 역을 순서대로 늘어놓고 후보를 뽑는다",
            "월세는 구조·면적·연식·역 도보를 맞춘 매물로 비교한다"
          ]
        },
        {
          "type": "h2",
          "text": "노선 이름으로 비교해서는 살 역이 정해지지 않는다"
        },
        {
          "type": "p",
          "text": "한 노선에는 터미널역 근처의 역부터 교외의 역까지 늘어서 있고, 월세도 동네 분위기도 역마다 다릅니다. “○○선은 비싸다”, “△△선은 싸다” 같은 노선 단위 이야기는 어느 역을 비교했느냐에 따라 결론이 바뀝니다. 비교 단위는 노선이 아니라 역입니다."
        },
        {
          "type": "h2",
          "text": "통근 가능한 역을 지도에서 좁힌다"
        },
        {
          "type": "p",
          "text": "먼저 회사나 학교에서 가까운 역을 {siteName}의 출발역에 넣고 거기서 뻗어 나가는 노선을 봅니다. 시부야라면 도큐 도요코선·도큐 덴엔토시선·게이오 이노카시라선 등이 서쪽과 남서쪽으로 뻗어 있는 것을 알 수 있습니다. 환승 없이 다닐 수 있는 노선부터 후보로 삼으면 통근 부담도 같은 조건으로 비교할 수 있습니다."
        },
        {
          "type": "shot",
          "shot": "from-shibuya",
          "alt": "출발역에 시부야를 고른 지도. 도큐 도요코선·도큐 덴엔토시선·게이오 이노카시라선 등이 서쪽과 남서쪽으로 뻗어 있다",
          "caption": "시부야를 출발역으로 둔 상태. 시부야를 지나는 노선이 어느 방향으로 뻗는지 알 수 있다"
        },
        {
          "type": "h2",
          "text": "노선의 역을 순서대로 늘어놓는다"
        },
        {
          "type": "p",
          "text": "후보 노선이 정해지면 노선 페이지에서 역을 순서대로 확인합니다. 도큐 도요코선 페이지에는 시부야부터 요코하마까지 21개 역이 순서대로 나오고, 역마다 갈아탈 수 있는 노선도 적혀 있습니다. 환승역과 그 옆 역은 통근 선택지가 다르므로 둘 다 후보에 넣어 비교합니다."
        },
        {
          "type": "shot",
          "shot": "line-stations",
          "alt": "도큐 도요코선 페이지. 시부야부터 순서대로 역과 갈아탈 수 있는 노선이 나온 표",
          "caption": "도큐 도요코선 페이지. 역 순서와 갈아탈 수 있는 노선을 한눈에 알 수 있다"
        },
        {
          "type": "h2",
          "text": "조건을 맞춰 월세를 비교한다"
        },
        {
          "type": "p",
          "text": "후보 역이 정해지면 부동산 사이트에서 역마다 매물을 찾고, 아래 조건을 맞춰 비교합니다. 한 건만 유난히 싼 매물을 그 역의 시세로 여기지 않도록 합니다."
        },
        {
          "type": "table",
          "head": [
            "항목",
            "맞추는 법"
          ],
          "rows": [
            [
              "구조·면적",
              "같은 1K라도 넓이가 다르므로 둘 다 지정한다"
            ],
            [
              "연식·설비",
              "범위를 정하고 양보할 수 없는 설비를 정해 둔다"
            ],
            [
              "역 도보",
              "표시된 분 외에 쓸 출구와 실제 길을 확인한다"
            ],
            [
              "매월 비용",
              "월세에 관리비·공익비를 더한 금액으로 비교한다"
            ],
            [
              "입주·갱신 비용",
              "매월 비용과 따로 기록한다"
            ],
            [
              "시점",
              "게재일·확인일과 매물 URL을 남긴다"
            ]
          ]
        },
        {
          "type": "p",
          "text": "{siteName}은 월세를 비교 자료로 제공하지 않습니다. 가진 것이 추정값뿐이고 확실한 공개 데이터가 없기 때문입니다(추정값은 기본적으로 표시하지 않습니다). 월세는 반드시 모집 중인 매물 정보로 확인하세요."
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.62,
              139.67
            ],
            "zoom": 12
          },
          "title": "{siteName} 지도(시부야를 출발역으로 둔 상태)",
          "caption": "실제 지도(시부야를 출발역으로 둔 상태). 틀 안에서 확대·이동할 수 있습니다."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "시부야를 출발역으로 둔 지도 열기",
          "text": "출발역을 내 회사나 학교에서 가까운 역으로 바꿔서 쓰세요."
        }
      ]
    }
  }
};
