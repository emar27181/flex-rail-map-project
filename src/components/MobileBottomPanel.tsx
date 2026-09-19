/**
 * MobileBottomPanel
 * Mobile footer for the map. Three stable destinations are always rendered:
 * route, display and settings. Existing panel content is reused until the
 * legacy settings body is split into dedicated organisms.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Layers3, Settings, TrainFront, X } from 'lucide-react';
import { getThemeColors } from '../contexts/ThemeContext';
import IconButton from './ui/atoms/IconButton';
import { L } from './legend/legendStyles';

const NAV_H = 60;
const POPOVER_MAX_W = 440;
const POPOVER_MAX_H = '68dvh';
const POPOVER_MIN_H = 140;
const Z_BACKDROP = 10000;
const Z_NAV = 10001;
const Z_POPOVER = 10002;

export type PopoverKey = 'routes' | 'display' | 'settings';
export interface FloatingButtonDef { key: PopoverKey; icon?: React.ReactNode; label: string; content: React.ReactNode; onPress?: () => void; badge?: number; }
export interface MobileBottomPanelProps { buttons: FloatingButtonDef[]; theme: 'light' | 'dark'; safeAreaBottom?: number; }

const meta: Record<PopoverKey, { label: string; icon: React.ReactNode }> = {
  routes: { label: '経路', icon: <TrainFront size={21} /> },
  display: { label: '表示', icon: <Layers3 size={21} /> },
  settings: { label: '設定', icon: <Settings size={21} /> },
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

  // RailwayMap still provides the legacy `settings` body. Keep the footer IA
  // stable in preview while that body is being separated into display/settings.
  const provided = new Map(buttons.map(button => [button.key, button]));
  const legacyBody = provided.get('settings')?.content ?? provided.get('display')?.content;
  const orderedButtons: FloatingButtonDef[] = (['routes', 'display', 'settings'] as const).map(key => {
    const existing = provided.get(key);
    if (existing) return existing;
    if (key === 'routes') {
      return { key, label: meta[key].label, content: <p style={{ margin: 0, color: colors.textSecondary }}>出発駅と到着駅を選ぶと、ここに候補経路を表示します。</p> };
    }
    return { key, label: meta[key].label, content: legacyBody ?? <p style={{ margin: 0, color: colors.textSecondary }}>設定項目を準備中です。</p> };
  });

  const active = orderedButtons.find(button => button.key === openKey);
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

  return <>
    {openKey && <div aria-hidden onClick={close} style={{ position:'fixed', inset:0, zIndex:Z_BACKDROP, background:'rgba(0,0,0,.10)' }} />}
    {active && <section ref={popoverRef} role="dialog" aria-label={meta[active.key].label} style={{
      position:'fixed', left:10, right:10, bottom:`calc(${NAV_H}px + env(safe-area-inset-bottom, 0px) + 8px)`,
      width:`min(${POPOVER_MAX_W}px, calc(100vw - 20px))`, margin:'0 auto', ...(panelHeight ? {height:panelHeight}:{maxHeight:POPOVER_MAX_H}),
      zIndex:Z_POPOVER, backgroundColor:colors.glassOpen, backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)',
      border:`1px solid ${colors.border}`, borderRadius:18, boxShadow:`0 12px 40px ${colors.shadow}`, display:'flex', flexDirection:'column', overflow:'hidden'
    }}>
      <div onTouchStart={dragStart} onTouchMove={dragMove} onTouchEnd={()=>{dragStartRef.current=null;}} style={{display:'flex',justifyContent:'center',padding:'10px 0 6px',touchAction:'none'}}>
        <div style={{width:38,height:4,borderRadius:99,backgroundColor:colors.border}} />
      </div>
      <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:`${L.sp.sm} ${L.sp['2xl']} ${L.sp.md}`,borderBottom:`1px solid ${colors.border}`}}>
        <strong style={{display:'flex',alignItems:'center',gap:8,color:colors.text,fontSize:15}}>{active.icon || meta[active.key].icon}{meta[active.key].label}</strong>
        <IconButton theme={theme} size="sm" onClick={close} label="閉じる" icon={<X size={18}/>} />
      </header>
      <div ref={scrollRef} style={{flex:1,minHeight:0,overflowY:'auto',padding:`${L.sp.lg} ${L.sp['2xl']}`,overscrollBehavior:'contain'}}>{active.content}</div>
    </section>}

    <nav aria-label="メイン操作" style={{
      position:'fixed',left:0,right:0,bottom:0,minHeight:NAV_H,zIndex:Z_NAV,display:'grid',gridTemplateColumns:'repeat(3, minmax(0, 1fr))',
      padding:`4px max(16px, env(safe-area-inset-left, 0px)) calc(4px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-right, 0px))`,
      borderTop:`1px solid ${colors.border}`,backgroundColor:colors.glassOpen,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',boxShadow:`0 -3px 14px ${colors.shadow}`
    }}>
      {orderedButtons.map(button => {
        const selected=openKey===button.key; const item=meta[button.key];
        return <button key={button.key} type="button" onClick={()=>press(button)} aria-label={item.label} aria-expanded={selected} style={{
          position:'relative',minHeight:50,border:0,borderRadius:12,background:selected?colors.surface:'transparent',color:selected?colors.primary:colors.textSecondary,
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,font:'inherit',fontSize:10,fontWeight:selected?700:600,cursor:'pointer',WebkitTapHighlightColor:'transparent'
        }}>
          <span style={{height:22,display:'flex',alignItems:'center'}}>{button.icon || item.icon}</span><span>{item.label}</span>
          {!!button.badge && button.badge>0 && <span style={{position:'absolute',top:3,left:'calc(50% + 8px)',minWidth:16,height:16,padding:'0 4px',borderRadius:999,background:colors.primary,color:colors.onPrimary,fontSize:9,fontWeight:700,lineHeight:'16px',textAlign:'center'}}>{button.badge}</span>}
        </button>;
      })}
    </nav>
  </>;
};
export default MobileBottomPanel;
