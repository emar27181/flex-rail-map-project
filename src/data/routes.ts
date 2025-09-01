import { yamanote } from './yamanote';
import { chuo } from './chuo';
import { keihinTohoku } from './keihin-tohoku';
import { tokaido } from './tokaido';
import { ginzaLine } from './ginza-line';

export const routes = {
  yamanote,
  chuo,
  keihinTohoku,
  tokaido,
  ginzaLine,
};

export type RouteKey = keyof typeof routes;

export const routeColors = {
  yamanote: '#58B848', // JR Yamanote Line green
  chuo: '#F15A22', // JR Chuo Line orange
  keihinTohoku: '#00B5E2', // JR Keihin-Tohoku Line blue
  tokaido: '#F68B1E', // JR Tokaido Line orange
  ginzaLine: '#FF9500', // Tokyo Metro Ginza Line orange
};

export const routeNames = {
  yamanote: '山手線',
  chuo: '中央線',
  keihinTohoku: '京浜東北線',
  tokaido: '東海道線',
  ginzaLine: '銀座線',
};