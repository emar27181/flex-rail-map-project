/**
 * 記事「通勤時間から住む駅を探す｜職場の駅から逆算する方法」（/articles/commute-30min-cheap-rent）。
 * 書き方: docs/article-writing.md ／ 形: ./types.ts ／ 画面はプレビューで確認する（iframe で埋め込む）
 * 値だけを書く（計算で組み立てない）。文章中のサービス名は {siteName} と書く。
 */
import type { ArticleSource } from './types';

export const commute30minCheapRent: ArticleSource = {
  "slug": "commute-30min-cheap-rent",
  "publishedDate": "2025-06-06",
  "modifiedDate": "2026-10-06",
  "related": [
    "tokyo-rent-by-route",
    "tokyo-safe-area-by-route",
    "tokyo-train-map-beginner"
  ],
  "keywordsJa": "通勤時間 住む駅, 通勤30分, 職場 最寄り駅, 引っ越し 駅 選び方, 所要時間",
  "maps": {
    "main": {
      "from": "武蔵小杉"
    }
  },
  "shots": {
    "from-work": {
      "map": {
        "from": "武蔵小杉",
        "center": [
          35.58,
          139.65
        ],
        "zoom": 11
      }
    },
    "travel-times": {
      "map": {
        "from": "武蔵小杉",
        "center": [
          35.576,
          139.66
        ],
        "zoom": 12,
        "travelTimes": true
      }
    }
  },
  "content": {
    "ja": {
      "meta": {
        "title": "通勤時間から住む駅を探す｜職場の駅から逆算する方法",
        "description": "住む駅は、家賃や街の印象より先に「職場まで何分か」で絞ると決めやすくなります。職場の最寄り駅を出発駅にして、地図で駅ごとの所要時間を見る手順と、時刻表で確かめるときの注意点を紹介します。",
        "category": "引っ越し・住まい",
        "kicker": "住まいガイド",
        "readTime": "読了 約5分",
        "tag": "通勤ガイド"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "「通勤30分」は、玄関から職場の入口までで数える",
            "職場の最寄り駅を出発駅にすると、そこから伸びる路線が一度に見える",
            "地図の所要時間は目安。候補を決めたら、通勤する時間帯の時刻表で確かめる"
          ]
        },
        {
          "type": "h2",
          "text": "「通勤30分」は何の30分か"
        },
        {
          "type": "p",
          "text": "同じ「30分」でも、電車に乗っている時間だけなのか、家を出てから職場に着くまでなのかで、住める範囲は大きく変わります。駅まで歩いて10分、待ち時間と乗り換えで5分かかれば、電車に乗れるのは15分だけです。まず、次の4つに分けて考えます。"
        },
        {
          "type": "table",
          "head": [
            "区間",
            "確かめること"
          ],
          "rows": [
            [
              "家から駅",
              "物件の「駅徒歩◯分」は道のり80mを1分として計算した値。信号や坂は含まない"
            ],
            [
              "駅での待ち・乗り換え",
              "通勤する時間帯の運転間隔と、乗り換えで歩く距離"
            ],
            [
              "乗車",
              "地図の所要時間で見当をつけ、時刻表で確かめる"
            ],
            [
              "駅から職場",
              "実際に使う出口から職場の入口まで"
            ]
          ]
        },
        {
          "type": "h2",
          "text": "職場の最寄り駅を出発駅にする"
        },
        {
          "type": "p",
          "text": "{siteName}で、職場の最寄り駅を「出発駅」に入れます。到着駅は空けたままで構いません。その駅を通る路線が地図に残るので、どの方向に何本の路線が伸びているかが分かります。武蔵小杉駅なら、駅を通る7路線が渋谷・横浜・川崎・立川・海老名などの方向に伸び、そのまま乗り入れる路線（みなとみらい線・副都心線など）も合わせて16路線が残ります（2026年10月時点の{siteName}のデータ）。"
        },
        {
          "type": "shot",
          "shot": "from-work",
          "alt": "出発駅に武蔵小杉を選んだ地図。武蔵小杉駅を通る路線が各方向に伸びている",
          "caption": "武蔵小杉駅を出発駅にした状態。武蔵小杉駅を通る路線だけが残る（右上の「表示路線の切替」を開くと一覧が出る）"
        },
        {
          "type": "h2",
          "text": "駅と駅の間の所要時間を表示する"
        },
        {
          "type": "p",
          "text": "「所要時間を表示」を押すと、駅と駅の間に丸い数字（分）が出ます。職場の駅から候補の駅まで、この数字を足していけば乗車時間の目安になります。乗車時間が分かれば、01で決めた全体の時間から逆算して、どこまでなら住めるかが見えてきます。"
        },
        {
          "type": "p",
          "text": "ただし、この数字は駅間のおおよその時間です。各駅停車か快速か、待ち時間、乗り換えで歩く時間は含みません。"
        },
        {
          "type": "shot",
          "shot": "travel-times",
          "alt": "「所要時間を表示」をオンにした地図。駅と駅の間に分数を示す丸い数字が並んでいる",
          "caption": "「所要時間を表示」をオン。駅間の丸い数字が所要時間（分）の目安"
        },
        {
          "type": "h2",
          "text": "候補の駅を時刻表で確かめる"
        },
        {
          "type": "steps",
          "items": [
            "地図で、職場から乗り換えなしか1回で行ける駅を3〜5駅選ぶ。",
            "通勤する曜日・時刻で、鉄道会社の時刻表や乗換案内を調べる。",
            "帰りの時間帯の本数と終電も確かめる。",
            "残った駅で、家賃と周辺の環境を比べる。"
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.58,
              139.65
            ],
            "zoom": 11
          },
          "title": "{siteName}の地図（武蔵小杉駅を出発駅にした状態）",
          "caption": "実際の地図（武蔵小杉駅を出発駅にした状態）。枠の中で拡大・移動できます。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "武蔵小杉駅を出発駅にした地図を開く",
          "text": "出発駅を、自分の職場の最寄り駅に変えて使ってください。"
        }
      ]
    },
    "en": {
      "meta": {
        "title": "Find Where to Live by Commute Time: Work Backward from Your Office Station",
        "description": "Choosing a station is easier if you narrow it down by minutes to work before rent or neighborhood image. Set your office station as the departure, read travel times on the map, then confirm them in timetables.",
        "category": "Moving / Living",
        "kicker": "Living Guide",
        "readTime": "About 5 min read",
        "tag": "Commute Guide"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "Count a \"30-minute commute\" from your front door to the office entrance",
            "Set your office station as the departure to see every line leaving it at once",
            "Map travel times are estimates. Once you have candidates, confirm them in timetables for your commuting hours"
          ]
        },
        {
          "type": "h2",
          "text": "What does \"30 minutes\" include?"
        },
        {
          "type": "p",
          "text": "A \"30-minute commute\" covers a very different area depending on whether it means time on the train or door to door. If the walk to the station takes 10 minutes and waiting and transfers take 5, you only have 15 minutes on the train. Start by splitting the trip into four parts."
        },
        {
          "type": "table",
          "head": [
            "Part",
            "What to check"
          ],
          "rows": [
            [
              "Home to station",
              "Walking times in Japanese listings assume 80 m per minute and ignore traffic lights and slopes"
            ],
            [
              "Waiting and transfers",
              "Train frequency at your commuting hours and walking distance for transfers"
            ],
            [
              "On the train",
              "Estimate with map travel times, then confirm in timetables"
            ],
            [
              "Station to office",
              "From the exit you will actually use to the office entrance"
            ]
          ]
        },
        {
          "type": "h2",
          "text": "Set your office station as the departure"
        },
        {
          "type": "p",
          "text": "In {siteName}, enter your office's nearest station as the \"Departure\". You can leave the arrival empty. The lines through that station stay on the map, showing how many lines head in which directions. From Musashi-kosugi Station, the 7 lines through the station head toward Shibuya, Yokohama, Kawasaki, Tachikawa, Ebina and more, and with the lines they run through to (such as the Minatomirai Line and Fukutoshin Line), 16 lines remain ({siteName} data as of October 2026)."
        },
        {
          "type": "shot",
          "shot": "from-work",
          "alt": "Map with Musashi-kosugi as the departure station. Lines through Musashi-kosugi Station head in several directions",
          "caption": "Musashi-kosugi Station set as the departure. Only the lines through Musashi-kosugi Station remain (open \"Route Display Toggle\" at the top right for the list)"
        },
        {
          "type": "h2",
          "text": "Show the travel time between stations"
        },
        {
          "type": "p",
          "text": "Press \"Show Travel Times\" and small circled numbers (minutes) appear between stations. Add them up from your office station to a candidate station to estimate time on the train. Then work backward from the total time you set in step 1 to see how far out you can live."
        },
        {
          "type": "p",
          "text": "These numbers are rough times between stations. They do not reflect local versus rapid trains, waiting time, or walking time for transfers."
        },
        {
          "type": "shot",
          "shot": "travel-times",
          "alt": "Map with \"Show Travel Times\" on. Circled numbers showing minutes appear between stations",
          "caption": "\"Show Travel Times\" on. The circled numbers between stations are estimated minutes"
        },
        {
          "type": "h2",
          "text": "Confirm candidate stations in timetables"
        },
        {
          "type": "steps",
          "items": [
            "On the map, pick 3–5 stations reachable from work with no transfer or one transfer.",
            "Look up railway timetables or a route planner for the days and times you commute.",
            "Check evening frequency and the last train home, too.",
            "Compare rent and surroundings for the stations that remain."
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.58,
              139.65
            ],
            "zoom": 11
          },
          "title": "{siteName} map (Musashi-kosugi set as the departure)",
          "caption": "The live map (Musashi-kosugi set as the departure). You can zoom and pan inside the frame."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "Open a map with Musashi-kosugi as the departure",
          "text": "Change the departure to the station nearest your own office."
        }
      ]
    },
    "zh": {
      "meta": {
        "title": "从通勤时间找住的车站：从公司所在车站反推",
        "description": "选住的车站时，先按“到公司要几分钟”来缩小范围，比先看租金或街区印象更容易决定。本文介绍把公司最近的车站设为出发站、在地图上看各站所需时间的步骤，以及用时刻表确认时的注意点。",
        "category": "搬家・居住",
        "kicker": "居住指南",
        "readTime": "约 5 分钟阅读",
        "tag": "通勤指南"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "“通勤30分钟”要从家门口算到公司门口",
            "把公司最近的车站设为出发站，就能一次看到从那里延伸出去的线路",
            "地图上的所需时间只是参考。确定候选后，要用通勤时段的时刻表确认"
          ]
        },
        {
          "type": "h2",
          "text": "“通勤30分钟”指的是哪30分钟"
        },
        {
          "type": "p",
          "text": "同样是“30分钟”，只算乘车时间，还是从出家门到到达公司，能住的范围差别很大。如果走到车站要10分钟，等车和换乘要5分钟，能坐车的时间就只有15分钟。首先把通勤分成下面4段来考虑。"
        },
        {
          "type": "table",
          "head": [
            "区段",
            "要确认的内容"
          ],
          "rows": [
            [
              "家到车站",
              "日本房源的“距车站步行○分钟”按道路距离80米为1分钟计算，不含红绿灯和坡道"
            ],
            [
              "候车・换乘",
              "通勤时段的发车间隔，以及换乘时要走的距离"
            ],
            [
              "乘车",
              "用地图上的所需时间估算，再用时刻表确认"
            ],
            [
              "车站到公司",
              "从实际使用的出口到公司门口"
            ]
          ]
        },
        {
          "type": "h2",
          "text": "把公司最近的车站设为出发站"
        },
        {
          "type": "p",
          "text": "在{siteName}中，把公司最近的车站填入“出发站”，到达站可以空着。经过该站的线路会保留在地图上，能看出有几条线路往哪些方向延伸。以武藏小杉站为例，经过该站的7条线路向涩谷、横滨、川崎、立川、海老名等方向延伸，加上直通运行的线路，共有16条线路保留在地图上（{siteName} 2026年10月的数据）。"
        },
        {
          "type": "shot",
          "shot": "from-work",
          "alt": "出发站选武藏小杉的地图，经过武藏小杉站的线路向各个方向延伸",
          "caption": "把武藏小杉站设为出发站。只保留经过武藏小杉站的线路（打开右上角的“显示路线切换”可看到列表）"
        },
        {
          "type": "h2",
          "text": "显示车站之间的所需时间"
        },
        {
          "type": "p",
          "text": "按下“显示所需时间”，车站之间会出现带圆圈的数字（分钟）。从公司所在车站到候选车站，把这些数字加起来就是乘车时间的参考。知道乘车时间后，就能从第1步定下的总时间反推，看出最远能住到哪里。"
        },
        {
          "type": "p",
          "text": "不过，这些数字只是站间的大致时间，不包括各站停车或快速的区别、候车时间以及换乘步行时间。"
        },
        {
          "type": "shot",
          "shot": "travel-times",
          "alt": "打开“显示所需时间”的地图，车站之间排列着表示分钟数的圆圈数字",
          "caption": "打开“显示所需时间”。站间的圆圈数字是所需时间（分钟）的参考"
        },
        {
          "type": "h2",
          "text": "用时刻表确认候选车站"
        },
        {
          "type": "steps",
          "items": [
            "在地图上选出从公司不换乘或换乘一次能到的3～5个车站。",
            "按通勤的星期和时刻，查铁路公司的时刻表或换乘查询。",
            "也要确认回家时段的班次和末班车。",
            "对剩下的车站比较租金和周边环境。"
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.58,
              139.65
            ],
            "zoom": 11
          },
          "title": "{siteName}地图（把武藏小杉站设为出发站）",
          "caption": "实际的地图（把武藏小杉站设为出发站）。可以在框内缩放和移动。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "打开以武藏小杉站为出发站的地图",
          "text": "请把出发站换成自己公司最近的车站。"
        }
      ]
    },
    "ko": {
      "meta": {
        "title": "통근 시간으로 살 역 찾기: 회사 역에서 거꾸로 계산하는 방법",
        "description": "살 역은 월세나 동네 이미지보다 먼저 “회사까지 몇 분인지”로 좁히면 정하기 쉽습니다. 회사 가까운 역을 출발역으로 두고 지도에서 역마다 소요 시간을 보는 순서와, 시간표로 확인할 때의 주의점을 소개합니다.",
        "category": "이사・주거",
        "kicker": "주거 가이드",
        "readTime": "약 5분 읽기",
        "tag": "통근 가이드"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "“통근 30분”은 현관에서 회사 입구까지로 센다",
            "회사 가까운 역을 출발역으로 두면 거기서 뻗어 나가는 노선이 한눈에 보인다",
            "지도의 소요 시간은 기준일 뿐. 후보를 정하면 통근 시간대의 시간표로 확인한다"
          ]
        },
        {
          "type": "h2",
          "text": "“통근 30분”은 무엇의 30분인가"
        },
        {
          "type": "p",
          "text": "같은 “30분”이라도 전철에 타 있는 시간만인지, 집을 나서서 회사에 도착할 때까지인지에 따라 살 수 있는 범위가 크게 달라집니다. 역까지 걸어서 10분, 기다림과 환승에 5분이 걸리면 전철에 탈 수 있는 시간은 15분뿐입니다. 먼저 아래 4구간으로 나눠 생각합니다."
        },
        {
          "type": "table",
          "head": [
            "구간",
            "확인할 것"
          ],
          "rows": [
            [
              "집에서 역",
              "일본 매물의 “역 도보 ○분”은 도로 거리 80m를 1분으로 계산한 값. 신호와 언덕은 포함하지 않음"
            ],
            [
              "역에서 대기·환승",
              "통근 시간대의 배차 간격과 환승 때 걷는 거리"
            ],
            [
              "승차",
              "지도의 소요 시간으로 가늠하고 시간표로 확인"
            ],
            [
              "역에서 회사",
              "실제로 쓰는 출구에서 회사 입구까지"
            ]
          ]
        },
        {
          "type": "h2",
          "text": "회사 가까운 역을 출발역으로 둔다"
        },
        {
          "type": "p",
          "text": "{siteName}에서 회사 가까운 역을 “출발역”에 입력합니다. 도착역은 비워 둬도 됩니다. 그 역을 지나는 노선이 지도에 남아서 어느 방향으로 몇 개의 노선이 뻗어 있는지 알 수 있습니다. 무사시고스기역이라면 역을 지나는 7개 노선이 시부야·요코하마·가와사키·다치카와·에비나 등의 방향으로 뻗고, 그대로 직통 운행하는 노선까지 합쳐 16개 노선이 남습니다(2026년 10월 기준 {siteName} 데이터)."
        },
        {
          "type": "shot",
          "shot": "from-work",
          "alt": "출발역에 무사시고스기를 고른 지도. 무사시고스기역을 지나는 노선이 여러 방향으로 뻗어 있다",
          "caption": "무사시고스기역을 출발역으로 둔 상태. 무사시고스기역을 지나는 노선만 남는다(오른쪽 위 “표시 노선 전환”을 열면 목록이 나온다)"
        },
        {
          "type": "h2",
          "text": "역과 역 사이의 소요 시간을 표시한다"
        },
        {
          "type": "p",
          "text": "“소요 시간 표시”를 누르면 역과 역 사이에 동그라미 숫자(분)가 나옵니다. 회사 역에서 후보 역까지 이 숫자를 더하면 승차 시간의 기준이 됩니다. 승차 시간을 알면 1단계에서 정한 전체 시간에서 거꾸로 계산해 어디까지 살 수 있는지 보입니다."
        },
        {
          "type": "p",
          "text": "다만 이 숫자는 역 사이의 대략적인 시간입니다. 완행인지 쾌속인지, 기다리는 시간, 환승 때 걷는 시간은 포함하지 않습니다."
        },
        {
          "type": "shot",
          "shot": "travel-times",
          "alt": "“소요 시간 표시”를 켠 지도. 역과 역 사이에 분을 나타내는 동그라미 숫자가 늘어서 있다",
          "caption": "“소요 시간 표시”를 켠 상태. 역 사이의 동그라미 숫자가 소요 시간(분)의 기준"
        },
        {
          "type": "h2",
          "text": "후보 역을 시간표로 확인한다"
        },
        {
          "type": "steps",
          "items": [
            "지도에서 회사까지 환승 없이 또는 한 번 환승으로 갈 수 있는 역을 3~5개 고른다.",
            "통근하는 요일·시각으로 철도 회사의 시간표나 환승 안내를 찾아본다.",
            "귀가 시간대의 운행 횟수와 막차도 확인한다.",
            "남은 역에서 월세와 주변 환경을 비교한다."
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.58,
              139.65
            ],
            "zoom": 11
          },
          "title": "{siteName} 지도(무사시고스기역을 출발역으로 둔 상태)",
          "caption": "실제 지도(무사시고스기역을 출발역으로 둔 상태). 틀 안에서 확대·이동할 수 있습니다."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "무사시고스기역을 출발역으로 둔 지도 열기",
          "text": "출발역을 내 회사 가까운 역으로 바꿔서 쓰세요."
        }
      ]
    }
  }
};
