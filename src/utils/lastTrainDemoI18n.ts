import type { Language } from './translation';

/** 終電PoCは既存の駅・時刻UIを使う。追加するUI文言はトグルだけ。 */
export interface LastTrainCopy {
  toggleMode: string;
  /** 既存のSnackbarに表示する、到着駅を指定していないときの案内。 */
  chooseArrivalNotice: string;
  /** 現在の出発時刻欄の意味を保ちつつ、試験中だけ仮想の基準時刻とする。 */
  virtualTime: string;
  /** 新規の注意バナーを増やさずボタンの既存title属性に載せる。 */
  warnBody: string;
}
export const LAST_TRAIN_I18N: Record<Language, LastTrainCopy> = {
  japanese: {
    toggleMode: '終電モード（試作）',
    chooseArrivalNotice: '終電モードを使用するには、到着駅を設定してください。',
    virtualTime: '基準時刻',
    warnBody: '試作中：終電時刻は架空のデモダイヤです。実際の乗車判断に利用しないでください。',
  },
  english: {
    toggleMode: 'Last train mode (beta)',
    chooseArrivalNotice: 'Select an arrival station to use last train mode.',
    virtualTime: 'Reference time',
    warnBody: 'Prototype: all last-train times are fictional. Do not use for actual journeys.',
  },
  chinese: {
    toggleMode: '末班车模式（测试）',
    chooseArrivalNotice: '请先设置目的地，再使用末班车模式。',
    virtualTime: '基准时间',
    warnBody: '测试功能：所有末班车时刻都是虚构的，请勿用于实际乘车判断。',
  },
  korean: {
    toggleMode: '막차 모드(시험)',
    chooseArrivalNotice: '막차 모드를 사용하려면 도착역을 설정하세요.',
    virtualTime: '기준 시각',
    warnBody: '시험 기능: 모든 막차 시각은 가상 데이터입니다. 실제 이동에 사용하지 마세요.',
  },
};
export function lastTrainCopy(language: Language): LastTrainCopy {
  return LAST_TRAIN_I18N[language];
}
