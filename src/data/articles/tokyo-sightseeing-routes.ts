/**
 * 記事「東京観光の電車は山手線が軸｜浅草・お台場だけ路線を足す」（/articles/tokyo-sightseeing-routes）。
 * 書き方: docs/article-writing.md ／ 形: ./types.ts ／ 画像を撮る: npx tsx scripts/capture-article-screenshots.mts --only tokyo-sightseeing-routes
 * 値だけを書く（計算で組み立てない）。文章中のサービス名は {siteName} と書く。
 */
import type { ArticleSource } from './types';

export const tokyoSightseeingRoutes: ArticleSource = {
  "slug": "tokyo-sightseeing-routes",
  "publishedDate": "2025-06-06",
  "modifiedDate": "2026-09-29",
  "related": [
    "tokyo-train-map-beginner",
    "flex-rail-map-introduction",
    "commute-30min-cheap-rent"
  ],
  "keywordsJa": "東京 観光 電車, 山手線 観光, 浅草 行き方, お台場 行き方, ゆりかもめ, りんかい線",
  "maps": {
    "main": {
      "routes": [
        "yamanote",
        "ginzaLine",
        "yurikamomeLine",
        "rinkaiLine"
      ]
    }
  },
  "shots": {
    "yamanote-ginza": {
      "map": {
        "routes": [
          "yamanote",
          "ginzaLine"
        ],
        "center": [
          35.69,
          139.745
        ],
        "zoom": 12
      },
      "collapsePanels": true
    },
    "odaiba": {
      "map": {
        "routes": [
          "yamanote",
          "yurikamomeLine",
          "rinkaiLine"
        ],
        "center": [
          35.645,
          139.765
        ],
        "zoom": 13
      },
      "collapsePanels": true
    }
  },
  "content": {
    "ja": {
      "meta": {
        "title": "東京観光の電車は山手線が軸｜浅草・お台場だけ路線を足す",
        "description": "東京観光で使う電車は多くありません。原宿・渋谷・秋葉原・上野は山手線で回れ、足りないのは浅草とお台場くらいです。山手線に銀座線、ゆりかもめ・りんかい線を足す考え方を、実際の地図で紹介します。",
        "category": "観光ガイド",
        "kicker": "観光ガイド",
        "readTime": "読了 約5分",
        "tag": "観光ガイド"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "定番エリアの多くは JR 山手線の駅にある",
            "浅草へは東京メトロ銀座線を足す",
            "お台場へはゆりかもめ（新橋から）かりんかい線（大崎から）を足す"
          ]
        },
        {
          "type": "h2",
          "text": "観光で使う路線は多くない"
        },
        {
          "type": "p",
          "text": "東京には多くの路線がありますが、観光で行く場所の多くは、都心を一周する山手線の駅か、そこから1回乗り換えた先にあります。最初から全路線を覚える必要はありません。「山手線を軸にして、足りない場所だけ路線を足す」と考えると迷いにくくなります。"
        },
        {
          "type": "h2",
          "text": "定番エリアは山手線で回れる"
        },
        {
          "type": "p",
          "text": "原宿・渋谷・秋葉原・上野はどれも山手線の駅です。山手線は環状なので、どちら回りでもいずれ着きます。近い方向の電車に乗れば大丈夫です。"
        },
        {
          "type": "table",
          "head": [
            "駅",
            "主なスポット"
          ],
          "rows": [
            [
              "原宿",
              "明治神宮、竹下通り"
            ],
            [
              "渋谷",
              "スクランブル交差点"
            ],
            [
              "秋葉原",
              "電気街"
            ],
            [
              "上野",
              "上野公園、アメ横"
            ]
          ]
        },
        {
          "type": "shot",
          "shot": "one-line",
          "article": "tokyo-train-map-beginner",
          "alt": "山手線だけを表示した地図。原宿・渋谷・秋葉原・上野が緑色の環の上に並んでいる",
          "caption": "山手線だけを表示。定番エリアの駅が1本の環の上に並ぶ"
        },
        {
          "type": "h2",
          "text": "浅草とお台場だけは路線を足す"
        },
        {
          "type": "h3",
          "text": "浅草へは銀座線"
        },
        {
          "type": "p",
          "text": "浅草は山手線の駅ではありません。東京メトロ銀座線の終点で、山手線の上野・神田・新橋・渋谷で乗り換えられます。上野からなら3駅です。"
        },
        {
          "type": "shot",
          "shot": "yamanote-ginza",
          "alt": "山手線と銀座線だけを表示した地図。オレンジ色の銀座線が上野から浅草へ延びている",
          "caption": "山手線に銀座線を足した状態。上野から浅草へ延びるオレンジ色の線が銀座線"
        },
        {
          "type": "h3",
          "text": "お台場へはゆりかもめ・りんかい線"
        },
        {
          "type": "p",
          "text": "お台場へは2本あります。新橋から乗るゆりかもめは、レインボーブリッジを渡る眺めのよい路線です。大崎から乗るりんかい線は地下を走り、東京テレポート駅に着きます。りんかい線は埼京線と直通する電車もあり、渋谷・新宿から乗り換えずに行ける列車もあります。"
        },
        {
          "type": "shot",
          "shot": "odaiba",
          "alt": "山手線・ゆりかもめ・りんかい線を表示した地図。新橋から豊洲へ向かうゆりかもめと、大崎から新木場へ向かうりんかい線がお台場を通っている",
          "caption": "新橋から出るのがゆりかもめ、大崎から出るのがりんかい線。どちらもお台場を通る"
        },
        {
          "type": "h2",
          "text": "4路線だけの地図で1日の順番を決める"
        },
        {
          "type": "p",
          "text": "地図に出す路線を、山手線・銀座線・ゆりかもめ・りんかい線の4本にしぼると、定番の観光地はこの範囲に収まります。行きたい場所の駅を地図で確かめ、近い順に並べると、無駄な移動が減ります。"
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.67,
              139.76
            ],
            "zoom": 12
          },
          "title": "{siteName}の地図（観光で使う4路線だけを表示した状態）",
          "caption": "実際の地図（観光で使う4路線だけを表示した状態）。枠の中で拡大・移動できます。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "観光で使う4路線だけを表示した地図を開く",
          "text": "山手線・銀座線・ゆりかもめ・りんかい線だけが出た状態で開きます。"
        }
      ]
    },
    "en": {
      "meta": {
        "title": "Getting Around Tokyo by Train: Start with the Yamanote Line, Add Lines for Asakusa and Odaiba",
        "description": "You need fewer train lines for Tokyo sightseeing than you think. Harajuku, Shibuya, Akihabara and Ueno are on the Yamanote Line; Asakusa and Odaiba are the main exceptions. See on real maps how to add the Ginza Line, Yurikamome and Rinkai Line.",
        "category": "Travel Guide",
        "kicker": "Travel Guide",
        "readTime": "About 5 min read",
        "tag": "Travel Guide"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "Most classic sightseeing areas are at JR Yamanote Line stations",
            "For Asakusa, add the Tokyo Metro Ginza Line",
            "For Odaiba, add the Yurikamome (from Shimbashi) or the Rinkai Line (from Osaki)"
          ]
        },
        {
          "type": "h2",
          "text": "You need only a few lines for sightseeing"
        },
        {
          "type": "p",
          "text": "Tokyo has many rail lines, but most sightseeing spots are either at a station on the Yamanote Line, which loops around central Tokyo, or one transfer away from it. You do not need to learn every line. Think \"use the Yamanote Line as the base, and add a line only where it does not reach.\""
        },
        {
          "type": "h2",
          "text": "The classic areas are on the Yamanote Line"
        },
        {
          "type": "p",
          "text": "Harajuku, Shibuya, Akihabara and Ueno are all Yamanote Line stations. Because the line is a loop, either direction eventually gets you there; just take the shorter way."
        },
        {
          "type": "table",
          "head": [
            "Station",
            "Main spots"
          ],
          "rows": [
            [
              "Harajuku",
              "Meiji Jingu, Takeshita Street"
            ],
            [
              "Shibuya",
              "Scramble Crossing"
            ],
            [
              "Akihabara",
              "Electric Town"
            ],
            [
              "Ueno",
              "Ueno Park, Ameyoko"
            ]
          ]
        },
        {
          "type": "shot",
          "shot": "one-line",
          "article": "tokyo-train-map-beginner",
          "alt": "Map showing only the Yamanote Line, with Harajuku, Shibuya, Akihabara and Ueno on the green loop",
          "caption": "Only the Yamanote Line. The classic areas sit on one loop"
        },
        {
          "type": "h2",
          "text": "Add lines only for Asakusa and Odaiba"
        },
        {
          "type": "h3",
          "text": "Asakusa: the Ginza Line"
        },
        {
          "type": "p",
          "text": "Asakusa is not on the Yamanote Line. It is the terminus of the Tokyo Metro Ginza Line, which you can transfer to from the Yamanote Line at Ueno, Kanda, Shimbashi and Shibuya. From Ueno it is three stops."
        },
        {
          "type": "shot",
          "shot": "yamanote-ginza",
          "alt": "Map showing only the Yamanote and Ginza lines, with the orange Ginza Line extending from Ueno to Asakusa",
          "caption": "The Ginza Line added to the Yamanote Line. The orange line from Ueno to Asakusa is the Ginza Line"
        },
        {
          "type": "h3",
          "text": "Odaiba: the Yurikamome or the Rinkai Line"
        },
        {
          "type": "p",
          "text": "Two lines serve Odaiba. The Yurikamome from Shimbashi crosses the Rainbow Bridge and has great views. The Rinkai Line from Osaki runs underground to Tokyo Teleport Station. Some Rinkai Line trains run through from the Saikyo Line, so some trains from Shibuya and Shinjuku get there without a transfer."
        },
        {
          "type": "shot",
          "shot": "odaiba",
          "alt": "Map showing the Yamanote Line, Yurikamome and Rinkai Line. The Yurikamome runs from Shimbashi to Toyosu and the Rinkai Line from Osaki to Shin-kiba, both through Odaiba",
          "caption": "The line from Shimbashi is the Yurikamome; the one from Osaki is the Rinkai Line. Both pass through Odaiba"
        },
        {
          "type": "h2",
          "text": "Plan the day on a map with just four lines"
        },
        {
          "type": "p",
          "text": "Narrow the map to the Yamanote Line, Ginza Line, Yurikamome and Rinkai Line, and the classic sights fit within it. Find the stations of the places you want to visit and visit them in order of distance to cut wasted travel."
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.67,
              139.76
            ],
            "zoom": 12
          },
          "title": "{siteName} map (only the four sightseeing lines shown)",
          "caption": "The live map (only the four sightseeing lines shown). You can zoom and pan inside the frame."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "Open a map with the four sightseeing lines",
          "text": "The map opens with only the Yamanote Line, Ginza Line, Yurikamome and Rinkai Line."
        }
      ]
    },
    "zh": {
      "meta": {
        "title": "东京观光坐电车以山手线为主：只为浅草和台场加线路",
        "description": "东京观光需要用到的线路并不多。原宿、涩谷、秋叶原、上野可以坐山手线到达，需要补充的主要是浅草和台场。本文用实际地图介绍在山手线上加上银座线、百合海鸥号和临海线的思路。",
        "category": "观光指南",
        "kicker": "观光指南",
        "readTime": "约 5 分钟阅读",
        "tag": "观光指南"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "经典景点大多在 JR 山手线的车站",
            "去浅草，加上东京地铁银座线",
            "去台场，加上百合海鸥号（从新桥）或临海线（从大崎）"
          ]
        },
        {
          "type": "h2",
          "text": "观光用到的线路并不多"
        },
        {
          "type": "p",
          "text": "东京的线路很多，但观光要去的地方，大多在环绕市中心的山手线车站，或从那里换乘一次就能到。不必一开始就记住所有线路。以“山手线为主，只为到不了的地方加线路”来思考，就不容易迷路。"
        },
        {
          "type": "h2",
          "text": "经典景点坐山手线就能到"
        },
        {
          "type": "p",
          "text": "原宿、涩谷、秋叶原、上野都是山手线的车站。山手线是环线，往哪个方向坐最终都会到，选近的方向即可。"
        },
        {
          "type": "table",
          "head": [
            "车站",
            "主要景点"
          ],
          "rows": [
            [
              "原宿",
              "明治神宫、竹下通"
            ],
            [
              "涩谷",
              "十字路口（Scramble Crossing）"
            ],
            [
              "秋叶原",
              "电器街"
            ],
            [
              "上野",
              "上野公园、阿美横"
            ]
          ]
        },
        {
          "type": "shot",
          "shot": "one-line",
          "article": "tokyo-train-map-beginner",
          "alt": "只显示山手线的地图，原宿、涩谷、秋叶原、上野位于绿色环线上",
          "caption": "只显示山手线。经典景点的车站都在一个环上"
        },
        {
          "type": "h2",
          "text": "只为浅草和台场加线路"
        },
        {
          "type": "h3",
          "text": "去浅草坐银座线"
        },
        {
          "type": "p",
          "text": "浅草不是山手线的车站。它是东京地铁银座线的终点，可在山手线的上野、神田、新桥、涩谷换乘。从上野坐3站即到。"
        },
        {
          "type": "shot",
          "shot": "yamanote-ginza",
          "alt": "只显示山手线和银座线的地图，橙色的银座线从上野延伸到浅草",
          "caption": "在山手线上加上银座线。从上野延伸到浅草的橙色线就是银座线"
        },
        {
          "type": "h3",
          "text": "去台场坐百合海鸥号或临海线"
        },
        {
          "type": "p",
          "text": "去台场有两条线。从新桥出发的百合海鸥号会经过彩虹大桥，沿途风景很好。从大崎出发的临海线在地下行驶，到达东京电讯港站。临海线有与埼京线直通的列车，部分列车从涩谷、新宿不用换乘即可到达。"
        },
        {
          "type": "shot",
          "shot": "odaiba",
          "alt": "显示山手线、百合海鸥号、临海线的地图。从新桥到丰洲的百合海鸥号和从大崎到新木场的临海线都经过台场",
          "caption": "从新桥出发的是百合海鸥号，从大崎出发的是临海线，两条都经过台场"
        },
        {
          "type": "h2",
          "text": "用只有4条线路的地图安排一天的顺序"
        },
        {
          "type": "p",
          "text": "把地图上的线路缩小到山手线、银座线、百合海鸥号、临海线4条，经典景点都在这个范围内。在地图上确认想去地点的车站，按远近排好顺序，就能减少多余的移动。"
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.67,
              139.76
            ],
            "zoom": 12
          },
          "title": "{siteName}地图（只显示4条观光线路）",
          "caption": "实际的地图（只显示4条观光线路）。可以在框内缩放和移动。"
        },
        {
          "type": "cta",
          "map": "main",
          "title": "打开只显示4条观光线路的地图",
          "text": "地图会以只显示山手线、银座线、百合海鸥号、临海线的状态打开。"
        }
      ]
    },
    "ko": {
      "meta": {
        "title": "도쿄 관광 전철은 야마노테선이 중심: 아사쿠사·오다이바만 노선을 더한다",
        "description": "도쿄 관광에 쓰는 전철은 많지 않습니다. 하라주쿠·시부야·아키하바라·우에노는 야마노테선으로 돌 수 있고, 부족한 곳은 아사쿠사와 오다이바 정도입니다. 야마노테선에 긴자선, 유리카모메·린카이선을 더하는 방법을 실제 지도로 소개합니다.",
        "category": "관광 가이드",
        "kicker": "관광 가이드",
        "readTime": "약 5분 읽기",
        "tag": "관광 가이드"
      },
      "blocks": [
        {
          "type": "points",
          "items": [
            "대표 관광지 대부분은 JR 야마노테선 역에 있다",
            "아사쿠사에 가려면 도쿄메트로 긴자선을 더한다",
            "오다이바에 가려면 유리카모메(신바시에서)나 린카이선(오사키에서)을 더한다"
          ]
        },
        {
          "type": "h2",
          "text": "관광에 쓰는 노선은 많지 않다"
        },
        {
          "type": "p",
          "text": "도쿄에는 노선이 많지만, 관광으로 가는 곳 대부분은 도심을 한 바퀴 도는 야마노테선 역이거나 거기서 한 번 갈아탄 곳에 있습니다. 처음부터 모든 노선을 외울 필요는 없습니다. “야마노테선을 중심으로, 닿지 않는 곳만 노선을 더한다”고 생각하면 헤매지 않습니다."
        },
        {
          "type": "h2",
          "text": "대표 지역은 야마노테선으로 돈다"
        },
        {
          "type": "p",
          "text": "하라주쿠·시부야·아키하바라·우에노는 모두 야마노테선 역입니다. 야마노테선은 순환선이라 어느 방향으로 타도 언젠가는 도착합니다. 가까운 방향의 전철을 타면 됩니다."
        },
        {
          "type": "table",
          "head": [
            "역",
            "주요 명소"
          ],
          "rows": [
            [
              "하라주쿠",
              "메이지 신궁, 다케시타 거리"
            ],
            [
              "시부야",
              "스크램블 교차로"
            ],
            [
              "아키하바라",
              "전자상가"
            ],
            [
              "우에노",
              "우에노 공원, 아메요코"
            ]
          ]
        },
        {
          "type": "shot",
          "shot": "one-line",
          "article": "tokyo-train-map-beginner",
          "alt": "야마노테선만 표시한 지도. 하라주쿠·시부야·아키하바라·우에노가 초록색 고리 위에 있다",
          "caption": "야마노테선만 표시. 대표 지역의 역이 고리 하나 위에 늘어선다"
        },
        {
          "type": "h2",
          "text": "아사쿠사와 오다이바만 노선을 더한다"
        },
        {
          "type": "h3",
          "text": "아사쿠사는 긴자선"
        },
        {
          "type": "p",
          "text": "아사쿠사는 야마노테선 역이 아닙니다. 도쿄메트로 긴자선의 종점으로, 야마노테선의 우에노·간다·신바시·시부야에서 갈아탈 수 있습니다. 우에노에서 3정거장입니다."
        },
        {
          "type": "shot",
          "shot": "yamanote-ginza",
          "alt": "야마노테선과 긴자선만 표시한 지도. 주황색 긴자선이 우에노에서 아사쿠사로 뻗어 있다",
          "caption": "야마노테선에 긴자선을 더한 상태. 우에노에서 아사쿠사로 뻗은 주황색 선이 긴자선"
        },
        {
          "type": "h3",
          "text": "오다이바는 유리카모메·린카이선"
        },
        {
          "type": "p",
          "text": "오다이바로 가는 노선은 두 개입니다. 신바시에서 타는 유리카모메는 레인보우 브리지를 건너 경치가 좋은 노선입니다. 오사키에서 타는 린카이선은 지하를 달려 오다이바에 도착합니다. 린카이선은 사이쿄선과 직통하는 열차도 있어, 시부야·신주쿠에서 갈아타지 않고 가는 열차도 있습니다."
        },
        {
          "type": "shot",
          "shot": "odaiba",
          "alt": "야마노테선·유리카모메·린카이선을 표시한 지도. 신바시에서 도요스로 가는 유리카모메와 오사키에서 신기바로 가는 린카이선이 오다이바를 지난다",
          "caption": "신바시에서 출발하는 것이 유리카모메, 오사키에서 출발하는 것이 린카이선. 둘 다 오다이바를 지난다"
        },
        {
          "type": "h2",
          "text": "4개 노선만 있는 지도로 하루 순서를 정한다"
        },
        {
          "type": "p",
          "text": "지도에 표시할 노선을 야마노테선·긴자선·유리카모메·린카이선 4개로 줄이면 대표 관광지는 이 범위에 들어옵니다. 가고 싶은 곳의 역을 지도에서 확인하고 가까운 순서로 늘어놓으면 쓸데없는 이동이 줄어듭니다."
        },
        {
          "type": "embed",
          "map": "main",
          "view": {
            "center": [
              35.67,
              139.76
            ],
            "zoom": 12
          },
          "title": "{siteName} 지도(관광용 4개 노선만 표시한 상태)",
          "caption": "실제 지도(관광용 4개 노선만 표시한 상태). 틀 안에서 확대·이동할 수 있습니다."
        },
        {
          "type": "cta",
          "map": "main",
          "title": "관광용 4개 노선만 표시한 지도 열기",
          "text": "야마노테선·긴자선·유리카모메·린카이선만 나온 상태로 열립니다."
        }
      ]
    }
  }
};
