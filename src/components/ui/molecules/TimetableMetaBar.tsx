import React from 'react';
import { CalendarDays } from 'lucide-react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import type { Language } from '../../../utils/translation';
import { translateUI } from '../../../utils/translation';
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';

export type TimetableDayType = 'weekday' | 'holiday';
interface Props { dayType: TimetableDayType; onChange: (v: TimetableDayType) => void; updatedAt?: string; theme: 'light'|'dark'; language: Language; }
const TimetableMetaBar: React.FC<Props> = ({ dayType, onChange, updatedAt, theme, language }) => {
  const colors = getThemeColors(theme);
  return <div style={{display:'flex',alignItems:'center',gap:L.sp.sm,flexWrap:'wrap',fontSize:FS.caption,color:colors.textSecondary}}>
    <CalendarDays size={14}/>
    <span>{translateUI('displayingSchedule', language)}</span>
    <div style={{display:'inline-flex',border:`1px solid ${colors.border}`,borderRadius:L.r.control,overflow:'hidden'}}>
      {(['weekday','holiday'] as TimetableDayType[]).map(v => <button key={v} type="button" onClick={()=>onChange(v)} aria-pressed={dayType===v} style={{border:0,padding:`${L.sp.xxs} ${L.sp.sm}`,background:dayType===v?colors.surfaceElevated:'transparent',color:dayType===v?colors.primary:colors.textSecondary,font:'inherit',fontWeight:dayType===v?700:500}}>{translateUI(v==='weekday'?'weekdaySchedule':'holidaySchedule', language)}</button>)}
    </div>
    {updatedAt && <span style={{marginLeft:'auto'}}>{translateUI('timetableUpdatedAt', language, {date:updatedAt})}</span>}
  </div>;
};
export default TimetableMetaBar;
