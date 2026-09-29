/**
 * 路線の運行系統名と、主な始発・行先（分岐先ごと）を示す。
 *
 * 同じ線路を別の系統が走る区間（藤沢の上野東京ラインと湘南新宿ラインなど）で、
 * 「この線の列車がどこから来てどこへ行くか」を路線名の横に出すための部品。
 * データは src/data/serviceSystems.ts だけから取り、ここには系統名も駅名も書かない。
 *
 * 路線・駅というアプリの概念を知っているので organism。見た目はトークン
 * （FS / L / getThemeColors）と路線色（routeColors + adjustRouteColorForTheme）から取る。
 */
import { FS } from '../constants/ui';
import { L } from './legend/legendStyles';
import { getThemeColors, adjustRouteColorForTheme } from '../contexts/ThemeContext';
import { routeColors, routeNames, type RouteKey } from '../data/routes';
import { getServiceSystem, SERVICE_BRAND_LABEL_KEY, type ServiceEnd } from '../data/serviceSystems';
import { translateRoute, translateStation, translateUI, type Language } from '../utils/translation';

export interface ServiceTerminiProps {
  route: RouteKey;
  theme: 'light' | 'dark';
  language: Language;
  /**
   * brand: 系統名だけ（路線一覧の2行目。路線名に系統名が含まれていれば何も出さない）
   * full: 系統名＋主な始発・行先
   */
  variant: 'brand' | 'full';
}

/**
 * 直通先の路線名。「JR東海道本線（静岡〜浜松）」のような区間の注記は長いので外す。
 * 運行系統の路線は「上野東京ライン（宇都宮線）」の形なので、括弧の中（路線名）を使う
 */
function viaLineName(via: RouteKey, language: Language): string {
  const name = translateRoute(routeNames[via] ?? via, language);
  const m = name.match(/^(.*?)\s*[（(]([^（()）]*)[）)]\s*$/);
  if (!m) return name;
  const brands = Object.values(SERVICE_BRAND_LABEL_KEY).map(k => translateUI(k, language));
  return brands.includes(m[1]) ? m[2] : m[1];
}

function formatEnd(end: ServiceEnd, language: Language): string {
  const sep = language === 'japanese' ? '・' : ', ';
  const stations = end.stations.map(s => translateStation(s, language)).join(sep);
  if (!end.via) return stations;
  const line = viaLineName(end.via, language);
  return language === 'japanese' ? `${stations}（${line}）` : `${stations} (${line})`;
}

export function hasServiceSystem(route: RouteKey): boolean {
  return getServiceSystem(route) !== undefined;
}

export default function ServiceTermini({ route, theme, language, variant }: ServiceTerminiProps) {
  const system = getServiceSystem(route);
  if (!system) return null;

  const colors = getThemeColors(theme);
  const brand = translateUI(SERVICE_BRAND_LABEL_KEY[system.brand], language);

  if (variant === 'brand') {
    // 路線名そのものが系統名を含む（湘南新宿ライン（…））なら重ねて出さない
    const routeName = translateRoute(routeNames[route] ?? route, language);
    if (routeName.includes(brand)) return null;
    return (
      <span style={{ display: 'block', fontSize: FS.caption, color: colors.textSecondary, lineHeight: 1.3 }}>
        {brand}
      </span>
    );
  }

  const groupSep = language === 'japanese' ? '／' : ' / ';
  const dot = adjustRouteColorForTheme(routeColors[route] ?? colors.textMuted, theme);
  return (
    <div
      style={{
        padding: `${L.sp.xs} ${L.sp.md}`,
        borderBottom: `1px solid ${colors.borderLight}`,
        fontSize: FS.caption,
        lineHeight: 1.4,
        color: colors.textSecondary,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.xs, color: colors.text, fontWeight: 'bold' }}>
        <span aria-hidden style={{ width: '8px', height: '8px', borderRadius: L.r.pill, backgroundColor: dot, flexShrink: 0 }} />
        {brand}
      </div>
      <div title={translateUI('serviceTerminiLabel', language)}>
        {system.head.map(e => formatEnd(e, language)).join(groupSep)}
        {' ⇔ '}
        {system.tail.map(e => formatEnd(e, language)).join(groupSep)}
      </div>
    </div>
  );
}
