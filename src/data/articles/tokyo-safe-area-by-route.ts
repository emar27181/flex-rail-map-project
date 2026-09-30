/**
 * 記事「住む駅の周辺環境を確かめる方法｜犯罪件数データの見方と現地確認」（/articles/tokyo-safe-area-by-route）。
 * 書き方: docs/article-writing.md ／ 形: ./types.ts ／ 画像を撮る: npx tsx scripts/capture-article-screenshots.mts --only tokyo-safe-area-by-route
 * 値だけを書く（計算で組み立てない）。文章中のサービス名は {siteName} と書く。
 */
import type { ArticleSource } from './types';

export const tokyoSafeAreaByRoute: ArticleSource = {
  "slug": "tokyo-safe-area-by-route",
  "publishedDate": "2025-06-06",
  "modifiedDate": "2026-09-29",
  "related": [
    "tokyo-rent-by-route",
    "commute-30min-cheap-rent",
    "tokyo-train-map-beginner"
  ],
  "keywordsJa": "東京 治安 駅, 犯罪件数 駅, 治安 調べ方, 一人暮らし 駅 選び, 警視庁 犯罪 データ",
  "maps": {
    "main": {
      "routes": [
        "yamanote",
        "chuo"
      ],
      "metric": "crimeIndex"
    }
  },
  "shots": {
    "crime-heatmap": {
      "map": {
        "routes": [
          "yamanote",
          "chuo"
        ],
        "metric": "crimeIndex",
        "center": [
          35.69,
          139.72
        ],
        "zoom": 12
      },
      "collapsePanels": true
    },
    "station-data": {
      "page": "/stations/shibuya",
      "scrollToHeading": "aroundStats"
    }
  },
  "content": {
    "ja": {
      "meta": {
        "title": "住む駅の周辺環境を確かめる方法｜犯罪件数データの見方と現地確認",
        "description": "「治安のいい沿線」は、イメージだけでは決められません。{siteName}で見られる東京都内の犯罪認知件数（警視庁・令和5年）の読み方と、その数字だけでは分からないことを、駅から家まで歩いて確かめる手順とあわせて紹介します。",
        "category": "引っ越し・住まい",
        "kicker": "住まいガイド",
        "readTime": "読了 約5分",
        "tag": "治安ガイド"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "沿線のイメージではなく、駅ごとの公開データと現地で確かめる",
            "{siteName}の犯罪件数は警視庁の町丁別データ（令和5年）で、東京都内の438駅だけ",
            "件数は人が集まる繁華街ほど多くなる。最後は駅から家までの道を歩いて確かめる"
          ]
        },
        {
          "type": "h2",
          "text": "「治安のいい沿線」はイメージで決めない"
        },
        {
          "type": "p",
          "text": "同じ沿線でも駅によって、同じ駅でも出口によって、まわりの様子は違います。沿線の評判や駅名の印象だけで決めると、毎日歩く道の様子が抜け落ちます。確かめる順番は「公開データで駅を比べる → 駅のまわりの施設を見る → 実際に歩く」です。"
        },
        {
          "type": "h2",
          "text": "犯罪件数を地図の色で見る"
        },
        {
          "type": "p",
          "text": "{siteName}の「データ可視化」で「犯罪件数」を選ぶと、駅が件数で色分けされます。青いほど少なく、赤いほど多い駅です。元のデータは警視庁が公開している町丁別の犯罪認知件数（令和5年）で、駅がある町丁の件数を駅に割り当てています。"
        },
        {
          "type": "shot",
          "shot": "crime-heatmap",
          "alt": "山手線と中央線の駅を犯罪件数で色分けした地図。新宿が赤く、多くの駅は青い",
          "caption": "山手線・中央線の駅を犯罪件数（警視庁・令和5年）で色分け。灰色はデータのない駅"
        },
        {
          "type": "h2",
          "text": "件数が多い＝住みにくい、ではない"
        },
        {
          "type": "p",
          "text": "犯罪の認知件数は、住んでいる人の数ではなく、その場所で起きた件数です。買い物客や通勤客が集まる繁華街ほど多くなり、駅前がにぎやかでも少し離れた住宅地は静かなこともあります。また、データがあるのは東京都内の438駅だけで、ほかの駅は灰色（データなし）になります。"
        },
        {
          "type": "p",
          "text": "駅のページの「駅周辺のデータ」には、件数と一緒に、飲食店・スーパー・公園など駅のまわりの施設の数と、それぞれの数えた範囲・時期が並びます。暮らしやすさは、件数と施設を並べて判断します。"
        },
        {
          "type": "shot",
          "shot": "station-data",
          "alt": "渋谷駅のページの「駅周辺のデータ」の表。飲食店数・スーパー数・犯罪件数などの値と、範囲・時期が並んでいる",
          "caption": "駅ページの「駅周辺のデータ」（渋谷）。値ごとに、数えた範囲と時期が書いてある"
        },
        {
          "type": "h2",
          "text": "最後は駅から家まで歩く"
        },
        {
          "type": "ul",
          "items": [
            "実際に使う改札・出口から、物件まで歩く",
            "街灯、歩道、見通し、人通りを見る",
            "昼の内見だけでなく、帰宅する時間帯にも一度歩く",
            "共用部の照明やオートロックなど、物件そのものも確かめる"
          ]
        },
        {
          "type": "p",
          "text": "データも現地の印象も、安全を保証するものではありません。判断の材料を増やすために使ってください。"
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.69,
              139.72
            ],
            "zoom": 12
          },
          "title": "{siteName}の地図（山手線・中央線の駅を犯罪件数で色分けした状態）",
          "caption": "実際の地図（山手線・中央線の駅を犯罪件数で色分けした状態）。枠の中で拡大・移動できます。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "犯罪件数で色分けした地図を開く",
          "text": "山手線と中央線の駅が犯罪件数で色分けされた状態で開きます。路線を変えて、候補の駅を比べてください。"
        }
      ]
    },
    "en": {
      "meta": {
        "title": "How to Check the Area Around a Station Before Moving: Reading Crime Data and Walking It Yourself",
        "description": "A line's reputation cannot tell you if an area is safe. Learn how to read the Tokyo crime counts (Tokyo Metropolitan Police, 2023) shown in {siteName}, what the numbers cannot tell you, and how to check the walk from the station to your home.",
        "category": "Moving / Living",
        "kicker": "Living Guide",
        "readTime": "About 5 min read",
        "tag": "Safety Guide"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "Check public data per station and the area itself, not a line's image",
            "Crime counts in {siteName} come from Tokyo Metropolitan Police block-level data (2023) and cover only 438 stations in Tokyo",
            "Counts are higher in busy commercial districts. Finally, walk from the station to your home yourself"
          ]
        },
        {
          "type": "h2",
          "text": "Do not judge a \"safe line\" by its image"
        },
        {
          "type": "p",
          "text": "Even on the same line, the surroundings differ by station, and at the same station by exit. Deciding by a line's reputation or a station name leaves out the streets you will walk every day. Check in this order: compare stations with public data, look at facilities around the station, then walk it."
        },
        {
          "type": "h2",
          "text": "See crime counts as colors on the map"
        },
        {
          "type": "p",
          "text": "In {siteName}, choose \"Crime count\" under \"Visualization\" and stations are colored by count: bluer means fewer, redder means more. The source is the Tokyo Metropolitan Police Department's published crime counts by town block (2023), and each station is given the count of the block it stands in."
        },
        {
          "type": "shot",
          "shot": "crime-heatmap",
          "alt": "Map coloring Yamanote and Chuo Line stations by crime count. Shinjuku is red and most stations are blue",
          "caption": "Yamanote and Chuo Line stations colored by crime count (Tokyo Metropolitan Police, 2023). Gray stations have no data"
        },
        {
          "type": "h2",
          "text": "A high count does not mean a bad place to live"
        },
        {
          "type": "p",
          "text": "Recorded crime counts are incidents in that place, not per resident. They rise in commercial districts where shoppers and commuters gather, and a quiet residential area can lie just a few minutes from a busy station front. Data exists only for 438 stations in Tokyo; other stations appear gray (no data)."
        },
        {
          "type": "p",
          "text": "On each station page, \"Around the station\" lists the count together with nearby facilities such as restaurants, supermarkets and parks, plus how and when each was counted. Judge livability by reading counts and facilities side by side."
        },
        {
          "type": "shot",
          "shot": "station-data",
          "alt": "The \"Around the station\" table on the Shibuya station page, listing values such as restaurants, supermarkets and crime count with their range and period",
          "caption": "\"Around the station\" on a station page (Shibuya). Each value shows the range and period it was counted over"
        },
        {
          "type": "h2",
          "text": "Finally, walk from the station to your home"
        },
        {
          "type": "ul",
          "items": [
            "Walk from the gate and exit you will actually use to the property",
            "Look at street lights, sidewalks, sight lines and foot traffic",
            "Besides a daytime viewing, walk it once at the hour you would come home",
            "Check the building itself too: lighting in shared areas, auto-lock and so on"
          ]
        },
        {
          "type": "p",
          "text": "Neither data nor impressions guarantee safety. Use them to gather more information for your decision."
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.69,
              139.72
            ],
            "zoom": 12
          },
          "title": "{siteName} map (Yamanote and Chuo Line stations colored by crime count)",
          "caption": "The live map (Yamanote and Chuo Line stations colored by crime count). You can zoom and pan inside the frame."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "Open a map colored by crime count",
          "text": "The map opens with Yamanote and Chuo Line stations colored by crime count. Change lines to compare your candidate stations."
        }
      ]
    },
    "zh": {
      "meta": {
        "title": "如何确认要住的车站周边环境：犯罪件数数据的读法与实地确认",
        "description": "“治安好的沿线”不能只凭印象决定。本文介绍{siteName}中东京都内犯罪认知件数（警视厅・2023年）的读法、这些数字无法说明的地方，以及从车站走到住处实地确认的步骤。",
        "category": "搬家・居住",
        "kicker": "居住指南",
        "readTime": "约 5 分钟阅读",
        "tag": "治安指南"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "不凭沿线印象，而是看每个车站的公开数据并实地确认",
            "{siteName}的犯罪件数来自警视厅按町丁统计的数据（2023年），只覆盖东京都内438个车站",
            "人越多的繁华街件数越多。最后要亲自从车站走到住处确认"
          ]
        },
        {
          "type": "h2",
          "text": "不要凭印象判断“治安好的沿线”"
        },
        {
          "type": "p",
          "text": "即使在同一条沿线，不同车站、甚至同一车站的不同出口，周边的样子都不一样。只凭沿线口碑或站名印象来决定，会忽略每天要走的那条路。确认的顺序是：用公开数据比较车站 → 看车站周边的设施 → 实地走一走。"
        },
        {
          "type": "h2",
          "text": "用地图颜色看犯罪件数"
        },
        {
          "type": "p",
          "text": "在{siteName}的“数据可视化”中选择“犯罪件数”，车站会按件数着色。越蓝越少，越红越多。原始数据是警视厅公开的按町丁统计的犯罪认知件数（2023年），把车站所在町丁的件数分配给该车站。"
        },
        {
          "type": "shot",
          "shot": "crime-heatmap",
          "alt": "按犯罪件数给山手线和中央线车站着色的地图，新宿为红色，多数车站为蓝色",
          "caption": "按犯罪件数（警视厅・2023年）给山手线、中央线车站着色。灰色是没有数据的车站"
        },
        {
          "type": "h2",
          "text": "件数多不等于不好住"
        },
        {
          "type": "p",
          "text": "犯罪认知件数是在该地发生的件数，而不是按居民人数计算的。购物和通勤人群聚集的繁华街件数会更多；即使站前很热闹，稍远一点的住宅区也可能很安静。另外，只有东京都内的438个车站有数据，其他车站显示为灰色（无数据）。"
        },
        {
          "type": "p",
          "text": "车站页面的“车站周边数据”中，除了件数，还列出餐饮店、超市、公园等车站周边设施的数量，以及各项的统计范围和时间。判断是否宜居，要把件数和设施放在一起看。"
        },
        {
          "type": "shot",
          "shot": "station-data",
          "alt": "涩谷站页面“车站周边数据”的表格，列出餐饮店数、超市数、犯罪件数等数值及其范围和时间",
          "caption": "车站页面的“车站周边数据”（涩谷）。每项数值都写明了统计范围和时间"
        },
        {
          "type": "h2",
          "text": "最后从车站走到住处"
        },
        {
          "type": "ul",
          "items": [
            "从实际使用的检票口和出口走到房子",
            "看路灯、人行道、视野和行人多少",
            "除了白天看房，也在平时回家的时段走一次",
            "也确认房子本身，例如公共区域的照明和自动门锁"
          ]
        },
        {
          "type": "p",
          "text": "无论是数据还是实地印象，都不能保证安全。请把它们当作增加判断依据的材料。"
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.69,
              139.72
            ],
            "zoom": 12
          },
          "title": "{siteName}地图（按犯罪件数给山手线、中央线车站着色）",
          "caption": "实际的地图（按犯罪件数给山手线、中央线车站着色）。可以在框内缩放和移动。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "打开按犯罪件数着色的地图",
          "text": "地图会以山手线和中央线车站按犯罪件数着色的状态打开。请切换线路比较候选车站。"
        }
      ]
    },
    "ko": {
      "meta": {
        "title": "살 역의 주변 환경 확인하는 법: 범죄 건수 데이터 읽는 법과 현장 확인",
        "description": "“치안 좋은 노선”은 이미지만으로 정할 수 없습니다. {siteName}에서 볼 수 있는 도쿄도 내 범죄 인지 건수(경시청·2023년) 읽는 법과 그 숫자만으로는 알 수 없는 점을, 역에서 집까지 걸어서 확인하는 순서와 함께 소개합니다.",
        "category": "이사・주거",
        "kicker": "주거 가이드",
        "readTime": "약 5분 읽기",
        "tag": "치안 가이드"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "노선 이미지가 아니라 역별 공개 데이터와 현장에서 확인한다",
            "{siteName}의 범죄 건수는 경시청의 동네 단위 데이터(2023년)이며 도쿄도 내 438개 역만 있다",
            "건수는 사람이 모이는 번화가일수록 많다. 마지막에는 역에서 집까지 직접 걸어서 확인한다"
          ]
        },
        {
          "type": "h2",
          "text": "“치안 좋은 노선”을 이미지로 정하지 않는다"
        },
        {
          "type": "p",
          "text": "같은 노선이라도 역에 따라, 같은 역이라도 출구에 따라 주변 모습은 다릅니다. 노선 평판이나 역 이름의 인상만으로 정하면 매일 걷는 길의 모습이 빠집니다. 확인 순서는 “공개 데이터로 역을 비교 → 역 주변 시설 보기 → 직접 걷기”입니다."
        },
        {
          "type": "h2",
          "text": "범죄 건수를 지도의 색으로 본다"
        },
        {
          "type": "p",
          "text": "{siteName}의 “데이터 시각화”에서 “범죄 건수”를 고르면 역이 건수에 따라 색으로 나뉩니다. 파랄수록 적고, 빨갈수록 많은 역입니다. 원래 데이터는 경시청이 공개한 동네 단위 범죄 인지 건수(2023년)이며, 역이 있는 동네의 건수를 역에 할당했습니다."
        },
        {
          "type": "shot",
          "shot": "crime-heatmap",
          "alt": "야마노테선과 주오선 역을 범죄 건수로 색칠한 지도. 신주쿠는 빨갛고 대부분의 역은 파랗다",
          "caption": "야마노테선·주오선 역을 범죄 건수(경시청·2023년)로 색칠. 회색은 데이터가 없는 역"
        },
        {
          "type": "h2",
          "text": "건수가 많다 = 살기 나쁘다는 아니다"
        },
        {
          "type": "p",
          "text": "범죄 인지 건수는 거주자 수가 아니라 그 장소에서 일어난 건수입니다. 쇼핑객과 통근객이 모이는 번화가일수록 많아지고, 역 앞이 붐벼도 조금 떨어진 주택가는 조용할 수 있습니다. 또 데이터가 있는 것은 도쿄도 내 438개 역뿐이고, 다른 역은 회색(데이터 없음)으로 나옵니다."
        },
        {
          "type": "p",
          "text": "역 페이지의 “역 주변 데이터”에는 건수와 함께 음식점·슈퍼·공원 등 역 주변 시설의 수와 각각 센 범위·시기가 나옵니다. 살기 좋은지는 건수와 시설을 나란히 놓고 판단합니다."
        },
        {
          "type": "shot",
          "shot": "station-data",
          "alt": "시부야역 페이지의 “역 주변 데이터” 표. 음식점 수·슈퍼 수·범죄 건수 등의 값과 범위·시기가 나와 있다",
          "caption": "역 페이지의 “역 주변 데이터”(시부야). 값마다 센 범위와 시기가 적혀 있다"
        },
        {
          "type": "h2",
          "text": "마지막에는 역에서 집까지 걷는다"
        },
        {
          "type": "ul",
          "items": [
            "실제로 쓸 개찰구·출구에서 집까지 걸어 본다",
            "가로등, 보도, 시야, 사람 왕래를 본다",
            "낮에 집을 보는 것 외에 귀가 시간대에도 한 번 걸어 본다",
            "공용부 조명이나 자동 잠금 등 건물 자체도 확인한다"
          ]
        },
        {
          "type": "p",
          "text": "데이터도 현장의 인상도 안전을 보장하지는 않습니다. 판단 재료를 늘리는 데 쓰세요."
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.69,
              139.72
            ],
            "zoom": 12
          },
          "title": "{siteName} 지도(야마노테선·주오선 역을 범죄 건수로 색칠한 상태)",
          "caption": "실제 지도(야마노테선·주오선 역을 범죄 건수로 색칠한 상태). 틀 안에서 확대·이동할 수 있습니다."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "범죄 건수로 색칠한 지도 열기",
          "text": "야마노테선과 주오선 역이 범죄 건수로 색칠된 상태로 열립니다. 노선을 바꿔 후보 역을 비교하세요."
        }
      ]
    }
  }
};
