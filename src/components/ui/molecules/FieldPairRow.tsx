/**
 * 入力欄を2つ並べる行（モレキュール）。左右の欄は同じ幅で、間に小さな区切りの列を置く。
 *
 * 駅選択パネルの「出発駅 ⇆ 到着駅」と、「集合駅を探す」で増やす出発駅の行は、**同じ幅・同じ位置**にそろえる
 * （2026-11-14 ユーザー指摘: 追加の出発駅だけ幅いっぱいで、出発駅欄と幅がちがっていた）。
 * 区切りの列の幅は入れ替えボタン（IconButton の sm）と同じ `PAIR_DIVIDER_WIDTH`。中身が無い欄・区切りも幅を取るので、
 * 欄が1つだけの行も、ほかの行と同じ半分の幅になる。
 *
 * 何の欄か（駅・路線など）は知らない。
 */
import React from 'react';
import { CONTROL_SIZE } from '../atoms/controlSize';
import { L } from '../../legend/legendStyles';

/** 区切りの列の幅（px）。入れ替えボタン（IconButton sm は正方形で、幅 = sm の高さ）と同じ定義元から取る */
export const PAIR_DIVIDER_WIDTH = CONTROL_SIZE.sm.minHeight;

export interface FieldPairRowProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  /** 区切りの列（入れ替えボタンなど）。無ければ同じ幅の空き */
  middle?: React.ReactNode;
}

const FieldPairRow: React.FC<FieldPairRowProps> = ({ left, right, middle }) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: L.sp.xs }}>
    <div style={{ flex: '1 1 0%', minWidth: 0, position: 'relative' }}>{left}</div>
    <div style={{ flex: `0 0 ${PAIR_DIVIDER_WIDTH}px`, width: PAIR_DIVIDER_WIDTH }}>{middle}</div>
    <div style={{ flex: '1 1 0%', minWidth: 0, position: 'relative' }}>{right}</div>
  </div>
);

export default FieldPairRow;
