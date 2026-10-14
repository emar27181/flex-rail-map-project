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
import { anchoredPointLabel } from './ui/molecules/anchoredPointLabel';
import { deviceClassOf } from '../constants/breakpoints';
import { initialDisplayUrlOptions } from '../utils/mapDisplayUrlParam';
import { captureTerrainCamera, restoreTerrainCamera, type TerrainCameraSnapshot } from '../utils/terrain3dCamera';
import {
  TERRAIN3D_GROUND_STYLES, terrain3dPalette, loadTerrain3dGroundStyle, saveTerrain3dGroundStyle,
  type Terrain3DGroundStyle,
} from '../utils/terrain3dAppearance';
import SegmentedControl from './ui/molecules/SegmentedControl';
import {
  TERRAIN3D_DATA_URLS, TERRAIN3D_DEFAULT_VERSION, TERRAIN3D_EXAGGERATION, v2ToRoutes,
  type Terrain3DVersion, type Terrain3DDataV2, type Terrain3DRoute, type Terrain3DStructure, TERRAIN3D_GROUND_META_URL, TERRAIN3D_GROUND_BIN_URL, GROUND_WATER,
  selectTerrainRoutes, frameFor, toLocal, extentKm, elevationNear,
  parseGround, groundCellCenter, groundElevationAt,
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
const CONTROL_SPEED = { rotate: 0.45, pan: 0.6, zoom: 0.3, damping: 0.1 } as const;
/** 画面の縦横比（幅/高さ）がこれより小さいときは、カメラをその分だけ離す */
const PORTRAIT_FIT_ASPECT = 1.2;
/** 地面を分ける塊の大きさ（格子の数）。画面の外の塊は描かないので、関東全域を出しても軽い */
const CHUNK_CELLS = 64;
/**
 * 遠くの地面を背景に溶かす霧。カメラから見ている中心までの距離に対する倍率で、拡大・縮小に合わせて動かす
 * （見ている所の周りは常にはっきり見え、地平線のほうだけ溶ける。地面の端が唐突に切れて見えない）
 */
const FOG_RANGE = { near: 1.6, far: 4.5 } as const;
/** どこまで引いて見られるか（表示範囲に対する倍率）。関東全域が入るくらい */
const MAX_DISTANCE_RATIO = 6;
/** Prevent zooming through tracks: near clipping distance relative to visible rail extent. */
const MIN_DISTANCE_RATIO = 0.025;
/** 地面の色を高い側の色にしきる標高（m）。関東平野の低い土地の差も見えるよう、対数で補間する */
const GROUND_TINT_MAX_M = 1500;
/** 地面に隠れた線を透かして見せる濃さ */
const HIDDEN_LINE_OPACITY = 0.28;
/** 陰影の光の向き（地図の陰影図の慣例どおり北西から。x=東, y=上, z=南） */
const LIGHT_DIRECTION = [-1, 1.4, -1] as const;

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

/**
 * 地面（格子の全体）。路線の周りだけを切り出さず、データのある範囲（関東全域）を描くので、
 * 動かして見て回っても地面が途切れない。CHUNK_CELLS 四方の塊に分け、画面の外の塊は three.js が描かない。
 * 法線は格子全体から求める（塊ごとに求めると、塊の境目で陰影が段になる）
 */
function buildGround(
  ground: Terrain3DGround, frame: NonNullable<ReturnType<typeof frameFor>>,
  exaggeration: number, palette: { low: string; high: string; water: string },
): { group: THREE.Group; dispose: () => void } {
  const { rows, cols } = ground.meta;
  const n = rows * cols;
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const low = new THREE.Color(palette.low), high = new THREE.Color(palette.high), water = new THREE.Color(palette.water);
  const c = new THREE.Color();
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const idx = r * cols + q;
    const kind = ground.water[idx];
    // 海だけ高さ0にそろえる（湖・川は内陸の高いところにもあるので、その場の標高のまま色だけ水にする）
    const ele = kind === GROUND_WATER.ocean ? 0 : Math.max(0, ground.elevation[idx]);
    const [lat, lng] = groundCellCenter(ground.meta, r, q);
    pos.set(toLocal(frame, lat, lng, ele, exaggeration), idx * 3);
    (kind !== GROUND_WATER.land ? c.copy(water) : groundTint(low, high, ele, c)).toArray(col, idx * 3);
  }
  // 法線: 南北・東西の隣の点の差の外積（端は自分の点を使う）
  const nor = new Float32Array(n * 3);
  const v = (r: number, q: number, k: number) => pos[(Math.min(rows - 1, Math.max(0, r)) * cols + Math.min(cols - 1, Math.max(0, q))) * 3 + k];
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const sx = v(r + 1, q, 0) - v(r - 1, q, 0), sy = v(r + 1, q, 1) - v(r - 1, q, 1), sz = v(r + 1, q, 2) - v(r - 1, q, 2); // 南向き
    const ex = v(r, q + 1, 0) - v(r, q - 1, 0), ey = v(r, q + 1, 1) - v(r, q - 1, 1), ez = v(r, q + 1, 2) - v(r, q - 1, 2); // 東向き
    const nx = sy * ez - sz * ey, ny = sz * ex - sx * ez, nz = sx * ey - sy * ex;
    const len = Math.hypot(nx, ny, nz) || 1;
    nor.set([nx / len, ny / len, nz / len], (r * cols + q) * 3);
  }
  const material = new THREE.MeshLambertMaterial({
    vertexColors: true,
    // 線と同じ高さで重なったときに面が手前に出ないよう、奥へずらす
    polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
  });
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  for (let r0 = 0; r0 < rows - 1; r0 += CHUNK_CELLS) for (let c0 = 0; c0 < cols - 1; c0 += CHUNK_CELLS) {
    // 隣の塊と境目の行・列を共有して、すき間を作らない
    const r1 = Math.min(rows - 1, r0 + CHUNK_CELLS), c1 = Math.min(cols - 1, c0 + CHUNK_CELLS);
    const nr = r1 - r0 + 1, nc = c1 - c0 + 1;
    const p = new Float32Array(nr * nc * 3), cc = new Float32Array(nr * nc * 3), nn = new Float32Array(nr * nc * 3);
    for (let i = 0; i < nr; i++) {
      const from = ((r0 + i) * cols + c0) * 3, to = from + nc * 3;
      p.set(pos.subarray(from, to), i * nc * 3);
      cc.set(col.subarray(from, to), i * nc * 3);
      nn.set(nor.subarray(from, to), i * nc * 3);
    }
    const index: number[] = [];
    for (let i = 0; i < nr - 1; i++) for (let j = 0; j < nc - 1; j++) {
      const a = i * nc + j, b = a + 1, d = a + nc, e = d + 1;
      index.push(a, d, b, b, d, e);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(p, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(cc, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(nn, 3));
    geometry.setIndex(index);
    geometry.computeBoundingSphere();
    geometries.push(geometry);
    group.add(new THREE.Mesh(geometry, material));
  }
  return { group, dispose: () => { geometries.forEach(g => g.dispose()); material.dispose(); } };
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
  const cameraSnapshotRef = useRef<TerrainCameraSnapshot | null>(null);
  const [version, setVersion] = useState<Terrain3DVersion>(() => initialDisplayUrlOptions().terrainVersion ?? TERRAIN3D_DEFAULT_VERSION);
  const [v1, setV1] = useState<Terrain3DData | null>(null);
  const [v2, setV2] = useState<Terrain3DDataV2 | null>(null);
  const [errorVersion, setErrorVersion] = useState<Terrain3DVersion | null>(null);
  const [exaggeration, setExaggeration] = useState<number>(TERRAIN3D_EXAGGERATION.default);
  const [ground, setGround] = useState<Terrain3DGround | null>(null);
  const [groundError, setGroundError] = useState(false);
  const [showGround, setShowGround] = useState(() => initialDisplayUrlOptions().ground ?? true);
  const [groundStyle, setGroundStyle] = useState<Terrain3DGroundStyle>(() => initialDisplayUrlOptions().groundStyle ?? loadTerrain3dGroundStyle());
  useEffect(() => { saveTerrain3dGroundStyle(groundStyle); }, [groundStyle]);
  // 説明の箱はスマホでは閉じて始める（地図が隠れないように）。開閉は見出しで
  const [panelOpen, setPanelOpen] = useState(() => typeof window === 'undefined' || deviceClassOf(window.innerWidth) !== 'mobile');
  // Align the collapsed 3D status with the mobile "表示切替" button.
  // Read the actual button bounds rather than hardcoding its translated width.
  const [mobileStatusPosition, setMobileStatusPosition] = useState<{ left: number; bottom: number; maxWidth: number } | null>(null);
  useEffect(() => {
    const update = () => {
      if (deviceClassOf(window.innerWidth) !== 'mobile') {
        setMobileStatusPosition(null);
        return;
      }
      const group = document.querySelector('[data-mobile-map-controls]');
      const button = group?.lastElementChild;
      if (!button) { setMobileStatusPosition(null); return; }
      const bounds = button.getBoundingClientRect();
      const gap = parseFloat(FLOATING_PANEL.gap);
      const inset = parseFloat(FLOATING_PANEL.inset);
      const left = bounds.right + gap;
      setMobileStatusPosition({
        left,
        bottom: window.innerHeight - bounds.bottom,
        maxWidth: Math.max(0, window.innerWidth - left - inset),
      });
    };
    update();
    const group = document.querySelector('[data-mobile-map-controls]');
    const observer = typeof ResizeObserver !== 'undefined' && group ? new ResizeObserver(update) : null;
    if (group && observer) observer.observe(group);
    window.addEventListener('resize', update);
    return () => { observer?.disconnect(); window.removeEventListener('resize', update); };
  }, []);


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
    const cameraFrame = JSON.stringify([frame.lat0, frame.lng0, frame.kmPerLng, size]);

    const scene = new THREE.Scene();
    const palette = terrain3dPalette(groundStyle, theme);
    scene.background = new THREE.Color(palette.background);

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
    controls.minDistance = Math.max(size * MIN_DISTANCE_RATIO, camera.near * 2);
    controls.maxDistance = size * MAX_DISTANCE_RATIO;
    restoreTerrainCamera(camera, controls.target, cameraFrame, cameraSnapshotRef.current);
    controls.update();

    const disposables: { dispose: () => void }[] = [];
    const lineMaterials: LineMaterial[] = [];

    const groundData = showGround ? ground : null;
    const groundShown = groundData !== null;
    if (groundData) {
      const groundMesh = buildGround(groundData, frame, exaggeration, palette);
      scene.add(groundMesh.group);
      disposables.push(groundMesh);
      scene.fog = new THREE.Fog(palette.background, size * FOG_RANGE.near, size * FOG_RANGE.far);
      scene.add(new THREE.HemisphereLight(NEUTRAL.white, palette.water, 0.9));
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
      // 印と文字は画面上の固定寸法。範囲やカメラ距離で肥大化させない。
      const label = anchoredPointLabel(translateStation(st.name, language), color, theme);
      const obj = new CSS2DObject(label);
      obj.position.set(...pos);
      scene.add(obj);
    }

    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      controls.update();
      // 霧と描く距離を、カメラから見ている中心までの距離に合わせる
      const d = camera.position.distanceTo(controls.target);
      if (scene.fog instanceof THREE.Fog) { scene.fog.near = d * FOG_RANGE.near; scene.fog.far = d * FOG_RANGE.far; }
      const far = d * FOG_RANGE.far * 1.2;
      if (Math.abs(camera.far - far) > far * 0.05) { camera.far = far; camera.near = far / 20000; camera.updateProjectionMatrix(); }
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
      cameraSnapshotRef.current = captureTerrainCamera(camera, controls.target, cameraFrame);
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      disposables.forEach(d => d.dispose());
      renderer.dispose();
      host.removeChild(renderer.domElement);
      host.removeChild(labelRenderer.domElement);
    };
  }, [shown, exaggeration, theme, departure, arrival, colorOf, language, ground, showGround, groundStyle, lineWidth]); // eslint-disable-line react-hooks/exhaustive-deps

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
        style={{
          position: 'absolute',
          left: mobileStatusPosition && !panelOpen ? mobileStatusPosition.left : FLOATING_PANEL.inset,
          bottom: mobileStatusPosition && !panelOpen ? mobileStatusPosition.bottom : overlayBottom,
          // Collapsed on mobile: stay next to the settings button without covering it.
          ...(mobileStatusPosition && !panelOpen ? { maxWidth: mobileStatusPosition.maxWidth, minWidth: 0 } : {}),
        }}
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
              {showGround && !groundError && <SegmentedControl
                theme={theme} size="sm" ariaLabel={translateUI('terrain3dGroundStyle', language)}
                value={groundStyle} onChange={setGroundStyle}
                options={TERRAIN3D_GROUND_STYLES.map(value => ({
                  value, label: translateUI(value === 'simple' ? 'terrain3dGroundSimple' : 'terrain3dGroundElevation', language),
                }))}
              />}
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
