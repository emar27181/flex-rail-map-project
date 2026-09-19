import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeftRight, Clock, Waypoints, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { routes } from '../data/routes';
import type { Station } from '../data/yamanote';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateStation, translateUI } from '../utils/translation'
import type { Language } from '../utils/translation';
import { stationReadings, normalizeToHiragana, hiraganaToRomaji, normalizeRomajiForMatch } from '../utils/stationReadings';
import { findNearestStations } from '../utils/nearestStations';
import { loadStationHistory, recordStationSelection, buildSuggestions } from '../utils/stationHistory';
import type { StationHistoryEntry } from '../utils/stationHistory';
import { FS, TARGET, SEMANTIC, alphaWhite } from '../constants/ui';
import { L } from './legend/legendStyles';
import Button from './ui/atoms/Button';
import IconButton from './ui/atoms/IconButton';
import { FLOATING_ICON_BUTTON_SIZE } from './ui/atoms/controlSize';
import TrainStatusPanel from './TrainStatusPanel';
import type { DetectedRoute } from '../utils/trainDetector';
import TextField from './ui/atoms/TextField';

/** 駅名検索の結果として出す最大件数 */
const STATION_SUGGESTION_LIMIT = 10;
const SUGGESTION_FREQUENT_COUNT = 3;
const SUGGESTION_NEARBY_COUNT = 2;
const SUGGESTION_HEAD_COUNT = SUGGESTION_NEARBY_COUNT + SUGGESTION_FREQUENT_COUNT;
const NEARBY_STATION_COUNT = STATION_SUGGESTION_LIMIT;

interface StationSelectorProps {
  onDepartureChange: (station: Station | null) => void;
  onArrivalChange: (station: Station | null) => void;
  departure: Station | null;
  arrival: Station | null;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  language?: Language;
  departureTime?: string;
  onDepartureTimeChange?: (time: string) => void;
  onSetNearestDeparture?: () => void;
  onSearchingChange?: (isSearching: boolean) => void;
  detectedRoute?: DetectedRoute | null;
  manualTrainRoute?: DetectedRoute | null;
  onManualTrainRouteChange?: (route: DetectedRoute | null) => void;
  userLocation?: [number, number] | null;
  hasGps?: boolean;
  showTrainStatusPanel?: boolean;
  locationError?: 'denied' | 'unavailable' | 'timeout' | null;
  onRetryLocation?: () => void;
  showTravelTime?: boolean;
  onShowTravelTimeChange?: (value: boolean) => void;
  showTransferStationsOnly?: boolean;
  onShowTransferStationsOnlyChange?: (value: boolean) => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({ onDepartureChange,onArrivalChange,departure,arrival,isExpanded=true,onToggleExpanded,language='japanese',departureTime,onDepartureTimeChange,onSetNearestDeparture,onSearchingChange,detectedRoute=null,manualTrainRoute=null,onManualTrainRouteChange,userLocation=null,hasGps=false,showTrainStatusPanel=false,locationError=null,onRetryLocation,showTravelTime=false,onShowTravelTimeChange,showTransferStationsOnly=false,onShowTransferStationsOnlyChange }) => {
  const { theme } = useTheme(); const colors=getThemeColors(theme);
  const [departureSearch,setDepartureSearch]=useState(''); const [arrivalSearch,setArrivalSearch]=useState(''); const [showDepartureResults,setShowDepartureResults]=useState(false); const [showArrivalResults,setShowArrivalResults]=useState(false); const [departureDropdownPos,setDepartureDropdownPos]=useState<{top:number;left:number;width:number}|null>(null); const [arrivalDropdownPos,setArrivalDropdownPos]=useState<{top:number;left:number;width:number}|null>(null);
  const departureRef=useRef<HTMLDivElement>(null); const arrivalRef=useRef<HTMLDivElement>(null); const departurePortalRef=useRef<HTMLDivElement>(null); const arrivalPortalRef=useRef<HTMLDivElement>(null); const departureClickedRef=useRef(false); const arrivalClickedRef=useRef(false); const focusedInputRef=useRef<HTMLInputElement|null>(null);
  const [stationHistory,setStationHistory]=useState<StationHistoryEntry[]>([]); useEffect(()=>{setStationHistory(loadStationHistory());},[]);
  useEffect(()=>{const f=(event:MouseEvent)=>{const target=event.target as Node;if(departureRef.current&&!departureRef.current.contains(target)&&!departurePortalRef.current?.contains(target))setShowDepartureResults(false);if(arrivalRef.current&&!arrivalRef.current.contains(target)&&!arrivalPortalRef.current?.contains(target))setShowArrivalResults(false);};document.addEventListener('mousedown',f);return()=>document.removeEventListener('mousedown',f);},[]);
  useEffect(()=>{if(departure)setDepartureSearch(translateStation(departure.name,language));if(arrival)setArrivalSearch(translateStation(arrival.name,language));},[language,departure,arrival]);
  const allStations=useMemo(()=>{const m=new Map<string,Station>();Object.values(routes).forEach(rs=>rs.forEach(s=>{if(!m.has(s.name))m.set(s.name,s);}));return Array.from(m.values()).sort((a,b)=>(stationReadings[a.name]??'￿'+a.name).localeCompare(stationReadings[b.name]??'￿'+b.name,'ja'));},[]);
  const majorStations=useMemo(()=>{const c=new Map<string,number>();for(const list of Object.values(routes))for(const st of list as Station[])c.set(st.name,(c.get(st.name)??0)+1);return[...allStations].sort((a,b)=>(c.get(b.name)??0)-(c.get(a.name)??0)).slice(0,STATION_SUGGESTION_LIMIT*3);},[allStations]);
  const nearbyStations=useMemo(()=>userLocation?findNearestStations(allStations,userLocation[0],userLocation[1],NEARBY_STATION_COUNT):null,[allStations,userLocation]);
  function filterStations(search:string,empty:Station[]=majorStations){if(!search)return empty;const term=normalizeToHiragana(search.toLowerCase());const termRomaji=normalizeRomajiForMatch(hiraganaToRomaji(term));return allStations.filter(s=>{const r=stationReadings[s.name]??'';const n=normalizeToHiragana(s.name.toLowerCase());const en=translateStation(s.name,'english').toLowerCase();return r.includes(term)||n.includes(term)||en.includes(term)||(termRomaji.length>0&&normalizeRomajiForMatch(en).includes(termRomaji));}).slice(0,STATION_SUGGESTION_LIMIT);}
  const findStationByName=useMemo(()=>{const m=new Map(allStations.map(s=>[s.name,s]));return(name:string)=>m.get(name);},[allStations]);
  const buildEmpty=(useNearby:boolean)=>{const nearby=useNearby?(nearbyStations??[]):[];const head=buildSuggestions(nearby,stationHistory,majorStations,findStationByName,{nearbyCount:useNearby?SUGGESTION_NEARBY_COUNT:0,frequentCount:SUGGESTION_FREQUENT_COUNT,total:SUGGESTION_HEAD_COUNT});const seen=new Set(head.map(s=>s.name));const rest:Station[]=[];for(const s of [...nearby,...majorStations]){if(head.length+rest.length>=STATION_SUGGESTION_LIMIT)break;if(!seen.has(s.name)){seen.add(s.name);rest.push(s);}}return[...head,...rest];};
  const depSug=useMemo(()=>buildEmpty(true),[nearbyStations,stationHistory,majorStations,findStationByName]); const arrSug=useMemo(()=>buildEmpty(false),[nearbyStations,stationHistory,majorStations,findStationByName]); const filteredDep=useMemo(()=>filterStations(departureSearch,depSug),[departureSearch,depSug]); const filteredArr=useMemo(()=>filterStations(arrivalSearch,arrSug),[arrivalSearch,arrSug]);
  const selectDep=(s:Station)=>{departureClickedRef.current=true;onDepartureChange(s);setDepartureSearch(translateStation(s.name,language));setShowDepartureResults(false);setStationHistory(recordStationSelection(s.name));}; const selectArr=(s:Station)=>{arrivalClickedRef.current=true;onArrivalChange(s);setArrivalSearch(translateStation(s.name,language));setShowArrivalResults(false);setStationHistory(recordStationSelection(s.name));};
  const exact=(q:string)=>allStations.find(s=>s.name.toLowerCase()===q.toLowerCase().trim()||translateStation(s.name,'english').toLowerCase()===q.toLowerCase().trim())??null;
  const stopTouchPropagation=(e:React.TouchEvent)=>e.stopPropagation();
  const renderDropdown=(items:Station[],pos:{top:number;left:number;width:number}|null,portalRef:React.RefObject<HTMLDivElement|null>,onSelect:(s:Station)=>void,search:string)=>(pos&&createPortal(<div ref={portalRef} onMouseDown={e=>e.preventDefault()} onTouchStart={e=>e.stopPropagation()} style={{position:'fixed',top:pos.top,left:pos.left,width:pos.width,backgroundColor:colors.surfaceElevated,border:`1px solid ${colors.border}`,borderRadius:L.r.control,boxShadow:`0 4px 12px ${colors.shadow}`,maxHeight:'240px',overflowY:'auto',overscrollBehavior:'contain',touchAction:'pan-y',zIndex:99999}}>{items.map((s,i)=><div key={`${s.name}-${i}`} onClick={()=>onSelect(s)} style={{padding:`${L.sp.md} ${L.sp.xl}`,cursor:'pointer',borderBottom:i<items.length-1?`1px solid ${colors.borderLight}`:'none',fontSize:FS.body}}>{translateStation(s.name,language)}</div>)}{items.length===0&&<div style={{padding:`${L.sp.md} ${L.sp.xl}`,color:colors.textSecondary}}>{search?translateUI('noStationFound',language):translateUI('majorStationsHint',language)}</div>}</div>,document.body));
  const field=(kind:'dep'|'arr')=>{const isDep=kind==='dep';const value=isDep?departureSearch:arrivalSearch;const selected=isDep?departure:arrival;const setValue=isDep?setDepartureSearch:setArrivalSearch;const setShow=isDep?setShowDepartureResults:setShowArrivalResults;const setPos=isDep?setDepartureDropdownPos:setArrivalDropdownPos;const ref=isDep?departureRef:arrivalRef;const semantic=isDep?SEMANTIC.departure:SEMANTIC.arrival;return <div ref={ref} style={{flex:'1 1 0',minWidth:0,position:'relative'}}><label style={{display:'block',marginBottom:L.sp.xs,fontWeight:'bold',color:colors.textSecondary,fontSize:FS.caption}}>{translateUI(isDep?'departureStation':'arrivalStation',language)}</label><div style={{position:'relative'}}><TextField theme={theme} size="sm" value={value} onChange={e=>{setValue(e.target.value);setShow(true);}} onFocus={e=>{focusedInputRef.current=e.currentTarget;const r=e.currentTarget.getBoundingClientRect();setPos({top:r.bottom+2,left:r.left,width:r.width});setShow(true);onSearchingChange?.(true);}} onBlur={()=>{setTimeout(()=>{const s=exact(value);if(s)(isDep?selectDep:selectArr)(s);setShow(false);},200);onSearchingChange?.(false);}} placeholder={selected?translateStation(selected.name,language):translateUI('stationPlaceholder',language)} className="station-input-filled" styleOverride={{paddingRight:L.sp['3xl'],border:`2px solid ${semantic}`,backgroundColor:semantic,color:colors.onPrimary}}/>{selected&&<IconButton theme={theme} size="sm" onClick={()=>{isDep?onDepartureChange(null):onArrivalChange(null);setValue('');}} label={translateUI('clearSelection',language)} icon={<X size={14}/>} styleOverride={{position:'absolute',right:'2px',top:'50%',transform:'translateY(-50%)',color:alphaWhite(.9)}}/>}</div>{isDep&&showDepartureResults&&renderDropdown(filteredDep,departureDropdownPos,departurePortalRef,selectDep,departureSearch)}{!isDep&&showArrivalResults&&renderDropdown(filteredArr,arrivalDropdownPos,arrivalPortalRef,selectArr,arrivalSearch)}</div>;};
  return <div onTouchStart={stopTouchPropagation} onTouchMove={stopTouchPropagation} onTouchEnd={stopTouchPropagation} style={{marginBottom:L.sp.md,padding:isExpanded?L.sp.md:0,height:isExpanded?'auto':FLOATING_ICON_BUTTON_SIZE.md,display:'flex',flexDirection:'column',justifyContent:isExpanded?'flex-start':'center',boxSizing:'border-box',overflow:(showDepartureResults||showArrivalResults)?'visible':'hidden',border:`1px solid ${colors.border}`,borderRadius:L.r.card,backgroundColor:isExpanded?colors.glassOpen:colors.glassCollapsed,boxShadow:`0 2px 8px ${colors.shadow}`,backdropFilter:'blur(10px)'}}><div onClick={onToggleExpanded} style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:onToggleExpanded?'pointer':'default',marginBottom:isExpanded?'6px':0}}><h3 style={{margin:0,color:colors.text,fontSize:FS.title,fontWeight:'bold'}}>{translateUI('stationSelection',language)}</h3>{onToggleExpanded&&<span style={{fontSize:FS.caption,color:colors.textSecondary,transform:isExpanded?'rotate(180deg)':'none'}}>▼</span>}</div>{isExpanded&&<><div style={{display:'flex',gap:L.sp.xs,alignItems:'flex-start'}}>{field('dep')}<div style={{paddingTop:'21px'}}><IconButton theme={theme} size="sm" onClick={()=>{const d=departure,a=arrival;onDepartureChange(a);onArrivalChange(d);}} label={translateUI('swapStationsTitle',language)} icon={<ArrowLeftRight size={14}/>}/></div>{field('arr')}</div>
  {departure&&arrival&&onDepartureTimeChange&&<div style={{marginTop:L.sp.md,display:'flex',alignItems:'center',gap:L.sp.xs,flexWrap:'wrap'}}><label style={{fontSize:FS.caption,fontWeight:'bold',color:colors.textSecondary,whiteSpace:'nowrap'}}>{translateUI('departureTime',language)}</label><TextField theme={theme} size="sm" type="time" value={departureTime??''} onChange={e=>onDepartureTimeChange(e.target.value)} fullWidth={false}/><Button theme={theme} variant="outline" size="sm" onClick={()=>{const now=new Date();onDepartureTimeChange(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`);}}>{translateUI('currentTime',language)}</Button></div>}
  {showTrainStatusPanel&&hasGps&&onManualTrainRouteChange&&<TrainStatusPanel detectedRoute={detectedRoute} manualRoute={manualTrainRoute} onManualRouteChange={onManualTrainRouteChange} userLocation={userLocation} hasGps={hasGps} language={language}/>}<div style={{marginTop:L.sp.md,display:'flex',alignItems:'center',gap:L.sp.md,flexWrap:'wrap'}}>{onSetNearestDeparture&&<Button theme={theme} variant="positive" size="sm" onClick={onSetNearestDeparture}>{translateUI('currentLocationFrom',language)}</Button>}{onShowTravelTimeChange&&<Button theme={theme} variant="primary" size="sm" pressed={showTravelTime} onClick={()=>onShowTravelTimeChange(!showTravelTime)} icon={<Clock size={14}/>}>{translateUI('showTravelTimes',language)}</Button>}{onShowTransferStationsOnlyChange&&<Button theme={theme} variant="primary" size="sm" pressed={showTransferStationsOnly} onClick={()=>onShowTransferStationsOnlyChange(!showTransferStationsOnly)} icon={<Waypoints size={14}/>}>{translateUI('showOnlyTransferStations',language)}</Button>}</div></>}</div>;
};
export default StationSelector;
