import { yamanote } from './yamanote';
import { chuo } from './chuo';
import { keihinTohoku } from './keihin-tohoku';
import { tokaido } from './tokaido';
import { ginzaLine } from './ginza-line';
import { marunouchiLine } from './marunouchi-line';
import { hibiyaLine } from './hibiya-line';
import { tozaiLine } from './tozai-line';
import { odakyuLine } from './odakyu-line';
import { keioLine } from './keio-line';
import { tokyuToyokoLine } from './tokyu-toyoko-line';

export const routes = {
  yamanote,
  chuo,
  keihinTohoku,
  tokaido,
  ginzaLine,
  marunouchiLine,
  hibiyaLine,
  tozaiLine,
  odakyuLine,
  keioLine,
  tokyuToyokoLine,
};

export type RouteKey = keyof typeof routes;

export const routeColors = {
  yamanote: '#58B848', // JR Yamanote Line green
  chuo: '#F15A22', // JR Chuo Line orange
  keihinTohoku: '#00B5E2', // JR Keihin-Tohoku Line blue
  tokaido: '#F68B1E', // JR Tokaido Line orange
  ginzaLine: '#FF9500', // Tokyo Metro Ginza Line orange
  marunouchiLine: '#F62E36', // Tokyo Metro Marunouchi Line red
  hibiyaLine: '#B5B5AC', // Tokyo Metro Hibiya Line silver
  tozaiLine: '#009BBF', // Tokyo Metro Tozai Line light blue
  odakyuLine: '#0066CC', // Odakyu Line blue
  keioLine: '#DD0077', // Keio Line magenta
  tokyuToyokoLine: '#DA020E', // Tokyu Toyoko Line red
};

export const routeNames = {
  yamanote: '山手線',
  chuo: '中央線',
  keihinTohoku: '京浜東北線',
  tokaido: '東海道線',
  ginzaLine: '銀座線',
  marunouchiLine: '丸ノ内線',
  hibiyaLine: '日比谷線',
  tozaiLine: '東西線',
  odakyuLine: '小田急線',
  keioLine: '京王線',
  tokyuToyokoLine: '東急東横線',
};