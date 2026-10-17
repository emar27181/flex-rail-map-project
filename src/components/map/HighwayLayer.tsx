import React, { useEffect, useState } from 'react';
import { Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import { HIGHWAY_ROUTES, HIGHWAY_SOURCE, highwayQuery } from '../../data/highwayRoutes';
import { useTheme, getThemeColors } from '../../contexts/ThemeContext';

type HighwayWay = { type: string; id: number; tags?: Record<string,string>; geometry?: {lat:number;lon:number}[]; lat?:number;lon?:number };
export default function HighwayLayer({ visible }: {visible: ReadonlySet<string>}) {
  const [items,setItems] = useState<HighwayWay[]>([]);
  const {theme}=useTheme();
  const colors=getThemeColors(theme);
  useEffect(() => {
    const controller = new AbortController();
    fetch(HIGHWAY_SOURCE.endpoint, { method:'POST', body:new URLSearchParams({data:highwayQuery()}),signal:controller.signal })
      .then(r => {if(!r.ok) throw new Error('Overpass '+r.status);return r.json()})
      .then(data => {if(!controller.signal.aborted) setItems(Array.isArray(data.elements)?data.elements:[])})
      .catch(e => {if(!controller.signal.aborted) console.warn('Highway demo data unavailable',e)});
    return () => controller.abort();
  },[]);
  return <>
    {HIGHWAY_ROUTES.filter(route=>visible.has(route.id)).flatMap(route =>
      items.filter(item=>item.type==='way' && item.geometry?.length && route.aliases.some(name=>(item.tags?.name||'').includes(name)))
        .map(item=><Polyline key={route.id+'-'+item.id} positions={item.geometry!.map(p=>[p.lat,p.lon])} pathOptions={{color:route.color,weight:4,opacity:.85}}><Tooltip>{route.name}</Tooltip></Polyline>)
    )}
    {items.filter(item=>item.type==='node' && item.tags?.highway==='motorway_junction' && item.lat!==undefined && item.lon!==undefined).map(item=>
      <CircleMarker key={'junction-'+item.id} center={[item.lat!,item.lon!]} radius={3} pathOptions={{color:colors.border,fillColor:colors.text,fillOpacity:.9}}><Tooltip>{item.tags?.name || 'IC / JCT'}</Tooltip></CircleMarker>
    )}
  </>;
}
