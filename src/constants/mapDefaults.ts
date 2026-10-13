/**
 * 地図を開いたときの既定の表示位置。
 *
 * 位置情報が使えない（許可されない・取得できない）とき、URL で位置や駅の指定も無ければここを中心に開く。
 * 出発駅は設定しない（位置情報が無いのに「最寄り駅」を決めると、関係ない駅が出発駅になる）。
 * 以前は横浜と新宿の中間（ほぼ武蔵小杉）だったが、初めて開いた人に分かりやすい東京駅を中心にした。
 * 座標は路線データの東京駅から取る（数値を直書きしない）。
 */
import { yamanote } from '../data/yamanote';

const tokyoStation = yamanote.find(s => s.name === '東京');
if (!tokyoStation) throw new Error('山手線データに東京駅が無い');

/** 位置情報が無いときの地図の中心（東京駅） */
export const DEFAULT_MAP_CENTER: [number, number] = [tokyoStation.lat, tokyoStation.lng];
