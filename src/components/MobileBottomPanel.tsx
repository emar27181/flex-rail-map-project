/**
 * MobileBottomPanel
 * Mobile fullscreen app footer + contextual bottom sheet.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LocateFixed, Search, SlidersHorizontal, TrainFront, X } from 'lucide-react';
import { getThemeColors } from '../contexts/ThemeContext';
import IconButton from './ui/atoms/IconButton';
import { L } from './legend/legendStyles';

const NAV_H = 66;
const NAV_MARGIN = 10;
const POPOVER_MAX_W = 420;
const POPOVER_MAX_H = '68dvh';
const POPOVER_MIN_H = 140;
const Z_BACKDROP = 10000;
const Z_NAV = 10001;
const Z_POPOVER = 10002;

export type PopoverKey = 'station' | 'location' | 'routes' | 'settings';
export interface FloatingButtonDef { key: PopoverKey; icon?: React.ReactNode; label: string; content: React.ReactNode; onPress?: () => void; }
export interface MobileBottomPanelProps { buttons: FloatingButtonDef[]; theme: 'light' | 'dark'; safeAreaBottom?: number; }

const defaultIcon = (key: PopoverKey) => {
  switch (key) {
    case 'station': return <Search size={21} />;
    case 'location': return <LocateFixed size={21} />;
    case 'routes': return <TrainFront size={21} />;
    default: return <SlidersHorizontal size={21} />;
  }
};

const MobileBottomPanel: React.FC<MobileBottomPanelProps> = ({ buttons, theme, safeAreaBottom = 0 }) => {
  const colors = getThemeColors(theme);
  const [openKey, setOpenKey] = useState<PopoverKey | null>(null);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ startY: number; startH: number } | null>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [openKey]);
  const close = useCallback(() => setOpenKey(null), []);
  const press = useCallback((button: FloatingButtonDef) => {
    if (button.onPress) { button.onPress(); setOpenKey(null); return; }
    setPanelHeight(null);
    setOpenKey(prev => prev === button.key ? null : button.key);
  }, []);
  const dragStart = useCallback((e: React.TouchEvent) => {
    const el = popoverRef.current; if (!el) return;
    dragStartRef.current = { startY: e.touches[0].clientY, startH: el.getBoundingClientRect().height };
  }, []);
  const dragMove = useCallback((e: React.TouchEvent) => {
    if (!dragStartRef.current) return;
    const delta = dragStartRef.current.startY - e.touches[0].clientY;
    setPanelHeight(Math.max(POPOVER_MIN_H, Math.min(window.innerHeight * .9, dragStartRef.current.startH + delta)));
  }, []);

  const safeBottom = safeAreaBottom + NAV_MARGIN;
  const active = buttons.find(b => b.key === openKey);

  return <>
    {openKey && <div onClick={close} style={{ position:'fixed', inset:0, zIndex:Z_BACKDROP, background:'rgba(0,0,0,.10)' }} />}
    {active && <div ref={popoverRef} role="dialog" aria-label={active.label} style={{
      position:'fixed', left:NAV_MARGIN, right:NAV_MARGIN, bottom:safeBottom + NAV_H + 8,
      width:`min(${POPOVER_MAX_W}px, calc(100vw - ${NAV_MARGIN*2}px))`, margin:'0 auto',
      ...(panelHeight ? {height:panelHeight} : {maxHeight:POPOVER_MAX_H}), zIndex:Z_POPOVER,
      backgroundColor:colors.glassOpen, backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)',
      border:`1px solid ${colors.border}`, borderRadius:20, boxShadow:`0 12px 40px ${colors.shadow}`,
      display:'flex', flexDirection:'column', overflow:'hidden'
    }}>
      <div onTouchStart={dragStart} onTouchMove={dragMove} onTouchEnd={()=>dragStartRef.current=null}
        style={{display:'flex',justifyContent:'center',padding:'10px 0 6px',touchAction:'none'}}>
        <div style={{width:38,height:4,borderRadius:99,backgroundColor:colors.border}} />
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:`${L.sp.sm} ${L.sp['2xl']} ${L.sp.md}`,borderBottom:`1px solid ${colors.border}`}}>
        <strong style={{display:'flex',alignItems:'center',gap:8,color:colors.text,fontSize:15}}>{active.icon || defaultIcon(active.key)}{active.label}</strong>
        <IconButton theme={theme} size="sm" onClick={close} label="閉じる" icon={<X size={18}/>} />
      </div>
      <div ref={scrollRef} style={{flex:1,minHeight:0,overflowY:'auto',padding:`${L.sp.lg} ${L.sp['2xl']}`,overscrollBehavior:'contain'}}>{active.content}</div>
    </div>}

    <nav aria-label="メイン操作" style={{
      position:'fixed',left:NAV_MARGIN,right:NAV_MARGIN,bottom:safeBottom,height:NAV_H,zIndex:Z_NAV,
      maxWidth:420,margin:'0 auto',display:'grid',gridTemplateColumns:`repeat(${Math.max(buttons.length,1)}, 1fr)`,
      padding:4,borderRadius:20,border:`1px solid ${colors.border}`,backgroundColor:colors.glassOpen,
      backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',boxShadow:`0 6px 24px ${colors.shadow}`
    }}>
      {buttons.map(button => {
        const selected = openKey === button.key;
        return <button key={button.key} type="button" onClick={()=>press(button)} aria-expanded={selected} style={{
          border:0,borderRadius:16,background:selected?'rgba(33,150,243,.14)':'transparent',
          color:selected?'#2196f3':colors.textSecondary,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,
          font:'inherit',fontSize:11,fontWeight:selected?700:600,cursor:'pointer',WebkitTapHighlightColor:'transparent'
        }}>
          <span style={{height:23,display:'flex',alignItems:'center'}}>{button.icon || defaultIcon(button.key)}</span>
          <span>{button.label}</span>
        </button>;
      })}
    </nav>
  </>;
};
export default MobileBottomPanel;
