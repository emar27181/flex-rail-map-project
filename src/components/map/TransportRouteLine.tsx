import React from 'react';
import { Polyline } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

/** Shared visual primitive for railway and highway lines. */
export const TRANSPORT_LINE_OPACITY = 0.85;
export const TRANSPORT_HOVER_OPACITY = 0.5;
export const TRANSPORT_HOVER_WIDTH_INCREMENT = 2;
export const HIGHWAY_DEMO_LINE_WIDTH = 4;

interface Props {
  positions: LatLngExpression[];
  color: string;
  width: number;
  hovered?: boolean;
}
export default function TransportRouteLine({positions,color,width,hovered=false}:Props) {
  return <Polyline positions={positions} pathOptions={{
    color,
    weight: hovered ? width + TRANSPORT_HOVER_WIDTH_INCREMENT : width,
    opacity: hovered ? TRANSPORT_HOVER_OPACITY : TRANSPORT_LINE_OPACITY,
  }} interactive={false}/>;
}
