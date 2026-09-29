import type { ArticleLanguage } from './articleI18n';

type ArticleBodyTranslations = Record<string, Record<ArticleLanguage, string>>;

export const ARTICLE_BODY_TRANSLATIONS: ArticleBodyTranslations = {
  "flex-rail-map-introduction": {
    ja: `
      <h2><span class="num">01</span><span>なぜ作りたかったのか</span></h2>
      <p>きっかけは、自分自身が電車の中でよく不安になっていたからです。今どちら方向に進んでいるのか、この電車で本当に合っているのか、目的地まであとどのくらいなのか。混雑している車内では、その小さな不安が意外と大きくなります。</p>
      <p>Flex Rail Map は、その不安を減らすために、必要な路線だけを残して「今どう進んでいるか」を見やすくする路線図UIです。</p>
      <h2><span class="num">02</span><span>既存サービスとの違い</span></h2>
      <p>乗換案内アプリは最適なルートを出すのが得意です。一方で、路線のつながり、分岐、方向、現在地を自分で理解するには、従来の路線図のような「全体像」も必要です。</p>
      <p>Flex Rail Map は、最適解を出して終わりではなく、利用者自身が状況を理解できる地図を目指しています。</p>
      <h2><span class="num">03</span><span>やること</span></h2>
      <div class="cards">
        <div class="card"><h4>必要な路線だけ表示</h4><p>関係ない路線を一時的に隠して、自分の移動に必要な線だけを追えるようにします。</p></div>
        <div class="card"><h4>「今どこ？」を分かりやすく</h4><p>現在地、方向、通過駅、所要時間を路線図の上で理解しやすくします。</p></div>
        <div class="card"><h4>分岐・行き先を把握</h4><p>同じ路線でも行き先が分かれる場面を、視覚的に判断しやすくします。</p></div>
      </div>
      <h2><span class="num">04</span><span>こんな時に使えます</span></h2>
      <div class="uses">
        <div class="use"><div class="t"><span class="dot"></span>初めての路線</div><p>土地勘がなくても、使う路線だけを表示して流れを追えます。</p></div>
        <div class="use"><div class="t"><span class="dot"></span>遅延・運休時</div><p>迂回が必要な時に、路線のつながりを見ながら判断できます。</p></div>
        <div class="use"><div class="t"><span class="dot"></span>毎日の通勤</div><p>いつもの路線だけに絞って、分岐や行き先を素早く確認できます。</p></div>
        <div class="use"><div class="t"><span class="dot"></span>訪日・多言語利用</div><p>駅名が読めない場合でも、線の流れから進む方向を把握しやすくします。</p></div>
      </div>
      <div class="cta"><div class="ey">今すぐ試す</div><h3>自分のルートに関係する路線だけを表示してみてください</h3><p>39路線の表示ON/OFFや乗換駅フィルターで、複雑な東京の路線図を自分仕様に整理できます。</p><a class="btn" href="/">フレックス路線図をひらく <span class="ar">→</span></a></div>
    `,
    en: `
      <h2><span class="num">01</span><span>Why I wanted to build it</span></h2>
      <p>The starting point was a very ordinary anxiety: being on a train and wondering which direction it is going, whether it is really the right train, and how far the destination still is. In a crowded car, those small uncertainties become surprisingly stressful.</p>
      <p>Flex Rail Map is a rail-map UI designed to reduce that stress by showing only the lines you need and making your current route easier to understand.</p>
      <h2><span class="num">02</span><span>How it differs from route-search apps</span></h2>
      <p>Transfer apps are excellent at giving you the optimal route. But when you want to understand how lines connect, where branches go, and what direction you are traveling, you still need a readable map-like overview.</p>
      <p>Flex Rail Map is not just about presenting an answer. It is about helping riders understand the situation for themselves.</p>
      <h2><span class="num">03</span><span>What it does</span></h2>
      <div class="cards">
        <div class="card"><h4>Show only relevant lines</h4><p>Hide unrelated lines temporarily so you can follow only the route that matters to your trip.</p></div>
        <div class="card"><h4>Make “Where am I?” clearer</h4><p>Current position, direction, passing stations, and travel time become easier to read on the map.</p></div>
        <div class="card"><h4>Understand branches and destinations</h4><p>When a line splits into several destinations, the UI helps you judge the correct direction visually.</p></div>
      </div>
      <h2><span class="num">04</span><span>When to use it</span></h2>
      <div class="uses">
        <div class="use"><div class="t"><span class="dot"></span>Unfamiliar lines</div><p>Even without local knowledge, you can focus on the lines you will actually use.</p></div>
        <div class="use"><div class="t"><span class="dot"></span>Delays and disruptions</div><p>When the best route changes, you can inspect connections and choose an alternate path.</p></div>
        <div class="use"><div class="t"><span class="dot"></span>Daily commuting</div><p>Keep your usual lines visible and check branches or destinations quickly.</p></div>
        <div class="use"><div class="t"><span class="dot"></span>Visitors and multilingual use</div><p>Even when station names are hard to read, the flow of the line helps you understand direction.</p></div>
      </div>
      <div class="cta"><div class="ey">Try it now</div><h3>Display only the lines related to your route</h3><p>Use line visibility controls and transfer filters to turn Tokyo’s dense rail map into a map that fits your trip.</p><a class="btn" href="/?lang=en">Open Flex Rail Map <span class="ar">→</span></a></div>
    `,
    zh: `
      <h2><span class="num">01</span><span>为什么想做这个工具</span></h2>
      <p>起点是一个很普通的不安：坐在电车里时，不确定列车正往哪个方向走、不确定是不是坐对了、也不知道离目的地还有多远。在拥挤的车厢里，这些小疑问会变成很大的压力。</p>
      <p>Flex Rail Map 通过只显示需要的线路，让你更容易理解现在的路线和方向。</p>
      <h2><span class="num">02</span><span>和换乘 App 的区别</span></h2>
      <p>换乘 App 擅长给出最佳路线。但是如果想理解线路之间如何连接、分岔之后去哪里、现在朝哪个方向移动，仍然需要一个容易读懂的路线图。</p>
      <p>Flex Rail Map 不只是给出答案，而是帮助使用者自己理解当前状况。</p>
      <h2><span class="num">03</span><span>主要功能</span></h2>
      <div class="cards">
        <div class="card"><h4>只显示相关线路</h4><p>暂时隐藏无关线路，只追踪本次移动需要的线路。</p></div>
        <div class="card"><h4>更容易知道“我在哪里”</h4><p>当前位置、方向、经过车站和所需时间都能在路线图上更清楚地理解。</p></div>
        <div class="card"><h4>理解分岔和目的地</h4><p>当同一线路分成不同方向时，可以更直观地判断该坐哪一班。</p></div>
      </div>
      <h2><span class="num">04</span><span>适合使用的场景</span></h2>
      <div class="uses">
        <div class="use"><div class="t"><span class="dot"></span>第一次使用的线路</div><p>即使没有土地感，也能只看实际会用到的线路。</p></div>
        <div class="use"><div class="t"><span class="dot"></span>延误或停运时</div><p>需要绕行时，可以看着线路连接关系自己判断。</p></div>
        <div class="use"><div class="t"><span class="dot"></span>日常通勤</div><p>只保留常用线路，快速确认分岔和方向。</p></div>
        <div class="use"><div class="t"><span class="dot"></span>访日和多语言使用</div><p>即使车站名不好读，也能通过线路流向理解方向。</p></div>
      </div>
      <div class="cta"><div class="ey">立即试用</div><h3>只显示与你的路线相关的线路</h3><p>通过线路显示开关和换乘站过滤器，把复杂的东京路线图整理成适合自己的地图。</p><a class="btn" href="/?lang=zh">打开 Flex Rail Map <span class="ar">→</span></a></div>
    `,
    ko: `
      <h2><span class="num">01</span><span>왜 만들고 싶었는가</span></h2>
      <p>출발점은 아주 평범한 불안이었습니다. 전철을 타고 있으면서 지금 어느 방향으로 가는지, 이 열차가 맞는지, 목적지까지 얼마나 남았는지 헷갈리는 순간입니다. 붐비는 차 안에서는 작은 의문도 꽤 큰 스트레스가 됩니다.</p>
      <p>Flex Rail Map은 필요한 노선만 보여 주어 현재 경로와 방향을 더 쉽게 이해하도록 돕는 노선도 UI입니다.</p>
      <h2><span class="num">02</span><span>환승 앱과의 차이</span></h2>
      <p>환승 앱은 최적 경로를 알려 주는 데 강합니다. 하지만 노선이 어떻게 연결되는지, 분기 후 어디로 가는지, 지금 어느 방향으로 이동하는지 이해하려면 읽기 쉬운 지도형 개요도 필요합니다.</p>
      <p>Flex Rail Map은 답만 제시하는 것이 아니라 사용자가 상황을 직접 이해하도록 돕는 것을 목표로 합니다.</p>
      <h2><span class="num">03</span><span>주요 기능</span></h2>
      <div class="cards">
        <div class="card"><h4>관련 노선만 표시</h4><p>관계없는 노선을 잠시 숨기고, 이번 이동에 필요한 선만 따라갈 수 있습니다.</p></div>
        <div class="card"><h4>“지금 어디?”를 더 명확하게</h4><p>현재 위치, 방향, 통과역, 소요 시간을 노선도 위에서 이해하기 쉽게 보여 줍니다.</p></div>
        <div class="card"><h4>분기와 행선지 파악</h4><p>같은 노선이 여러 방향으로 갈라질 때 올바른 방향을 시각적으로 판단하기 쉽게 합니다.</p></div>
      </div>
      <h2><span class="num">04</span><span>사용하기 좋은 상황</span></h2>
      <div class="uses">
        <div class="use"><div class="t"><span class="dot"></span>처음 타는 노선</div><p>지역을 잘 몰라도 실제로 사용할 노선만 집중해서 볼 수 있습니다.</p></div>
        <div class="use"><div class="t"><span class="dot"></span>지연・운휴 상황</div><p>우회가 필요할 때 노선 연결을 보며 직접 판단할 수 있습니다.</p></div>
        <div class="use"><div class="t"><span class="dot"></span>매일의 통근</div><p>자주 쓰는 노선만 남겨 분기와 행선지를 빠르게 확인할 수 있습니다.</p></div>
        <div class="use"><div class="t"><span class="dot"></span>방문객・다국어 이용</div><p>역명이 읽기 어려워도 선의 흐름으로 방향을 이해할 수 있습니다.</p></div>
      </div>
      <div class="cta"><div class="ey">지금 사용해 보기</div><h3>내 경로와 관련된 노선만 표시해 보세요</h3><p>노선 표시 전환과 환승역 필터로 복잡한 도쿄 노선도를 내 이동에 맞게 정리할 수 있습니다.</p><a class="btn" href="/?lang=ko">Flex Rail Map 열기 <span class="ar">→</span></a></div>
    `,
  },
  "tokyo-train-map-beginner": {
    ja: `
      <p>上京したて、あるいは訪日して初めて東京の電車に乗るとき、多くの人が同じ場所でつまずきます。この記事では、初心者がまず押さえておきたい<strong>路線図の読み方</strong>と、<strong>乗り換えの基本</strong>を、順を追ってやさしく解説します。</p>
      <div class="points"><div class="ttl">この記事のポイント</div><ul><li>東京の電車は複数の会社が運行している</li><li>路線は色と駅ナンバリングで見分ける</li><li>乗り換えで最も大事なのは方面確認</li><li>必要な路線だけに絞ると読みやすくなる</li></ul></div>
      <h2><span class="num">01</span><span>なぜ東京の路線図は複雑に見えるのか</span></h2>
      <p>東京の鉄道が分かりにくい最大の理由は、JR、東京メトロ、都営地下鉄、私鉄など複数の会社が網の目のように重なっていることです。相互直通運転により、同じ電車が途中から別の路線名になることもあります。</p>
      <h2><span class="num">02</span><span>路線図の読み方 ― 3つの基本</span></h2>
      <h3><span class="lab">①</span>色で一本だけ追う</h3><p>目的の路線を見つけたら、その色の線だけを目で追いましょう。すべてを一度に理解しようとしないのがコツです。</p>
      <h3><span class="lab">②</span>記号と番号を見る</h3><p><span class="mono">JY20</span> のような駅ナンバリングは、アルファベットが路線、数字が駅の順番を示します。</p>
      <h3><span class="lab">③</span>乗換駅のマークを見る</h3><p>複数の線が交わる白い丸は、路線を乗り換えられる駅を表します。</p>
      <figure class="map"><div class="map-head"><div class="cap">図：<b>必要な路線だけ</b>表示してみる</div><p class="sub">チップをタップして路線を消したり戻したりできます。</p></div><div class="chips" id="chips" role="group" aria-label="表示する路線の切り替え"></div><div class="map-stage"><svg viewBox="0 0 640 440" role="img" aria-label="東京の主要路線を簡略化した概念図"><g id="g-yamanote" class="ln" data-line="yamanote"><polygon points="210,95 420,110 470,250 380,365 200,345 150,205" fill="none" stroke="#7FBF3F" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-chuo" class="ln" data-line="chuo"><polyline points="150,205 300,225 400,205 470,250" fill="none" stroke="#E8542A" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-marunouchi" class="ln" data-line="marunouchi"><polyline points="210,95 330,160 420,215 470,250" fill="none" stroke="#D9362C" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-ginza" class="ln" data-line="ginza"><polyline points="200,345 275,302 450,302 440,200 420,110" fill="none" stroke="#F5A623" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-odakyu" class="ln" data-line="odakyu"><polyline points="150,205 78,262 40,332" fill="none" stroke="#1F7FC4" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-tozai" class="ln" data-line="tozai"><polyline points="70,168 250,196 420,215 575,215" fill="none" stroke="#16A7CE" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="nodes"><g><circle cx="210" cy="95" r="7.5" fill="#fff" stroke="#211E18" stroke-width="2.6"/><text class="st-label" x="210" y="78" text-anchor="middle">池袋</text></g><g><circle cx="470" cy="250" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="484" y="254">東京</text></g><g><circle cx="200" cy="345" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="186" y="366" text-anchor="end">渋谷</text></g><g><circle cx="150" cy="205" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="136" y="200" text-anchor="end">新宿</text></g></g></svg></div><div class="readout" id="readout">表示中の路線：<b>6</b> / 6</div><div class="map-note">※ これは概念図です。</div></figure>
      <h2><span class="num">03</span><span>乗り換えの基本4ステップ</span></h2><ol class="steps"><li><strong>目的地の方面を確認する。</strong></li><li><strong>乗り換える路線の色・記号を探す。</strong></li><li><strong>案内サインの色を頼りに移動する。</strong></li><li><strong>電車の行き先を確認して乗る。</strong></li></ol>
      <div class="cta"><div class="ey">今すぐ試す</div><h3>自分のルートに関係する路線だけを表示してみよう</h3><p>Flex Rail Map は、出発駅と到着駅に関連する路線だけを絞り込んで表示できるインタラクティブ路線図です。</p><a class="btn" href="/">Flex Rail Map をひらく <span class="ar">→</span></a></div>
    `,
    en: `
      <p>If you are new to Tokyo or visiting Japan, Tokyo trains can feel intimidating. This guide explains how to read a rail map and how to transfer without relying on complex terminology.</p>
      <div class="points"><div class="ttl">Key Points</div><ul><li>Tokyo trains are operated by multiple companies.</li><li>Lines are identified by colors and station numbering.</li><li>The most important transfer check is direction.</li><li>A filtered map is much easier to read.</li></ul></div>
      <h2><span class="num">01</span><span>Why Tokyo maps look complicated</span></h2><p>JR, Tokyo Metro, Toei Subway, and private railways overlap across the city. Through services can also continue from one company’s line into another, so one train may appear to change line names along the way.</p>
      <h2><span class="num">02</span><span>Three basics for reading the map</span></h2><h3><span class="lab">1</span>Follow one color</h3><p>Find the line you need and follow only that colored line. Do not try to read the whole map at once.</p><h3><span class="lab">2</span>Use symbols and numbers</h3><p>Station codes such as <span class="mono">JY20</span> show the line and station order, which is helpful even when names are hard to read.</p><h3><span class="lab">3</span>Look for transfer markers</h3><p>White circles where lines cross usually indicate transfer stations.</p>
      <figure class="map"><div class="map-head"><div class="cap">Figure: show <b>only the lines you need</b></div><p class="sub">Tap a chip to hide or show a line.</p></div><div class="chips" id="chips" role="group" aria-label="Choose which lines to show"></div><div class="map-stage"><svg viewBox="0 0 640 440" role="img" aria-label="Simplified concept map of major Tokyo lines"><g id="g-yamanote" class="ln" data-line="yamanote"><polygon points="210,95 420,110 470,250 380,365 200,345 150,205" fill="none" stroke="#7FBF3F" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-chuo" class="ln" data-line="chuo"><polyline points="150,205 300,225 400,205 470,250" fill="none" stroke="#E8542A" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-marunouchi" class="ln" data-line="marunouchi"><polyline points="210,95 330,160 420,215 470,250" fill="none" stroke="#D9362C" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-ginza" class="ln" data-line="ginza"><polyline points="200,345 275,302 450,302 440,200 420,110" fill="none" stroke="#F5A623" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-odakyu" class="ln" data-line="odakyu"><polyline points="150,205 78,262 40,332" fill="none" stroke="#1F7FC4" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-tozai" class="ln" data-line="tozai"><polyline points="70,168 250,196 420,215 575,215" fill="none" stroke="#16A7CE" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="nodes"><g><circle cx="210" cy="95" r="7.5" fill="#fff" stroke="#211E18" stroke-width="2.6"/><text class="st-label" x="210" y="78" text-anchor="middle">Ikebukuro</text></g><g><circle cx="470" cy="250" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="484" y="254">Tokyo</text></g><g><circle cx="200" cy="345" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="186" y="366" text-anchor="end">Shibuya</text></g><g><circle cx="150" cy="205" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="136" y="200" text-anchor="end">Shinjuku</text></g></g></svg></div><div class="readout" id="readout">Lines shown: <b>6</b> / 6</div><div class="map-note">This is a conceptual diagram.</div></figure>
      <h2><span class="num">03</span><span>Four transfer steps</span></h2><ol class="steps"><li><strong>Check the direction of your destination.</strong></li><li><strong>Find the color and code of the next line.</strong></li><li><strong>Follow station signs by color.</strong></li><li><strong>Confirm the train destination before boarding.</strong></li></ol>
      <div class="cta"><div class="ey">Try it now</div><h3>Show only the lines related to your route</h3><p>Flex Rail Map filters Tokyo’s dense network so you can focus on the lines you actually need.</p><a class="btn" href="/?lang=en">Open Flex Rail Map <span class="ar">→</span></a></div>
    `,
    zh: `
      <p>刚到东京或第一次来日本时，东京电车看起来很复杂。本指南用简单的方式说明路线图怎么看、换乘时该确认什么。</p>
      <div class="points"><div class="ttl">重点</div><ul><li>东京电车由多家公司运营。</li><li>线路可以通过颜色和车站编号区分。</li><li>换乘时最重要的是确认方向。</li><li>只显示需要的线路会更容易读懂。</li></ul></div>
      <h2><span class="num">01</span><span>为什么东京路线图看起来复杂</span></h2><p>JR、东京地铁、都营地铁和私铁在城市中交错运行。直通运行也会让同一列车中途进入另一家公司的线路。</p>
      <h2><span class="num">02</span><span>看路线图的三个基础</span></h2><h3><span class="lab">1</span>只追踪一种颜色</h3><p>找到目标线路后，只沿着那条颜色看，不必一次理解整张图。</p><h3><span class="lab">2</span>看符号和编号</h3><p><span class="mono">JY20</span> 这样的编号可以显示线路和车站顺序。</p><h3><span class="lab">3</span>找换乘标记</h3><p>多条线路交汇的白色圆点通常表示可换乘车站。</p>
      <figure class="map"><div class="map-head"><div class="cap">图：只显示<b>需要的线路</b></div><p class="sub">点击标签可以隐藏或重新显示线路。</p></div><div class="chips" id="chips" role="group" aria-label="切换显示的线路"></div><div class="map-stage"><svg viewBox="0 0 640 440" role="img" aria-label="东京主要线路的简化概念图"><g id="g-yamanote" class="ln" data-line="yamanote"><polygon points="210,95 420,110 470,250 380,365 200,345 150,205" fill="none" stroke="#7FBF3F" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-chuo" class="ln" data-line="chuo"><polyline points="150,205 300,225 400,205 470,250" fill="none" stroke="#E8542A" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-marunouchi" class="ln" data-line="marunouchi"><polyline points="210,95 330,160 420,215 470,250" fill="none" stroke="#D9362C" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-ginza" class="ln" data-line="ginza"><polyline points="200,345 275,302 450,302 440,200 420,110" fill="none" stroke="#F5A623" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-odakyu" class="ln" data-line="odakyu"><polyline points="150,205 78,262 40,332" fill="none" stroke="#1F7FC4" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-tozai" class="ln" data-line="tozai"><polyline points="70,168 250,196 420,215 575,215" fill="none" stroke="#16A7CE" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="nodes"><g><circle cx="210" cy="95" r="7.5" fill="#fff" stroke="#211E18" stroke-width="2.6"/><text class="st-label" x="210" y="78" text-anchor="middle">池袋</text></g><g><circle cx="470" cy="250" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="484" y="254">东京</text></g><g><circle cx="200" cy="345" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="186" y="366" text-anchor="end">涩谷</text></g><g><circle cx="150" cy="205" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="136" y="200" text-anchor="end">新宿</text></g></g></svg></div><div class="readout" id="readout">显示中的线路：<b>6</b> / 6</div><div class="map-note">※ 这是概念图。</div></figure>
      <h2><span class="num">03</span><span>换乘的四个步骤</span></h2><ol class="steps"><li><strong>确认目的地所在方向。</strong></li><li><strong>找到要换乘线路的颜色和编号。</strong></li><li><strong>根据站内指示牌颜色移动。</strong></li><li><strong>上车前确认列车目的地。</strong></li></ol>
      <div class="cta"><div class="ey">立即试用</div><h3>只显示与你的路线相关的线路</h3><p>Flex Rail Map 可以过滤东京复杂的铁路网，只保留你真正需要看的线路。</p><a class="btn" href="/?lang=zh">打开 Flex Rail Map <span class="ar">→</span></a></div>
    `,
    ko: `
      <p>도쿄에 막 왔거나 일본을 처음 방문했다면 전철 노선도가 복잡하게 느껴질 수 있습니다. 이 가이드는 노선도를 읽는 법과 환승할 때 확인할 점을 쉽게 설명합니다.</p>
      <div class="points"><div class="ttl">핵심</div><ul><li>도쿄 전철은 여러 회사가 운영합니다.</li><li>노선은 색상과 역 번호로 구분합니다.</li><li>환승에서 가장 중요한 것은 방향 확인입니다.</li><li>필요한 노선만 보면 훨씬 읽기 쉽습니다.</li></ul></div>
      <h2><span class="num">01</span><span>도쿄 노선도가 복잡해 보이는 이유</span></h2><p>JR, 도쿄메트로, 도에이 지하철, 사철이 도시 전체에 겹쳐 있습니다. 직통 운행 때문에 같은 열차가 중간부터 다른 회사 노선으로 이어지기도 합니다.</p>
      <h2><span class="num">02</span><span>노선도 읽기의 세 가지 기본</span></h2><h3><span class="lab">1</span>한 가지 색만 따라가기</h3><p>필요한 노선을 찾으면 그 색의 선만 따라가세요. 전체를 한 번에 이해하려 하지 않아도 됩니다.</p><h3><span class="lab">2</span>기호와 번호 보기</h3><p><span class="mono">JY20</span> 같은 역 번호는 노선과 역 순서를 알려 줍니다.</p><h3><span class="lab">3</span>환승 표시 찾기</h3><p>여러 노선이 만나는 흰 원은 보통 환승역을 뜻합니다.</p>
      <figure class="map"><div class="map-head"><div class="cap">그림: <b>필요한 노선만</b> 표시해 보기</div><p class="sub">칩을 누르면 노선을 숨기거나 다시 표시할 수 있습니다.</p></div><div class="chips" id="chips" role="group" aria-label="표시할 노선 전환"></div><div class="map-stage"><svg viewBox="0 0 640 440" role="img" aria-label="도쿄 주요 노선을 단순화한 개념도"><g id="g-yamanote" class="ln" data-line="yamanote"><polygon points="210,95 420,110 470,250 380,365 200,345 150,205" fill="none" stroke="#7FBF3F" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-chuo" class="ln" data-line="chuo"><polyline points="150,205 300,225 400,205 470,250" fill="none" stroke="#E8542A" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-marunouchi" class="ln" data-line="marunouchi"><polyline points="210,95 330,160 420,215 470,250" fill="none" stroke="#D9362C" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-ginza" class="ln" data-line="ginza"><polyline points="200,345 275,302 450,302 440,200 420,110" fill="none" stroke="#F5A623" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-odakyu" class="ln" data-line="odakyu"><polyline points="150,205 78,262 40,332" fill="none" stroke="#1F7FC4" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-tozai" class="ln" data-line="tozai"><polyline points="70,168 250,196 420,215 575,215" fill="none" stroke="#16A7CE" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="nodes"><g><circle cx="210" cy="95" r="7.5" fill="#fff" stroke="#211E18" stroke-width="2.6"/><text class="st-label" x="210" y="78" text-anchor="middle">이케부쿠로</text></g><g><circle cx="470" cy="250" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="484" y="254">도쿄</text></g><g><circle cx="200" cy="345" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="186" y="366" text-anchor="end">시부야</text></g><g><circle cx="150" cy="205" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="136" y="200" text-anchor="end">신주쿠</text></g></g></svg></div><div class="readout" id="readout">표시 중인 노선: <b>6</b> / 6</div><div class="map-note">※ 개념도입니다.</div></figure>
      <h2><span class="num">03</span><span>환승의 네 단계</span></h2><ol class="steps"><li><strong>목적지 방향을 확인합니다.</strong></li><li><strong>다음 노선의 색과 기호를 찾습니다.</strong></li><li><strong>역 안 안내 색상을 따라 이동합니다.</strong></li><li><strong>타기 전에 열차 행선지를 확인합니다.</strong></li></ol>
      <div class="cta"><div class="ey">지금 사용해 보기</div><h3>내 경로와 관련된 노선만 표시해 보세요</h3><p>Flex Rail Map은 복잡한 도쿄 철도망에서 실제로 필요한 노선만 볼 수 있게 합니다.</p><a class="btn" href="/?lang=ko">Flex Rail Map 열기 <span class="ar">→</span></a></div>
    `,
  },
  "tokyo-sightseeing-routes": {
    ja: `
      <p>東京は世界屈指の鉄道網を持つ都市ですが、観光で見るべき路線は意外と限られます。浅草、秋葉原、原宿、お台場などの人気スポットへ行く時は、まず主要路線の役割を押さえると迷いにくくなります。</p>
      <div class="highlight"><strong>この記事のポイント</strong><ul><li>定番エリアはJR山手線で回れることが多い</li><li>浅草・スカイツリー方面は地下鉄が便利</li><li>お台場へはゆりかもめかりんかい線を使う</li></ul></div>
      <h2>1. まずはJR山手線</h2><p>東京観光の基本は、都心を一周するJR山手線です。新宿、渋谷、原宿、秋葉原、上野、東京、品川など、多くの主要エリアをつないでいます。</p>
      <table><tr><th>駅</th><th>主なスポット</th></tr><tr><td>原宿</td><td>竹下通り、明治神宮、表参道</td></tr><tr><td>渋谷</td><td>スクランブル交差点、SHIBUYA SKY</td></tr><tr><td>秋葉原</td><td>電気街、アニメ・ゲーム文化</td></tr><tr><td>上野</td><td>上野公園、アメ横、博物館</td></tr></table>
      <h2>2. 浅草・スカイツリー方面</h2><p>浅草や東京スカイツリーへは、東京メトロ銀座線や都営浅草線が便利です。JRだけで行こうとすると遠回りになることがあるので、地下鉄を組み合わせましょう。</p>
      <h2>3. お台場方面</h2><p>お台場へは、景色を楽しみたいならゆりかもめ、スピード重視ならりんかい線がおすすめです。新橋からゆりかもめ、大崎や渋谷方面からりんかい線を使うと分かりやすいです。</p>
      <div class="cta-box"><h3>観光で使う路線だけを表示</h3><p>Flex Rail Mapなら、山手線、銀座線、ゆりかもめなど、観光に必要な路線だけを残して見られます。</p><a href="/" class="cta-btn">路線図を開く</a></div>
    `,
    en: `
      <p>Tokyo has one of the world’s densest rail networks, but sightseeing usually relies on a smaller set of lines. Once you understand which lines serve Asakusa, Akihabara, Harajuku, and Odaiba, the city becomes much easier to navigate.</p>
      <div class="highlight"><strong>Key Points</strong><ul><li>The JR Yamanote Line covers many classic areas.</li><li>Subway lines are useful for Asakusa and Skytree.</li><li>Use Yurikamome or the Rinkai Line for Odaiba.</li></ul></div>
      <h2>1. Start with the JR Yamanote Line</h2><p>The Yamanote Line loops around central Tokyo and connects Shinjuku, Shibuya, Harajuku, Akihabara, Ueno, Tokyo, and Shinagawa.</p>
      <table><tr><th>Station</th><th>Main sights</th></tr><tr><td>Harajuku</td><td>Takeshita Street, Meiji Shrine, Omotesando</td></tr><tr><td>Shibuya</td><td>Scramble Crossing, SHIBUYA SKY</td></tr><tr><td>Akihabara</td><td>Electronics, anime, and game culture</td></tr><tr><td>Ueno</td><td>Ueno Park, Ameyoko, museums</td></tr></table>
      <h2>2. Asakusa and Tokyo Skytree</h2><p>For Asakusa and Skytree, Tokyo Metro Ginza Line and Toei Asakusa Line are often more convenient than trying to stay on JR lines.</p>
      <h2>3. Odaiba</h2><p>Choose Yurikamome for the view over the bay, or the Rinkai Line for a faster connection from Shibuya, Shinjuku, or Osaki.</p>
      <div class="cta-box"><h3>Show only sightseeing lines</h3><p>Flex Rail Map lets you keep only the lines you need for your sightseeing route.</p><a href="/?lang=en" class="cta-btn">Open the map</a></div>
    `,
    zh: `
      <p>东京铁路网非常密集，但观光时常用的线路其实并不多。先了解浅草、秋叶原、原宿、台场分别适合用哪些线路，就会容易很多。</p>
      <div class="highlight"><strong>重点</strong><ul><li>经典区域多半可以用 JR 山手线到达。</li><li>浅草和晴空塔方向适合使用地下铁。</li><li>去台场可选择百合海鸥号或临海线。</li></ul></div>
      <h2>1. 先掌握 JR 山手线</h2><p>山手线环绕东京中心，连接新宿、涩谷、原宿、秋叶原、上野、东京、品川等主要地区。</p>
      <table><tr><th>车站</th><th>主要景点</th></tr><tr><td>原宿</td><td>竹下通、明治神宫、表参道</td></tr><tr><td>涩谷</td><td>十字路口、SHIBUYA SKY</td></tr><tr><td>秋叶原</td><td>电器街、动漫和游戏文化</td></tr><tr><td>上野</td><td>上野公园、阿美横、博物馆</td></tr></table>
      <h2>2. 浅草和晴空塔</h2><p>前往浅草和东京晴空塔时，东京地铁银座线和都营浅草线通常比只坐 JR 更方便。</p>
      <h2>3. 台场</h2><p>想看海湾景色可以选百合海鸥号，想从涩谷、新宿、大崎快速前往则可使用临海线。</p>
      <div class="cta-box"><h3>只显示观光需要的线路</h3><p>Flex Rail Map 可以只保留观光路线中真正需要的线路。</p><a href="/?lang=zh" class="cta-btn">打开路线图</a></div>
    `,
    ko: `
      <p>도쿄의 철도망은 매우 촘촘하지만 관광에 필요한 노선은 생각보다 제한적입니다. 아사쿠사, 아키하바라, 하라주쿠, 오다이바에 어떤 노선을 쓰면 좋은지 알면 이동이 쉬워집니다.</p>
      <div class="highlight"><strong>핵심</strong><ul><li>대표 관광지는 JR 야마노테선으로 많이 이동할 수 있습니다.</li><li>아사쿠사와 스카이트리 방면은 지하철이 편리합니다.</li><li>오다이바는 유리카모메나 린카이선을 이용합니다.</li></ul></div>
      <h2>1. 먼저 JR 야마노테선</h2><p>야마노테선은 도쿄 중심을 순환하며 신주쿠, 시부야, 하라주쿠, 아키하바라, 우에노, 도쿄, 시나가와를 연결합니다.</p>
      <table><tr><th>역</th><th>주요 명소</th></tr><tr><td>하라주쿠</td><td>다케시타도리, 메이지신궁, 오모테산도</td></tr><tr><td>시부야</td><td>스크램블 교차로, SHIBUYA SKY</td></tr><tr><td>아키하바라</td><td>전자상가, 애니메이션과 게임 문화</td></tr><tr><td>우에노</td><td>우에노공원, 아메요코, 박물관</td></tr></table>
      <h2>2. 아사쿠사와 스카이트리</h2><p>아사쿠사와 도쿄 스카이트리는 도쿄메트로 긴자선이나 도에이 아사쿠사선을 이용하면 편리합니다.</p>
      <h2>3. 오다이바</h2><p>전망을 즐기고 싶다면 유리카모메, 빠른 이동을 원한다면 린카이선을 선택하세요.</p>
      <div class="cta-box"><h3>관광에 필요한 노선만 표시</h3><p>Flex Rail Map에서 관광 경로에 필요한 노선만 남겨 볼 수 있습니다.</p><a href="/?lang=ko" class="cta-btn">노선도 열기</a></div>
    `,
  },
  "commute-30min-cheap-rent": {
    ja: `
      <p>「通勤30分で、家賃を抑えたい」ときは、先に通勤時間の測り方を決めましょう。電車に乗る時間だけで30分なのか、玄関から職場まで30分なのかで、候補になる駅は変わります。この記事は家賃ランキングではなく、候補を絞るための手順です。</p>
<h2>1. 30分に何を含めるか決める</h2><p>自宅から駅までの徒歩、改札・ホームへの移動、待ち時間、乗車、乗り換え、到着駅から職場までの徒歩を分けてメモします。路線図の駅間所要時間だけでは、毎朝の通勤全体を判断できません。出社時刻と帰宅時刻も条件に入れます。</p>
<h2>2. 職場の最寄り駅から候補を広げる</h2><ol><li>フレックス路線図で職場の最寄り駅を見つけます。</li><li>職場に向かう候補路線を表示し、関係のない路線を隠します。</li><li>直通と乗り換えありの候補を分け、比較したい駅を数駅メモします。</li><li>候補駅から職場まで、実際に利用する曜日・時間帯の時刻表と乗換案内を確認します。</li></ol><p>地図上の所要時間は目安です。列車種別、待ち時間、運行状況によって変わるため、この地図だけで「30分以内」を確定しないでください。</p>
<h2>3. 家賃は条件をそろえて比較する</h2><p>不動産サイトで候補駅ごとに、間取り・専有面積・築年数・駅徒歩の条件をそろえます。家賃に管理費を加えた毎月の金額と、契約時に必要な費用を分けて記録してください。募集日・確認日と物件URLを残すと、後から比較の前提を確認できます。</p>
<h2>4. 時間と費用を一つの表にする</h2><table><thead><tr><th>記録する項目</th><th>確認する内容</th></tr></thead><tbody><tr><td>通勤</td><td>玄関から職場までの時間・乗換回数・確認した曜日と時刻</td></tr><tr><td>住居費</td><td>家賃＋管理費、初期費用、更新時の費用</td></tr><tr><td>生活</td><td>駅から物件までの道、買い物先、帰宅時間帯の周辺環境</td></tr></tbody></table>
<p>Flex Rail Mapは路線のつながりを整理する道具です。現在、家賃相場や治安スコアのヒートマップは提供していません。</p><div class="cta"><h3>候補駅を路線図で確認する →</h3><a class="btn" href="/">候補駅を路線図で確認する →</a></div><ul><li><a href="/articles/tokyo-rent-by-route">東京・首都圏で家賃と沿線を比較するには｜駅選びの手順</a></li><li><a href="/articles/tokyo-safe-area-by-route">東京で住む沿線を選ぶとき、駅周辺の環境をどう確認する？</a></li></ul>
    `,
    en: `
      <p>Does a 30-minute commute mean time on the train, or time from your front door to your workplace? Decide this first. This guide provides a comparison process, not a ranking of cheap stations.</p><h2>1. Define the full journey</h2><p>Include walking to the station, reaching the platform, waiting, riding, transferring and walking to work. Record your required arrival time and usual journey home. A station-to-station estimate does not cover all these steps.</p><h2>2. Shortlist stations on the map</h2><ol><li>Find your workplace station in Flex Rail Map.</li><li>Keep candidate lines visible and hide unrelated lines.</li><li>List a few stations, separating direct routes from routes with transfers.</li><li>Check operator timetables and journey planners for your actual weekday and time.</li></ol><p>Map travel times are estimates. Train type, waiting and disruptions can change the journey; do not use the map alone to confirm a 30-minute limit.</p><h2>3. Compare matching listings</h2><p>Use the same layout, floor area, building age and walking-distance filters. Record rent plus management fees separately from initial and renewal costs. Keep the listing URL and the date checked.</p><h2>4. Compare the trade-offs</h2><p>For each station, record the full journey, transfers, monthly housing costs and the walk home. Check the neighborhood at the times you expect to use it. Flex Rail Map helps organize route connections; it does not currently provide rent or safety-score heatmaps.</p><div class="cta"><h3>Explore candidate stations on the map →</h3><a class="btn" href="/?lang=en">Explore candidate stations on the map →</a></div><ul><li><a href="/en/articles/tokyo-rent-by-route">Compare Rent and Rail Lines in Greater Tokyo: A Station Shortlisting Guide</a></li><li><a href="/en/articles/tokyo-safe-area-by-route">Choosing Where to Live in Tokyo: Check the Streets Around the Station</a></li></ul>
    `,
    zh: `
      <p>通勤30分钟是指乘车时间，还是从家门口到公司的总时间？先明确这个条件。本指南介绍筛选步骤，不提供低租金车站排行榜。</p><h2>1. 拆分完整行程</h2><p>记录步行到车站、进入站台、候车、乘车、换乘以及从到达站走到公司的时间，同时确定上班和回家时段。站间时间不能代表完整通勤。</p><h2>2. 用路线图整理候选车站</h2><ol><li>找到公司最近的车站。</li><li>显示候选线路，隐藏无关线路。</li><li>选出几个车站，区分直达与需要换乘的路线。</li><li>根据实际使用的星期和时间，查看铁路公司的时刻表与换乘信息。</li></ol><p>地图上的时间仅供参考，车种、候车和运行状况都会影响总时间，不能仅凭地图确认30分钟内可达。</p><h2>3. 在相同条件下比较房源</h2><p>统一户型、面积、楼龄和步行到站的条件。月租加管理费与签约初期费用、续约费用分开记录，并保留房源链接和查询日期。</p><h2>4. 比较时间与费用</h2><p>为每个车站记录完整通勤时间、换乘次数、每月住房支出和回家的步行路线。在预计回家时段实地查看周边。Flex Rail Map用于整理线路连接，目前不提供租金或治安评分热力图。</p><div class="cta"><h3>在路线图上查看候选车站 →</h3><a class="btn" href="/?lang=zh">在路线图上查看候选车站 →</a></div><ul><li><a href="/zh/articles/tokyo-rent-by-route">东京及首都圈的租金与沿线比较：车站筛选步骤</a></li><li><a href="/zh/articles/tokyo-safe-area-by-route">在东京选择居住沿线：如何确认车站周边环境</a></li></ul>
    `,
    ko: `
      <p>통근 30분이 열차에 타는 시간인지, 집 현관에서 직장까지의 전체 시간인지 먼저 정하세요. 이 글은 저렴한 역 순위가 아니라 후보를 좁히는 절차를 설명합니다.</p><h2>1. 전체 이동 시간을 나누기</h2><p>역까지 걷기, 승강장 이동, 대기, 승차, 환승, 직장까지 걷는 시간을 따로 적습니다. 출근 도착 시각과 퇴근 시간대도 정하세요. 역 사이의 시간만으로 전체 통근을 판단할 수 없습니다.</p><h2>2. 노선도에서 후보 찾기</h2><ol><li>직장에서 가까운 역을 찾습니다.</li><li>후보 노선을 표시하고 무관한 노선을 숨깁니다.</li><li>직통과 환승 경로를 나누어 몇 개 역을 기록합니다.</li><li>실제 이용 요일과 시간의 철도회사 시간표 및 환승 정보를 확인합니다.</li></ol><p>지도의 소요 시간은 참고치입니다. 열차 종류, 대기 시간과 운행 상황이 달라지므로 지도만으로 30분 이내라고 확정하지 마세요.</p><h2>3. 같은 조건의 매물 비교하기</h2><p>구조, 면적, 건물 연식, 역까지 도보 조건을 맞춥니다. 월세와 관리비의 합계는 초기 계약 비용 및 갱신 비용과 나누어 기록하고, 매물 링크와 확인 날짜를 남깁니다.</p><h2>4. 시간과 비용 함께 보기</h2><p>각 역의 전체 통근 시간, 환승 횟수, 월 주거비, 귀가 동선을 비교합니다. 실제 귀가 시간대에 주변을 확인하세요. Flex Rail Map은 노선 연결을 정리하는 도구이며 현재 월세나 치안 점수 히트맵은 제공하지 않습니다.</p><div class="cta"><h3>노선도에서 후보 역 확인하기 →</h3><a class="btn" href="/?lang=ko">노선도에서 후보 역 확인하기 →</a></div><ul><li><a href="/ko/articles/tokyo-rent-by-route">도쿄·수도권 월세와 노선 비교: 후보 역 고르는 순서</a></li><li><a href="/ko/articles/tokyo-safe-area-by-route">도쿄에서 살 노선 고르기: 역 주변 환경 확인 방법</a></li></ul>
    `,
  },
  "tokyo-safe-area-by-route": {
    ja: `
      <p>住む場所の環境は、駅名や沿線のイメージだけでは判断できません。同じ駅でも出口や帰宅ルートによって見える風景が異なります。ここでは「安全な駅ランキング」を作らず、物件を選ぶ前に確認したいことを整理します。</p><h2>1. 駅から家までの道を確認する</h2><ul><li>実際に使う改札・出口から物件まで歩く。</li><li>歩道、交通量、横断箇所、街灯、見通しを確認する。</li><li>昼の内見だけでなく、無理のない範囲で普段の帰宅時間帯の様子も確認する。</li><li>買い物などで寄り道する場合、その動線も含める。</li></ul><p>明るさや人通りの確認は判断材料の一つです。それだけで安全を保証できるものではありません。</p><h2>2. 公的情報は対象範囲と時点を見る</h2><p>警察や自治体が公開する犯罪発生情報を確認する際は、対象期間、犯罪の種類、町丁目などの集計単位を確認します。市区町村全体の件数を、そのまま駅前や特定の物件の評価に置き換えないでください。件数だけで比較したり、性質の違う統計をまとめて独自スコアにしたりしないことも大切です。</p><h2>3. 物件と周辺の確認を分ける</h2><p>周辺環境とは別に、共用部の照明、玄関や窓の施錠、訪問者への対応設備など、物件そのものも確認します。不明点は管理会社や仲介会社に質問し、回答を記録しましょう。</p><h2>4. 路線図でできること</h2><p>フレックス路線図は通勤路線や乗り換えのつながりを整理するために使えます。現在、治安スコアや犯罪発生率のヒートマップは提供していません。店舗・施設の情報があっても、それを治安の良さの根拠にしないでください。</p><p>候補駅を整理した後は、実際の道と物件の確認へ進みましょう。通勤の便利さと周辺環境は、別々の確認項目として残しておくと比較できます。</p><div class="cta"><h3>候補駅を路線図で確認する →</h3><a class="btn" href="/">候補駅を路線図で確認する →</a></div><ul><li><a href="/articles/commute-30min-cheap-rent">通勤30分を目安に住む駅を探す｜路線と家賃の比較手順</a></li><li><a href="/articles/tokyo-rent-by-route">東京・首都圏で家賃と沿線を比較するには｜駅選びの手順</a></li></ul>
    `,
    en: `
      <p>A station name or a rail line's reputation cannot establish the conditions around a particular home. Different exits and walking routes can lead to different environments. This guide offers a checklist rather than a safest-station ranking.</p><h2>1. Check your actual walk home</h2><ul><li>Walk from the exit you would use to the property.</li><li>Check pavements, traffic, crossings, lighting and sightlines.</li><li>When practical, check the area at your usual return time as well as during a daytime viewing.</li><li>Include detours to shops you expect to use.</li></ul><p>Lighting and foot traffic are observations, not guarantees of safety.</p><h2>2. Read public information in context</h2><p>For police or municipal crime information, check the reporting period, offense categories and geographic units. A citywide count does not describe an individual station exit or property. Do not rank neighborhoods using raw counts alone or combine incompatible statistics into a score.</p><h2>3. Check the building separately</h2><p>Inspect shared-area lighting, door and window locks, and visitor access arrangements. Ask the property manager or agent about unclear points and record the answers.</p><h2>4. Use the map for transport</h2><p>Flex Rail Map helps organize commute lines and transfers. It currently provides no safety scores or crime-rate heatmap. Shop or facility information is not evidence that an area is safe. Keep transport convenience and neighborhood checks as separate comparison criteria.</p><div class="cta"><h3>Explore candidate stations on the map →</h3><a class="btn" href="/?lang=en">Explore candidate stations on the map →</a></div><ul><li><a href="/en/articles/commute-30min-cheap-rent">Find Stations for a 30-Minute Commute: Compare Routes and Rent</a></li><li><a href="/en/articles/tokyo-rent-by-route">Compare Rent and Rail Lines in Greater Tokyo: A Station Shortlisting Guide</a></li></ul>
    `,
    zh: `
      <p>车站名或线路口碑不能代表具体住宅周边的环境。同一车站的不同出口、步行路线也可能很不一样。本篇提供检查清单，不制作安全车站排行榜。</p><h2>1. 查看实际回家路线</h2><ul><li>从将来使用的出口走到房源。</li><li>观察人行道、车流、过街位置、路灯和视野。</li><li>在条件允许时，除了白天看房，也查看平常回家时段的情况。</li><li>把去常用商店的绕路也纳入检查。</li></ul><p>照明和人流只是判断材料，不能保证安全。</p><h2>2. 结合统计范围阅读公开信息</h2><p>查看警方或自治体发布的犯罪信息时，确认统计期间、案件种类和地域单位。整个行政区的案件数不能直接代表某个车站出口或具体房源。不要仅用数量排名，也不要把性质不同的统计合并为评分。</p><h2>3. 单独检查建筑</h2><p>确认公共区域照明、门窗锁和访客管理设施。不明确的问题向管理公司或中介提问并记录答复。</p><h2>4. 地图用于交通整理</h2><p>Flex Rail Map可以整理通勤线路和换乘关系，目前不提供治安评分或犯罪率热力图。商店或设施信息不能作为安全的证明。请把交通便利度和环境检查作为不同项目分别记录。</p><div class="cta"><h3>在路线图上查看候选车站 →</h3><a class="btn" href="/?lang=zh">在路线图上查看候选车站 →</a></div><ul><li><a href="/zh/articles/commute-30min-cheap-rent">以通勤30分钟为目标找车站：线路与租金比较步骤</a></li><li><a href="/zh/articles/tokyo-rent-by-route">东京及首都圈的租金与沿线比较：车站筛选步骤</a></li></ul>
    `,
    ko: `
      <p>역 이름이나 노선의 평판만으로 특정 집 주변 환경을 판단할 수 없습니다. 같은 역이라도 출구와 귀가 동선에 따라 상황이 다릅니다. 이 글은 안전한 역 순위가 아닌 확인 목록을 제공합니다.</p><h2>1. 실제 귀가 동선 확인하기</h2><ul><li>이용할 출구에서 매물까지 걸어봅니다.</li><li>보도, 교통량, 횡단 지점, 조명과 시야를 확인합니다.</li><li>가능한 범위에서 낮뿐 아니라 평소 귀가 시간대의 모습도 살펴봅니다.</li><li>자주 이용할 가게에 들르는 동선도 포함합니다.</li></ul><p>밝기와 통행량은 판단 자료일 뿐 안전을 보장하지 않습니다.</p><h2>2. 공공 정보의 범위 확인하기</h2><p>경찰이나 지자체의 범죄 정보를 볼 때는 집계 기간, 범죄 종류와 지역 단위를 확인합니다. 행정구역 전체 건수가 특정 출구나 매물의 환경을 설명하지는 않습니다. 건수만으로 순위를 매기거나 성격이 다른 통계를 합쳐 점수를 만들지 마세요.</p><h2>3. 건물은 따로 확인하기</h2><p>공용 공간 조명, 출입문과 창문의 잠금장치, 방문객 대응 설비를 살펴봅니다. 모르는 점은 관리회사나 중개회사에 물어보고 답변을 기록하세요.</p><h2>4. 노선도는 교통 확인에 활용하기</h2><p>Flex Rail Map은 통근 노선과 환승 연결을 정리합니다. 현재 치안 점수나 범죄율 히트맵은 제공하지 않습니다. 가게나 시설 정보도 안전의 증거가 아닙니다. 교통 편의성과 주변 환경을 별도 항목으로 비교하세요.</p><div class="cta"><h3>노선도에서 후보 역 확인하기 →</h3><a class="btn" href="/?lang=ko">노선도에서 후보 역 확인하기 →</a></div><ul><li><a href="/ko/articles/commute-30min-cheap-rent">통근 30분을 목표로 역 찾기: 노선과 월세 비교 순서</a></li><li><a href="/ko/articles/tokyo-rent-by-route">도쿄·수도권 월세와 노선 비교: 후보 역 고르는 순서</a></li></ul>
    `,
  },
  "tokyo-rent-by-route": {
    ja: `
      <p>沿線名だけで家賃の安さを決めると、職場から遠すぎたり、希望する物件条件と合わなかったりします。まず通勤できる駅を選び、その駅の募集物件を同じ条件で比較すると、判断の根拠が残ります。</p><h2>1. 比較する駅を絞る</h2><p>職場や学校の最寄り駅から、直通路線と乗り換え可能な路線を地図で確認します。候補駅を数駅選び、利用する時間帯の通勤時間を別途確認してください。路線が同じでも、列車種別や乗り換えによって使いやすさは変わります。</p><h2>2. 募集物件の条件をそろえる</h2><table><thead><tr><th>項目</th><th>比較するときの確認点</th></tr></thead><tbody><tr><td>間取り・面積</td><td>同じ1Kでも面積が違うため、両方を指定する</td></tr><tr><td>築年数・設備</td><td>条件をそろえ、譲れない設備を決める</td></tr><tr><td>駅徒歩</td><td>掲載時間に加え、使う出口と実際の道を確認する</td></tr><tr><td>毎月の費用</td><td>家賃と管理費・共益費を合算する</td></tr><tr><td>初期・更新費用</td><td>月額とは分けて契約条件を記録する</td></tr><tr><td>時点</td><td>募集の有無、掲載日・確認日、物件URLを残す</td></tr></tbody></table><p>件数が少ない駅は、たまたま見つけた1件が駅全体の相場とは限りません。極端に安い物件だけで沿線を順位付けせず、条件が合う複数の募集を見比べます。</p><h2>3. 節約と負担の両方を見る</h2><p>家賃を下げる代わりに徒歩や乗り換えが増えるなら、毎日の負担と合わせて検討します。交通費の自己負担や、普段使う買い物先までの距離も記録すると比較しやすくなります。</p><h2>4. 路線図の使いどころ</h2><p>フレックス路線図では候補駅と路線のつながりを確認できます。現在、家賃・人口密度・治安スコアのヒートマップは提供していません。家賃は募集情報で確認し、地図は通勤候補を整理するために使ってください。</p><div class="cta"><h3>候補駅を路線図で確認する →</h3><a class="btn" href="/">候補駅を路線図で確認する →</a></div><ul><li><a href="/articles/commute-30min-cheap-rent">通勤30分を目安に住む駅を探す｜路線と家賃の比較手順</a></li><li><a href="/articles/tokyo-safe-area-by-route">東京で住む沿線を選ぶとき、駅周辺の環境をどう確認する？</a></li></ul>
    `,
    en: `
      <p>A line name alone cannot tell you which rental suits your needs. First choose stations that work for your commute, then compare actual listings under matching conditions. This article does not provide average rents or a cheapest-line ranking.</p><h2>1. Choose candidate stations</h2><p>Use the map to identify direct lines and possible transfers to work or school. Shortlist a few stations, then verify journeys for your actual travel time using timetables or a journey planner.</p><h2>2. Match the listing filters</h2><ul><li>Specify both layout and floor area; two 1K apartments may differ in size.</li><li>Match building age and required facilities.</li><li>Compare station walking distances, including the exit you would use.</li><li>Add rent and monthly management fees.</li><li>Record initial and renewal costs separately.</li><li>Keep each listing URL and date checked; confirm availability.</li></ul><p>One unusually cheap listing is not an area average. Where few comparable properties are available, record that limitation instead of ranking the whole line.</p><h2>3. Include the daily trade-offs</h2><p>Consider extra walking, transfers, your share of commuting expenses and access to shops alongside rent.</p><h2>4. Use the map for connections</h2><p>Flex Rail Map helps organize candidate stations and connecting lines. It currently offers no rent, population-density or safety-score heatmap. Check housing costs in actual property listings.</p><div class="cta"><h3>Explore candidate stations on the map →</h3><a class="btn" href="/?lang=en">Explore candidate stations on the map →</a></div><ul><li><a href="/en/articles/commute-30min-cheap-rent">Find Stations for a 30-Minute Commute: Compare Routes and Rent</a></li><li><a href="/en/articles/tokyo-safe-area-by-route">Choosing Where to Live in Tokyo: Check the Streets Around the Station</a></li></ul>
    `,
    zh: `
      <p>仅凭线路名称无法判断哪套房适合自己。先选出满足通勤条件的车站，再比较条件相近的实际房源。本篇不提供平均租金或便宜线路排行榜。</p><h2>1. 选择候选车站</h2><p>用地图查看到公司或学校的直达线路和换乘连接，选出几个车站，再按实际通勤时段查询时刻表及换乘信息。</p><h2>2. 统一房源条件</h2><ul><li>同时指定户型和面积，同为1K也可能面积不同。</li><li>统一楼龄与必要设备。</li><li>比较步行距离，并确认实际使用的车站出口。</li><li>月租与管理费合计比较。</li><li>签约初期费用与续约费用单独记录。</li><li>保留房源链接、确认日期，并确认是否仍在出租。</li></ul><p>一套特别便宜的房源不能代表整个区域的平均水平。可比房源很少时，应记录这一限制，不要据此给整条线路排名。</p><h2>3. 同时考虑日常负担</h2><p>降低租金可能伴随更多步行或换乘。把自己承担的交通费和到常用商店的距离也记入比较表。</p><h2>4. 地图用于整理线路连接</h2><p>Flex Rail Map帮助整理候选车站和连接线路，目前不提供租金、人口密度或治安评分热力图。住房费用请通过实际房源确认。</p><div class="cta"><h3>在路线图上查看候选车站 →</h3><a class="btn" href="/?lang=zh">在路线图上查看候选车站 →</a></div><ul><li><a href="/zh/articles/commute-30min-cheap-rent">以通勤30分钟为目标找车站：线路与租金比较步骤</a></li><li><a href="/zh/articles/tokyo-safe-area-by-route">在东京选择居住沿线：如何确认车站周边环境</a></li></ul>
    `,
    ko: `
      <p>노선 이름만으로 적합한 집을 고를 수는 없습니다. 먼저 통근 가능한 역을 정하고 조건이 비슷한 실제 매물을 비교하세요. 이 글은 평균 월세나 저렴한 노선 순위를 제공하지 않습니다.</p><h2>1. 후보 역 고르기</h2><p>회사나 학교까지의 직통 노선과 환승 연결을 지도에서 확인합니다. 몇 개 역을 고른 뒤 실제 통근 시간대의 시간표와 환승 정보를 확인하세요.</p><h2>2. 매물 조건 맞추기</h2><ul><li>구조와 면적을 모두 지정합니다. 같은 1K도 면적이 다를 수 있습니다.</li><li>건물 연식과 필요한 설비를 맞춥니다.</li><li>역 도보 거리와 실제 이용 출구를 확인합니다.</li><li>월세에 관리비를 더해 비교합니다.</li><li>초기 계약 비용과 갱신 비용은 따로 적습니다.</li><li>매물 링크, 확인 날짜, 현재 모집 여부를 남깁니다.</li></ul><p>특별히 저렴한 매물 하나가 지역 전체 평균은 아닙니다. 비교 가능한 매물이 적다면 그 한계를 기록하고 노선 전체의 순위를 매기지 마세요.</p><h2>3. 생활 부담도 함께 비교하기</h2><p>월세가 낮아지는 대신 도보나 환승이 늘어날 수 있습니다. 본인이 부담하는 교통비와 자주 가는 가게까지의 거리도 함께 검토하세요.</p><h2>4. 지도는 노선 연결 확인에 활용하기</h2><p>Flex Rail Map은 후보 역과 노선 연결을 정리하는 도구입니다. 현재 월세, 인구 밀도, 치안 점수 히트맵은 제공하지 않습니다. 주거비는 실제 매물 정보로 확인하세요.</p><div class="cta"><h3>노선도에서 후보 역 확인하기 →</h3><a class="btn" href="/?lang=ko">노선도에서 후보 역 확인하기 →</a></div><ul><li><a href="/ko/articles/commute-30min-cheap-rent">통근 30분을 목표로 역 찾기: 노선과 월세 비교 순서</a></li><li><a href="/ko/articles/tokyo-safe-area-by-route">도쿄에서 살 노선 고르기: 역 주변 환경 확인 방법</a></li></ul>
    `,
  },
};
