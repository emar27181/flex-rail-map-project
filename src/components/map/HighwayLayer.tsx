import React, { useEffect, useState } from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';
import TransportRouteLine, { HIGHWAY_DEMO_LINE_WIDTH } from './TransportRouteLine';
import { HIGHWAY_ROUTES, HIGHWAY_SOURCE, highwayQuery } from '../../data/highwayRoutes';
import { useTheme, getThemeColors } from '../../contexts/ThemeContext';

type HighwayWay = { type: string; id: number; tags?: Record<string,string>; geometry?: {lat:number;lon:number}[]; lat?:number;lon?:number };
export default function HighwayLayer({ visible }: {visible: ReadonlySet<string>}) {
  const [items,setItems] = useState<HighwayWay[]>([]);
  const [loadStatus,setLoadStatus] = useState<'loading'|'ready'|'error'>('loading');
  const {theme}=useTheme();
  const colors=getThemeColors(theme);
  useEffect(() => {
    const controller = new AbortController();
    fetch(HIGHWAY_SOURCE.endpoint, { method:'POST', body:new URLSearchParams({data:highwayQuery()}),signal:controller.signal })
      .then(r => {if(!r.ok) throw new Error('Overpass '+r.status);return r.json()})
      .then(data => {if(!controller.signal.aborted) {setItems(Array.isArray(data.elements)?data.elements:[]);setLoadStatus('ready')}})
      .catch(e => {if(!controller.signal.aborted) {setLoadStatus('error');console.warn('Highway demo data unavailable',e)}});
    return () => controller.abort();
  },[]);
  return <>
    {loadStatus !== 'ready' && <div style={{position:'absolute',top:12,left:12,zIndex:1000,padding:12,background:colors.background,color:colors.text,border:`1px solid ${colors.border}`,borderRadius:8,pointerEvents:'none'}} role="status">{loadStatus==='loading'?'高速道路データを取得中…':'高速道路データの取得に失敗しました。時間をおいて再読み込みしてください。'}</div>}
    {loadStatus==='ready' && items.filter(item=>item.type==='way').length===0 && <div role="status" style={{position:'absolute',top:12,left:12,zIndex:1000,padding:12,background:colors.background,color:colors.text}}>対象範囲に道路データがありません</div>}
    {HIGHWAY_ROUTES.filter(route=>visible.has(route.id)).flatMap(route =>
      items.filter(item=>item.type==='way' && item.geometry?.length && route.aliases.some(name=>(item.tags?.name||'').includes(name)))
        .map(item=><React.Fragment key={route.id+'-'+item.id}><TransportRouteLine positions={item.geometry!.map(p=>[p.lat,p.lon])} color={route.color} width={HIGHWAY_DEMO_LINE_WIDTH}/></React.Fragment>)
    )}
    {items.filter(item=>item.type==='node' && item.tags?.highway==='motorway_junction' && item.lat!==undefined && item.lon!==undefined).map(item=>
      <CircleMarker key={'junction-'+item.id} center={[item.lat!,item.lon!]} radius={3} pathOptions={{color:colors.border,fillColor:colors.text,fillOpacity:.9}}><Tooltip>{item.tags?.name || 'IC / JCT'}</Tooltip></CircleMarker>
    )}
  </>;
}
