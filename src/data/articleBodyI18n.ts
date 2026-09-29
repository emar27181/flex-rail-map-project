import type { ArticleLanguage } from './articleI18n';

type ArticleBodyTranslations = Record<string, Record<ArticleLanguage, string>>;

export const ARTICLE_BODY_TRANSLATIONS: ArticleBodyTranslations = {
  "flex-rail-map-introduction": {
    ja: `
      <div class="points"><div class="ttl">この記事の結論</div><ul><li>東京の路線図が読みにくいのは、全路線が同時に出ているから</li><li>{siteName}は出発駅と到着駅を選ぶと、その移動に関係する路線だけを残す</li><li>乗換案内の「答え」と違い、同じ方向へ走る別の路線も自分の目で比べられる</li></ul></div>
      <h2><span class="num">01</span><span>全部の路線が出ていると、自分の線が見つからない</span></h2>
      <p>都心の主要15路線を同時に表示すると、下の図のようになります。山手線の内側では線と駅名が重なり、どの色がどこへ向かうのかを追うだけで時間がかかります。駅の案内図が分かりにくいのも同じ理由です。情報が足りないのではなく、今の自分に関係のない情報が多すぎるのです。</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/all-lines-ja.webp"><img src="/images/articles/flex-rail-map-introduction/all-lines-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="都心の主要15路線をすべて表示した{siteName}の地図。山手線の内側で線と駅名が重なっている"></a><figcaption>都心の主要15路線を同時に表示した状態。線と駅名が重なり、1本の線を追いにくい</figcaption></figure>
      <h2><span class="num">02</span><span>出発駅と到着駅を選ぶと、関係する路線だけが残る</span></h2>
      <p>{siteName}では、画面左上の「出発駅・到着駅を選択」に2つの駅を入れます。すると、2駅を結ぶ経路に使う路線と、2駅を通る路線だけが色付きで残り、それ以外は薄くなります。経路上の駅には、到着する時刻の目安も並びます。</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/route-only-ja.webp"><img src="/images/articles/flex-rail-map-introduction/route-only-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="出発駅に新宿、到着駅に東京を選んだ画面。経路の丸ノ内線と、新宿・東京を通る路線だけが色付きで残っている"></a><figcaption>新宿から東京を選んだところ。経路に使う丸ノ内線と、2駅を通る路線だけが残る</figcaption></figure>
      <h2><span class="num">03</span><span>答えを1つ出すのではなく、別の行き方も見える</span></h2>
      <p>乗換案内アプリは最適な経路を1つ出してくれますが、遅延や運休でその経路が使えなくなると、次にどうすればよいかまでは教えてくれません。路線だけを残した地図なら、同じ方向へ走る別の路線が目で見えます。</p>
      <p>藤沢から東京の例では、東海道線のほかに、武蔵小杉を通る横須賀線や、蒲田を通る京浜東北線も同じ方向へ走っていることが分かります。1本が止まっても、どこで別の線に移れるかを自分で判断できます。</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/parallel-ja.webp"><img src="/images/articles/flex-rail-map-introduction/parallel-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="出発駅に藤沢、到着駅に東京を選んだ地図。藤沢から東京まで複数の路線が並んで走っている"></a><figcaption>藤沢から東京。1つの答えではなく、同じ方向へ走る路線がまとめて見える</figcaption></figure>
      <h2><span class="num">04</span><span>こんなときに使う</span></h2>
      <div class="uses"><div class="use"><div class="t"><span class="dot"></span>初めて乗る路線</div><p>土地勘がなくても、使う路線だけを表示して流れを追えます。</p></div><div class="use"><div class="t"><span class="dot"></span>遅延・運休のとき</div><p>並んで走る路線と乗り換えられる駅を見ながら、迂回の道を選べます。</p></div><div class="use"><div class="t"><span class="dot"></span>毎日の通勤</div><p>いつもの路線だけに絞って、分岐や行き先を素早く確かめられます。</p></div><div class="use"><div class="t"><span class="dot"></span>駅名が読めないとき</div><p>英語・中国語・韓国語で表示でき、線の流れから進む方向をつかめます。</p></div></div>
      <div class="cta"><h3>新宿から東京の例をそのまま開く</h3><p>出発駅と到着駅を入れた状態で地図が開きます。駅を変えて、自分の移動で試してください。</p><a class="btn" href="/?from=%E6%96%B0%E5%AE%BF&to=%E6%9D%B1%E4%BA%AC">地図で開く <span class="ar">→</span></a></div>
    `,
    en: `
      <div class="points"><div class="ttl">Key takeaways</div><ul><li>Tokyo rail maps are hard to read because every line is shown at once</li><li>Pick a departure and arrival station, and {siteName} keeps only the lines related to that trip</li><li>Unlike a route-search answer, you can compare other lines running the same way with your own eyes</li></ul></div>
      <h2><span class="num">01</span><span>With every line on screen, you cannot find yours</span></h2>
      <p>Showing 15 major central Tokyo lines at once looks like the image below. Inside the Yamanote Line loop, lines and station names overlap, and just following one color takes time. Station maps are hard for the same reason: the problem is not missing information, but too much information that has nothing to do with your trip.</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/all-lines-en.webp"><img src="/images/articles/flex-rail-map-introduction/all-lines-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="{siteName} map showing 15 major central Tokyo lines at once, with lines and station names overlapping inside the Yamanote Line loop"></a><figcaption>Fifteen central lines shown together. Lines and names overlap, making a single line hard to follow</figcaption></figure>
      <h2><span class="num">02</span><span>Pick two stations and only the related lines remain</span></h2>
      <p>In {siteName}, enter two stations in "Select Departure &amp; Arrival Stations" at the top left. The lines used on the route between them and the lines passing through the two stations stay in color, and everything else fades. Stations on the route also show estimated arrival times.</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/route-only-en.webp"><img src="/images/articles/flex-rail-map-introduction/route-only-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="Screen with Shinjuku as departure and Tokyo as arrival. Only the Marunouchi Line on the route and the lines through both stations stay in color"></a><figcaption>Shinjuku to Tokyo. Only the Marunouchi Line used on the route and lines through the two stations remain</figcaption></figure>
      <h2><span class="num">03</span><span>Not one answer, but the other ways to go</span></h2>
      <p>Route-search apps give you one best route, but when a delay or suspension makes it unusable, they do not tell you what to do next. A map that keeps only the relevant lines lets you see other lines running in the same direction.</p>
      <p>From Fujisawa to Tokyo, you can see that besides the Tokaido Line, the Yokosuka Line through Musashi-kosugi and the Keihin-Tohoku Line through Kamata also run the same way. If one line stops, you can judge for yourself where to switch.</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/parallel-en.webp"><img src="/images/articles/flex-rail-map-introduction/parallel-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="Map with Fujisawa as departure and Tokyo as arrival, showing several lines running side by side between them"></a><figcaption>Fujisawa to Tokyo. Instead of a single answer, you see all the lines heading the same way</figcaption></figure>
      <h2><span class="num">04</span><span>When to use it</span></h2>
      <div class="uses"><div class="use"><div class="t"><span class="dot"></span>Unfamiliar lines</div><p>Even without local knowledge, you can follow only the lines you will use.</p></div><div class="use"><div class="t"><span class="dot"></span>Delays and suspensions</div><p>See the parallel lines and transfer stations, and choose a detour.</p></div><div class="use"><div class="t"><span class="dot"></span>Daily commuting</div><p>Keep only your usual lines and check branches and destinations quickly.</p></div><div class="use"><div class="t"><span class="dot"></span>When station names are hard to read</div><p>Switch to English, Chinese or Korean, and read direction from the flow of the line.</p></div></div>
      <div class="cta"><h3>Open the Shinjuku to Tokyo example</h3><p>The map opens with the departure and arrival stations already set. Change the stations and try your own trip.</p><a class="btn" href="/?from=%E6%96%B0%E5%AE%BF&to=%E6%9D%B1%E4%BA%AC&lang=en">Open the map <span class="ar">→</span></a></div>
    `,
    zh: `
      <div class="points"><div class="ttl">本文结论</div><ul><li>东京路线图难读，是因为所有线路同时显示</li><li>选择出发站和到达站后，{siteName}只保留与这次移动有关的线路</li><li>与换乘 App 给出的“答案”不同，可以亲眼比较同方向的其他线路</li></ul></div>
      <h2><span class="num">01</span><span>所有线路都显示时，找不到自己的线</span></h2>
      <p>同时显示东京市中心的15条主要线路，就是下图的样子。山手线环内的线路和站名重叠，光是追踪某个颜色通往哪里就要花时间。车站的线路图难懂也是同样的原因：不是信息不够，而是与现在的自己无关的信息太多。</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/all-lines-zh.webp"><img src="/images/articles/flex-rail-map-introduction/all-lines-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="{siteName}同时显示东京市中心15条主要线路的地图，山手线环内线路和站名重叠"></a><figcaption>同时显示15条市中心线路。线路和站名重叠，很难追踪一条线</figcaption></figure>
      <h2><span class="num">02</span><span>选择出发站和到达站，只留下相关线路</span></h2>
      <p>在{siteName}中，在左上角的“选择出发站和到达站”输入两个车站。连接两站的路线所用的线路，以及经过这两站的线路会保留颜色，其他线路会变淡。路线上的车站还会显示预计到达时间。</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/route-only-zh.webp"><img src="/images/articles/flex-rail-map-introduction/route-only-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="出发站选新宿、到达站选东京的画面，只有路线上的丸之内线和经过两站的线路保留颜色"></a><figcaption>从新宿到东京。只留下路线所用的丸之内线和经过两站的线路</figcaption></figure>
      <h2><span class="num">03</span><span>不只给出一个答案，也能看到其他走法</span></h2>
      <p>换乘 App 会给出一条最佳路线，但当延误或停运让这条路线无法使用时，它不会告诉你接下来该怎么办。只保留相关线路的地图，可以直接看到同方向的其他线路。</p>
      <p>以藤泽到东京为例，除了东海道线，还能看到经过武藏小杉的横须贺线和经过蒲田的京滨东北线也朝同一方向行驶。即使一条线停运，也能自己判断在哪里换到别的线。</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/parallel-zh.webp"><img src="/images/articles/flex-rail-map-introduction/parallel-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="出发站选藤泽、到达站选东京的地图，两站之间有多条线路并行"></a><figcaption>藤泽到东京。看到的不是一个答案，而是同方向的所有线路</figcaption></figure>
      <h2><span class="num">04</span><span>适合使用的场景</span></h2>
      <div class="uses"><div class="use"><div class="t"><span class="dot"></span>第一次乘坐的线路</div><p>即使不熟悉当地，也能只显示要用的线路来追踪走向。</p></div><div class="use"><div class="t"><span class="dot"></span>延误或停运时</div><p>看着并行线路和可换乘的车站，选择绕行路线。</p></div><div class="use"><div class="t"><span class="dot"></span>日常通勤</div><p>只保留常用线路，快速确认分岔和目的地。</p></div><div class="use"><div class="t"><span class="dot"></span>看不懂站名时</div><p>可切换为英语、中文或韩语，从线路走向判断方向。</p></div></div>
      <div class="cta"><h3>直接打开新宿到东京的示例</h3><p>地图会在已填好出发站和到达站的状态下打开。请换成自己的车站试试。</p><a class="btn" href="/?from=%E6%96%B0%E5%AE%BF&to=%E6%9D%B1%E4%BA%AC&lang=zh">打开地图 <span class="ar">→</span></a></div>
    `,
    ko: `
      <div class="points"><div class="ttl">이 글의 결론</div><ul><li>도쿄 노선도가 읽기 어려운 이유는 모든 노선이 한꺼번에 나오기 때문</li><li>출발역과 도착역을 고르면 {siteName}이 그 이동에 관련된 노선만 남김</li><li>환승 앱의 “정답”과 달리, 같은 방향으로 달리는 다른 노선도 직접 비교할 수 있음</li></ul></div>
      <h2><span class="num">01</span><span>모든 노선이 나와 있으면 내 노선을 찾을 수 없다</span></h2>
      <p>도쿄 도심의 주요 15개 노선을 한꺼번에 표시하면 아래 그림처럼 됩니다. 야마노테선 안쪽은 선과 역 이름이 겹쳐서, 어떤 색이 어디로 가는지 따라가는 데만 시간이 걸립니다. 역의 노선 안내도가 어려운 것도 같은 이유입니다. 정보가 부족한 것이 아니라, 지금의 나와 상관없는 정보가 너무 많은 것입니다.</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/all-lines-ko.webp"><img src="/images/articles/flex-rail-map-introduction/all-lines-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="도쿄 도심 주요 15개 노선을 모두 표시한 {siteName} 지도. 야마노테선 안쪽에서 선과 역 이름이 겹쳐 있다"></a><figcaption>도심 15개 노선을 동시에 표시한 상태. 선과 역 이름이 겹쳐 한 노선을 따라가기 어렵다</figcaption></figure>
      <h2><span class="num">02</span><span>출발역과 도착역을 고르면 관련 노선만 남는다</span></h2>
      <p>{siteName}에서는 화면 왼쪽 위의 “출발역·도착역 선택”에 두 역을 입력합니다. 그러면 두 역을 잇는 경로에 쓰는 노선과 두 역을 지나는 노선만 색이 남고, 나머지는 흐려집니다. 경로 위의 역에는 도착 예상 시각도 표시됩니다.</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/route-only-ko.webp"><img src="/images/articles/flex-rail-map-introduction/route-only-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="출발역에 신주쿠, 도착역에 도쿄를 고른 화면. 경로의 마루노우치선과 두 역을 지나는 노선만 색이 남아 있다"></a><figcaption>신주쿠에서 도쿄. 경로에 쓰는 마루노우치선과 두 역을 지나는 노선만 남는다</figcaption></figure>
      <h2><span class="num">03</span><span>정답 하나가 아니라 다른 길도 보인다</span></h2>
      <p>환승 앱은 최적 경로 하나를 알려 주지만, 지연이나 운휴로 그 경로를 쓸 수 없게 되면 다음에 어떻게 해야 할지는 알려 주지 않습니다. 관련 노선만 남긴 지도라면 같은 방향으로 달리는 다른 노선이 눈에 보입니다.</p>
      <p>후지사와에서 도쿄로 가는 예에서는 도카이도선 외에도 무사시고스기를 지나는 요코스카선, 가마타를 지나는 게이힌도호쿠선이 같은 방향으로 달린다는 것을 알 수 있습니다. 한 노선이 멈춰도 어디서 다른 노선으로 갈아탈지 스스로 판단할 수 있습니다.</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/parallel-ko.webp"><img src="/images/articles/flex-rail-map-introduction/parallel-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="출발역에 후지사와, 도착역에 도쿄를 고른 지도. 두 역 사이에 여러 노선이 나란히 달리고 있다"></a><figcaption>후지사와에서 도쿄. 정답 하나가 아니라 같은 방향으로 가는 노선이 한눈에 보인다</figcaption></figure>
      <h2><span class="num">04</span><span>이럴 때 쓴다</span></h2>
      <div class="uses"><div class="use"><div class="t"><span class="dot"></span>처음 타는 노선</div><p>지리를 몰라도 쓸 노선만 표시해 흐름을 따라갈 수 있습니다.</p></div><div class="use"><div class="t"><span class="dot"></span>지연·운휴 때</div><p>나란히 달리는 노선과 환승역을 보면서 우회 경로를 고를 수 있습니다.</p></div><div class="use"><div class="t"><span class="dot"></span>매일 통근</div><p>평소 노선만 남겨 분기와 행선지를 빠르게 확인할 수 있습니다.</p></div><div class="use"><div class="t"><span class="dot"></span>역 이름을 읽기 어려울 때</div><p>영어·중국어·한국어로 바꿀 수 있고, 선의 흐름으로 방향을 잡을 수 있습니다.</p></div></div>
      <div class="cta"><h3>신주쿠→도쿄 예시를 그대로 열기</h3><p>출발역과 도착역이 입력된 상태로 지도가 열립니다. 역을 바꿔 내 이동으로 시험해 보세요.</p><a class="btn" href="/?from=%E6%96%B0%E5%AE%BF&to=%E6%9D%B1%E4%BA%AC&lang=ko">지도 열기 <span class="ar">→</span></a></div>
    `,
  },
  "tokyo-train-map-beginner": {
    ja: `
      <div class="points"><div class="ttl">この記事の結論</div><ul><li>路線図は全体を読まず、使う1本の色だけを追う</li><li>駅名が読めなくても、駅ナンバリング（例: <span class="mono">JY01</span>）で路線と順番が分かる</li><li>乗り換えでは、路線名より先に「どちら方面か」を確かめる</li></ul></div>
      <h2><span class="num">01</span><span>東京の路線図が複雑に見える理由</span></h2>
      <p>JR、東京メトロ、都営地下鉄、私鉄と、複数の会社の路線が1枚の図に重なっているからです。さらに相互直通運転で、1本の電車が途中から別の会社の路線に入ることもあります。すべてを一度に理解しようとすると、どこから見ればよいか分からなくなります。</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/all-lines-ja.webp"><img src="/images/articles/flex-rail-map-introduction/all-lines-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="都心の主要15路線をすべて表示した地図。線と駅名が重なっている"></a><figcaption>都心の主要路線を全部表示した状態。線が重なり、1本を追いにくい</figcaption></figure>
      <h2><span class="num">02</span><span>コツ1　使う1本の色だけを追う</span></h2>
      <p>乗る路線を1本決めたら、その色の線だけを目で追います。{siteName}の「表示路線の切替」で山手線だけを残すと、下のように緑色の1本の環になります。駅の並びと、どの駅でほかの路線と交わるかが読み取れます。</p>
      <figure class="shot"><a href="/images/articles/tokyo-train-map-beginner/one-line-ja.webp"><img src="/images/articles/tokyo-train-map-beginner/one-line-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="山手線だけを表示した地図。緑色の環状の線に沿って駅名が並んでいる"></a><figcaption>山手線だけを表示。1本だけなら駅の並びがそのまま読める</figcaption></figure>
      <h2><span class="num">03</span><span>コツ2・3　駅ナンバリングと乗換駅を見る</span></h2>
      <p>駅ナンバリングは、アルファベットが路線、数字が駅の順番を表します。たとえば山手線の東京駅は <span class="mono">JY01</span> です。数字が増える向きか減る向きかで、進む方向が分かります。</p>
      <p>線と線が交わる駅が乗換駅です。山手線・中央線・丸ノ内線の3本に増やすと、新宿や東京などで線が交わるのが見えます。表示する路線は、実際に乗り換える路線だけにとどめるのがコツです。</p>
      <figure class="shot"><a href="/images/articles/tokyo-train-map-beginner/three-lines-ja.webp"><img src="/images/articles/tokyo-train-map-beginner/three-lines-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="山手線・中央線・丸ノ内線の3路線だけを表示した地図。新宿や東京で線が交わっている"></a><figcaption>3路線に増やすと、線が交わる駅（乗換駅）が分かる</figcaption></figure>
      <h2><span class="num">04</span><span>乗り換えは「方面」を確かめてから</span></h2>
      <ol class="steps"><li><strong>乗り換える路線の色と記号を、構内の案内サインで探す。</strong></li><li><strong>ホームの案内で、行き先（方面）が目的地の側かを確かめる。</strong></li><li><strong>電車の行き先表示を見てから乗る。</strong></li></ol>
      <p>下の図では、路線を消したり戻したりして、線が減ると読みやすくなる様子を試せます。</p>
      <figure class="map"><div class="map-head"><div class="cap">図：<b>必要な路線だけ</b>表示してみる</div><p class="sub">チップをタップして路線を消したり戻したりできます。</p></div><div class="chips" id="chips" role="group" aria-label="表示する路線の切り替え"></div><div class="map-stage"><svg viewBox="0 0 640 440" role="img" aria-label="東京の主要路線を簡略化した概念図"><g id="g-yamanote" class="ln" data-line="yamanote"><polygon points="210,95 420,110 470,250 380,365 200,345 150,205" fill="none" stroke="#7FBF3F" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-chuo" class="ln" data-line="chuo"><polyline points="150,205 300,225 400,205 470,250" fill="none" stroke="#E8542A" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-marunouchi" class="ln" data-line="marunouchi"><polyline points="210,95 330,160 420,215 470,250" fill="none" stroke="#D9362C" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-ginza" class="ln" data-line="ginza"><polyline points="200,345 275,302 450,302 440,200 420,110" fill="none" stroke="#F5A623" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-odakyu" class="ln" data-line="odakyu"><polyline points="150,205 78,262 40,332" fill="none" stroke="#1F7FC4" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-tozai" class="ln" data-line="tozai"><polyline points="70,168 250,196 420,215 575,215" fill="none" stroke="#16A7CE" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="nodes"><g><circle cx="210" cy="95" r="7.5" fill="#fff" stroke="#211E18" stroke-width="2.6"/><text class="st-label" x="210" y="78" text-anchor="middle">池袋</text></g><g><circle cx="470" cy="250" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="484" y="254">東京</text></g><g><circle cx="200" cy="345" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="186" y="366" text-anchor="end">渋谷</text></g><g><circle cx="150" cy="205" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="136" y="200" text-anchor="end">新宿</text></g></g></svg></div><div class="readout" id="readout">表示中の路線：<b>6</b> / 6</div><div class="map-note">※ これは概念図です。</div></figure>
      <div class="cta"><h3>山手線だけを表示した地図を開く</h3><p>山手線だけが出た状態で開きます。乗り換える路線を1本ずつ足してみてください。</p><a class="btn" href="/?routes=yama">地図で開く <span class="ar">→</span></a></div>
    `,
    en: `
      <div class="points"><div class="ttl">Key takeaways</div><ul><li>Do not read the whole map; follow only the color of the one line you use</li><li>Even if you cannot read a station name, the station number (e.g. <span class="mono">JY01</span>) tells you the line and order</li><li>When transferring, check the direction before the line name</li></ul></div>
      <h2><span class="num">01</span><span>Why Tokyo rail maps look complicated</span></h2>
      <p>Lines from several companies — JR, Tokyo Metro, Toei Subway and private railways — are drawn on one sheet. Through services also mean one train can continue onto another company's line partway. Trying to understand everything at once leaves you unsure where to start.</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/all-lines-en.webp"><img src="/images/articles/flex-rail-map-introduction/all-lines-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="Map showing all 15 major central Tokyo lines, with lines and station names overlapping"></a><figcaption>All major central lines shown. Lines overlap, making it hard to follow one</figcaption></figure>
      <h2><span class="num">02</span><span>Tip 1: follow only the color of your line</span></h2>
      <p>Once you decide which line to ride, follow only that color. In {siteName}, keep only the Yamanote Line in "Route Display Toggle" and it becomes a single green loop, as below. You can read the order of stations and where other lines cross it.</p>
      <figure class="shot"><a href="/images/articles/tokyo-train-map-beginner/one-line-en.webp"><img src="/images/articles/tokyo-train-map-beginner/one-line-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="Map showing only the Yamanote Line, with station names along a green loop"></a><figcaption>Only the Yamanote Line. With one line, the station order is easy to read</figcaption></figure>
      <h2><span class="num">03</span><span>Tips 2 and 3: station numbers and transfer stations</span></h2>
      <p>In a station number, the letters stand for the line and the number for the station's order. For example, Tokyo Station on the Yamanote Line is <span class="mono">JY01</span>. Whether the numbers go up or down tells you which way you are heading.</p>
      <p>Stations where lines cross are transfer stations. Add the Chuo Line and the Marunouchi Line, and you can see the three lines meet at stations such as Shinjuku and Tokyo. The trick is to show only the lines you will actually transfer to.</p>
      <figure class="shot"><a href="/images/articles/tokyo-train-map-beginner/three-lines-en.webp"><img src="/images/articles/tokyo-train-map-beginner/three-lines-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="Map showing only the Yamanote, Chuo and Marunouchi lines, crossing at Shinjuku and Tokyo"></a><figcaption>With three lines, you can see where they cross — the transfer stations</figcaption></figure>
      <h2><span class="num">04</span><span>Check the direction before you transfer</span></h2>
      <ol class="steps"><li><strong>Find the color and symbol of the next line on the station signs.</strong></li><li><strong>On the platform, check that the direction is toward your destination.</strong></li><li><strong>Check the destination shown on the train before boarding.</strong></li></ol>
      <p>In the figure below, you can hide and show lines to see how fewer lines make the map easier to read.</p>
      <figure class="map"><div class="map-head"><div class="cap">Figure: show <b>only the lines you need</b></div><p class="sub">Tap a chip to hide or show a line.</p></div><div class="chips" id="chips" role="group" aria-label="Choose which lines to show"></div><div class="map-stage"><svg viewBox="0 0 640 440" role="img" aria-label="Simplified concept map of major Tokyo lines"><g id="g-yamanote" class="ln" data-line="yamanote"><polygon points="210,95 420,110 470,250 380,365 200,345 150,205" fill="none" stroke="#7FBF3F" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-chuo" class="ln" data-line="chuo"><polyline points="150,205 300,225 400,205 470,250" fill="none" stroke="#E8542A" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-marunouchi" class="ln" data-line="marunouchi"><polyline points="210,95 330,160 420,215 470,250" fill="none" stroke="#D9362C" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-ginza" class="ln" data-line="ginza"><polyline points="200,345 275,302 450,302 440,200 420,110" fill="none" stroke="#F5A623" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-odakyu" class="ln" data-line="odakyu"><polyline points="150,205 78,262 40,332" fill="none" stroke="#1F7FC4" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-tozai" class="ln" data-line="tozai"><polyline points="70,168 250,196 420,215 575,215" fill="none" stroke="#16A7CE" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="nodes"><g><circle cx="210" cy="95" r="7.5" fill="#fff" stroke="#211E18" stroke-width="2.6"/><text class="st-label" x="210" y="78" text-anchor="middle">Ikebukuro</text></g><g><circle cx="470" cy="250" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="484" y="254">Tokyo</text></g><g><circle cx="200" cy="345" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="186" y="366" text-anchor="end">Shibuya</text></g><g><circle cx="150" cy="205" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="136" y="200" text-anchor="end">Shinjuku</text></g></g></svg></div><div class="readout" id="readout">Lines shown: <b>6</b> / 6</div><div class="map-note">This is a conceptual diagram.</div></figure>
      <div class="cta"><h3>Open a map with only the Yamanote Line</h3><p>The map opens with only the Yamanote Line. Add the lines you transfer to, one at a time.</p><a class="btn" href="/?routes=yama&lang=en">Open the map <span class="ar">→</span></a></div>
    `,
    zh: `
      <div class="points"><div class="ttl">本文结论</div><ul><li>不要读整张图，只追要坐的那一条线的颜色</li><li>即使看不懂站名，也能从车站编号（例：<span class="mono">JY01</span>）知道线路和顺序</li><li>换乘时，先确认“往哪个方向”，再看线路名</li></ul></div>
      <h2><span class="num">01</span><span>东京路线图看起来复杂的原因</span></h2>
      <p>JR、东京地铁、都营地铁和私铁等多家公司的线路重叠在一张图上。再加上直通运行，一趟列车可能中途驶入另一家公司的线路。想一次理解全部，就会不知道从哪里看起。</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/all-lines-zh.webp"><img src="/images/articles/flex-rail-map-introduction/all-lines-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="显示东京市中心全部15条主要线路的地图，线路和站名重叠"></a><figcaption>显示全部市中心主要线路。线路重叠，很难追踪一条</figcaption></figure>
      <h2><span class="num">02</span><span>诀窍1：只追要坐的那一条线的颜色</span></h2>
      <p>决定要坐的线路后，只用眼睛追那个颜色。在{siteName}的“显示路线切换”中只保留山手线，就会像下图一样变成一个绿色的环。可以读出车站的顺序，以及在哪些站与其他线路相交。</p>
      <figure class="shot"><a href="/images/articles/tokyo-train-map-beginner/one-line-zh.webp"><img src="/images/articles/tokyo-train-map-beginner/one-line-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="只显示山手线的地图，站名沿绿色环线排列"></a><figcaption>只显示山手线。只有一条线时，车站顺序一目了然</figcaption></figure>
      <h2><span class="num">03</span><span>诀窍2和3：看车站编号和换乘站</span></h2>
      <p>车站编号中，字母代表线路，数字代表车站的顺序。例如山手线的东京站是 <span class="mono">JY01</span>。看数字是变大还是变小，就知道前进的方向。</p>
      <p>线路相交的车站就是换乘站。增加到山手线、中央线、丸之内线3条后，可以看到它们在新宿、东京等站相交。诀窍是只显示实际要换乘的线路。</p>
      <figure class="shot"><a href="/images/articles/tokyo-train-map-beginner/three-lines-zh.webp"><img src="/images/articles/tokyo-train-map-beginner/three-lines-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="只显示山手线、中央线、丸之内线3条线路的地图，在新宿和东京相交"></a><figcaption>增加到3条线路后，能看出线路相交的车站（换乘站）</figcaption></figure>
      <h2><span class="num">04</span><span>换乘前先确认方向</span></h2>
      <ol class="steps"><li><strong>在站内指示牌上找要换乘线路的颜色和符号。</strong></li><li><strong>在站台确认列车的方向是否朝着目的地。</strong></li><li><strong>看列车的终点站显示后再上车。</strong></li></ol>
      <p>在下图中可以隐藏或显示线路，体会线路减少后地图变得好读。</p>
      <figure class="map"><div class="map-head"><div class="cap">图：只显示<b>需要的线路</b></div><p class="sub">点击标签可以隐藏或重新显示线路。</p></div><div class="chips" id="chips" role="group" aria-label="切换显示的线路"></div><div class="map-stage"><svg viewBox="0 0 640 440" role="img" aria-label="东京主要线路的简化概念图"><g id="g-yamanote" class="ln" data-line="yamanote"><polygon points="210,95 420,110 470,250 380,365 200,345 150,205" fill="none" stroke="#7FBF3F" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-chuo" class="ln" data-line="chuo"><polyline points="150,205 300,225 400,205 470,250" fill="none" stroke="#E8542A" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-marunouchi" class="ln" data-line="marunouchi"><polyline points="210,95 330,160 420,215 470,250" fill="none" stroke="#D9362C" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-ginza" class="ln" data-line="ginza"><polyline points="200,345 275,302 450,302 440,200 420,110" fill="none" stroke="#F5A623" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-odakyu" class="ln" data-line="odakyu"><polyline points="150,205 78,262 40,332" fill="none" stroke="#1F7FC4" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-tozai" class="ln" data-line="tozai"><polyline points="70,168 250,196 420,215 575,215" fill="none" stroke="#16A7CE" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="nodes"><g><circle cx="210" cy="95" r="7.5" fill="#fff" stroke="#211E18" stroke-width="2.6"/><text class="st-label" x="210" y="78" text-anchor="middle">池袋</text></g><g><circle cx="470" cy="250" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="484" y="254">东京</text></g><g><circle cx="200" cy="345" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="186" y="366" text-anchor="end">涩谷</text></g><g><circle cx="150" cy="205" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="136" y="200" text-anchor="end">新宿</text></g></g></svg></div><div class="readout" id="readout">显示中的线路：<b>6</b> / 6</div><div class="map-note">※ 这是概念图。</div></figure>
      <div class="cta"><h3>打开只显示山手线的地图</h3><p>地图会以只显示山手线的状态打开。请逐条加上要换乘的线路。</p><a class="btn" href="/?routes=yama&lang=zh">打开地图 <span class="ar">→</span></a></div>
    `,
    ko: `
      <div class="points"><div class="ttl">이 글의 결론</div><ul><li>노선도 전체를 읽지 말고, 탈 노선 하나의 색만 따라간다</li><li>역 이름을 못 읽어도 역 번호(예: <span class="mono">JY01</span>)로 노선과 순서를 알 수 있다</li><li>환승할 때는 노선 이름보다 먼저 “어느 방면인지”를 확인한다</li></ul></div>
      <h2><span class="num">01</span><span>도쿄 노선도가 복잡해 보이는 이유</span></h2>
      <p>JR, 도쿄메트로, 도에이 지하철, 사철 등 여러 회사의 노선이 한 장의 그림에 겹쳐 있기 때문입니다. 게다가 직통 운행으로 한 열차가 도중에 다른 회사의 노선으로 들어가기도 합니다. 모든 것을 한 번에 이해하려 하면 어디서부터 봐야 할지 모르게 됩니다.</p>
      <figure class="shot"><a href="/images/articles/flex-rail-map-introduction/all-lines-ko.webp"><img src="/images/articles/flex-rail-map-introduction/all-lines-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="도쿄 도심 주요 15개 노선을 모두 표시한 지도. 선과 역 이름이 겹쳐 있다"></a><figcaption>도심 주요 노선을 모두 표시한 상태. 선이 겹쳐 하나를 따라가기 어렵다</figcaption></figure>
      <h2><span class="num">02</span><span>요령 1: 탈 노선 하나의 색만 따라간다</span></h2>
      <p>탈 노선을 하나 정했다면 그 색의 선만 눈으로 따라갑니다. {siteName}의 “표시 노선 전환”에서 야마노테선만 남기면 아래처럼 초록색 고리 하나가 됩니다. 역의 순서와 어느 역에서 다른 노선과 만나는지 읽을 수 있습니다.</p>
      <figure class="shot"><a href="/images/articles/tokyo-train-map-beginner/one-line-ko.webp"><img src="/images/articles/tokyo-train-map-beginner/one-line-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="야마노테선만 표시한 지도. 초록색 순환선을 따라 역 이름이 늘어서 있다"></a><figcaption>야마노테선만 표시. 노선이 하나면 역 순서가 그대로 읽힌다</figcaption></figure>
      <h2><span class="num">03</span><span>요령 2·3: 역 번호와 환승역을 본다</span></h2>
      <p>역 번호에서 알파벳은 노선, 숫자는 역의 순서를 나타냅니다. 예를 들어 야마노테선의 도쿄역은 <span class="mono">JY01</span>입니다. 숫자가 커지는 쪽인지 작아지는 쪽인지로 진행 방향을 알 수 있습니다.</p>
      <p>선과 선이 만나는 역이 환승역입니다. 야마노테선·주오선·마루노우치선 3개로 늘리면 신주쿠, 도쿄 등에서 선이 만나는 것이 보입니다. 표시할 노선은 실제로 갈아탈 노선만으로 줄이는 것이 요령입니다.</p>
      <figure class="shot"><a href="/images/articles/tokyo-train-map-beginner/three-lines-ko.webp"><img src="/images/articles/tokyo-train-map-beginner/three-lines-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="야마노테선·주오선·마루노우치선 3개 노선만 표시한 지도. 신주쿠와 도쿄에서 선이 만난다"></a><figcaption>3개 노선으로 늘리면 선이 만나는 역(환승역)을 알 수 있다</figcaption></figure>
      <h2><span class="num">04</span><span>환승은 “방면”을 확인한 뒤에</span></h2>
      <ol class="steps"><li><strong>갈아탈 노선의 색과 기호를 역 안의 안내판에서 찾는다.</strong></li><li><strong>승강장에서 행선지(방면)가 목적지 쪽인지 확인한다.</strong></li><li><strong>열차의 행선지 표시를 보고 탄다.</strong></li></ol>
      <p>아래 그림에서 노선을 숨기거나 다시 표시하면서, 선이 줄면 읽기 쉬워지는 것을 직접 확인할 수 있습니다.</p>
      <figure class="map"><div class="map-head"><div class="cap">그림: <b>필요한 노선만</b> 표시해 보기</div><p class="sub">칩을 누르면 노선을 숨기거나 다시 표시할 수 있습니다.</p></div><div class="chips" id="chips" role="group" aria-label="표시할 노선 전환"></div><div class="map-stage"><svg viewBox="0 0 640 440" role="img" aria-label="도쿄 주요 노선을 단순화한 개념도"><g id="g-yamanote" class="ln" data-line="yamanote"><polygon points="210,95 420,110 470,250 380,365 200,345 150,205" fill="none" stroke="#7FBF3F" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-chuo" class="ln" data-line="chuo"><polyline points="150,205 300,225 400,205 470,250" fill="none" stroke="#E8542A" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-marunouchi" class="ln" data-line="marunouchi"><polyline points="210,95 330,160 420,215 470,250" fill="none" stroke="#D9362C" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-ginza" class="ln" data-line="ginza"><polyline points="200,345 275,302 450,302 440,200 420,110" fill="none" stroke="#F5A623" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-odakyu" class="ln" data-line="odakyu"><polyline points="150,205 78,262 40,332" fill="none" stroke="#1F7FC4" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="g-tozai" class="ln" data-line="tozai"><polyline points="70,168 250,196 420,215 575,215" fill="none" stroke="#16A7CE" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></g><g id="nodes"><g><circle cx="210" cy="95" r="7.5" fill="#fff" stroke="#211E18" stroke-width="2.6"/><text class="st-label" x="210" y="78" text-anchor="middle">이케부쿠로</text></g><g><circle cx="470" cy="250" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="484" y="254">도쿄</text></g><g><circle cx="200" cy="345" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="186" y="366" text-anchor="end">시부야</text></g><g><circle cx="150" cy="205" r="8.5" fill="#fff" stroke="#211E18" stroke-width="3"/><text class="st-label" x="136" y="200" text-anchor="end">신주쿠</text></g></g></svg></div><div class="readout" id="readout">표시 중인 노선: <b>6</b> / 6</div><div class="map-note">※ 개념도입니다.</div></figure>
      <div class="cta"><h3>야마노테선만 표시한 지도 열기</h3><p>야마노테선만 나온 상태로 열립니다. 갈아탈 노선을 하나씩 더해 보세요.</p><a class="btn" href="/?routes=yama&lang=ko">지도 열기 <span class="ar">→</span></a></div>
    `,
  },
  "tokyo-sightseeing-routes": {
    ja: `
      <div class="points"><div class="ttl">この記事の結論</div><ul><li>定番エリアの多くは JR 山手線の駅にある</li><li>浅草へは東京メトロ銀座線を足す</li><li>お台場へはゆりかもめ（新橋から）かりんかい線（大崎から）を足す</li></ul></div>
      <h2><span class="num">01</span><span>観光で使う路線は多くない</span></h2>
      <p>東京には多くの路線がありますが、観光で行く場所の多くは、都心を一周する山手線の駅か、そこから1回乗り換えた先にあります。最初から全路線を覚える必要はありません。「山手線を軸にして、足りない場所だけ路線を足す」と考えると迷いにくくなります。</p>
      <h2><span class="num">02</span><span>定番エリアは山手線で回れる</span></h2>
      <p>原宿・渋谷・秋葉原・上野はどれも山手線の駅です。山手線は環状なので、どちら回りでもいずれ着きます。近い方向の電車に乗れば大丈夫です。</p>
      <div class="tbl"><table><thead><tr><th>駅</th><th>主なスポット</th></tr></thead><tbody><tr><td>原宿</td><td>明治神宮、竹下通り</td></tr><tr><td>渋谷</td><td>スクランブル交差点</td></tr><tr><td>秋葉原</td><td>電気街</td></tr><tr><td>上野</td><td>上野公園、アメ横</td></tr></tbody></table></div>
      <figure class="shot"><a href="/images/articles/tokyo-train-map-beginner/one-line-ja.webp"><img src="/images/articles/tokyo-train-map-beginner/one-line-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="山手線だけを表示した地図。原宿・渋谷・秋葉原・上野が緑色の環の上に並んでいる"></a><figcaption>山手線だけを表示。定番エリアの駅が1本の環の上に並ぶ</figcaption></figure>
      <h2><span class="num">03</span><span>浅草とお台場だけは路線を足す</span></h2>
      <h3>浅草へは銀座線</h3>
      <p>浅草は山手線の駅ではありません。東京メトロ銀座線の終点で、山手線の上野・神田・新橋・渋谷で乗り換えられます。上野からなら3駅です。</p>
      <figure class="shot"><a href="/images/articles/tokyo-sightseeing-routes/yamanote-ginza-ja.webp"><img src="/images/articles/tokyo-sightseeing-routes/yamanote-ginza-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="山手線と銀座線だけを表示した地図。オレンジ色の銀座線が上野から浅草へ延びている"></a><figcaption>山手線に銀座線を足した状態。上野から浅草へ延びるオレンジ色の線が銀座線</figcaption></figure>
      <h3>お台場へはゆりかもめ・りんかい線</h3>
      <p>お台場へは2本あります。新橋から乗るゆりかもめは、レインボーブリッジを渡る眺めのよい路線です。大崎から乗るりんかい線は地下を走り、東京テレポート駅に着きます。りんかい線は埼京線と直通する電車もあり、渋谷・新宿から乗り換えずに行ける列車もあります。</p>
      <figure class="shot"><a href="/images/articles/tokyo-sightseeing-routes/odaiba-ja.webp"><img src="/images/articles/tokyo-sightseeing-routes/odaiba-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="山手線・ゆりかもめ・りんかい線を表示した地図。新橋から豊洲へ向かうゆりかもめと、大崎から新木場へ向かうりんかい線がお台場を通っている"></a><figcaption>新橋から出るのがゆりかもめ、大崎から出るのがりんかい線。どちらもお台場を通る</figcaption></figure>
      <h2><span class="num">04</span><span>4路線だけの地図で1日の順番を決める</span></h2>
      <p>地図に出す路線を、山手線・銀座線・ゆりかもめ・りんかい線の4本にしぼると、定番の観光地はこの範囲に収まります。行きたい場所の駅を地図で確かめ、近い順に並べると、無駄な移動が減ります。</p>
      <div class="cta"><h3>観光で使う4路線だけを表示した地図を開く</h3><p>山手線・銀座線・ゆりかもめ・りんかい線だけが出た状態で開きます。</p><a class="btn" href="/?routes=yama%2Cginz%2Cyuri%2Crink">地図で開く <span class="ar">→</span></a></div>
    `,
    en: `
      <div class="points"><div class="ttl">Key takeaways</div><ul><li>Most classic sightseeing areas are at JR Yamanote Line stations</li><li>For Asakusa, add the Tokyo Metro Ginza Line</li><li>For Odaiba, add the Yurikamome (from Shimbashi) or the Rinkai Line (from Osaki)</li></ul></div>
      <h2><span class="num">01</span><span>You need only a few lines for sightseeing</span></h2>
      <p>Tokyo has many rail lines, but most sightseeing spots are either at a station on the Yamanote Line, which loops around central Tokyo, or one transfer away from it. You do not need to learn every line. Think "use the Yamanote Line as the base, and add a line only where it does not reach."</p>
      <h2><span class="num">02</span><span>The classic areas are on the Yamanote Line</span></h2>
      <p>Harajuku, Shibuya, Akihabara and Ueno are all Yamanote Line stations. Because the line is a loop, either direction eventually gets you there; just take the shorter way.</p>
      <div class="tbl"><table><thead><tr><th>Station</th><th>Main spots</th></tr></thead><tbody><tr><td>Harajuku</td><td>Meiji Jingu, Takeshita Street</td></tr><tr><td>Shibuya</td><td>Scramble Crossing</td></tr><tr><td>Akihabara</td><td>Electric Town</td></tr><tr><td>Ueno</td><td>Ueno Park, Ameyoko</td></tr></tbody></table></div>
      <figure class="shot"><a href="/images/articles/tokyo-train-map-beginner/one-line-en.webp"><img src="/images/articles/tokyo-train-map-beginner/one-line-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="Map showing only the Yamanote Line, with Harajuku, Shibuya, Akihabara and Ueno on the green loop"></a><figcaption>Only the Yamanote Line. The classic areas sit on one loop</figcaption></figure>
      <h2><span class="num">03</span><span>Add lines only for Asakusa and Odaiba</span></h2>
      <h3>Asakusa: the Ginza Line</h3>
      <p>Asakusa is not on the Yamanote Line. It is the terminus of the Tokyo Metro Ginza Line, which you can transfer to from the Yamanote Line at Ueno, Kanda, Shimbashi and Shibuya. From Ueno it is three stops.</p>
      <figure class="shot"><a href="/images/articles/tokyo-sightseeing-routes/yamanote-ginza-en.webp"><img src="/images/articles/tokyo-sightseeing-routes/yamanote-ginza-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="Map showing only the Yamanote and Ginza lines, with the orange Ginza Line extending from Ueno to Asakusa"></a><figcaption>The Ginza Line added to the Yamanote Line. The orange line from Ueno to Asakusa is the Ginza Line</figcaption></figure>
      <h3>Odaiba: the Yurikamome or the Rinkai Line</h3>
      <p>Two lines serve Odaiba. The Yurikamome from Shimbashi crosses the Rainbow Bridge and has great views. The Rinkai Line from Osaki runs underground to Tokyo Teleport Station. Some Rinkai Line trains run through from the Saikyo Line, so some trains from Shibuya and Shinjuku get there without a transfer.</p>
      <figure class="shot"><a href="/images/articles/tokyo-sightseeing-routes/odaiba-en.webp"><img src="/images/articles/tokyo-sightseeing-routes/odaiba-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="Map showing the Yamanote Line, Yurikamome and Rinkai Line. The Yurikamome runs from Shimbashi to Toyosu and the Rinkai Line from Osaki to Shin-kiba, both through Odaiba"></a><figcaption>The line from Shimbashi is the Yurikamome; the one from Osaki is the Rinkai Line. Both pass through Odaiba</figcaption></figure>
      <h2><span class="num">04</span><span>Plan the day on a map with just four lines</span></h2>
      <p>Narrow the map to the Yamanote Line, Ginza Line, Yurikamome and Rinkai Line, and the classic sights fit within it. Find the stations of the places you want to visit and visit them in order of distance to cut wasted travel.</p>
      <div class="cta"><h3>Open a map with the four sightseeing lines</h3><p>The map opens with only the Yamanote Line, Ginza Line, Yurikamome and Rinkai Line.</p><a class="btn" href="/?routes=yama%2Cginz%2Cyuri%2Crink&lang=en">Open the map <span class="ar">→</span></a></div>
    `,
    zh: `
      <div class="points"><div class="ttl">本文结论</div><ul><li>经典景点大多在 JR 山手线的车站</li><li>去浅草，加上东京地铁银座线</li><li>去台场，加上百合海鸥号（从新桥）或临海线（从大崎）</li></ul></div>
      <h2><span class="num">01</span><span>观光用到的线路并不多</span></h2>
      <p>东京的线路很多，但观光要去的地方，大多在环绕市中心的山手线车站，或从那里换乘一次就能到。不必一开始就记住所有线路。以“山手线为主，只为到不了的地方加线路”来思考，就不容易迷路。</p>
      <h2><span class="num">02</span><span>经典景点坐山手线就能到</span></h2>
      <p>原宿、涩谷、秋叶原、上野都是山手线的车站。山手线是环线，往哪个方向坐最终都会到，选近的方向即可。</p>
      <div class="tbl"><table><thead><tr><th>车站</th><th>主要景点</th></tr></thead><tbody><tr><td>原宿</td><td>明治神宫、竹下通</td></tr><tr><td>涩谷</td><td>十字路口（Scramble Crossing）</td></tr><tr><td>秋叶原</td><td>电器街</td></tr><tr><td>上野</td><td>上野公园、阿美横</td></tr></tbody></table></div>
      <figure class="shot"><a href="/images/articles/tokyo-train-map-beginner/one-line-zh.webp"><img src="/images/articles/tokyo-train-map-beginner/one-line-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="只显示山手线的地图，原宿、涩谷、秋叶原、上野位于绿色环线上"></a><figcaption>只显示山手线。经典景点的车站都在一个环上</figcaption></figure>
      <h2><span class="num">03</span><span>只为浅草和台场加线路</span></h2>
      <h3>去浅草坐银座线</h3>
      <p>浅草不是山手线的车站。它是东京地铁银座线的终点，可在山手线的上野、神田、新桥、涩谷换乘。从上野坐3站即到。</p>
      <figure class="shot"><a href="/images/articles/tokyo-sightseeing-routes/yamanote-ginza-zh.webp"><img src="/images/articles/tokyo-sightseeing-routes/yamanote-ginza-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="只显示山手线和银座线的地图，橙色的银座线从上野延伸到浅草"></a><figcaption>在山手线上加上银座线。从上野延伸到浅草的橙色线就是银座线</figcaption></figure>
      <h3>去台场坐百合海鸥号或临海线</h3>
      <p>去台场有两条线。从新桥出发的百合海鸥号会经过彩虹大桥，沿途风景很好。从大崎出发的临海线在地下行驶，到达东京电讯港站。临海线有与埼京线直通的列车，部分列车从涩谷、新宿不用换乘即可到达。</p>
      <figure class="shot"><a href="/images/articles/tokyo-sightseeing-routes/odaiba-zh.webp"><img src="/images/articles/tokyo-sightseeing-routes/odaiba-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="显示山手线、百合海鸥号、临海线的地图。从新桥到丰洲的百合海鸥号和从大崎到新木场的临海线都经过台场"></a><figcaption>从新桥出发的是百合海鸥号，从大崎出发的是临海线，两条都经过台场</figcaption></figure>
      <h2><span class="num">04</span><span>用只有4条线路的地图安排一天的顺序</span></h2>
      <p>把地图上的线路缩小到山手线、银座线、百合海鸥号、临海线4条，经典景点都在这个范围内。在地图上确认想去地点的车站，按远近排好顺序，就能减少多余的移动。</p>
      <div class="cta"><h3>打开只显示4条观光线路的地图</h3><p>地图会以只显示山手线、银座线、百合海鸥号、临海线的状态打开。</p><a class="btn" href="/?routes=yama%2Cginz%2Cyuri%2Crink&lang=zh">打开地图 <span class="ar">→</span></a></div>
    `,
    ko: `
      <div class="points"><div class="ttl">이 글의 결론</div><ul><li>대표 관광지 대부분은 JR 야마노테선 역에 있다</li><li>아사쿠사에 가려면 도쿄메트로 긴자선을 더한다</li><li>오다이바에 가려면 유리카모메(신바시에서)나 린카이선(오사키에서)을 더한다</li></ul></div>
      <h2><span class="num">01</span><span>관광에 쓰는 노선은 많지 않다</span></h2>
      <p>도쿄에는 노선이 많지만, 관광으로 가는 곳 대부분은 도심을 한 바퀴 도는 야마노테선 역이거나 거기서 한 번 갈아탄 곳에 있습니다. 처음부터 모든 노선을 외울 필요는 없습니다. “야마노테선을 중심으로, 닿지 않는 곳만 노선을 더한다”고 생각하면 헤매지 않습니다.</p>
      <h2><span class="num">02</span><span>대표 지역은 야마노테선으로 돈다</span></h2>
      <p>하라주쿠·시부야·아키하바라·우에노는 모두 야마노테선 역입니다. 야마노테선은 순환선이라 어느 방향으로 타도 언젠가는 도착합니다. 가까운 방향의 전철을 타면 됩니다.</p>
      <div class="tbl"><table><thead><tr><th>역</th><th>주요 명소</th></tr></thead><tbody><tr><td>하라주쿠</td><td>메이지 신궁, 다케시타 거리</td></tr><tr><td>시부야</td><td>스크램블 교차로</td></tr><tr><td>아키하바라</td><td>전자상가</td></tr><tr><td>우에노</td><td>우에노 공원, 아메요코</td></tr></tbody></table></div>
      <figure class="shot"><a href="/images/articles/tokyo-train-map-beginner/one-line-ko.webp"><img src="/images/articles/tokyo-train-map-beginner/one-line-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="야마노테선만 표시한 지도. 하라주쿠·시부야·아키하바라·우에노가 초록색 고리 위에 있다"></a><figcaption>야마노테선만 표시. 대표 지역의 역이 고리 하나 위에 늘어선다</figcaption></figure>
      <h2><span class="num">03</span><span>아사쿠사와 오다이바만 노선을 더한다</span></h2>
      <h3>아사쿠사는 긴자선</h3>
      <p>아사쿠사는 야마노테선 역이 아닙니다. 도쿄메트로 긴자선의 종점으로, 야마노테선의 우에노·간다·신바시·시부야에서 갈아탈 수 있습니다. 우에노에서 3정거장입니다.</p>
      <figure class="shot"><a href="/images/articles/tokyo-sightseeing-routes/yamanote-ginza-ko.webp"><img src="/images/articles/tokyo-sightseeing-routes/yamanote-ginza-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="야마노테선과 긴자선만 표시한 지도. 주황색 긴자선이 우에노에서 아사쿠사로 뻗어 있다"></a><figcaption>야마노테선에 긴자선을 더한 상태. 우에노에서 아사쿠사로 뻗은 주황색 선이 긴자선</figcaption></figure>
      <h3>오다이바는 유리카모메·린카이선</h3>
      <p>오다이바로 가는 노선은 두 개입니다. 신바시에서 타는 유리카모메는 레인보우 브리지를 건너 경치가 좋은 노선입니다. 오사키에서 타는 린카이선은 지하를 달려 오다이바에 도착합니다. 린카이선은 사이쿄선과 직통하는 열차도 있어, 시부야·신주쿠에서 갈아타지 않고 가는 열차도 있습니다.</p>
      <figure class="shot"><a href="/images/articles/tokyo-sightseeing-routes/odaiba-ko.webp"><img src="/images/articles/tokyo-sightseeing-routes/odaiba-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="야마노테선·유리카모메·린카이선을 표시한 지도. 신바시에서 도요스로 가는 유리카모메와 오사키에서 신기바로 가는 린카이선이 오다이바를 지난다"></a><figcaption>신바시에서 출발하는 것이 유리카모메, 오사키에서 출발하는 것이 린카이선. 둘 다 오다이바를 지난다</figcaption></figure>
      <h2><span class="num">04</span><span>4개 노선만 있는 지도로 하루 순서를 정한다</span></h2>
      <p>지도에 표시할 노선을 야마노테선·긴자선·유리카모메·린카이선 4개로 줄이면 대표 관광지는 이 범위에 들어옵니다. 가고 싶은 곳의 역을 지도에서 확인하고 가까운 순서로 늘어놓으면 쓸데없는 이동이 줄어듭니다.</p>
      <div class="cta"><h3>관광용 4개 노선만 표시한 지도 열기</h3><p>야마노테선·긴자선·유리카모메·린카이선만 나온 상태로 열립니다.</p><a class="btn" href="/?routes=yama%2Cginz%2Cyuri%2Crink&lang=ko">지도 열기 <span class="ar">→</span></a></div>
    `,
  },
  "commute-30min-cheap-rent": {
    ja: `
      <div class="points"><div class="ttl">この記事の結論</div><ul><li>「通勤30分」は、玄関から職場の入口までで数える</li><li>職場の最寄り駅を出発駅にすると、そこから伸びる路線が一度に見える</li><li>地図の所要時間は目安。候補を決めたら、通勤する時間帯の時刻表で確かめる</li></ul></div>
      <h2><span class="num">01</span><span>「通勤30分」は何の30分か</span></h2>
      <p>同じ「30分」でも、電車に乗っている時間だけなのか、家を出てから職場に着くまでなのかで、住める範囲は大きく変わります。駅まで歩いて10分、待ち時間と乗り換えで5分かかれば、電車に乗れるのは15分だけです。まず、次の4つに分けて考えます。</p>
      <div class="tbl"><table><thead><tr><th>区間</th><th>確かめること</th></tr></thead><tbody><tr><td>家から駅</td><td>物件の「駅徒歩◯分」は道のり80mを1分として計算した値。信号や坂は含まない</td></tr><tr><td>駅での待ち・乗り換え</td><td>通勤する時間帯の運転間隔と、乗り換えで歩く距離</td></tr><tr><td>乗車</td><td>地図の所要時間で見当をつけ、時刻表で確かめる</td></tr><tr><td>駅から職場</td><td>実際に使う出口から職場の入口まで</td></tr></tbody></table></div>
      <h2><span class="num">02</span><span>職場の最寄り駅を出発駅にする</span></h2>
      <p>{siteName}で、職場の最寄り駅を「出発駅」に入れます。到着駅は空けたままで構いません。その駅を通る路線が地図に残るので、どの方向に何本の路線が伸びているかが分かります。東京駅なら、13路線が四方に伸びています（2026年9月時点の{siteName}のデータ）。</p>
      <figure class="shot"><a href="/images/articles/commute-30min-cheap-rent/from-work-ja.webp"><img src="/images/articles/commute-30min-cheap-rent/from-work-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="出発駅に東京を選んだ地図。東京駅を通る路線が四方に伸び、右側に13路線の一覧が出ている"></a><figcaption>東京駅を出発駅にした状態。右の一覧に、東京駅を通る13路線が並ぶ</figcaption></figure>
      <h2><span class="num">03</span><span>駅と駅の間の所要時間を表示する</span></h2>
      <p>「所要時間を表示」を押すと、駅と駅の間に丸い数字（分）が出ます。職場の駅から候補の駅まで、この数字を足していけば乗車時間の目安になります。乗車時間が分かれば、01で決めた全体の時間から逆算して、どこまでなら住めるかが見えてきます。</p>
      <p>ただし、この数字は駅間のおおよその時間です。各駅停車か快速か、待ち時間、乗り換えで歩く時間は含みません。</p>
      <figure class="shot"><a href="/images/articles/commute-30min-cheap-rent/travel-times-ja.webp"><img src="/images/articles/commute-30min-cheap-rent/travel-times-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="「所要時間を表示」をオンにした地図。駅と駅の間に分数を示す丸い数字が並んでいる"></a><figcaption>「所要時間を表示」をオン。駅間の丸い数字が所要時間（分）の目安</figcaption></figure>
      <h2><span class="num">04</span><span>候補の駅を時刻表で確かめる</span></h2>
      <ol class="steps"><li><strong>地図で、職場から乗り換えなしか1回で行ける駅を3〜5駅選ぶ。</strong></li><li><strong>通勤する曜日・時刻で、鉄道会社の時刻表や乗換案内を調べる。</strong></li><li><strong>帰りの時間帯の本数と終電も確かめる。</strong></li><li><strong>残った駅で、家賃と周辺の環境を比べる。</strong></li></ol>
      <div class="cta"><h3>東京駅を出発駅にした地図を開く</h3><p>出発駅を、自分の職場の最寄り駅に変えて使ってください。</p><a class="btn" href="/?from=%E6%9D%B1%E4%BA%AC">地図で開く <span class="ar">→</span></a></div>
    `,
    en: `
      <div class="points"><div class="ttl">Key takeaways</div><ul><li>Count a "30-minute commute" from your front door to the office entrance</li><li>Set your office station as the departure to see every line leaving it at once</li><li>Map travel times are estimates. Once you have candidates, confirm them in timetables for your commuting hours</li></ul></div>
      <h2><span class="num">01</span><span>What does "30 minutes" include?</span></h2>
      <p>A "30-minute commute" covers a very different area depending on whether it means time on the train or door to door. If the walk to the station takes 10 minutes and waiting and transfers take 5, you only have 15 minutes on the train. Start by splitting the trip into four parts.</p>
      <div class="tbl"><table><thead><tr><th>Part</th><th>What to check</th></tr></thead><tbody><tr><td>Home to station</td><td>Walking times in Japanese listings assume 80 m per minute and ignore traffic lights and slopes</td></tr><tr><td>Waiting and transfers</td><td>Train frequency at your commuting hours and walking distance for transfers</td></tr><tr><td>On the train</td><td>Estimate with map travel times, then confirm in timetables</td></tr><tr><td>Station to office</td><td>From the exit you will actually use to the office entrance</td></tr></tbody></table></div>
      <h2><span class="num">02</span><span>Set your office station as the departure</span></h2>
      <p>In {siteName}, enter your office's nearest station as the "Departure". You can leave the arrival empty. The lines through that station stay on the map, showing how many lines head in which directions. From Tokyo Station, 13 lines spread out in every direction ({siteName} data as of September 2026).</p>
      <figure class="shot"><a href="/images/articles/commute-30min-cheap-rent/from-work-en.webp"><img src="/images/articles/commute-30min-cheap-rent/from-work-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="Map with Tokyo as the departure station. Lines through Tokyo Station spread in all directions, and a list of 13 lines appears on the right"></a><figcaption>Tokyo Station set as the departure. The list on the right shows the 13 lines through it</figcaption></figure>
      <h2><span class="num">03</span><span>Show the travel time between stations</span></h2>
      <p>Press "Show Travel Times" and small circled numbers (minutes) appear between stations. Add them up from your office station to a candidate station to estimate time on the train. Then work backward from the total time you set in step 1 to see how far out you can live.</p>
      <p>These numbers are rough times between stations. They do not reflect local versus rapid trains, waiting time, or walking time for transfers.</p>
      <figure class="shot"><a href="/images/articles/commute-30min-cheap-rent/travel-times-en.webp"><img src="/images/articles/commute-30min-cheap-rent/travel-times-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="Map with "Show Travel Times" on. Circled numbers showing minutes appear between stations"></a><figcaption>"Show Travel Times" on. The circled numbers between stations are estimated minutes</figcaption></figure>
      <h2><span class="num">04</span><span>Confirm candidate stations in timetables</span></h2>
      <ol class="steps"><li><strong>On the map, pick 3–5 stations reachable from work with no transfer or one transfer.</strong></li><li><strong>Look up railway timetables or a route planner for the days and times you commute.</strong></li><li><strong>Check evening frequency and the last train home, too.</strong></li><li><strong>Compare rent and surroundings for the stations that remain.</strong></li></ol>
      <div class="cta"><h3>Open a map with Tokyo as the departure</h3><p>Change the departure to the station nearest your own office.</p><a class="btn" href="/?from=%E6%9D%B1%E4%BA%AC&lang=en">Open the map <span class="ar">→</span></a></div>
    `,
    zh: `
      <div class="points"><div class="ttl">本文结论</div><ul><li>“通勤30分钟”要从家门口算到公司门口</li><li>把公司最近的车站设为出发站，就能一次看到从那里延伸出去的线路</li><li>地图上的所需时间只是参考。确定候选后，要用通勤时段的时刻表确认</li></ul></div>
      <h2><span class="num">01</span><span>“通勤30分钟”指的是哪30分钟</span></h2>
      <p>同样是“30分钟”，只算乘车时间，还是从出家门到到达公司，能住的范围差别很大。如果走到车站要10分钟，等车和换乘要5分钟，能坐车的时间就只有15分钟。首先把通勤分成下面4段来考虑。</p>
      <div class="tbl"><table><thead><tr><th>区段</th><th>要确认的内容</th></tr></thead><tbody><tr><td>家到车站</td><td>日本房源的“距车站步行○分钟”按道路距离80米为1分钟计算，不含红绿灯和坡道</td></tr><tr><td>候车・换乘</td><td>通勤时段的发车间隔，以及换乘时要走的距离</td></tr><tr><td>乘车</td><td>用地图上的所需时间估算，再用时刻表确认</td></tr><tr><td>车站到公司</td><td>从实际使用的出口到公司门口</td></tr></tbody></table></div>
      <h2><span class="num">02</span><span>把公司最近的车站设为出发站</span></h2>
      <p>在{siteName}中，把公司最近的车站填入“出发站”，到达站可以空着。经过该站的线路会保留在地图上，能看出有几条线路往哪些方向延伸。以东京站为例，有13条线路向四面延伸（{siteName} 2026年9月的数据）。</p>
      <figure class="shot"><a href="/images/articles/commute-30min-cheap-rent/from-work-zh.webp"><img src="/images/articles/commute-30min-cheap-rent/from-work-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="出发站选东京的地图，经过东京站的线路向四面延伸，右侧显示13条线路的列表"></a><figcaption>把东京站设为出发站。右侧列表中列出经过东京站的13条线路</figcaption></figure>
      <h2><span class="num">03</span><span>显示车站之间的所需时间</span></h2>
      <p>按下“显示所需时间”，车站之间会出现带圆圈的数字（分钟）。从公司所在车站到候选车站，把这些数字加起来就是乘车时间的参考。知道乘车时间后，就能从第1步定下的总时间反推，看出最远能住到哪里。</p>
      <p>不过，这些数字只是站间的大致时间，不包括各站停车或快速的区别、候车时间以及换乘步行时间。</p>
      <figure class="shot"><a href="/images/articles/commute-30min-cheap-rent/travel-times-zh.webp"><img src="/images/articles/commute-30min-cheap-rent/travel-times-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="打开“显示所需时间”的地图，车站之间排列着表示分钟数的圆圈数字"></a><figcaption>打开“显示所需时间”。站间的圆圈数字是所需时间（分钟）的参考</figcaption></figure>
      <h2><span class="num">04</span><span>用时刻表确认候选车站</span></h2>
      <ol class="steps"><li><strong>在地图上选出从公司不换乘或换乘一次能到的3～5个车站。</strong></li><li><strong>按通勤的星期和时刻，查铁路公司的时刻表或换乘查询。</strong></li><li><strong>也要确认回家时段的班次和末班车。</strong></li><li><strong>对剩下的车站比较租金和周边环境。</strong></li></ol>
      <div class="cta"><h3>打开以东京站为出发站的地图</h3><p>请把出发站换成自己公司最近的车站。</p><a class="btn" href="/?from=%E6%9D%B1%E4%BA%AC&lang=zh">打开地图 <span class="ar">→</span></a></div>
    `,
    ko: `
      <div class="points"><div class="ttl">이 글의 결론</div><ul><li>“통근 30분”은 현관에서 회사 입구까지로 센다</li><li>회사 가까운 역을 출발역으로 두면 거기서 뻗어 나가는 노선이 한눈에 보인다</li><li>지도의 소요 시간은 기준일 뿐. 후보를 정하면 통근 시간대의 시간표로 확인한다</li></ul></div>
      <h2><span class="num">01</span><span>“통근 30분”은 무엇의 30분인가</span></h2>
      <p>같은 “30분”이라도 전철에 타 있는 시간만인지, 집을 나서서 회사에 도착할 때까지인지에 따라 살 수 있는 범위가 크게 달라집니다. 역까지 걸어서 10분, 기다림과 환승에 5분이 걸리면 전철에 탈 수 있는 시간은 15분뿐입니다. 먼저 아래 4구간으로 나눠 생각합니다.</p>
      <div class="tbl"><table><thead><tr><th>구간</th><th>확인할 것</th></tr></thead><tbody><tr><td>집에서 역</td><td>일본 매물의 “역 도보 ○분”은 도로 거리 80m를 1분으로 계산한 값. 신호와 언덕은 포함하지 않음</td></tr><tr><td>역에서 대기·환승</td><td>통근 시간대의 배차 간격과 환승 때 걷는 거리</td></tr><tr><td>승차</td><td>지도의 소요 시간으로 가늠하고 시간표로 확인</td></tr><tr><td>역에서 회사</td><td>실제로 쓰는 출구에서 회사 입구까지</td></tr></tbody></table></div>
      <h2><span class="num">02</span><span>회사 가까운 역을 출발역으로 둔다</span></h2>
      <p>{siteName}에서 회사 가까운 역을 “출발역”에 입력합니다. 도착역은 비워 둬도 됩니다. 그 역을 지나는 노선이 지도에 남아서 어느 방향으로 몇 개의 노선이 뻗어 있는지 알 수 있습니다. 도쿄역이라면 13개 노선이 사방으로 뻗어 있습니다(2026년 9월 기준 {siteName} 데이터).</p>
      <figure class="shot"><a href="/images/articles/commute-30min-cheap-rent/from-work-ko.webp"><img src="/images/articles/commute-30min-cheap-rent/from-work-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="출발역에 도쿄를 고른 지도. 도쿄역을 지나는 노선이 사방으로 뻗어 있고 오른쪽에 13개 노선 목록이 나와 있다"></a><figcaption>도쿄역을 출발역으로 둔 상태. 오른쪽 목록에 도쿄역을 지나는 13개 노선이 나온다</figcaption></figure>
      <h2><span class="num">03</span><span>역과 역 사이의 소요 시간을 표시한다</span></h2>
      <p>“소요 시간 표시”를 누르면 역과 역 사이에 동그라미 숫자(분)가 나옵니다. 회사 역에서 후보 역까지 이 숫자를 더하면 승차 시간의 기준이 됩니다. 승차 시간을 알면 1단계에서 정한 전체 시간에서 거꾸로 계산해 어디까지 살 수 있는지 보입니다.</p>
      <p>다만 이 숫자는 역 사이의 대략적인 시간입니다. 완행인지 쾌속인지, 기다리는 시간, 환승 때 걷는 시간은 포함하지 않습니다.</p>
      <figure class="shot"><a href="/images/articles/commute-30min-cheap-rent/travel-times-ko.webp"><img src="/images/articles/commute-30min-cheap-rent/travel-times-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="“소요 시간 표시”를 켠 지도. 역과 역 사이에 분을 나타내는 동그라미 숫자가 늘어서 있다"></a><figcaption>“소요 시간 표시”를 켠 상태. 역 사이의 동그라미 숫자가 소요 시간(분)의 기준</figcaption></figure>
      <h2><span class="num">04</span><span>후보 역을 시간표로 확인한다</span></h2>
      <ol class="steps"><li><strong>지도에서 회사까지 환승 없이 또는 한 번 환승으로 갈 수 있는 역을 3~5개 고른다.</strong></li><li><strong>통근하는 요일·시각으로 철도 회사의 시간표나 환승 안내를 찾아본다.</strong></li><li><strong>귀가 시간대의 운행 횟수와 막차도 확인한다.</strong></li><li><strong>남은 역에서 월세와 주변 환경을 비교한다.</strong></li></ol>
      <div class="cta"><h3>도쿄역을 출발역으로 둔 지도 열기</h3><p>출발역을 내 회사 가까운 역으로 바꿔서 쓰세요.</p><a class="btn" href="/?from=%E6%9D%B1%E4%BA%AC&lang=ko">지도 열기 <span class="ar">→</span></a></div>
    `,
  },
  "tokyo-safe-area-by-route": {
    ja: `
      <div class="points"><div class="ttl">この記事の結論</div><ul><li>沿線のイメージではなく、駅ごとの公開データと現地で確かめる</li><li>{siteName}の犯罪件数は警視庁の町丁別データ（令和5年）で、東京都内の438駅だけ</li><li>件数は人が集まる繁華街ほど多くなる。最後は駅から家までの道を歩いて確かめる</li></ul></div>
      <h2><span class="num">01</span><span>「治安のいい沿線」はイメージで決めない</span></h2>
      <p>同じ沿線でも駅によって、同じ駅でも出口によって、まわりの様子は違います。沿線の評判や駅名の印象だけで決めると、毎日歩く道の様子が抜け落ちます。確かめる順番は「公開データで駅を比べる → 駅のまわりの施設を見る → 実際に歩く」です。</p>
      <h2><span class="num">02</span><span>犯罪件数を地図の色で見る</span></h2>
      <p>{siteName}の「データ可視化」で「犯罪件数」を選ぶと、駅が件数で色分けされます。青いほど少なく、赤いほど多い駅です。元のデータは警視庁が公開している町丁別の犯罪認知件数（令和5年）で、駅がある町丁の件数を駅に割り当てています。</p>
      <figure class="shot"><a href="/images/articles/tokyo-safe-area-by-route/crime-heatmap-ja.webp"><img src="/images/articles/tokyo-safe-area-by-route/crime-heatmap-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="山手線と中央線の駅を犯罪件数で色分けした地図。新宿が赤く、多くの駅は青い"></a><figcaption>山手線・中央線の駅を犯罪件数（警視庁・令和5年）で色分け。灰色はデータのない駅</figcaption></figure>
      <h2><span class="num">03</span><span>件数が多い＝住みにくい、ではない</span></h2>
      <p>犯罪の認知件数は、住んでいる人の数ではなく、その場所で起きた件数です。買い物客や通勤客が集まる繁華街ほど多くなり、駅前がにぎやかでも少し離れた住宅地は静かなこともあります。また、データがあるのは東京都内の438駅だけで、ほかの駅は灰色（データなし）になります。</p>
      <p>駅のページの「駅周辺のデータ」には、件数と一緒に、飲食店・スーパー・公園など駅のまわりの施設の数と、それぞれの数えた範囲・時期が並びます。暮らしやすさは、件数と施設を並べて判断します。</p>
      <figure class="shot"><a href="/images/articles/tokyo-safe-area-by-route/station-data-ja.webp"><img src="/images/articles/tokyo-safe-area-by-route/station-data-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="渋谷駅のページの「駅周辺のデータ」の表。飲食店数・スーパー数・犯罪件数などの値と、範囲・時期が並んでいる"></a><figcaption>駅ページの「駅周辺のデータ」（渋谷）。値ごとに、数えた範囲と時期が書いてある</figcaption></figure>
      <h2><span class="num">04</span><span>最後は駅から家まで歩く</span></h2>
      <ul><li>実際に使う改札・出口から、物件まで歩く</li><li>街灯、歩道、見通し、人通りを見る</li><li>昼の内見だけでなく、帰宅する時間帯にも一度歩く</li><li>共用部の照明やオートロックなど、物件そのものも確かめる</li></ul>
      <p>データも現地の印象も、安全を保証するものではありません。判断の材料を増やすために使ってください。</p>
      <div class="cta"><h3>犯罪件数で色分けした地図を開く</h3><p>山手線と中央線の駅が犯罪件数で色分けされた状態で開きます。路線を変えて、候補の駅を比べてください。</p><a class="btn" href="/?routes=yama%2Cchuo&metric=crimeIndex">地図で開く <span class="ar">→</span></a></div>
    `,
    en: `
      <div class="points"><div class="ttl">Key takeaways</div><ul><li>Check public data per station and the area itself, not a line's image</li><li>Crime counts in {siteName} come from Tokyo Metropolitan Police block-level data (2023) and cover only 438 stations in Tokyo</li><li>Counts are higher in busy commercial districts. Finally, walk from the station to your home yourself</li></ul></div>
      <h2><span class="num">01</span><span>Do not judge a "safe line" by its image</span></h2>
      <p>Even on the same line, the surroundings differ by station, and at the same station by exit. Deciding by a line's reputation or a station name leaves out the streets you will walk every day. Check in this order: compare stations with public data, look at facilities around the station, then walk it.</p>
      <h2><span class="num">02</span><span>See crime counts as colors on the map</span></h2>
      <p>In {siteName}, choose "Crime count" under "Visualization" and stations are colored by count: bluer means fewer, redder means more. The source is the Tokyo Metropolitan Police Department's published crime counts by town block (2023), and each station is given the count of the block it stands in.</p>
      <figure class="shot"><a href="/images/articles/tokyo-safe-area-by-route/crime-heatmap-en.webp"><img src="/images/articles/tokyo-safe-area-by-route/crime-heatmap-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="Map coloring Yamanote and Chuo Line stations by crime count. Shinjuku is red and most stations are blue"></a><figcaption>Yamanote and Chuo Line stations colored by crime count (Tokyo Metropolitan Police, 2023). Gray stations have no data</figcaption></figure>
      <h2><span class="num">03</span><span>A high count does not mean a bad place to live</span></h2>
      <p>Recorded crime counts are incidents in that place, not per resident. They rise in commercial districts where shoppers and commuters gather, and a quiet residential area can lie just a few minutes from a busy station front. Data exists only for 438 stations in Tokyo; other stations appear gray (no data).</p>
      <p>On each station page, "Around the station" lists the count together with nearby facilities such as restaurants, supermarkets and parks, plus how and when each was counted. Judge livability by reading counts and facilities side by side.</p>
      <figure class="shot"><a href="/images/articles/tokyo-safe-area-by-route/station-data-en.webp"><img src="/images/articles/tokyo-safe-area-by-route/station-data-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="The "Around the station" table on the Shibuya station page, listing values such as restaurants, supermarkets and crime count with their range and period"></a><figcaption>"Around the station" on a station page (Shibuya). Each value shows the range and period it was counted over</figcaption></figure>
      <h2><span class="num">04</span><span>Finally, walk from the station to your home</span></h2>
      <ul><li>Walk from the gate and exit you will actually use to the property</li><li>Look at street lights, sidewalks, sight lines and foot traffic</li><li>Besides a daytime viewing, walk it once at the hour you would come home</li><li>Check the building itself too: lighting in shared areas, auto-lock and so on</li></ul>
      <p>Neither data nor impressions guarantee safety. Use them to gather more information for your decision.</p>
      <div class="cta"><h3>Open a map colored by crime count</h3><p>The map opens with Yamanote and Chuo Line stations colored by crime count. Change lines to compare your candidate stations.</p><a class="btn" href="/?routes=yama%2Cchuo&metric=crimeIndex&lang=en">Open the map <span class="ar">→</span></a></div>
    `,
    zh: `
      <div class="points"><div class="ttl">本文结论</div><ul><li>不凭沿线印象，而是看每个车站的公开数据并实地确认</li><li>{siteName}的犯罪件数来自警视厅按町丁统计的数据（2023年），只覆盖东京都内438个车站</li><li>人越多的繁华街件数越多。最后要亲自从车站走到住处确认</li></ul></div>
      <h2><span class="num">01</span><span>不要凭印象判断“治安好的沿线”</span></h2>
      <p>即使在同一条沿线，不同车站、甚至同一车站的不同出口，周边的样子都不一样。只凭沿线口碑或站名印象来决定，会忽略每天要走的那条路。确认的顺序是：用公开数据比较车站 → 看车站周边的设施 → 实地走一走。</p>
      <h2><span class="num">02</span><span>用地图颜色看犯罪件数</span></h2>
      <p>在{siteName}的“数据可视化”中选择“犯罪件数”，车站会按件数着色。越蓝越少，越红越多。原始数据是警视厅公开的按町丁统计的犯罪认知件数（2023年），把车站所在町丁的件数分配给该车站。</p>
      <figure class="shot"><a href="/images/articles/tokyo-safe-area-by-route/crime-heatmap-zh.webp"><img src="/images/articles/tokyo-safe-area-by-route/crime-heatmap-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="按犯罪件数给山手线和中央线车站着色的地图，新宿为红色，多数车站为蓝色"></a><figcaption>按犯罪件数（警视厅・2023年）给山手线、中央线车站着色。灰色是没有数据的车站</figcaption></figure>
      <h2><span class="num">03</span><span>件数多不等于不好住</span></h2>
      <p>犯罪认知件数是在该地发生的件数，而不是按居民人数计算的。购物和通勤人群聚集的繁华街件数会更多；即使站前很热闹，稍远一点的住宅区也可能很安静。另外，只有东京都内的438个车站有数据，其他车站显示为灰色（无数据）。</p>
      <p>车站页面的“车站周边数据”中，除了件数，还列出餐饮店、超市、公园等车站周边设施的数量，以及各项的统计范围和时间。判断是否宜居，要把件数和设施放在一起看。</p>
      <figure class="shot"><a href="/images/articles/tokyo-safe-area-by-route/station-data-zh.webp"><img src="/images/articles/tokyo-safe-area-by-route/station-data-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="涩谷站页面“车站周边数据”的表格，列出餐饮店数、超市数、犯罪件数等数值及其范围和时间"></a><figcaption>车站页面的“车站周边数据”（涩谷）。每项数值都写明了统计范围和时间</figcaption></figure>
      <h2><span class="num">04</span><span>最后从车站走到住处</span></h2>
      <ul><li>从实际使用的检票口和出口走到房子</li><li>看路灯、人行道、视野和行人多少</li><li>除了白天看房，也在平时回家的时段走一次</li><li>也确认房子本身，例如公共区域的照明和自动门锁</li></ul>
      <p>无论是数据还是实地印象，都不能保证安全。请把它们当作增加判断依据的材料。</p>
      <div class="cta"><h3>打开按犯罪件数着色的地图</h3><p>地图会以山手线和中央线车站按犯罪件数着色的状态打开。请切换线路比较候选车站。</p><a class="btn" href="/?routes=yama%2Cchuo&metric=crimeIndex&lang=zh">打开地图 <span class="ar">→</span></a></div>
    `,
    ko: `
      <div class="points"><div class="ttl">이 글의 결론</div><ul><li>노선 이미지가 아니라 역별 공개 데이터와 현장에서 확인한다</li><li>{siteName}의 범죄 건수는 경시청의 동네 단위 데이터(2023년)이며 도쿄도 내 438개 역만 있다</li><li>건수는 사람이 모이는 번화가일수록 많다. 마지막에는 역에서 집까지 직접 걸어서 확인한다</li></ul></div>
      <h2><span class="num">01</span><span>“치안 좋은 노선”을 이미지로 정하지 않는다</span></h2>
      <p>같은 노선이라도 역에 따라, 같은 역이라도 출구에 따라 주변 모습은 다릅니다. 노선 평판이나 역 이름의 인상만으로 정하면 매일 걷는 길의 모습이 빠집니다. 확인 순서는 “공개 데이터로 역을 비교 → 역 주변 시설 보기 → 직접 걷기”입니다.</p>
      <h2><span class="num">02</span><span>범죄 건수를 지도의 색으로 본다</span></h2>
      <p>{siteName}의 “데이터 시각화”에서 “범죄 건수”를 고르면 역이 건수에 따라 색으로 나뉩니다. 파랄수록 적고, 빨갈수록 많은 역입니다. 원래 데이터는 경시청이 공개한 동네 단위 범죄 인지 건수(2023년)이며, 역이 있는 동네의 건수를 역에 할당했습니다.</p>
      <figure class="shot"><a href="/images/articles/tokyo-safe-area-by-route/crime-heatmap-ko.webp"><img src="/images/articles/tokyo-safe-area-by-route/crime-heatmap-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="야마노테선과 주오선 역을 범죄 건수로 색칠한 지도. 신주쿠는 빨갛고 대부분의 역은 파랗다"></a><figcaption>야마노테선·주오선 역을 범죄 건수(경시청·2023년)로 색칠. 회색은 데이터가 없는 역</figcaption></figure>
      <h2><span class="num">03</span><span>건수가 많다 = 살기 나쁘다는 아니다</span></h2>
      <p>범죄 인지 건수는 거주자 수가 아니라 그 장소에서 일어난 건수입니다. 쇼핑객과 통근객이 모이는 번화가일수록 많아지고, 역 앞이 붐벼도 조금 떨어진 주택가는 조용할 수 있습니다. 또 데이터가 있는 것은 도쿄도 내 438개 역뿐이고, 다른 역은 회색(데이터 없음)으로 나옵니다.</p>
      <p>역 페이지의 “역 주변 데이터”에는 건수와 함께 음식점·슈퍼·공원 등 역 주변 시설의 수와 각각 센 범위·시기가 나옵니다. 살기 좋은지는 건수와 시설을 나란히 놓고 판단합니다.</p>
      <figure class="shot"><a href="/images/articles/tokyo-safe-area-by-route/station-data-ko.webp"><img src="/images/articles/tokyo-safe-area-by-route/station-data-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="시부야역 페이지의 “역 주변 데이터” 표. 음식점 수·슈퍼 수·범죄 건수 등의 값과 범위·시기가 나와 있다"></a><figcaption>역 페이지의 “역 주변 데이터”(시부야). 값마다 센 범위와 시기가 적혀 있다</figcaption></figure>
      <h2><span class="num">04</span><span>마지막에는 역에서 집까지 걷는다</span></h2>
      <ul><li>실제로 쓸 개찰구·출구에서 집까지 걸어 본다</li><li>가로등, 보도, 시야, 사람 왕래를 본다</li><li>낮에 집을 보는 것 외에 귀가 시간대에도 한 번 걸어 본다</li><li>공용부 조명이나 자동 잠금 등 건물 자체도 확인한다</li></ul>
      <p>데이터도 현장의 인상도 안전을 보장하지는 않습니다. 판단 재료를 늘리는 데 쓰세요.</p>
      <div class="cta"><h3>범죄 건수로 색칠한 지도 열기</h3><p>야마노테선과 주오선 역이 범죄 건수로 색칠된 상태로 열립니다. 노선을 바꿔 후보 역을 비교하세요.</p><a class="btn" href="/?routes=yama%2Cchuo&metric=crimeIndex&lang=ko">지도 열기 <span class="ar">→</span></a></div>
    `,
  },
  "tokyo-rent-by-route": {
    ja: `
      <div class="points"><div class="ttl">この記事の結論</div><ul><li>家賃は沿線ではなく駅ごとに違う。沿線名で比べない</li><li>通える駅を地図で絞ってから、沿線の駅を順に並べて候補を出す</li><li>家賃は、間取り・面積・築年数・駅徒歩をそろえた募集物件で比べる</li></ul></div>
      <h2><span class="num">01</span><span>沿線名で比べても住む駅は決まらない</span></h2>
      <p>1本の沿線には、ターミナル駅のそばの駅から郊外の駅まで並んでいて、家賃も街の様子も駅ごとに違います。「◯◯線は高い」「△△線は安い」といった沿線単位の話は、どの駅を比べたかで結論が変わります。比べる単位は、沿線ではなく駅です。</p>
      <h2><span class="num">02</span><span>通える駅を地図で絞る</span></h2>
      <p>まず、職場や学校の最寄り駅を{siteName}の出発駅に入れ、そこから伸びる路線を見ます。渋谷なら、東急東横線・東急田園都市線・京王井の頭線などが西から南西へ伸びているのが分かります。乗り換えなしで通える路線から候補にすると、通勤の負担もそろえて比べられます。</p>
      <figure class="shot"><a href="/images/articles/tokyo-rent-by-route/from-shibuya-ja.webp"><img src="/images/articles/tokyo-rent-by-route/from-shibuya-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="出発駅に渋谷を選んだ地図。東急東横線・東急田園都市線・京王井の頭線などが西から南西へ伸びている"></a><figcaption>渋谷を出発駅にした状態。渋谷を通る路線がどの方向へ伸びるかが分かる</figcaption></figure>
      <h2><span class="num">03</span><span>沿線の駅を順に並べる</span></h2>
      <p>候補の路線が決まったら、路線のページで駅を順番に確かめます。東急東横線のページには、渋谷から横浜までの21駅が順に並び、それぞれの駅で乗り換えられる路線も書いてあります。乗り換えられる駅と、その隣の駅とでは通勤の選択肢が変わるので、両方を候補に入れて比べます。</p>
      <figure class="shot"><a href="/images/articles/tokyo-rent-by-route/line-stations-ja.webp"><img src="/images/articles/tokyo-rent-by-route/line-stations-ja.webp" width="1200" height="768" loading="lazy" decoding="async" alt="東急東横線のページ。渋谷から順に、駅と乗り換えられる路線が並んだ表"></a><figcaption>東急東横線のページ。駅の順番と、乗り換えられる路線が一覧で分かる</figcaption></figure>
      <h2><span class="num">04</span><span>条件をそろえて家賃を比べる</span></h2>
      <p>候補の駅が決まったら、不動産サイトで駅ごとに募集物件を探し、次の条件をそろえて比べます。1件だけ極端に安い物件を、その駅の相場と考えないようにします。</p>
      <div class="tbl"><table><thead><tr><th>項目</th><th>そろえ方</th></tr></thead><tbody><tr><td>間取り・面積</td><td>同じ1Kでも広さが違うので、両方を指定する</td></tr><tr><td>築年数・設備</td><td>範囲を決め、譲れない設備を決めておく</td></tr><tr><td>駅徒歩</td><td>表示の分数に加え、使う出口と実際の道を確かめる</td></tr><tr><td>毎月の費用</td><td>家賃に管理費・共益費を足した額で比べる</td></tr><tr><td>初期・更新の費用</td><td>毎月の費用とは分けて記録する</td></tr><tr><td>時点</td><td>掲載日・確認日と物件のURLを残す</td></tr></tbody></table></div>
      <p>{siteName}では家賃を比較の材料として出していません。手元にあるのは推定値だけで、確かな公開データが無いためです（推定値は既定で表示しません）。家賃は、必ず募集中の物件の情報で確かめてください。</p>
      <div class="cta"><h3>渋谷を出発駅にした地図を開く</h3><p>出発駅を、自分の職場や学校の最寄り駅に変えて使ってください。</p><a class="btn" href="/?from=%E6%B8%8B%E8%B0%B7">地図で開く <span class="ar">→</span></a></div>
    `,
    en: `
      <div class="points"><div class="ttl">Key takeaways</div><ul><li>Rent differs by station, not by line. Do not compare line names</li><li>Shortlist commutable stations on the map, then list the stations along each line</li><li>Compare rent using listings with the same layout, floor area, building age and walking time</li></ul></div>
      <h2><span class="num">01</span><span>Comparing line names will not pick your station</span></h2>
      <p>A single line runs from stations next to a big terminal out to the suburbs, and rent and atmosphere change station by station. Claims such as "this line is expensive" or "that line is cheap" depend on which stations were compared. Compare stations, not lines.</p>
      <h2><span class="num">02</span><span>Shortlist commutable stations on the map</span></h2>
      <p>First, enter the station nearest your work or school as the departure in {siteName} and look at the lines leaving it. From Shibuya, you can see the Tokyu Toyoko Line, Tokyu Den-en-toshi Line, Keio Inokashira Line and others heading west and southwest. Starting from lines with no transfer keeps commuting effort comparable too.</p>
      <figure class="shot"><a href="/images/articles/tokyo-rent-by-route/from-shibuya-en.webp"><img src="/images/articles/tokyo-rent-by-route/from-shibuya-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="Map with Shibuya as the departure. The Tokyu Toyoko, Tokyu Den-en-toshi and Keio Inokashira lines and others head west and southwest"></a><figcaption>Shibuya set as the departure. You can see which way each line through Shibuya heads</figcaption></figure>
      <h2><span class="num">03</span><span>List the stations along the line in order</span></h2>
      <p>Once you have candidate lines, check their stations in order on the line pages. The Tokyu Toyoko Line page lists 21 stations from Shibuya to Yokohama in order, with the lines you can transfer to at each. A transfer station and the station next to it offer different commuting options, so include both as candidates.</p>
      <figure class="shot"><a href="/images/articles/tokyo-rent-by-route/line-stations-en.webp"><img src="/images/articles/tokyo-rent-by-route/line-stations-en.webp" width="1200" height="768" loading="lazy" decoding="async" alt="The Tokyu Toyoko Line page, with a table of stations from Shibuya in order and their transfer lines"></a><figcaption>The Tokyu Toyoko Line page. Station order and transfer lines at a glance</figcaption></figure>
      <h2><span class="num">04</span><span>Compare rent with matching conditions</span></h2>
      <p>With your candidate stations set, search listings for each station on real estate sites and match the conditions below. Do not treat a single unusually cheap listing as the going rate for that station.</p>
      <div class="tbl"><table><thead><tr><th>Item</th><th>How to match</th></tr></thead><tbody><tr><td>Layout and floor area</td><td>Two 1K units can differ in size, so specify both</td></tr><tr><td>Building age and features</td><td>Set a range and decide your must-have features</td></tr><tr><td>Walk to station</td><td>Besides the listed minutes, check the exit you will use and the actual route</td></tr><tr><td>Monthly cost</td><td>Compare rent plus management and common fees</td></tr><tr><td>Move-in and renewal costs</td><td>Record them separately from monthly costs</td></tr><tr><td>Date</td><td>Keep the listing date, the date you checked, and the listing URL</td></tr></tbody></table></div>
      <p>{siteName} does not provide rent as a basis for comparison. We only have estimated values and no reliable public data (estimates are hidden by default). Always check rent against current listings.</p>
      <div class="cta"><h3>Open a map with Shibuya as the departure</h3><p>Change the departure to the station nearest your work or school.</p><a class="btn" href="/?from=%E6%B8%8B%E8%B0%B7&lang=en">Open the map <span class="ar">→</span></a></div>
    `,
    zh: `
      <div class="points"><div class="ttl">本文结论</div><ul><li>租金按车站不同，而不是按沿线。不要用线路名比较</li><li>先在地图上筛选能通勤的车站，再按顺序列出沿线车站作为候选</li><li>用户型、面积、楼龄、步行时间相同的房源比较租金</li></ul></div>
      <h2><span class="num">01</span><span>用线路名比较，决定不了要住的车站</span></h2>
      <p>一条线路上既有靠近枢纽站的车站，也有郊外的车站，租金和街区氛围逐站不同。“某某线贵”“某某线便宜”这类按沿线的说法，结论取决于比较了哪些车站。比较的单位应该是车站，而不是线路。</p>
      <h2><span class="num">02</span><span>在地图上筛选能通勤的车站</span></h2>
      <p>首先，把公司或学校最近的车站填入{siteName}的出发站，看从那里延伸出去的线路。以涩谷为例，可以看到东急东横线、东急田园都市线、京王井之头线等向西和西南方向延伸。先从不用换乘就能通勤的线路选候选，通勤负担也能放在同一条件下比较。</p>
      <figure class="shot"><a href="/images/articles/tokyo-rent-by-route/from-shibuya-zh.webp"><img src="/images/articles/tokyo-rent-by-route/from-shibuya-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="出发站选涩谷的地图，东急东横线、东急田园都市线、京王井之头线等向西和西南延伸"></a><figcaption>把涩谷设为出发站。可以看出经过涩谷的各线路往哪个方向延伸</figcaption></figure>
      <h2><span class="num">03</span><span>按顺序列出沿线车站</span></h2>
      <p>确定候选线路后，在线路页面按顺序确认车站。东急东横线的页面按顺序列出从涩谷到横滨的21个车站，并写明每站可换乘的线路。可换乘的车站和它旁边的车站，通勤选择不同，所以两者都列入候选比较。</p>
      <figure class="shot"><a href="/images/articles/tokyo-rent-by-route/line-stations-zh.webp"><img src="/images/articles/tokyo-rent-by-route/line-stations-zh.webp" width="1200" height="768" loading="lazy" decoding="async" alt="东急东横线的页面，表格从涩谷起按顺序列出车站和可换乘的线路"></a><figcaption>东急东横线的页面。车站顺序和可换乘的线路一目了然</figcaption></figure>
      <h2><span class="num">04</span><span>统一条件后比较租金</span></h2>
      <p>确定候选车站后，在房产网站上按车站搜索出租房源，并统一以下条件进行比较。不要把某一套特别便宜的房子当成该站的行情。</p>
      <div class="tbl"><table><thead><tr><th>项目</th><th>统一方法</th></tr></thead><tbody><tr><td>户型・面积</td><td>同样是1K，面积也不同，两者都要指定</td></tr><tr><td>楼龄・设备</td><td>定好范围，并确定不能妥协的设备</td></tr><tr><td>步行到车站</td><td>除了标注的分钟数，还要确认要用的出口和实际道路</td></tr><tr><td>每月费用</td><td>用租金加管理费・共益费的金额比较</td></tr><tr><td>入住・续约费用</td><td>与每月费用分开记录</td></tr><tr><td>时间</td><td>保留刊登日期、确认日期和房源网址</td></tr></tbody></table></div>
      <p>{siteName}不提供租金作为比较依据。因为我们手上只有推算值，没有可靠的公开数据（推算值默认不显示）。租金请务必以正在招租的房源信息为准。</p>
      <div class="cta"><h3>打开以涩谷为出发站的地图</h3><p>请把出发站换成自己公司或学校最近的车站。</p><a class="btn" href="/?from=%E6%B8%8B%E8%B0%B7&lang=zh">打开地图 <span class="ar">→</span></a></div>
    `,
    ko: `
      <div class="points"><div class="ttl">이 글의 결론</div><ul><li>월세는 노선이 아니라 역마다 다르다. 노선 이름으로 비교하지 않는다</li><li>통근 가능한 역을 지도에서 좁힌 뒤, 노선의 역을 순서대로 늘어놓고 후보를 뽑는다</li><li>월세는 구조·면적·연식·역 도보를 맞춘 매물로 비교한다</li></ul></div>
      <h2><span class="num">01</span><span>노선 이름으로 비교해서는 살 역이 정해지지 않는다</span></h2>
      <p>한 노선에는 터미널역 근처의 역부터 교외의 역까지 늘어서 있고, 월세도 동네 분위기도 역마다 다릅니다. “○○선은 비싸다”, “△△선은 싸다” 같은 노선 단위 이야기는 어느 역을 비교했느냐에 따라 결론이 바뀝니다. 비교 단위는 노선이 아니라 역입니다.</p>
      <h2><span class="num">02</span><span>통근 가능한 역을 지도에서 좁힌다</span></h2>
      <p>먼저 회사나 학교에서 가까운 역을 {siteName}의 출발역에 넣고 거기서 뻗어 나가는 노선을 봅니다. 시부야라면 도큐 도요코선·도큐 덴엔토시선·게이오 이노카시라선 등이 서쪽과 남서쪽으로 뻗어 있는 것을 알 수 있습니다. 환승 없이 다닐 수 있는 노선부터 후보로 삼으면 통근 부담도 같은 조건으로 비교할 수 있습니다.</p>
      <figure class="shot"><a href="/images/articles/tokyo-rent-by-route/from-shibuya-ko.webp"><img src="/images/articles/tokyo-rent-by-route/from-shibuya-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="출발역에 시부야를 고른 지도. 도큐 도요코선·도큐 덴엔토시선·게이오 이노카시라선 등이 서쪽과 남서쪽으로 뻗어 있다"></a><figcaption>시부야를 출발역으로 둔 상태. 시부야를 지나는 노선이 어느 방향으로 뻗는지 알 수 있다</figcaption></figure>
      <h2><span class="num">03</span><span>노선의 역을 순서대로 늘어놓는다</span></h2>
      <p>후보 노선이 정해지면 노선 페이지에서 역을 순서대로 확인합니다. 도큐 도요코선 페이지에는 시부야부터 요코하마까지 21개 역이 순서대로 나오고, 역마다 갈아탈 수 있는 노선도 적혀 있습니다. 환승역과 그 옆 역은 통근 선택지가 다르므로 둘 다 후보에 넣어 비교합니다.</p>
      <figure class="shot"><a href="/images/articles/tokyo-rent-by-route/line-stations-ko.webp"><img src="/images/articles/tokyo-rent-by-route/line-stations-ko.webp" width="1200" height="768" loading="lazy" decoding="async" alt="도큐 도요코선 페이지. 시부야부터 순서대로 역과 갈아탈 수 있는 노선이 나온 표"></a><figcaption>도큐 도요코선 페이지. 역 순서와 갈아탈 수 있는 노선을 한눈에 알 수 있다</figcaption></figure>
      <h2><span class="num">04</span><span>조건을 맞춰 월세를 비교한다</span></h2>
      <p>후보 역이 정해지면 부동산 사이트에서 역마다 매물을 찾고, 아래 조건을 맞춰 비교합니다. 한 건만 유난히 싼 매물을 그 역의 시세로 여기지 않도록 합니다.</p>
      <div class="tbl"><table><thead><tr><th>항목</th><th>맞추는 법</th></tr></thead><tbody><tr><td>구조·면적</td><td>같은 1K라도 넓이가 다르므로 둘 다 지정한다</td></tr><tr><td>연식·설비</td><td>범위를 정하고 양보할 수 없는 설비를 정해 둔다</td></tr><tr><td>역 도보</td><td>표시된 분 외에 쓸 출구와 실제 길을 확인한다</td></tr><tr><td>매월 비용</td><td>월세에 관리비·공익비를 더한 금액으로 비교한다</td></tr><tr><td>입주·갱신 비용</td><td>매월 비용과 따로 기록한다</td></tr><tr><td>시점</td><td>게재일·확인일과 매물 URL을 남긴다</td></tr></tbody></table></div>
      <p>{siteName}은 월세를 비교 자료로 제공하지 않습니다. 가진 것이 추정값뿐이고 확실한 공개 데이터가 없기 때문입니다(추정값은 기본적으로 표시하지 않습니다). 월세는 반드시 모집 중인 매물 정보로 확인하세요.</p>
      <div class="cta"><h3>시부야를 출발역으로 둔 지도 열기</h3><p>출발역을 내 회사나 학교에서 가까운 역으로 바꿔서 쓰세요.</p><a class="btn" href="/?from=%E6%B8%8B%E8%B0%B7&lang=ko">지도 열기 <span class="ar">→</span></a></div>
    `,
  },
};
