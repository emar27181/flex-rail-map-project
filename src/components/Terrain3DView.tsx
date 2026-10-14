/**
 * 立体（標高）表示。表示中の路線を、線路の下の地面の標高の高さで3次元に描く。
 *
 * - 高さは**地面の標高**（Copernicus DEM）。線路自体の高さではない（地下鉄は地下、高架は地面より上）。
 *   画面にもそう書く（terrain3dHeightNote）。docs/track-geometry.md「高さの決まり」
 * - 地面（同じ DEM を約500mの格子に平均したもの）を、標高の色分けと北西からの光の陰影で描く。
 *   線は地面の上に載せ、山などに隠れた部分は薄く透かして見せる（今後、地下を走る区間を地面の下に
 *   描いたときも、地面越しに見える）。地面を消したときは、線の下に海面（高さ0）までの半透明の幕を下ろす
 * - 水平の距離に比べて標高差は小さいので、高さは強調して描く（倍率は画面で変えられる）
 * - three.js はこの表示を開いたときだけ読み込む（RailwayMap から React.lazy で読む）
 * - 線形: © OpenStreetMap contributors（ODbL）。出典は画面の下に出す
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import type { RouteKey } from '../data/routes';
import { getThemeColors } from '../contexts/ThemeContext';
import { FS, SEMANTIC, NEUTRAL, ROUTE_LINE } from '../constants/ui';
import { L } from './legend/legendStyles';
import { translateStation, translateUI, type Language } from '../utils/translation';
import { FLOATING_PANEL, CONTROL_SIZE, aboveFloatingButtons } from './ui/atoms/controlSize';
import Button from './ui/atoms/Button';
import Stepper from './ui/molecules/Stepper';
import Checkbox from './ui/atoms/Checkbox';
import CollapsiblePanel from './ui/molecules/CollapsiblePanel';
import SourceDisclosure from './ui/molecules/SourceDisclosure';
import { deviceClassOf } from '../constants/breakpoints';
import SegmentedControl from './ui/molecules/SegmentedControl';
import {
  TERRAIN3D_DATA_URLS, TERRAIN3D_DEFAULT_VERSION, TERRAIN3D_EXAGGERATION, v2ToRoutes,
  type Terrain3DVersion, type Terrain3DDataV2, type Terrain3DRoute, type Terrain3DStructure, TERRAIN3D_GROUND_META_URL, TERRAIN3D_GROUND_BIN_URL, GROUND_WATER,
  selectTerrainRoutes, frameFor, toLocal, extentKm, elevationNear,
  parseGround, groundCellCenter, groundElevationAt, groundWindow,
  type Terrain3DData, type Terrain3DGround, type Terrain3DGroundMeta,
} from '../utils/terrain3d';

/** 海面までの幕の不透明度 */
const CURTAIN_OPACITY = 0.18;
/** 説明の箱の下端。地図の左下に浮かぶボタン（縮小・方位・言語）1段の上に置く */
const OVERLAY_BOTTOM = aboveFloatingButtons(1);
/**
 * 操作の感度。OrbitControls の既定（回転・移動・拡大とも 1）では速すぎて、
 * 少し指を動かしただけで大きく回ってしまったため下げている
 */
const CONTROL_SPEED = { rotate: 0.45, pan: 0.6, zoom: 0.6, damping: 0.1 } as const;
/** 画面の縦横比（幅/高さ）がこれより小さいときは、カメラをその分だけ離す */
const PORTRAIT_FIT_ASPECT = 1.2;
/** 地面を描く範囲: 表示中の路線の範囲の外に足す幅（度）。0.05度 ≒ 5km */
const GROUND_MARGIN_DEG = 0.05;
/** 地面の色を高い側の色にしきる標高（m）。関東平野の低い土地の差も見えるよう、対数で補間する */
const GROUND_TINT_MAX_M = 1500;
/** 地面に隠れた線を透かして見せる濃さ */
const HIDDEN_LINE_OPACITY = 0.28;
/** 陰影の光の向き（地図の陰影図の慣例どおり北西から。x=東, y=上, z=南） */
const LIGHT_DIRECTION = [-1, 1.4, -1] as const;
/** 出発・到着の印の大きさ（表示範囲に対する割合） */
const MARKER_RATIO = 0.008;

type LinesFile = { v1: Terrain3DData; v2: Terrain3DDataV2 };
const linesPromises: Partial<Record<Terrain3DVersion, Promise<unknown>>> = {};
/** 線形データ（版ごと）。一度読んだら使い回す。失敗したら次に開いたときに読み直す */
function loadLines<V extends Terrain3DVersion>(version: V): Promise<LinesFile[V]> {
  if (!linesPromises[version]) {
    const p = fetch(TERRAIN3D_DATA_URLS[version]).then(r => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    });
    p.catch(() => { delete linesPromises[version]; });
    linesPromises[version] = p;
  }
  return linesPromises[version] as Promise<LinesFile[V]>;
}

/**
 * 区間の構造ごとの線の描き方（地図の慣例: 高架は縁取り、地下は破線）。
 * 地下の深さは分からないので、地面の位置に破線で描く（地下に沈めない）
 */
const STRUCTURE_STYLE: Record<Terrain3DStructure, { casing: boolean; dashed: boolean; opacity: number }> = {
  g: { casing: false, dashed: false, opacity: 1 },
  e: { casing: true, dashed: false, opacity: 1 },
  u: { casing: false, dashed: true, opacity: 0.85 },
};
/** 高架の縁取りの太さ（線の太さに対する割合。両側にこの分ずつ足す） */
const CASING_RATIO = 0.5;
/** 地下の破線の長さ・間隔（表示範囲に対する割合。拡大しても見え方がそろうように範囲から決める） */
const DASH_RATIO = { dash: 0.006, gap: 0.004 } as const;

let groundPromise: Promise<Terrain3DGround> | null = null;
function loadGround(): Promise<Terrain3DGround> {
  if (!groundPromise) {
    groundPromise = Promise.all([
      fetch(TERRAIN3D_GROUND_META_URL).then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<Terrain3DGroundMeta>; }),
      fetch(TERRAIN3D_GROUND_BIN_URL).then(r => { if (!r.ok) throw new Error(String(r.status)); return r.arrayBuffer(); }),
    ]).then(([meta, buf]) => parseGround(meta, buf));
    groundPromise.catch(() => { groundPromise = null; });
  }
  return groundPromise;
}

/** 低い→高いの2色を、標高の対数で補間した色 */
function groundTint(low: THREE.Color, high: THREE.Color, elevationM: number, out: THREE.Color): THREE.Color {
  const t = Math.min(1, Math.log1p(Math.max(0, elevationM)) / Math.log1p(GROUND_TINT_MAX_M));
  return out.copy(low).lerp(high, t);
}

/** 地面の面（格子の点をつないだ三角形）。高さは表示用の倍率をかけたもの */
function buildGroundMesh(
  ground: Terrain3DGround, routes: ReturnType<typeof selectTerrainRoutes>, frame: NonNullable<ReturnType<typeof frameFor>>,
  exaggeration: number, palette: { low: string; high: string; water: string },
): THREE.Mesh | null {
  const win = groundWindow(ground, routes, GROUND_MARGIN_DEG);
  if (!win) return null;
  const { cols } = ground.meta;
  const nr = win.r1 - win.r0 + 1, nc = win.c1 - win.c0 + 1;
  const positions = new Float32Array(nr * nc * 3);
  const colorAttr = new Float32Array(nr * nc * 3);
  const low = new THREE.Color(palette.low), high = new THREE.Color(palette.high), water = new THREE.Color(palette.water);
  const c = new THREE.Color();
  for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) {
    const idx = (win.r0 + i) * cols + (win.c0 + j);
    const kind = ground.water[idx];
    const isWater = kind !== GROUND_WATER.land;
    // 海だけ高さ0にそろえる（湖・川は内陸の高いところにもあるので、その場の標高のまま色だけ水にする）
    const ele = kind === GROUND_WATER.ocean ? 0 : Math.max(0, ground.elevation[idx]);
    const [lat, lng] = groundCellCenter(ground.meta, win.r0 + i, win.c0 + j);
    const k = (i * nc + j) * 3;
    positions.set(toLocal(frame, lat, lng, ele, exaggeration), k);
    (isWater ? c.copy(water) : groundTint(low, high, ele, c)).toArray(colorAttr, k);
  }
  const index: number[] = [];
  for (let i = 0; i < nr - 1; i++) for (let j = 0; j < nc - 1; j++) {
    const a = i * nc + j, b = a + 1, d = a + nc, e = d + 1;
    index.push(a, d, b, b, d, e);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colorAttr, 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  const material = new THREE.MeshLambertMaterial({
    vertexColors: true,
    // 線と同じ高さで重なったときに面が手前に出ないよう、奥へずらす
    polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
  });
  return new THREE.Mesh(geometry, material);
}

export interface Terrain3DViewProps {
  visibleRoutes: Set<RouteKey>;
  /** 路線の色（テーマに合わせたもの） */
  colorOf: (routeKey: RouteKey) => string;
  departure?: { name: string; lat: number; lng: number } | null;
  arrival?: { name: string; lat: number; lng: number } | null;
  theme: 'light' | 'dark';
  language: Language;
  /** 立体のデータがある路線をすべて表示する */
  onShowRoutes: (routeKeys: RouteKey[]) => void;
  /** 説明の箱の下端。左下に別のボタン群がある画面（スマホ全画面）で、その上に置くために渡す */
  overlayBottom?: string;
  /** 線の太さ（画面上の px）。地図の「路線の太さ」の設定と同じ値 */
  lineWidth?: number;
}

const Terrain3DView: React.FC<Terrain3DViewProps> = ({
  visibleRoutes, colorOf, departure, arrival, theme, language, onShowRoutes, overlayBottom = OVERLAY_BOTTOM,
  lineWidth = ROUTE_LINE.defaultWidth,
}) => {
  const colors = getThemeColors(theme);
  const hostRef = useRef<HTMLDivElement>(null);
  const [version, setVersion] = useState<Terrain3DVersion>(TERRAIN3D_DEFAULT_VERSION);
  const [v1, setV1] = useState<Terrain3DData | null>(null);
  const [v2, setV2] = useState<Terrain3DDataV2 | null>(null);
  const [errorVersion, setErrorVersion] = useState<Terrain3DVersion | null>(null);
  const [exaggeration, setExaggeration] = useState<number>(TERRAIN3D_EXAGGERATION.default);
  const [ground, setGround] = useState<Terrain3DGround | null>(null);
  const [groundError, setGroundError] = useState(false);
  const [showGround, setShowGround] = useState(true);
  // 説明の箱はスマホでは閉じて始める（地図が隠れないように）。開閉は見出しで
  const [panelOpen, setPanelOpen] = useState(() => typeof window === 'undefined' || deviceClassOf(window.innerWidth) !== 'mobile');

  useEffect(() => {
    let alive = true;
    loadGround().then(g => { if (alive) setGround(g); }).catch(() => { if (alive) setGroundError(true); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    setErrorVersion(null);
    if (version === 'v1') loadLines('v1').then(d => { if (alive) setV1(d); }).catch(() => { if (alive) setErrorVersion('v1'); });
    else loadLines('v2').then(d => { if (alive) setV2(d); }).catch(() => { if (alive) setErrorVersion('v2'); });
    return () => { alive = false; };
  }, [version]);

  /** 選んだ版の線（v1 と同じ形）。v2 は地面の高さに載せるので、地面を読み終えるまで null */
  const lineRoutes = useMemo<Terrain3DRoute[] | null>(() => {
    if (version === 'v1') return v1?.routes ?? null;
    return v2 && ground ? v2ToRoutes(v2, ground) : null;
  }, [version, v1, v2, ground]);
  const data = lineRoutes ? { routes: lineRoutes } : null;
  // v2 は地面の高さを使うので、地面が読めなければ描けない
  const error = errorVersion === version || (version === 'v2' && groundError);
  const lineSourceName = version === 'v1' ? v1?.meta.elevationSource.sourceName : null;

  const shown = useMemo(() => (lineRoutes ? selectTerrainRoutes({ routes: lineRoutes }, visibleRoutes) : []), [lineRoutes, visibleRoutes]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || shown.length === 0) return;
    const frame = frameFor(shown);
    if (!frame) return;
    const size = extentKm(frame, shown);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);

    const width = host.clientWidth || 1;
    const height = host.clientHeight || 1;
    const camera = new THREE.PerspectiveCamera(45, width / height, size / 1000, size * 20);
    // 縦長の画面（スマホ）では横の画角が狭いので、横幅に収まるまで離す
    const fit = Math.max(1, PORTRAIT_FIT_ASPECT / (width / height));
    camera.position.set(size * 0.4 * fit, size * 0.65 * fit, size * 0.9 * fit);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    host.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.inset = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    host.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    // 地図と同じく、1本指・左ドラッグで移動。向きは2本指・右（中）ドラッグで変える
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.ROTATE,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE };
    controls.screenSpacePanning = false; // 移動は地面に沿って（画面の上下ではなく奥行き方向に動く）
    controls.rotateSpeed = CONTROL_SPEED.rotate;
    controls.panSpeed = CONTROL_SPEED.pan;
    controls.zoomSpeed = CONTROL_SPEED.zoom;
    controls.dampingFactor = CONTROL_SPEED.damping;
    controls.target.set(0, 0, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // 地面の下からは見ない

    const disposables: { dispose: () => void }[] = [];
    const lineMaterials: LineMaterial[] = [];

    const groundData = showGround ? ground : null;
    const groundShown = groundData !== null;
    if (groundData) {
      const mesh = buildGroundMesh(groundData, shown, frame, exaggeration, {
        low: colors.terrainLow, high: colors.terrainHigh, water: colors.terrainWater,
      });
      if (mesh) {
        scene.add(mesh);
        disposables.push(mesh.geometry, mesh.material as THREE.Material);
      }
      scene.add(new THREE.HemisphereLight(NEUTRAL.white, colors.terrainWater, 0.9));
      const sun = new THREE.DirectionalLight(NEUTRAL.white, 1.6);
      sun.position.set(...LIGHT_DIRECTION);
      scene.add(sun);
    } else {
      // 地面を出さないときは、海面（高さ0）の格子を目安にする
      const grid = new THREE.GridHelper(size * 1.2, 24, colors.border, colors.borderLight);
      scene.add(grid);
      disposables.push(grid.geometry, grid.material as THREE.Material);
    }
    /** 線の高さ。地面を出しているときは、地面（格子の平均）より下に沈まないよう地面の上に載せる */
    const lineElevation = (lat: number, lng: number, ele: number) => {
      if (!groundData) return ele;
      const g = groundElevationAt(groundData, lat, lng);
      return g === null ? ele : Math.max(ele, g);
    };

    for (const route of shown) {
      const color = colorOf(route.key);
      route.paths.forEach((path, pi) => {
        const style = STRUCTURE_STYLE[route.structures?.[pi] ?? 'g'];
        const pts = path.map(([lat, lng, ele]) => toLocal(frame, lat, lng, lineElevation(lat, lng, ele), exaggeration));
        const geometry = new LineGeometry();
        geometry.setPositions(pts.flat());
        disposables.push(geometry);
        // 高架: 灰色の太い線を下に敷いて縁取る（橋の表し方。背景色だとダークで黒い点線に見えた）
        if (style.casing) {
          const casingMaterial = new LineMaterial({ color: colors.textSecondary, linewidth: lineWidth * (1 + CASING_RATIO * 2), worldUnits: false });
          casingMaterial.resolution.set(width, height);
          lineMaterials.push(casingMaterial);
          const casing = new Line2(geometry, casingMaterial);
          casing.renderOrder = 2;
          scene.add(casing);
          disposables.push(casingMaterial);
        }
        // 線（地下は破線）
        const material = new LineMaterial({
          color, linewidth: lineWidth, worldUnits: false,
          transparent: style.opacity < 1, opacity: style.opacity,
          dashed: style.dashed, dashSize: size * DASH_RATIO.dash, gapSize: size * DASH_RATIO.gap,
        });
        material.resolution.set(width, height);
        lineMaterials.push(material);
        const line = new Line2(geometry, material);
        if (style.dashed) line.computeLineDistances();
        line.renderOrder = 3;
        scene.add(line);
        disposables.push(material);
        if (groundShown) {
          // 山などの地面に隠れた部分は、同じ線を薄く・奥行きを無視して描いて透かす
          const hiddenMaterial = new LineMaterial({
            color, linewidth: lineWidth, worldUnits: false,
            transparent: true, opacity: HIDDEN_LINE_OPACITY, depthTest: false, depthWrite: false,
            dashed: style.dashed, dashSize: size * DASH_RATIO.dash, gapSize: size * DASH_RATIO.gap,
          });
          hiddenMaterial.resolution.set(width, height);
          lineMaterials.push(hiddenMaterial);
          const hidden = new Line2(geometry, hiddenMaterial);
          if (style.dashed) hidden.computeLineDistances();
          hidden.renderOrder = 1;
          scene.add(hidden);
          disposables.push(hiddenMaterial);
          return; // 地面があるときは海面までの幕は要らない（地面に埋もれる）
        }
        // 海面までの幕（三角形の帯）
        const curtain = new THREE.BufferGeometry();
        const verts: number[] = [];
        for (let i = 0; i < pts.length - 1; i++) {
          const [ax, ay, az] = pts[i];
          const [bx, by, bz] = pts[i + 1];
          verts.push(ax, ay, az, ax, 0, az, bx, by, bz, bx, by, bz, ax, 0, az, bx, 0, bz);
        }
        curtain.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        const curtainMaterial = new THREE.MeshBasicMaterial({
          color, transparent: true, opacity: CURTAIN_OPACITY, side: THREE.DoubleSide, depthWrite: false,
        });
        scene.add(new THREE.Mesh(curtain, curtainMaterial));
        disposables.push(curtain, curtainMaterial);
      });
    }

    // 出発駅・到着駅の印と名前
    const markers: [typeof departure, string][] = [[departure, SEMANTIC.departure], [arrival, SEMANTIC.arrival]];
    for (const [st, color] of markers) {
      if (!st) continue;
      const ele = elevationNear(shown, st.lat, st.lng);
      if (ele === null) continue; // 表示中の線形から離れた駅は、高さが分からないので描かない
      const pos = toLocal(frame, st.lat, st.lng, lineElevation(st.lat, st.lng, ele), exaggeration);
      const sphereGeo = new THREE.SphereGeometry(size * MARKER_RATIO, 16, 12);
      const sphereMat = new THREE.MeshBasicMaterial({ color });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(...pos);
      scene.add(sphere);
      disposables.push(sphereGeo, sphereMat);
      const label = document.createElement('div');
      label.textContent = translateStation(st.name, language);
      Object.assign(label.style, {
        background: color, color: colors.onPrimary, fontSize: FS.caption, fontWeight: 'bold',
        padding: `${L.sp.xxs} ${L.sp.xs}`, borderRadius: L.r.control, whiteSpace: 'nowrap',
        transform: `translateY(-${L.sp.lg})`,
      } satisfies Partial<CSSStyleDeclaration>);
      const obj = new CSS2DObject(label);
      obj.position.set(...pos);
      scene.add(obj);
    }

    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    render();

    const ro = new ResizeObserver(() => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
      lineMaterials.forEach(m => m.resolution.set(w, h));
    });
    ro.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      disposables.forEach(d => d.dispose());
      renderer.dispose();
      host.removeChild(renderer.domElement);
      host.removeChild(labelRenderer.domElement);
    };
  }, [shown, exaggeration, theme, departure, arrival, colorOf, language, ground, showGround, lineWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  const overlayText: React.CSSProperties = { fontSize: FS.caption, color: colors.textSecondary, lineHeight: 1.5 };

  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: colors.background }} data-terrain3d>
      <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />

      {/* 説明と操作（左下に浮かべる）。見出しで開閉する */}
      <CollapsiblePanel
        theme={theme}
        expanded={panelOpen}
        onToggle={() => setPanelOpen(v => !v)}
        title={data && shown.length > 0
          ? translateUI('terrain3dCoverage', language, { shown: String(shown.length), visible: String(visibleRoutes.size) })
          : translateUI('terrain3dLabel', language)}
        width="wide"
        style={{ position: 'absolute', left: FLOATING_PANEL.inset, bottom: overlayBottom }}
        bodyStyle={{ padding: `${L.sp.sm} ${L.sp.md}`, boxSizing: 'border-box' }}
      >
        <div data-testid="terrain3d-controls" style={{ display: 'flex', flexDirection: 'column', gap: L.sp.xs }}>
          <SegmentedControl<Terrain3DVersion>
            theme={theme}
            variant="slide"
            ariaLabel={translateUI('terrain3dVersion', language)}
            value={version}
            onChange={setVersion}
            options={[
              { value: 'v2', label: translateUI('terrain3dVersionV2', language) },
              { value: 'v1', label: translateUI('terrain3dVersionV1', language) },
            ]}
          />
          {!data && !error && <div style={overlayText}>{translateUI('terrain3dLoading', language)}</div>}
          {error && <div style={overlayText}>{translateUI('terrain3dLoadError', language)}</div>}
          {data && shown.length === 0 && (
            <>
              <div style={{ ...overlayText, color: colors.text }}>
                {translateUI('terrain3dNoData', language, { count: String(data.routes.length) })}
              </div>
              <Button theme={theme} variant="primary" size="sm" fullWidth onClick={() => onShowRoutes(data.routes.map(r => r.key))}>
                {translateUI('terrain3dShowAvailable', language)}
              </Button>
            </>
          )}
          {data && shown.length > 0 && (
            <>
              <div style={overlayText}>{translateUI('terrain3dHeightNote', language)}</div>
              {version === 'v2' && <StructureLegend theme={theme} language={language} lineWidth={lineWidth} />}
              <Stepper
                theme={theme}
                label={translateUI('terrain3dExaggeration', language)}
                value={exaggeration}
                min={TERRAIN3D_EXAGGERATION.min}
                max={TERRAIN3D_EXAGGERATION.max}
                step={TERRAIN3D_EXAGGERATION.step}
                onChange={setExaggeration}
                format={v => `${v}x`}
                decreaseLabel="-"
                increaseLabel="+"
              />
              <Checkbox
                theme={theme}
                size="sm"
                checked={showGround && !groundError}
                disabled={groundError}
                onChange={setShowGround}
              >
                {translateUI('terrain3dGroundLabel', language)}
              </Checkbox>
              <div style={overlayText}>
                {translateUI(groundError ? 'terrain3dGroundLoadError' : 'terrain3dGroundNote', language)}
              </div>
              <div style={overlayText}>{translateUI('terrain3dHint', language)}</div>
            </>
          )}
          {data && (
            <SourceDisclosure theme={theme} label={translateUI('dataSource', language)}>
              <div><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" style={{ color: colors.text }}>© OpenStreetMap contributors (ODbL)</a></div>
              {version === 'v2'
                ? <div>{translateUI('terrain3dV2Source', language)}</div>
                : lineSourceName && <div>{lineSourceName}</div>}
              {ground && (
                <div>
                  <a href={ground.meta.source.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: colors.text }}>
                    {ground.meta.source.sourceName}
                  </a>
                  {' '}{ground.meta.source.license}
                </div>
              )}
            </SourceDisclosure>
          )}
        </div>
      </CollapsiblePanel>
    </div>
  );
};

/** 区間の構造の凡例（v2）。線の見本は STRUCTURE_STYLE と同じ描き方 */
const StructureLegend: React.FC<{ theme: 'light' | 'dark'; language: Language; lineWidth: number }> = ({ theme, language, lineWidth }) => {
  const colors = getThemeColors(theme);
  // 見本の大きさは補助の操作部品（CONTROL_SIZE.sm）の幅と、縁取りを含めた線の太さから決める
  const casingWidth = lineWidth * (1 + CASING_RATIO * 2);
  const w = CONTROL_SIZE.sm.minHeight, h = Math.ceil(casingWidth), mid = h / 2;
  const dash = `${lineWidth * 2} ${lineWidth}`;
  const sample = (s: Terrain3DStructure) => (
    <svg width={w} height={h} aria-hidden="true" style={{ flexShrink: 0 }}>
      {STRUCTURE_STYLE[s].casing && <line x1={0} y1={mid} x2={w} y2={mid} stroke={colors.textSecondary} strokeWidth={casingWidth} />}
      <line x1={0} y1={mid} x2={w} y2={mid} stroke={colors.text} strokeWidth={lineWidth}
        strokeDasharray={STRUCTURE_STYLE[s].dashed ? dash : undefined} opacity={STRUCTURE_STYLE[s].opacity} />
    </svg>
  );
  const items: [Terrain3DStructure, string][] = [
    ['g', 'terrain3dStructureAtGrade'], ['e', 'terrain3dStructureElevated'], ['u', 'terrain3dStructureUnderground'],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: L.sp.xxs }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${L.sp.xxs} ${L.sp.md}` }}>
        {items.map(([s, key]) => (
          <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: L.sp.xs, fontSize: FS.caption, color: colors.text }}>
            {sample(s)}{translateUI(key, language)}
          </span>
        ))}
      </div>
      <div style={{ fontSize: FS.caption, color: colors.textSecondary, lineHeight: 1.5 }}>
        {translateUI('terrain3dStructureNote', language)}
      </div>
    </div>
  );
};

export default Terrain3DView;
