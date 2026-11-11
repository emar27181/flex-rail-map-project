import type { Language } from './translation';

/** 試作画面の全UI文言。駅名は既存の translateStation を使用する。 */
export interface LastTrainCopy {
  back: string; trial: string; title: string; intro: string;
  toggleMode: string; unsupportedDestination: string; nowButton: string;
  warnTitle: string; warnBody: string;
  chooseHeading: string; destinationPrompt: string; scope: string;
  timeHeading: string; virtualTime: string; timeAria: string;
  play: string; pause: string; reset: string;
  reachHeading: string; stationUnit: string; reachableSummary: string; ratioAria: string;
  inspectHeading: string; inspectLabel: string;
  statusDestination: string; statusNoData: string; statusRemaining: string;
  statusEnded: string; statusDestDetail: string; statusNoDataDetail: string; statusLast: string;
  mapHeading: string; mapAt: string; mapAria: string; viewStation: string;
  tooltipRemaining: string; tooltipExpired: string; legendAria: string;
  legendAlive: string; legendSoon: string; legendOff: string; legendDest: string;
  expiringHeading: string; noneLeft: string; minuteUnit: string; note: string;
}

export const LAST_TRAIN_I18N: Record<Language, LastTrainCopy> = {
  japanese: {
    back: '路線図に戻る', trial: 'EXPERIMENT / 非公開試作',
    nowButton: '現在時刻に戻す', toggleMode: '終電モード', unsupportedDestination: '選択した到着駅は試作ダイヤの対象外です。対象路線の駅を選択してください。',
    title: '終電で帰れる駅が、時間とともに消えていく。',
    intro: '到着駅を決めて、夜の時刻を進める。各駅からまだ目的地へ向かえるかを、路線図の縮退で試せるプロトタイプ。',
    warnTitle: '実際の終電検索には使えません。',
    warnBody: 'この画面の発車時刻・乗換はすべて架空の試験データです。実際のダイヤ・運行日・遅延には未対応です。',
    chooseHeading: '到着駅を決める', destinationPrompt: '終電で向かいたい駅',
    scope: '対象：東京周辺の山手線・中央線・京浜東北線の一部（試作）',
    timeHeading: '夜の時刻を動かす', virtualTime: '仮想現在時刻', timeAria: '仮想現在時刻を変更',
    play: '自動再生', pause: '一時停止', reset: '最初に戻す',
    reachHeading: 'この時刻の到達圏', stationUnit: '駅', reachableSummary: '目的地へ向かえる出発駅（架空ダイヤでの計算）', ratioAria: '到達できる駅の割合',
    inspectHeading: '駅ごとの終電猶予', inspectLabel: '確認する駅（地図上からも選択可能）',
    statusDestination: '目的地', statusNoData: '試験データで接続なし', statusRemaining: 'あと ',
    statusEnded: 'この時刻では終了', statusDestDetail: '到着駅に指定されています',
    statusNoDataDetail: '対象区間・仮想接続を確認してください', statusLast: '架空ダイヤの最遅出発 ',
    mapHeading: '終電到達ネットワーク', mapAt: '時点 · 到着駅：',
    mapAria: '架空ダイヤに基づく到達可能路線図。到着駅：', viewStation: 'の状態を見る',
    tooltipRemaining: '残り', tooltipExpired: '仮想終電終了', legendAria: '凡例',
    legendAlive: 'まだ間に合う', legendSoon: '残り15分以内', legendOff: '間に合わない', legendDest: '到着駅',
    expiringHeading: '次に終電圏から外れる駅（試験）', noneLeft: 'この時刻に到達可能な出発駅はありません。',
    minuteUnit: '分',
    note: '駅の座標・駅名は既存の路線データから引用。線分は駅間の概略表示です。時刻・運行便・乗換接続はすべて仮想モデルで、公式時刻表に基づきません。',
  },
  english: {
    back: 'Back to map', trial: 'EXPERIMENT / PRIVATE PREVIEW',
    nowButton: 'Back to current time', toggleMode: 'Last train mode', unsupportedDestination: 'This destination is outside the sample timetable. Choose a station on the supported lines.',
    title: 'Watch the last-train network disappear over time.',
    intro: 'Pick a destination and move through the night. See which stations are still reachable in this interactive prototype.',
    warnTitle: 'Not for real last-train journeys.',
    warnBody: 'Every departure and transfer time here is fictional demo data. Actual schedules, service days and disruptions are not supported.',
    chooseHeading: 'Choose a destination', destinationPrompt: 'Where do you want to go?',
    scope: 'Sample only: parts of the Yamanote, Chuo and Keihin-Tohoku lines near Tokyo.',
    timeHeading: 'Move through the night', virtualTime: 'Simulated current time', timeAria: 'Change simulated time',
    play: 'Play', pause: 'Pause', reset: 'Reset',
    reachHeading: 'Reachable network', stationUnit: 'stations', reachableSummary: 'Stations that can depart for the destination in the fictional schedule', ratioAria: 'Share of reachable stations',
    inspectHeading: 'Time left by station', inspectLabel: 'Inspect a station (or tap it on the map)',
    statusDestination: 'Destination', statusNoData: 'No demo connection', statusRemaining: 'Remaining ',
    statusEnded: 'No longer reachable', statusDestDetail: 'This is your selected destination',
    statusNoDataDetail: 'There is no connection in the sample network', statusLast: 'Fictional latest departure: ',
    mapHeading: 'Last-train reachability', mapAt: ' · destination: ',
    mapAria: 'Fictional reachability map for ', viewStation: ': inspect station',
    tooltipRemaining: 'Remaining ', tooltipExpired: 'Demo service ended', legendAria: 'Legend',
    legendAlive: 'Reachable', legendSoon: '15 min or less', legendOff: 'Expired', legendDest: 'Destination',
    expiringHeading: 'Next stations to expire (demo)', noneLeft: 'No more departure stations are reachable at this time.',
    minuteUnit: ' min',
    note: 'Station names and approximate locations come from the existing network data. All trains, timings, connections and transfer assumptions are fictional. Never use them to plan a real journey.',
  },
  chinese: {
    back: '返回线路图', trial: 'EXPERIMENT / 内部试用',
    nowButton: '返回当前时间', toggleMode: '末班车模式', unsupportedDestination: '该目的地不在模拟时刻表的支持范围内。请重新选择车站。',
    title: '随着夜色加深，末班车可达线路逐渐消失。',
    intro: '选择目的地并调整时间，在交互式线路图中观察哪些车站仍可到达目的地。',
    warnTitle: '不可用于实际查询末班车。',
    warnBody: '所有发车及换乘时间均为虚构测试数据，未考虑实际时刻表、运营日期及延误。',
    chooseHeading: '选择目的地', destinationPrompt: '想乘末班车到达的车站',
    scope: '试用范围：东京附近部分山手线、中央线及京滨东北线车站。',
    timeHeading: '调整夜间时间', virtualTime: '模拟当前时间', timeAria: '调整模拟时间',
    play: '自动播放', pause: '暂停', reset: '重置',
    reachHeading: '当前可达范围', stationUnit: '站', reachableSummary: '虚构时刻表中仍可前往目的地的车站', ratioAria: '可达车站比例',
    inspectHeading: '各站剩余时间', inspectLabel: '查看车站（也可点击地图）',
    statusDestination: '目的地', statusNoData: '测试数据无连接', statusRemaining: '剩余 ',
    statusEnded: '已无法到达', statusDestDetail: '已选择为目的地',
    statusNoDataDetail: '测试线路中没有此连接', statusLast: '模拟最晚出发：',
    mapHeading: '末班车可达线路图', mapAt: ' · 目的地：',
    mapAria: '虚构数据可达线路图，目的地：', viewStation: '：查看车站',
    tooltipRemaining: '剩余', tooltipExpired: '模拟末班车已结束', legendAria: '图例',
    legendAlive: '仍可到达', legendSoon: '剩余15分钟内', legendOff: '无法到达', legendDest: '目的地',
    expiringHeading: '即将失去可达性的车站（试用）', noneLeft: '当前时间没有可达的出发站。',
    minuteUnit: '分钟',
    note: '车站名称和近似位置引用现有线路数据。所有班次、时间和换乘条件均为虚构测试数据，不可用于实际出行。',
  },
  korean: {
    back: '노선도로 돌아가기', trial: 'EXPERIMENT / 비공개 테스트',
    nowButton: '현재 시각으로', toggleMode: '막차 모드', unsupportedDestination: '이 목적지는 시험 운행표에 없습니다. 지원되는 역을 선택하세요.',
    title: '시간이 지나면 막차로 갈 수 있는 역이 사라집니다.',
    intro: '도착역을 정하고 밤 시간대를 움직여 어떤 역에서 목적지까지 갈 수 있는지 확인하는 프로토타입입니다.',
    warnTitle: '실제 막차 검색에 사용할 수 없습니다.',
    warnBody: '모든 출발 및 환승 시각은 가상의 테스트 데이터이며, 실제 시간표·운행일·지연을 반영하지 않습니다.',
    chooseHeading: '도착역 선택', destinationPrompt: '막차로 가고 싶은 역',
    scope: '도쿄 인근 야마노테선·주오선·게이힌도호쿠선 일부 역만 포함합니다.',
    timeHeading: '시간 이동', virtualTime: '가상 현재 시각', timeAria: '가상 시간 변경',
    play: '자동 재생', pause: '일시 정지', reset: '처음으로',
    reachHeading: '현재 도달 가능 범위', stationUnit: '개 역', reachableSummary: '가상 운행표에서 목적지로 갈 수 있는 출발역', ratioAria: '도달 가능한 역의 비율',
    inspectHeading: '역별 남은 시간', inspectLabel: '확인할 역 (지도에서 선택 가능)',
    statusDestination: '도착역', statusNoData: '가상 연결 없음', statusRemaining: '남은 시간 ',
    statusEnded: '이 시각에는 불가능', statusDestDetail: '도착역으로 지정되어 있습니다',
    statusNoDataDetail: '시험 네트워크에 연결이 없습니다', statusLast: '가상 최종 출발: ',
    mapHeading: '막차 도달 가능 네트워크', mapAt: ' 기준 · 도착역: ',
    mapAria: '가상 시각표 도달 가능 지도. 도착역: ', viewStation: '역 상태 확인',
    tooltipRemaining: '남은 시간 ', tooltipExpired: '가상 막차 종료', legendAria: '범례',
    legendAlive: '도달 가능', legendSoon: '15분 이하', legendOff: '도달 불가', legendDest: '도착역',
    expiringHeading: '곧 도달 불가가 되는 역 (시험)', noneLeft: '현재 시각에 도달 가능한 출발역이 없습니다.',
    minuteUnit: '분',
    note: '역 이름과 개략 위치만 기존 노선 데이터를 사용합니다. 운행편·시각·환승 조건은 모두 가상이며 실제 이동에 사용하면 안 됩니다.',
  },
};

export function lastTrainCopy(language: Language): LastTrainCopy {
  return LAST_TRAIN_I18N[language];
}
