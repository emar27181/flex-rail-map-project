/** Mobile bottom navigation + edge-to-edge sheet. */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Layers3, Settings, TrainFront, X } from 'lucide-react';
import { getThemeColors } from '../contexts/ThemeContext';
import IconButton from './ui/atoms/IconButton';
import { L } from './legend/legendStyles';

const NAV_H = 60;
const POPOVER_MAX_H = '68dvh';
const POPOVER_MIN_H = 140;
const Z_BACKDROP = 10000;
const Z_NAV = 10001;
const Z_POPOVER = 10002;

export type PopoverKey = 'routes' | 'display' | 'settings';
export interface FloatingButtonDef { key: PopoverKey; icon?: React.ReactNode; label: string; content: React.ReactNode; onPress?: () => void; badge?: number; }
export interface MobileBottomPanelProps { buttons: FloatingButtonDef[]; theme: 'light' | 'dark'; safeAreaBottom?: number; }
const meta: Record<PopoverKey,{label:string;icon:React.ReactNode}>={routes:{label:'経路',icon:<TrainFront size={21}/>},display:{label:'表示',icon:<Layers3 size={21}/>},settings:{label:'設定',icon:<Settings size={21}/>}};

const MobileBottomPanel:React.FC<MobileBottomPanelProps>=({buttons,theme})=>{
 const colors=getThemeColors(theme); const [openKey,setOpenKey]=useState<PopoverKey|null>(null); const [panelHeight,setPanelHeight]=useState<number|null>(null); const scrollRef=useRef<HTMLDivElement>(null); const popoverRef=useRef<HTMLDivElement>(null); const dragStartRef=useRef<{startY:number;startH:number}|null>(null);
 useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=0;},[openKey]); const close=useCallback(()=>setOpenKey(null),[]);
 const provided=new Map(buttons.map(b=>[b.key,b]));
 const orderedButtons:FloatingButtonDef[]=(['routes','display','settings'] as const).map(key=>provided.get(key)??{key,label:meta[key].label,content:<p style={{margin:0,color:colors.textSecondary}}>{key==='routes'?'出発駅と到着駅を設定してください。':'設定項目はありません。'}</p>});
 const active=orderedButtons.find(b=>b.key===openKey);
 const press=useCallback((b:FloatingButtonDef)=>{if(b.onPress){b.onPress();setOpenKey(null);return;}setPanelHeight(null);setOpenKey(p=>p===b.key?null:b.key);},[]);
 const dragStart=useCallback((e:React.TouchEvent)=>{const el=popoverRef.current;if(el)dragStartRef.current={startY:e.touches[0].clientY,startH:el.getBoundingClientRect().height};},[]);
 const dragMove=useCallback((e:React.TouchEvent)=>{if(!dragStartRef.current)return;const d=dragStartRef.current.startY-e.touches[0].clientY;setPanelHeight(Math.max(POPOVER_MIN_H,Math.min(window.innerHeight*.9,dragStartRef.current.startH+d)));},[]);
 return <>{openKey&&<div aria-hidden onClick={close} style={{position:'fixed',inset:0,zIndex:Z_BACKDROP,background:'rgba(0,0,0,.10)'}}/>}{active&&<section ref={popoverRef} role="dialog" aria-label={meta[active.key].label} style={{position:'fixed',left:0,right:0,bottom:`calc(${NAV_H}px + env(safe-area-inset-bottom, 0px))`,width:'100%',boxSizing:'border-box',...(panelHeight?{height:panelHeight}:{maxHeight:POPOVER_MAX_H}),zIndex:Z_POPOVER,backgroundColor:colors.glassOpen,backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',borderTop:`1px solid ${colors.border}`,borderLeft:0,borderRight:0,borderBottom:0,borderRadius:'18px 18px 0 0',boxShadow:`0 -8px 32px ${colors.shadow}`,display:'flex',flexDirection:'column',overflow:'hidden'}}><div onTouchStart={dragStart} onTouchMove={dragMove} onTouchEnd={()=>{dragStartRef.current=null;}} style={{display:'flex',justifyContent:'center',padding:'10px 0 6px',touchAction:'none'}}><div style={{width:38,height:4,borderRadius:99,backgroundColor:colors.border}}/></div><header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:`${L.sp.sm} ${L.sp['2xl']} ${L.sp.md}`,borderBottom:`1px solid ${colors.border}`}}><strong style={{display:'flex',alignItems:'center',gap:8,color:colors.text,fontSize:15}}>{active.icon||meta[active.key].icon}{meta[active.key].label}</strong><IconButton theme={theme} size="sm" onClick={close} label="閉じる" icon={<X size={18}/>}/></header><div ref={scrollRef} style={{flex:1,minHeight:0,overflowY:'auto',padding:`${L.sp.lg} ${L.sp['2xl']}`,overscrollBehavior:'contain'}}>{active.content}</div></section>}
 <nav aria-label="メイン操作" style={{position:'fixed',left:0,right:0,bottom:0,minHeight:NAV_H,zIndex:Z_NAV,display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',padding:`4px max(16px,env(safe-area-inset-left,0px)) calc(4px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-right,0px))`,borderTop:`1px solid ${colors.border}`,backgroundColor:colors.glassOpen,backdropFilter:'blur(20px)',boxShadow:`0 -3px 14px ${colors.shadow}`}}>{orderedButtons.map(b=>{const selected=openKey===b.key;const item=meta[b.key];return <button key={b.key} type="button" onClick={()=>press(b)} aria-label={item.label} aria-expanded={selected} style={{position:'relative',minHeight:50,border:0,borderRadius:12,background:selected?colors.surface:'transparent',color:selected?colors.primary:colors.textSecondary,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,font:'inherit',fontSize:10,fontWeight:selected?700:600,cursor:'pointer'}}><span style={{height:22,display:'flex',alignItems:'center'}}>{b.icon||item.icon}</span><span>{item.label}</span>{!!b.badge&&b.badge>0&&<span style={{position:'absolute',top:3,left:'calc(50% + 8px)',minWidth:16,height:16,borderRadius:999,background:colors.primary,color:colors.onPrimary,fontSize:9}}>{b.badge}</span>}</button>})}</nav></>;
};
export default MobileBottomPanel;
