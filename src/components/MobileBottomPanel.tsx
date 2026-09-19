/**
 * MobileBottomPanel
 * Mobile fullscreen app footer + contextual bottom sheet.
 * Only real, connected actions are rendered: no disabled placeholder tabs.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, TrainFront, X } from 'lucide-react';
import { getThemeColors } from '../contexts/ThemeContext';
import IconButton from './ui/atoms/IconButton';
import { L } from './legend/legendStyles';

const NAV_H = 58;
const POPOVER_MAX_W = 420;
const POPOVER_MAX_H = '68dvh';
const POPOVER_MIN_H = 140;
const Z_BACKDROP = 10000;
const Z_NAV = 10001;
const Z_POPOVER = 10002;

export type PopoverKey = 'station' | 'location' | 'routes' | 'settings';
export interface FloatingButtonDef { key: PopoverKey; icon?: React.ReactNode; label: string; content: React.ReactNode; onPress?: () => void; }
export interface MobileBottomPanelProps { buttons: FloatingButtonDef[]; theme: 'light' | 'dark'; safeAreaBottom?: number; }

const defaultIcon = (key: PopoverKey) => key === 'routes'
  ? <TrainFront size={21} />
  : <SlidersHorizontal size={21} />;

const shortLabel = (button: FloatingButtonDef) => {
  if (button.key === 'routes') return '経路';
  if (button.key === 'settings') return '表示';
  return button.label;
};

const MobileBottomPanel: React.FC<MobileBottomPanelProps> = ({ buttons, theme }) => {
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

  const active = buttons.find(b => b.key === openKey);
  const columns = Math.max(buttons.length, 1);

  return <>
    {openKey && <div onClick={close} style={{ position:'fixed', inset:0, zIndex:Z_BACKDROP, background:'rgba(0,0,0,.10)' }} />}
    {active && <div ref={popoverRef} role="dialog" aria-label={active.label} style={{
      position:'fixed', left:10, right:10, bottom:`calc(${NAV_H}px + env(safe-area-inset-bottom, 0px) + 8px)`,
      width:`min(${POPOVER_MAX_W}px, calc(100vw - 20px))`, margin:'0 auto',
      ...(panelHeight ? {height:panelHeight} : {maxHeight:POPOVER_MAX_H}), zIndex:Z_POPOVER,
      backgroundColor:colors.glassOpen, backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)',
      border:`1px solid ${colors.border}`, borderRadius:18, boxShadow:`0 12px 40px ${colors.shadow}`,
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
      position:'fixed',left:0,right:0,bottom:0,minHeight:NAV_H,zIndex:Z_NAV,
      display:'grid',gridTemplateColumns:`repeat(${columns}, minmax(0, 1fr))`,
      padding:`4px max(16px, env(safe-area-inset-left, 0px)) calc(4px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-right, 0px))`,
      borderTop:`1px solid ${colors.border}`,backgroundColor:colors.glassOpen,
      backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',boxShadow:`0 -3px 14px ${colors.shadow}`
    }}>
      {buttons.map(button => {
        const selected = openKey === button.key;
        return <button key={button.key} type="button" onClick={()=>press(button)}
          aria-label={button.label} aria-expanded={selected} style={{
          minHeight:50,border:0,borderRadius:12,background:selected?'rgba(33,150,243,.12)':'transparent',
          color:selected?'#2196f3':colors.textSecondary,
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,
          font:'inherit',fontSize:10,fontWeight:selected?700:600,cursor:'pointer',WebkitTapHighlightColor:'transparent'
        }}>
          <span style={{height:22,display:'flex',alignItems:'center'}}>{button.icon || defaultIcon(button.key)}</span>
          <span>{shortLabel(button)}</span>
        </button>;
      })}
    </nav>
  </>;
};
export default MobileBottomPanel;
