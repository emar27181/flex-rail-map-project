/** Visitor rail guide: ueno-keisei-ueno-difference. Maps use centralized route data; prose does not invent station codes. */
import type { ArticleSource } from './types';
export const guide_ueno_keisei_ueno_difference: ArticleSource = {
  "slug": "ueno-keisei-ueno-difference",
  "publishedDate": "2026-10-16",
  "related": [
    "how-to-read-station-numbers",
    "tokyo-train-map-beginner",
    "flex-rail-map-introduction"
  ],
  "keywordsJa": "上野駅と京成上野駅の違い, 日本 鉄道 観光 英語 路線図",
  "sources": [
    {
      "title": "京成上野駅・乗り換え路線",
      "url": "https://www.keisei.co.jp/keisei/tetudou/accessj/keisei-ueno.php",
      "publisher": "京成電鉄",
      "checkedAt": "2026-10-17"
    }
  ],
  "relatedRoutes": [
    "keiseiMainLine",
    "yamanote",
    "ginzaLine",
    "hibiyaLine"
  ],
  "maps": {
    "main": {
      "focus": { "name": "上野", "route": "yamanote" },
      "routes": [
        "keiseiMainLine",
        "yamanote",
        "ginzaLine",
        "hibiyaLine"
      ]
    }
  },
  "shots": {
    "detail": {
      "map": "main"
    }
  },
  "content": {
    "ja": {
      "meta": {
        "title": "上野駅と京成上野駅の違い｜JR・地下鉄・京成の位置を地図で比較",
        "description": "上野駅と京成上野駅は別の駅です。JR・銀座線・日比谷線・京成線を同じ地図に表示し、乗り換え前に駅の位置と利用する路線を確認できます。",
        "category": "鉄道の使い方",
        "kicker": "鉄道の使い方",
        "readTime": "読了 約5分",
        "tag": "鉄道の使い方"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "JR・東京メトロの{station:yamanote:上野}と、京成の{station:keiseiMainLine:京成上野}は別の駅です。",
            "下の地図は上野周辺から始まります。山手線・銀座線・日比谷線と京成線を重ね、2つの駅の位置を見比べてください。",
            "列車の行先・のりば・運行情報は公式案内で最後に確認してください。"
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "title": "上野駅と京成上野駅の違い",
          "caption": "上野周辺を拡大して表示しています。駅をタップして路線を確認し、縮小すると各路線の行き先を追えます。徒歩経路の案内図ではありません。"
        },
        {
          "type": "h2",
          "text": "最初に確認したいこと"
        },
        {
          "type": "p",
          "text": "上野周辺ではJR・地下鉄・京成の駅名を区別する必要があります。 出発前に、目的地の名称・利用する鉄道会社・降りる駅をそれぞれ確認しましょう。観光施設の名前がそのまま駅名になるとは限りません。"
        },
        {
          "type": "h2",
          "text": "必要な路線だけで見る方法"
        },
        {
          "type": "p",
          "text": "このデモは関係する路線だけに絞っています。駅の並びを一つずつ追い、目的地の手前の駅も確認してください。拡大すれば周囲の駅が見分けやすくなり、縮小すれば路線全体の位置関係を把握できます。"
        },
        {
          "type": "shot",
          "shot": "detail",
          "alt": "対象路線の駅を確認できる操作可能な地図",
          "caption": "同じ路線を別の縮尺で確認できます。駅名を見ながら操作してみましょう。"
        },
        {
          "type": "h2",
          "text": "現地で間違えないための確認"
        },
        {
          "type": "p",
          "text": "地図上の位置関係は道順・運賃・列車種別・ホームの場所を保証しません。現地の公式表示と最新情報を確認してください。 路線の線は接続関係やおおまかな位置を示しますが、駅構内の歩行距離・運賃・運転間隔・各列車の停車駅まで保証するものではありません。"
        },
        {
          "type": "h2",
          "text": "次の移動に備える"
        },
        {
          "type": "steps",
          "items": [
            "行きたい場所の施設名と鉄道駅名を区別する。",
            "路線図で利用する路線と駅の並びを確認する。",
            "現地では公式案内の方面・ホーム・運行情報を確かめる。"
          ]
        },
        {
          "type": "p",
          "text": "駅名だけでなく路線名も一緒に控えておくと、現地の案内と照合しやすくなります。選択済みの路線を同じ地図で見比べ、目的地の路線名も確認しましょう。通信できない場合に備えて重要な駅名をメモしておくと安心です。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "上野・京成上野の位置を地図で比較する",
          "text": "同じ4路線と上野周辺の表示範囲で開きます。"
        }
      ]
    },
    "en": {
      "meta": {
        "title": "Ueno vs Keisei-Ueno: Compare Station Locations on a Map",
        "description": "Ueno and Keisei-Ueno are separate stations. Compare JR, Tokyo Metro and Keisei on one interactive map, then check the operator's station guide for your walking connection.",
        "category": "Japan rail travel",
        "kicker": "Japan rail travel",
        "readTime": "About 5 min read",
        "tag": "Japan rail travel"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "JR and Tokyo Metro serve {station:yamanote:上野}; Keisei serves the separate {station:keiseiMainLine:京成上野} station.",
            "The map starts around Ueno, showing the Yamanote, Ginza, Hibiya and Keisei lines together so you can compare the station locations.",
            "Verify station signs, the platform and your service with the operator before you travel."
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "title": "Ueno vs Keisei-Ueno: Two Names Travelers Confuse",
          "caption": "Start with the two station locations. Tap a station to inspect its lines, or zoom out to follow the routes. This is not a walking-directions map."
        },
        {
          "type": "h2",
          "text": "What to check first"
        },
        {
          "type": "p",
          "text": "Ueno and Keisei-Ueno are not interchangeable labels on a railway ticket. Match the operator printed in your route result before choosing a station. Before following a route search result, identify the railway operator, your destination station and any connecting line. Tourist attraction names, railway station names and platform labels answer different questions."
        },
        {
          "type": "h2",
          "text": "Explore only the relevant railway"
        },
        {
          "type": "p",
          "text": "The map below focuses on the chosen railway instead of displaying every nearby service. Follow the connected sequence of stations and note which station you will reach before your destination. Zoom in to distinguish adjacent stops, then zoom out to see where this corridor sits in the wider network."
        },
        {
          "type": "shot",
          "shot": "detail",
          "alt": "Interactive overview of the selected train line",
          "caption": "Open this closer view to examine the line and individual station labels."
        },
        {
          "type": "h2",
          "text": "What the map cannot tell you"
        },
        {
          "type": "p",
          "text": "The four selected lines help distinguish the stations. Use the official Keisei station guide in the sources below for the pedestrian connection. The map does not establish indoor walking distances, service frequency, fare validity, disruption status or which train stops at each station."
        },
        {
          "type": "h2",
          "text": "Plan your next step"
        },
        {
          "type": "steps",
          "items": [
            "Write down the destination and the actual railway station name.",
            "Use the interactive map to follow the relevant line and station order.",
            "Confirm the operator, platform, destination sign and current service on site."
          ]
        },
        {
          "type": "p",
          "text": "Save the line name together with the station name so you can compare it with the signs you see at the station. Compare the selected lines together, and check the railway operator for your destination. Keep an offline or written copy of the essential stop names in case network access is unavailable."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "Open the interactive railway map",
          "text": "Continue with the same line selection in the full map."
        }
      ]
    },
    "zh": {
      "meta": {
        "title": "上野站与京成上野站：有什么不同",
        "description": "围绕「上野站与京成上野站：有什么不同」，先核对铁路公司、线路与车站名称。通过互动线路图查看站点顺序，出行前再确认官方信息。",
        "category": "日本铁路出行",
        "kicker": "日本铁路出行",
        "readTime": "阅读约5分钟",
        "tag": "日本铁路出行"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "JR、东京地铁的{station:yamanote:上野}与京成的{station:keiseiMainLine:京成上野}是不同的车站。",
            "地图从上野周边开始，同时显示山手线、银座线、日比谷线和京成线，可比较两个车站的位置。",
            "乘车前请以官方站牌、站台与列车运行信息为准。"
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "title": "上野站与京成上野站：有什么不同",
          "caption": "可操作的真实铁路线路图，可以缩放和移动查看站点。"
        },
        {
          "type": "h2",
          "text": "先确认哪些信息"
        },
        {
          "type": "p",
          "text": "不同线路可能使用相似的目的地名称，先找准运营公司和车站名称。 出发前请区分景点名称、铁路运营商与实际到达的车站。三者不一定同名。"
        },
        {
          "type": "h2",
          "text": "只查看需要的线路"
        },
        {
          "type": "p",
          "text": "下面只展示相关铁路，而不是把附近所有线路放在一张图上。顺着线路查看各站，并确认目的地前一站，必要时缩放以掌握位置关系。"
        },
        {
          "type": "shot",
          "shot": "detail",
          "alt": "可操作的目标线路与车站地图",
          "caption": "另一个缩放级别的线路图，可逐站查看。"
        },
        {
          "type": "h2",
          "text": "地图无法告诉你的事"
        },
        {
          "type": "p",
          "text": "线路图不等于步行路线、票价或实时列车信息。请核对运营商的官方指示。 线路图主要解释连接关系，不提供可靠的站内步行距离、票价、发车频率或各班列车停靠信息。"
        },
        {
          "type": "h2",
          "text": "出行前检查"
        },
        {
          "type": "steps",
          "items": [
            "分清目的地名称与实际铁路车站名称。",
            "在互动地图上核对线路和车站顺序。",
            "到站后再核对官方站台、方向和运行信息。"
          ]
        },
        {
          "type": "p",
          "text": "把线路名和车站名一起保存，方便对照现场指示牌。需要换乘时，分别查看第二条线路，也建议离线保留重要站名。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "打开互动铁路地图",
          "text": "在完整地图中继续查看同一线路。"
        }
      ]
    },
    "ko": {
      "meta": {
        "title": "우에노역과 게이세이우에노역 구분",
        "description": "「우에노역과 게이세이우에노역 구분」 여행에서는 역 이름과 노선을 먼저 구별하세요. 실제 지도를 조작하며 역 순서를 확인하고 현지 안내를 함께 확인합니다.",
        "category": "일본 철도 여행",
        "kicker": "일본 철도 여행",
        "readTime": "약 5분",
        "tag": "일본 철도 여행"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "JR·도쿄메트로의 {station:yamanote:上野}와 게이세이의 {station:keiseiMainLine:京成上野}는 서로 다른 역입니다.",
            "지도는 우에노 주변에서 시작합니다. 야마노테선·긴자선·히비야선·게이세이선을 함께 보며 두 역의 위치를 비교하세요.",
            "탑승 전 공식 역 안내와 승강장 및 운행 정보를 확인하세요."
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "title": "우에노역과 게이세이우에노역 구분",
          "caption": "직접 조작할 수 있는 실제 노선도입니다. 확대·이동하며 역을 살펴보세요."
        },
        {
          "type": "h2",
          "text": "먼저 확인할 것"
        },
        {
          "type": "p",
          "text": "비슷한 목적지 이름이라도 이용 노선과 역은 다를 수 있습니다. 출발 전 관광지 이름, 철도 운영사, 실제 하차역을 각각 확인하세요. 이름이 항상 같지는 않습니다."
        },
        {
          "type": "h2",
          "text": "필요한 노선만 보기"
        },
        {
          "type": "p",
          "text": "아래 지도는 주변 모든 노선을 한꺼번에 표시하지 않습니다. 노선을 따라 역 순서와 목적지 직전 역을 확인하고 확대·축소해 전체 연결을 살펴보세요."
        },
        {
          "type": "shot",
          "shot": "detail",
          "alt": "선택한 노선과 역을 확인하는 실제 지도",
          "caption": "다른 확대 수준에서 같은 노선과 역을 확인하세요."
        },
        {
          "type": "h2",
          "text": "지도만으로 알 수 없는 것"
        },
        {
          "type": "p",
          "text": "노선도는 도보 경로, 요금, 실시간 열차 정보를 대신하지 않습니다. 운영사 공식 안내를 확인하세요. 노선도는 연결 관계를 이해하기 위한 것이며 역내 도보 거리, 요금, 운행 간격, 각 열차 정차역을 보증하지 않습니다."
        },
        {
          "type": "h2",
          "text": "출발 전 확인"
        },
        {
          "type": "steps",
          "items": [
            "목적지 이름과 실제 철도역 이름을 구별하세요.",
            "인터랙티브 지도에서 노선과 역 순서를 확인하세요.",
            "현장 공식 안내에서 승강장, 방향, 운행 정보를 확인하세요."
          ]
        },
        {
          "type": "p",
          "text": "역 이름과 노선 이름을 함께 메모하면 현장 안내와 대조하기 쉽습니다. 환승 노선도 따로 확인하고 중요한 역명은 오프라인으로 저장하세요."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "인터랙티브 노선도 열기",
          "text": "같은 노선 선택을 전체 지도에서 계속 확인합니다."
        }
      ]
    }
  },
  "modifiedDate": "2026-10-17"
};
