import React, { useEffect, useState } from 'react';
import { Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import { routeColors } from '../../data/routes';

export const HIGHWAY_ROUTES = [
  { id: 'tomei', name: '東名高速道路', aliases: ['東名高速道路', '東名高速'], color: routeColors.jrTokaidoMainLine },
  { id: 'chuo', name: '中央自動車道', aliases: ['中央自動車道', '中央道'], color: routeColors.chuo },
  { id: 'kanetsu', name: '関越自動車道', aliases: ['関越自動車道', '関越道'], color: routeColors.jrTakasakiLine },
] as const;
type HighwayWay = { type: string; id: number; tags?: Record<string,string>; geometry?: {lat:number;lon:number}[]; lat?:number;lon?:number };
const QUERY = '[out:json][timeout:90];(way["highway"="motorway"]["name"~"東名高速|中央自動車道|中央道|関越自動車道|関越道"](35.35,138.85,36.25,140.10);node["highway"="motorway_junction"](35.35,138.85,36.25,140.10););out geom;';
export default function HighwayLayer({ visible }: {visible: ReadonlySet<string>}) {
  const [items,setItems] = useState<HighwayWay[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch('https://overpass.kumi.systems/api/interpreter', { method:'POST', body:new URLSearchParams({data:QUERY}),signal:controller.signal })
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
      <CircleMarker key={'junction-'+item.id} center={[item.lat!,item.lon!]} radius={3} pathOptions={{color:'#ffffff',fillColor:'#f47c7c',fillOpacity:.9}}><Tooltip>{item.tags?.name || 'IC / JCT'}</Tooltip></CircleMarker>
    )}
  </>;
}
