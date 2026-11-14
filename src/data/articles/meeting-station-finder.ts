/**
 * 記事「集合駅を探す｜複数の出発駅から行きやすい駅を見つける方法」（/articles/meeting-station-finder）。
 * 書き方: docs/article-writing.md ／ 形: ./types.ts ／ 画面はプレビューで確認する（iframe で埋め込む）
 * 値だけを書く（計算で組み立てない）。文章中のサービス名は {siteName} と書く。
 * 推定を含む注意書きは、地図の状態の mode から自動で付く（src/utils/articleNotices.ts）。
 */
import type { ArticleSource } from './types';

export const meetingStationFinder: ArticleSource = {
  "slug": "meeting-station-finder",
  "publishedDate": "2026-11-13",
  "related": [
    "flex-rail-map-introduction",
    "tokyo-train-map-beginner",
    "commute-30min-cheap-rent"
  ],
  "keywordsJa": "集合駅 探す, 待ち合わせ 駅 どこ, 複数 出発駅, 中間地点 駅, みんなが行きやすい駅",
  "relatedRoutes": [
    "yamanote",
    "keihinTohoku"
  ],
  "relatedStations": [
    {
      "name": "東京",
      "route": "yamanote"
    },
    {
      "name": "新橋",
      "route": "yamanote"
    },
    {
      "name": "横浜",
      "route": "keihinTohoku"
    }
  ],
  "maps": {
    "main": {
      "mode": "meeting",
      "from": "新宿",
      "withStations": [
        "東京",
        "横浜"
      ],
      "center": [
        35.64,
        139.72
      ],
      "zoom": 11
    },
    "route": {
      "mode": "meeting",
      "from": "新宿",
      "withStations": [
        "東京",
        "横浜"
      ],
      "to": "新橋",
      "center": [
        35.67,
        139.72
      ],
      "zoom": 12
    }
  },
  "shots": {
    "with-destination": {
      "map": "route"
    },
    "four": {
      "map": {
        "mode": "meeting",
        "from": "新宿",
        "withStations": [
          "東京",
          "横浜",
          "渋谷"
        ],
        "center": [
          35.64,
          139.72
        ],
        "zoom": 11
      }
    }
  },
  "content": {
    "ja": {
      "meta": {
        "title": "集合駅を探す｜複数の出発駅から行きやすい駅を見つける方法",
        "description": "友人や家族が別々の駅から集まるとき、どの駅ならみんなが着きやすいかを、出発駅ごとの所要時間から探す方法です。「いちばん遅い人の所要時間」が短い順に候補を出し、出発駅ごとに使う路線も見られます。所要時間は路線データによる目安です。",
        "category": "機能の使い方",
        "kicker": "機能の使い方",
        "readTime": "読了 約4分",
        "tag": "機能の使い方"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "「集合駅を探す」は、出発駅を複数入れると、全員が行きやすい駅を所要時間の短い順に出す機能",
            "並びは「いちばん遅い人の所要時間」が短い順。待たされる人を作らない駅が上に来る",
            "集合駅を決めると、出発駅ごとに使う路線と所要時間が分かる。所要時間は路線データによる目安"
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.64,
              139.72
            ],
            "zoom": 11
          },
          "title": "{siteName}の地図（{station:yamanote:新宿}・{station:yamanote:東京}・{station:keihinTohoku:横浜}から集合駅を探した状態）",
          "caption": "実際の地図（新宿・東京・横浜の3駅から探した状態）。駅名の下の分数は、3人が着くまでのいちばん長い時間です。枠の中で拡大・移動できます。"
        },
        {
          "type": "h2",
          "text": "集合する駅を決めるのが難しい理由"
        },
        {
          "type": "p",
          "text": "別々の駅から集まるとき、「真ん中あたり」を地図の距離だけで選ぶと、路線の都合で片方だけ遠くなることがあります。みんなが同じ路線に乗れるとは限らず、乗換の回数も人によって違います。"
        },
        {
          "type": "p",
          "text": "そこで、出発駅ごとに全駅までの最短の所要時間（乗換を含む）を求め、駅ごとに「全員が着くまでの時間」を比べます。地図上で人数ぶんの距離を目で測る必要はありません。"
        },
        {
          "type": "h2",
          "text": "出発駅を足して、集合駅を探す"
        },
        {
          "type": "p",
          "text": "駅選択パネルの出発駅に1人目の駅を入れ、「集合駅を探す」を押します。すると出発駅の下に、出発駅と同じ緑の入力欄がいつでも出ているので、駅名を入れて選ぶたびに欄が増えます（削除ボタンで減らせます）。2駅以上そろうと、候補が5件出ます。候補を押すと、その駅が到着駅になり、出発駅ごとのルートと使う路線が下に並びます。"
        },
        {
          "type": "shot",
          "shot": "with-destination",
          "alt": "新宿・東京・横浜の3駅から新橋を集合駅にした地図。3駅から新橋までに使う路線が地図に残っている",
          "caption": "新橋を集合駅にした場合。3人それぞれが使う路線がまとめて地図に出る"
        },
        {
          "type": "h2",
          "text": "結果の読み方と注意"
        },
        {
          "type": "p",
          "text": "候補は、「いちばん遅い人の所要時間」が短い順です。合計時間で選ぶと、1人だけが長く乗る駅が上に来ることがあるため、待たされる人を作らない並びにしています。最大が同じなら、合計が短い方を上にします。"
        },
        {
          "type": "p",
          "text": "所要時間は、路線データの駅間時間と乗換のペナルティから出した目安です。実際の時刻表・遅延・混雑は反映していません。人数を増やしたいときは、出発駅の下の空いている欄に駅を入れて足します。"
        },
        {
          "type": "shot",
          "shot": "four",
          "alt": "新宿・東京・横浜・渋谷の4駅から集合駅を探した地図。駅名の下に全員が着くまでの最大時間が出ている",
          "caption": "4駅から探した場合。人数が増えると、集合駅の候補も変わる"
        },
        {
          "type": "h2",
          "text": "集合駅を決めたら"
        },
        {
          "type": "steps",
          "items": [
            "出発駅に1人目の駅を入れ、「集合駅を探す」を押す",
            "出発駅の下の空いている欄に、集まる人の出発駅を入れて足す",
            "候補を押して集合駅を決め、出発駅ごとのルートと使う路線を確かめる",
            "出発前に、各社の公式の時刻表・運行情報で確認する"
          ]
        },
        {
          "type": "cta",
          "map": "main",
          "title": "新宿・東京・横浜から集合駅を探した地図を開く",
          "text": "3駅の出発駅を入れた状態で開きます。駅を足したり変えたりして、自分たちの集まり方で試してください。"
        }
      ]
    },
    "en": {
      "meta": {
        "title": "Find a Meeting Station: Pick a Station Everyone Can Reach Easily",
        "description": "When friends or family set off from different stations, this shows how to find a station everyone can reach easily, using the travel time from each departure station. Candidates are ranked by the slowest traveler's time, and you can see which lines each person uses. Travel times are estimates from line data.",
        "category": "How-to",
        "kicker": "How-to",
        "readTime": "About 4 min read",
        "tag": "How-to"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "\"Find meeting station\" ranks the stations everyone can reach easily, by travel time, once you enter several departure stations",
            "Candidates are ordered by the slowest traveler's time, so stations that leave one person waiting come lower",
            "Once you pick a meeting station, you see the lines and travel time for each departure station. Travel times are estimates from line data"
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.64,
              139.72
            ],
            "zoom": 11
          },
          "title": "{siteName} map (searching for a meeting station from {station:yamanote:新宿}, {station:yamanote:東京} and {station:keihinTohoku:横浜})",
          "caption": "The live map (searching from Shinjuku, Tokyo and Yokohama). The minutes under each station name are the longest time among the three travelers. You can zoom and pan inside the frame."
        },
        {
          "type": "h2",
          "text": "Why a meeting station is hard to choose"
        },
        {
          "type": "p",
          "text": "When people set off from different stations, picking the middle by map distance alone can leave one person far away because of how the lines run. Everyone may not share a line, and the number of transfers differs from person to person."
        },
        {
          "type": "p",
          "text": "So for each departure station we work out the shortest travel time to every station, including transfers, and compare how long it takes everyone to arrive at each one. You do not have to eyeball several distances on the map."
        },
        {
          "type": "h2",
          "text": "Add departure stations and search"
        },
        {
          "type": "p",
          "text": "Enter the first person's station as the departure station and press \"Find meeting station\". An empty green field like the departure field is always shown below, so each time you enter a station name and pick it, another field appears (use the remove button to delete one). Once there are two or more, five candidates appear. Press a candidate to make it the arrival station, and the route and lines for each departure station are listed below."
        },
        {
          "type": "shot",
          "shot": "with-destination",
          "alt": "Map with Shimbashi as the meeting station for Shinjuku, Tokyo and Yokohama. The lines the three travelers use stay on the map",
          "caption": "With Shimbashi as the meeting station. The lines each of the three uses appear together on the map"
        },
        {
          "type": "h2",
          "text": "Reading the result, and a caution"
        },
        {
          "type": "p",
          "text": "Candidates are ordered by the slowest traveler's time. Ranking by the total can put a station at the top where only one person rides for a long time, so the order avoids leaving anyone waiting. If the maximum is the same, the shorter total comes first."
        },
        {
          "type": "p",
          "text": "Travel times are estimates from the time between stations in the line data plus a transfer penalty. They do not reflect actual timetables, delays or crowding. To add more people, enter their stations in the empty field below the departure station."
        },
        {
          "type": "shot",
          "shot": "four",
          "alt": "Map searching for a meeting station from four stations: Shinjuku, Tokyo, Yokohama and Shibuya. The longest time for everyone is shown under each station name",
          "caption": "Searching from four stations. With more people, the candidate stations change"
        },
        {
          "type": "h2",
          "text": "Once you have chosen a station"
        },
        {
          "type": "steps",
          "items": [
            "Enter the first person's station as the departure station and press \"Find meeting station\"",
            "Enter each person's departure station in the empty field below the departure station",
            "Press a candidate to pick the meeting station and check each person's route and lines",
            "Before you leave, check each operator's official timetable and service information"
          ]
        },
        {
          "type": "cta",
          "map": "main",
          "title": "Open the map searching from Shinjuku, Tokyo and Yokohama",
          "text": "The map opens with three departure stations entered. Add or change stations to try how your own group would meet."
        }
      ]
    },
    "zh": {
      "meta": {
        "title": "寻找集合站：找到大家都容易到达的车站",
        "description": "朋友或家人从不同车站出发集合时，根据各出发站的所需时间，找出大家都容易到达的车站的方法。候选按“最晚到的人所需时间”由短到长排列，还能看到每个出发站使用的线路。所需时间是根据线路数据的估算。",
        "category": "功能用法",
        "kicker": "功能用法",
        "readTime": "阅读约4分钟",
        "tag": "功能用法"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "“寻找集合站”：输入多个出发站后，按所需时间由短到长列出大家都容易到达的车站",
            "排序按“最晚到的人所需时间”由短到长，不会让某个人等很久的车站排在前面",
            "确定集合站后，可以看到每个出发站使用的线路和所需时间。所需时间是根据线路数据的估算"
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.64,
              139.72
            ],
            "zoom": 11
          },
          "title": "{siteName}地图（从{station:yamanote:新宿}、{station:yamanote:東京}、{station:keihinTohoku:横浜}寻找集合站的状态）",
          "caption": "实际的地图（从新宿、东京、横滨三站寻找的状态）。车站名称下方的分钟数，是三个人中最晚到达的时间。可以在框内缩放和移动。"
        },
        {
          "type": "h2",
          "text": "为什么难以决定集合的车站"
        },
        {
          "type": "p",
          "text": "从不同车站出发集合时，只按地图上的距离选“中间”，有时会因为线路的关系让某一个人特别远。大家不一定能乘同一条线路，换乘次数也因人而异。"
        },
        {
          "type": "p",
          "text": "因此，我们为每个出发站计算到所有车站的最短所需时间（含换乘），再比较每个车站“大家全部到达所需的时间”。无需在地图上用眼睛估算多人的距离。"
        },
        {
          "type": "h2",
          "text": "添加出发站，寻找集合站"
        },
        {
          "type": "p",
          "text": "在车站选择面板的出发站中输入第一个人的车站，按“寻找集合站”。出发站下方始终有一个与出发站相同的绿色空输入栏，每输入站名并选择一次，就会增加一栏（可用删除按钮删除）。有两个以上时，会显示5个候选。按候选就会把该站设为到达站，下方会列出每个出发站的路线和使用的线路。"
        },
        {
          "type": "shot",
          "shot": "with-destination",
          "alt": "以新桥为集合站、从新宿、东京、横滨三站出发的地图。三人所用的线路保留在地图上",
          "caption": "以新桥为集合站时。三个人各自使用的线路会一起显示在地图上"
        },
        {
          "type": "h2",
          "text": "结果的看法和注意事项"
        },
        {
          "type": "p",
          "text": "候选按“最晚到的人所需时间”由短到长排列。按总时间排序的话，只有一个人乘车很久的车站可能排在前面，所以采用不让任何人久等的排序。最大值相同时，总时间短的排前面。"
        },
        {
          "type": "p",
          "text": "所需时间是根据线路数据的站间时间和换乘罚时估算的，并未反映实际时刻表、延误和拥挤情况。想增加人数时，在出发站下方的空栏中输入车站即可。"
        },
        {
          "type": "shot",
          "shot": "four",
          "alt": "从新宿、东京、横滨、涩谷四站寻找集合站的地图。车站名称下方显示大家全部到达所需的最长时间",
          "caption": "从四个车站寻找时。人数增加，集合站的候选也会改变"
        },
        {
          "type": "h2",
          "text": "决定集合站之后"
        },
        {
          "type": "steps",
          "items": [
            "在出发站输入第一个人的车站，按“寻找集合站”",
            "在出发站下方的空栏中输入集合的人的出发站",
            "按候选决定集合站，确认每个出发站的路线和使用的线路",
            "出发前，请在各公司的官方时刻表和运行信息中确认"
          ]
        },
        {
          "type": "cta",
          "map": "main",
          "title": "打开从新宿、东京、横滨寻找集合站的地图",
          "text": "在已输入三个出发站的状态下打开。请添加或更改车站，试试你们自己的集合方式。"
        }
      ]
    },
    "ko": {
      "meta": {
        "title": "만날 역 찾기: 모두가 가기 쉬운 역 찾는 방법",
        "description": "친구나 가족이 서로 다른 역에서 출발해 모일 때, 출발역별 소요 시간으로 모두가 가기 쉬운 역을 찾는 방법입니다. 후보는 ‘가장 늦게 도착하는 사람의 소요 시간’이 짧은 순으로 나오고, 출발역별로 이용하는 노선도 볼 수 있습니다. 소요 시간은 노선 데이터에 따른 추정입니다.",
        "category": "기능 사용법",
        "kicker": "기능 사용법",
        "readTime": "약 4분 읽기",
        "tag": "기능 사용법"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "‘만날 역 찾기’는 출발역을 여러 개 넣으면 모두가 가기 쉬운 역을 소요 시간이 짧은 순으로 보여 주는 기능",
            "순서는 ‘가장 늦게 도착하는 사람의 소요 시간’이 짧은 순. 한 사람을 오래 기다리게 하는 역은 아래로 간다",
            "만날 역을 정하면 출발역별로 이용하는 노선과 소요 시간을 알 수 있다. 소요 시간은 노선 데이터에 따른 추정"
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.64,
              139.72
            ],
            "zoom": 11
          },
          "title": "{siteName} 지도({station:yamanote:新宿}·{station:yamanote:東京}·{station:keihinTohoku:横浜}에서 만날 역을 찾은 상태)",
          "caption": "실제 지도(신주쿠·도쿄·요코하마 3개 역에서 찾은 상태). 역 이름 아래의 분은 세 사람이 도착할 때까지의 가장 긴 시간입니다. 틀 안에서 확대·이동할 수 있습니다."
        },
        {
          "type": "h2",
          "text": "만날 역을 정하기 어려운 이유"
        },
        {
          "type": "p",
          "text": "서로 다른 역에서 모일 때 지도상의 거리만으로 ‘중간’을 고르면, 노선 사정 때문에 한 사람만 멀어질 수 있습니다. 모두가 같은 노선을 탈 수 있는 것도 아니고 환승 횟수도 사람마다 다릅니다."
        },
        {
          "type": "p",
          "text": "그래서 출발역마다 모든 역까지의 최단 소요 시간(환승 포함)을 구하고, 역별로 ‘모두가 도착할 때까지의 시간’을 비교합니다. 지도에서 여러 사람의 거리를 눈으로 재 볼 필요가 없습니다."
        },
        {
          "type": "h2",
          "text": "출발역을 추가해 만날 역 찾기"
        },
        {
          "type": "p",
          "text": "역 선택 패널의 출발역에 첫 번째 사람의 역을 넣고 ‘만날 역 찾기’를 누릅니다. 출발역 아래에는 출발역과 같은 초록색 빈 입력란이 항상 있어, 역 이름을 넣어 고를 때마다 입력란이 늘어납니다(삭제 버튼으로 줄일 수 있습니다). 2개 이상이 되면 후보 5개가 나옵니다. 후보를 누르면 그 역이 도착역이 되고, 출발역별 경로와 이용 노선이 아래에 나열됩니다."
        },
        {
          "type": "shot",
          "shot": "with-destination",
          "alt": "신주쿠·도쿄·요코하마 3개 역에서 신바시를 만날 역으로 한 지도. 세 역에서 신바시까지 이용하는 노선이 지도에 남아 있다",
          "caption": "신바시를 만날 역으로 한 경우. 세 사람이 각각 이용하는 노선이 한꺼번에 지도에 나온다"
        },
        {
          "type": "h2",
          "text": "결과를 보는 법과 주의"
        },
        {
          "type": "p",
          "text": "후보는 ‘가장 늦게 도착하는 사람의 소요 시간’이 짧은 순입니다. 합계 시간으로 고르면 한 사람만 오래 타는 역이 위로 올 수 있어, 아무도 오래 기다리지 않는 순서로 했습니다. 최댓값이 같으면 합계가 짧은 쪽이 위입니다."
        },
        {
          "type": "p",
          "text": "소요 시간은 노선 데이터의 역간 시간과 환승 시간으로 계산한 추정치이며, 실제 시각표·지연·혼잡은 반영하지 않습니다. 인원을 늘리려면 출발역 아래의 빈 칸에 역을 넣습니다."
        },
        {
          "type": "shot",
          "shot": "four",
          "alt": "신주쿠·도쿄·요코하마·시부야 4개 역에서 만날 역을 찾은 지도. 역 이름 아래에 모두가 도착할 때까지의 최대 시간이 나온다",
          "caption": "4개 역에서 찾은 경우. 인원이 늘면 만날 역의 후보도 달라진다"
        },
        {
          "type": "h2",
          "text": "만날 역을 정한 뒤에"
        },
        {
          "type": "steps",
          "items": [
            "출발역에 첫 번째 사람의 역을 넣고 ‘만날 역 찾기’를 누른다",
            "출발역 아래의 빈 칸에 모이는 사람의 출발역을 넣어 더한다",
            "후보를 눌러 만날 역을 정하고 출발역별 경로와 이용 노선을 확인한다",
            "출발 전에 각 사의 공식 시각표·운행 정보를 확인한다"
          ]
        },
        {
          "type": "cta",
          "map": "main",
          "title": "신주쿠·도쿄·요코하마에서 만날 역을 찾은 지도 열기",
          "text": "출발역 3개를 넣은 상태로 지도가 열립니다. 역을 더하거나 바꿔서 우리 모임에 맞게 시험해 보세요."
        }
      ]
    }
  }
};
