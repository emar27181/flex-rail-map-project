/**
 * 記事「終電モードの使い方｜到着駅から帰れる範囲を地図で見る（試作）」（/articles/last-train-mode-guide）。
 * 書き方: docs/article-writing.md ／ 形: ./types.ts ／ 画面はプレビューで確認する（iframe で埋め込む）
 * 値だけを書く（計算で組み立てない）。文章中のサービス名は {siteName} と書く。
 * 試作・架空のデータの注意書きは、地図の状態の mode から自動で付く（src/utils/articleNotices.ts）。
 */
import type { ArticleSource } from './types';

export const lastTrainModeGuide: ArticleSource = {
  "slug": "last-train-mode-guide",
  "publishedDate": "2026-11-13",
  "related": [
    "flex-rail-map-introduction",
    "tokyo-train-map-beginner",
    "commute-30min-cheap-rent"
  ],
  "keywordsJa": "終電 地図, 終電 帰れる駅, 終電モード, 終電 逆引き, 終電 逃しそう",
  "relatedRoutes": [
    "yamanote",
    "jrTokaidoMainLine"
  ],
  "relatedStations": [
    {
      "name": "渋谷",
      "route": "yamanote"
    },
    {
      "name": "藤沢",
      "route": "jrTokaidoMainLine"
    }
  ],
  "maps": {
    "main": {
      "mode": "last-train",
      "to": "渋谷",
      "center": [
        35.66,
        139.72
      ],
      "zoom": 11
    }
  },
  "shots": {
    "reachable": {
      "map": {
        "mode": "last-train",
        "to": "渋谷",
        "center": [
          35.665,
          139.715
        ],
        "zoom": 12
      }
    },
    "other": {
      "map": {
        "mode": "last-train",
        "to": "藤沢",
        "center": [
          35.4,
          139.5
        ],
        "zoom": 11
      }
    }
  },
  "content": {
    "ja": {
      "meta": {
        "title": "終電モードの使い方｜到着駅から帰れる範囲を地図で見る（試作）",
        "description": "終電を逃しそうなとき、帰りたい駅（到着駅）を決めると、その駅へ向かえる駅と区間だけを地図に残す「終電モード」の使い方です。試作機能で、時刻は架空の試験ダイヤによる値であることも説明します。",
        "category": "機能の使い方（試作）",
        "kicker": "機能の使い方（試作）",
        "readTime": "読了 約4分",
        "tag": "試作機能"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "終電モード（試作）は、到着駅を決めると、その駅へ向かえる駅と路線の区間だけを地図に残す機能",
            "駅名の下の時刻は「その駅を出発できる最終時刻」。ただし架空の試験ダイヤによる値で、実際の終電ではない",
            "基準時刻を遅くすると帰れる駅が減る。実際の終電は、必ず各社の公式の時刻表で確認する"
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.66,
              139.72
            ],
            "zoom": 11
          },
          "title": "{siteName}の地図（{station:yamanote:渋谷}を到着駅にして終電モードを入れた状態）",
          "caption": "実際の地図（渋谷を到着駅にした終電モード・試作）。時刻の * は架空の試験ダイヤの値です。枠の中で拡大・移動できます。"
        },
        {
          "type": "h2",
          "text": "終電を逃しそうなとき、地図で知りたいこと"
        },
        {
          "type": "p",
          "text": "終電が近いときに知りたいのは、「この時刻に、いまの駅から家まで帰れるか」です。乗換案内は答えを1つ出しますが、同じ方向へ向かう別の路線や、あと何駅まで行けば帰れるのかまでは見えません。"
        },
        {
          "type": "p",
          "text": "終電モードは、帰りたい駅（到着駅）から逆にたどり、その時刻までに出発すれば着ける駅と、使える区間だけを残します。残った駅の名前の下には、その駅を出発できる最終時刻の目安が出ます。"
        },
        {
          "type": "h2",
          "text": "終電モードを使う"
        },
        {
          "type": "p",
          "text": "画面左上の「出発駅・到着駅を選択」で、帰りたい駅を到着駅に入れます。次に「終電モード（試作）」を押します。基準時刻（初めは今の時刻）は、元からある時刻の欄で変えます。到着駅を決めずに押したときは、画面の下に案内が出ます。"
        },
        {
          "type": "shot",
          "shot": "reachable",
          "alt": "渋谷を到着駅にして終電モードを入れた地図。渋谷へ向かえる駅と区間だけが濃く残り、駅名の下に最終時刻が出ている",
          "caption": "渋谷へ帰る場合。濃く残った駅と区間が、基準時刻までに出発すれば着ける範囲"
        },
        {
          "type": "h2",
          "text": "時刻と * の意味に気をつける"
        },
        {
          "type": "p",
          "text": "駅名の下の時刻は、通常の画面では到着予定時刻ですが、終電モードでは「その駅を出発できる最終時刻」になります。意味が変わるので、ボタンは同じ「時刻を表示」のまま、下の小さな「※」の注記で説明しています。"
        },
        {
          "type": "p",
          "text": "時刻に付く * は、架空の試験ダイヤから作った値という印です。発車の間隔・運行を終える時刻・乗換の4分は架空の試験条件で、駅の構造や実際のダイヤ、直通運転の有無は反映していません。「乗換駅のみ表示」で乗換の候補だけに絞ることもできます。"
        },
        {
          "type": "shot",
          "shot": "other",
          "alt": "藤沢を到着駅にして終電モードを入れた地図。藤沢へ向かえる駅と区間が残っている",
          "caption": "藤沢へ帰る場合。到着駅を変えると、帰れる範囲も変わる"
        },
        {
          "type": "h2",
          "text": "試作として使うときの決まり"
        },
        {
          "type": "steps",
          "items": [
            "到着駅（帰りたい駅）を決めて、「終電モード（試作）」を押す",
            "基準時刻を、帰る予定の時刻にして、帰れる駅の広がりを見る",
            "実際の終電は、各社の公式の時刻表・運行情報で必ず確認する"
          ]
        },
        {
          "type": "cta",
          "map": "main",
          "title": "渋谷を到着駅にした終電モードを開く",
          "text": "到着駅を入れて終電モード（試作）をONにした状態で開きます。到着駅を変えて試してください。"
        }
      ]
    },
    "en": {
      "meta": {
        "title": "How to Use Last Train Mode: See Where You Can Still Get Home (Prototype)",
        "description": "When you might miss the last train, pick the station you want to reach and Last Train Mode keeps only the stations and line sections that can still reach it. This is a prototype, and the times come from a fictional test timetable.",
        "category": "How-to (Prototype)",
        "kicker": "How-to (Prototype)",
        "readTime": "About 4 min read",
        "tag": "Prototype"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "Last Train Mode (a prototype) keeps only the stations and line sections that can reach your arrival station",
            "The time under each station name is the latest time you can leave that station, but it comes from a fictional test timetable and is not a real last train",
            "The later you set the reference time, the fewer stations can still get home. Always check the real last train in each operator's official timetable"
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.66,
              139.72
            ],
            "zoom": 11
          },
          "title": "{siteName} map (Last Train Mode with {station:yamanote:渋谷} as the arrival station)",
          "caption": "The live map (Last Train Mode prototype, arriving at Shibuya). The * on a time marks a fictional test-timetable value. You can zoom and pan inside the frame."
        },
        {
          "type": "h2",
          "text": "What you want to know when you might miss the last train"
        },
        {
          "type": "p",
          "text": "When the last train is near, what you want to know is whether you can still get home from where you are at this time. A route-search app gives one answer, but it does not show other lines going the same way, or how far you can still get."
        },
        {
          "type": "p",
          "text": "Last Train Mode works backwards from the station you want to reach and keeps only the stations you can still leave from in time, and the line sections you can use. Under each remaining station you see an estimate of the latest time you can leave it."
        },
        {
          "type": "h2",
          "text": "Using Last Train Mode"
        },
        {
          "type": "p",
          "text": "In \"Select Departure & Arrival Stations\" at the top left, enter the station you want to reach as the arrival station. Then press \"Last train mode (beta)\". Change the reference time (the current time at first) with the existing time field. If you press it without an arrival station, a message appears at the bottom of the screen."
        },
        {
          "type": "shot",
          "shot": "reachable",
          "alt": "Map with Shibuya as the arrival station in Last Train Mode. Only the stations and sections that can reach Shibuya stay dark, with the latest times under the station names",
          "caption": "Getting home to Shibuya. The stations and sections that stay dark are the range you can reach if you leave by the reference time"
        },
        {
          "type": "h2",
          "text": "Mind what the time and * mean"
        },
        {
          "type": "p",
          "text": "In the normal screen the time under a station name is its estimated arrival time, but in Last Train Mode it is the latest time you can leave that station. Because the meaning changes, the button stays \"Show Times\" and a small \"*\" note below explains it."
        },
        {
          "type": "p",
          "text": "The * on a time means a value built from a fictional test timetable. The train intervals, the end of service and the 4-minute transfer are fictional test conditions, and station layouts, the real timetable and through services are not reflected. \"Show Transfer Stations Only\" narrows the view to transfer candidates."
        },
        {
          "type": "shot",
          "shot": "other",
          "alt": "Map with Fujisawa as the arrival station in Last Train Mode, keeping the stations and sections that can reach Fujisawa",
          "caption": "Getting home to Fujisawa. When you change the arrival station, the range you can reach changes too"
        },
        {
          "type": "h2",
          "text": "Rules for using a prototype"
        },
        {
          "type": "steps",
          "items": [
            "Set the station you want to reach as the arrival station and press \"Last train mode (beta)\"",
            "Set the reference time to when you plan to head home and see how far the reachable stations spread",
            "Always confirm the real last train in each operator's official timetable and service information"
          ]
        },
        {
          "type": "cta",
          "map": "main",
          "title": "Open Last Train Mode with Shibuya as the arrival station",
          "text": "The map opens with an arrival station set and Last Train Mode (prototype) on. Change the arrival station and try your own trip."
        }
      ]
    },
    "zh": {
      "meta": {
        "title": "末班车模式的使用方法：在地图上看还能回家的范围（测试）",
        "description": "担心赶不上末班车时，选好想回的车站（到达站），末班车模式就只保留还能到达该站的车站和线路区间。这是测试功能，时间来自虚构的测试时刻表。",
        "category": "功能用法（测试）",
        "kicker": "功能用法（测试）",
        "readTime": "阅读约4分钟",
        "tag": "测试功能"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "末班车模式（测试）会在设置到达站后，只在地图上保留还能到达该站的车站和线路区间",
            "车站名称下方的时间是“能从该站出发的最晚时间”，但它来自虚构的测试时刻表，并非真实的末班车",
            "基准时间设得越晚，能回家的车站越少。真实的末班车请务必在各公司的官方时刻表中确认"
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.66,
              139.72
            ],
            "zoom": 11
          },
          "title": "{siteName}地图（以{station:yamanote:渋谷}为到达站并开启末班车模式）",
          "caption": "实际的地图（以涩谷为到达站的末班车模式·测试）。时间后的 * 表示虚构测试时刻表的值。可以在框内缩放和移动。"
        },
        {
          "type": "h2",
          "text": "担心赶不上末班车时，想在地图上知道什么"
        },
        {
          "type": "p",
          "text": "末班车临近时，想知道的是“这个时间能不能从现在的车站回到家”。换乘查询只给出一个答案，看不到朝同一方向的其他线路，也不知道还能走到哪一站。"
        },
        {
          "type": "p",
          "text": "末班车模式从想回的车站（到达站）倒着推，只保留在该时间前出发就能到达的车站和可用的区间。保留下来的车站名称下方，会显示能从该站出发的最晚时间的估算值。"
        },
        {
          "type": "h2",
          "text": "使用末班车模式"
        },
        {
          "type": "p",
          "text": "在左上角的“选择出发站和到达站”中，把想回的车站填为到达站，然后按“末班车模式（测试）”。基准时间（起初是当前时间）用原有的时间栏修改。未设置到达站就按下时，画面下方会显示提示。"
        },
        {
          "type": "shot",
          "shot": "reachable",
          "alt": "以涩谷为到达站开启末班车模式的地图。只有能到达涩谷的车站和区间保持深色，车站名称下方显示最晚时间",
          "caption": "回涩谷的情况。保持深色的车站和区间，就是在基准时间前出发能到达的范围"
        },
        {
          "type": "h2",
          "text": "请注意时间和 * 的含义"
        },
        {
          "type": "p",
          "text": "车站名称下方的时间，在通常画面中是预计到达时间，而在末班车模式中是“能从该站出发的最晚时间”。因为含义会改变，所以按钮保持“显示时刻”不变，并在下方用小小的“※”注记说明。"
        },
        {
          "type": "p",
          "text": "时间后的 * 表示由虚构的测试时刻表得出的值。发车间隔、停运时间和4分钟的换乘都是虚构的测试条件，没有反映车站结构、实际时刻表和直通运行。也可以用“仅显示换乘站”只看换乘候选。"
        },
        {
          "type": "shot",
          "shot": "other",
          "alt": "以藤泽为到达站开启末班车模式的地图，保留了能到达藤泽的车站和区间",
          "caption": "回藤泽的情况。更改到达站，能回家的范围也会改变"
        },
        {
          "type": "h2",
          "text": "作为测试功能使用时的规则"
        },
        {
          "type": "steps",
          "items": [
            "设置想回的车站为到达站，按“末班车模式（测试）”",
            "把基准时间设为计划回家的时间，查看能回去的车站范围",
            "真实的末班车务必在各公司的官方时刻表和运行信息中确认"
          ]
        },
        {
          "type": "cta",
          "map": "main",
          "title": "打开以涩谷为到达站的末班车模式",
          "text": "在已设置到达站并开启末班车模式（测试）的状态下打开地图。请更改到达站试试自己的行程。"
        }
      ]
    },
    "ko": {
      "meta": {
        "title": "막차 모드 사용법: 지도에서 집에 갈 수 있는 범위 보기(시험)",
        "description": "막차를 놓칠 것 같을 때, 가려는 역(도착역)을 정하면 그 역으로 갈 수 있는 역과 노선 구간만 지도에 남기는 ‘막차 모드’의 사용법입니다. 시험 기능이며, 시각은 가상의 시험 시각표로 만든 값입니다.",
        "category": "기능 사용법(시험)",
        "kicker": "기능 사용법(시험)",
        "readTime": "약 4분 읽기",
        "tag": "시험 기능"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "막차 모드(시험)는 도착역을 정하면 그 역으로 갈 수 있는 역과 노선 구간만 지도에 남기는 기능",
            "역 이름 아래의 시각은 ‘그 역에서 출발할 수 있는 마지막 시각’이지만, 가상의 시험 시각표로 만든 값이며 실제 막차가 아님",
            "기준 시각을 늦출수록 집에 갈 수 있는 역이 줄어듦. 실제 막차는 반드시 각 사의 공식 시각표로 확인"
          ]
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.66,
              139.72
            ],
            "zoom": 11
          },
          "title": "{siteName} 지도({station:yamanote:渋谷}를 도착역으로 막차 모드를 켠 상태)",
          "caption": "실제 지도(시부야를 도착역으로 한 막차 모드·시험). 시각의 * 는 가상의 시험 시각표 값입니다. 틀 안에서 확대·이동할 수 있습니다."
        },
        {
          "type": "h2",
          "text": "막차를 놓칠 것 같을 때 지도에서 알고 싶은 것"
        },
        {
          "type": "p",
          "text": "막차가 가까울 때 알고 싶은 것은 ‘이 시각에 지금 있는 역에서 집까지 갈 수 있는가’입니다. 환승 안내는 답을 하나만 주므로, 같은 방향으로 가는 다른 노선이나 몇 정거장까지 갈 수 있는지는 보이지 않습니다."
        },
        {
          "type": "p",
          "text": "막차 모드는 가려는 역(도착역)에서 거꾸로 따라가며, 그 시각까지 출발하면 닿을 수 있는 역과 쓸 수 있는 구간만 남깁니다. 남은 역의 이름 아래에는 그 역에서 출발할 수 있는 마지막 시각의 추정값이 나옵니다."
        },
        {
          "type": "h2",
          "text": "막차 모드 사용하기"
        },
        {
          "type": "p",
          "text": "화면 왼쪽 위의 ‘출발역·도착역 선택’에서 가려는 역을 도착역으로 넣습니다. 그다음 ‘막차 모드(시험)’를 누릅니다. 기준 시각(처음에는 지금 시각)은 원래 있는 시각 입력란으로 바꿉니다. 도착역을 정하지 않고 누르면 화면 아래에 안내가 나옵니다."
        },
        {
          "type": "shot",
          "shot": "reachable",
          "alt": "시부야를 도착역으로 막차 모드를 켠 지도. 시부야로 갈 수 있는 역과 구간만 진하게 남고 역 이름 아래에 마지막 시각이 나온다",
          "caption": "시부야로 가는 경우. 진하게 남은 역과 구간이 기준 시각까지 출발하면 닿을 수 있는 범위"
        },
        {
          "type": "h2",
          "text": "시각과 * 의 의미에 주의하기"
        },
        {
          "type": "p",
          "text": "역 이름 아래의 시각은 일반 화면에서는 도착 예정 시각이지만, 막차 모드에서는 ‘그 역에서 출발할 수 있는 마지막 시각’입니다. 의미가 바뀌므로 버튼은 ‘시간 표시’ 그대로 두고, 아래의 작은 ‘※’ 주석으로 설명합니다."
        },
        {
          "type": "p",
          "text": "시각에 붙는 * 는 가상의 시험 시각표로 만든 값이라는 표시입니다. 배차 간격, 운행 종료 시각, 4분의 환승은 모두 가상의 시험 조건이며 역 구조, 실제 시각표, 직통 운행은 반영하지 않았습니다. ‘환승역만 표시’로 환승 후보만 좁혀 볼 수도 있습니다."
        },
        {
          "type": "shot",
          "shot": "other",
          "alt": "후지사와를 도착역으로 막차 모드를 켠 지도. 후지사와로 갈 수 있는 역과 구간이 남아 있다",
          "caption": "후지사와로 가는 경우. 도착역을 바꾸면 갈 수 있는 범위도 바뀐다"
        },
        {
          "type": "h2",
          "text": "시험 기능으로 사용할 때의 규칙"
        },
        {
          "type": "steps",
          "items": [
            "가려는 역을 도착역으로 정하고 ‘막차 모드(시험)’를 누른다",
            "기준 시각을 집에 가려는 시각으로 두고 갈 수 있는 역의 범위를 본다",
            "실제 막차는 각 사의 공식 시각표·운행 정보로 반드시 확인한다"
          ]
        },
        {
          "type": "cta",
          "map": "main",
          "title": "시부야를 도착역으로 한 막차 모드 열기",
          "text": "도착역을 넣고 막차 모드(시험)를 켠 상태로 지도가 열립니다. 도착역을 바꿔 직접 시험해 보세요."
        }
      ]
    }
  }
};
