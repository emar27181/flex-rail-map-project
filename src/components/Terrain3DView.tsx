/**
 * 立体（標高）表示。表示中の路線を、線路の下の地面の標高の高さで3次元に描く。
 *
 * - 高さは**地面の標高**（Copernicus DEM）。線路自体の高さではない（地下鉄は地下、高架は地面より上）。
 *   画面にもそう書く（terrain3dHeightNote）。docs/track-geometry.md「高さの決まり」
 * - 線の下に、海面（高さ0）までの半透明の幕を下ろして、高低差を読みやすくする
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
import { FS, SEMANTIC } from '../constants/ui';
import { L } from './legend/legendStyles';
import { translateStation, translateUI, type Language } from '../utils/translation';
import { floatingSurfaceStyle } from './ui/atoms/floatingSurface';
import { FLOATING_ICON_BUTTON_SIZE } from './ui/atoms/controlSize';
import Button from './ui/atoms/Button';
import Stepper from './ui/molecules/Stepper';
import {
  TERRAIN3D_DATA_URL, TERRAIN3D_EXAGGERATION, selectTerrainRoutes, frameFor, toLocal, extentKm, elevationNear,
  type Terrain3DData,
} from '../utils/terrain3d';

/** 線の太さ（画面上の px）。地図の路線の線と同じくらい */
const LINE_WIDTH_PX = 3;
/** 海面までの幕の不透明度 */
const CURTAIN_OPACITY = 0.18;
/** 説明の箱の下端。地図の左下に浮かぶボタン（縮小・方位・言語。FLOATING_ICON_BUTTON_SIZE.md）の上に置く */
const OVERLAY_BOTTOM = `calc(${L.sp.lg} + ${FLOATING_ICON_BUTTON_SIZE.md}px + ${L.sp.sm})`;
/** 説明の箱の最大幅(px)。スマホでは画面の幅から左右の余白を引いた幅まで */
const OVERLAY_MAX_WIDTH_PX = 360;
/** 画面の縦横比（幅/高さ）がこれより小さいときは、カメラをその分だけ離す */
const PORTRAIT_FIT_ASPECT = 1.2;
/** 出発・到着の印の大きさ（表示範囲に対する割合） */
const MARKER_RATIO = 0.008;

let dataPromise: Promise<Terrain3DData> | null = null;
function loadData(): Promise<Terrain3DData> {
  if (!dataPromise) {
    dataPromise = fetch(TERRAIN3D_DATA_URL).then(r => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<Terrain3DData>;
    });
    dataPromise.catch(() => { dataPromise = null; });
  }
  return dataPromise;
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
}

const Terrain3DView: React.FC<Terrain3DViewProps> = ({
  visibleRoutes, colorOf, departure, arrival, theme, language, onShowRoutes, overlayBottom = OVERLAY_BOTTOM,
}) => {
  const colors = getThemeColors(theme);
  const hostRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Terrain3DData | null>(null);
  const [error, setError] = useState(false);
  const [exaggeration, setExaggeration] = useState<number>(TERRAIN3D_EXAGGERATION.default);

  useEffect(() => {
    let alive = true;
    loadData().then(d => { if (alive) setData(d); }).catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, []);

  const shown = useMemo(() => (data ? selectTerrainRoutes(data, visibleRoutes) : []), [data, visibleRoutes]);

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
    // 左ドラッグ: 平行移動 / 右・中ドラッグ: 視点回転。
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.ROTATE,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.target.set(0, 0, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // 地面の下からは見ない

    // 海面（高さ0）の格子
    const grid = new THREE.GridHelper(size * 1.2, 24, colors.border, colors.borderLight);
    scene.add(grid);

    const disposables: { dispose: () => void }[] = [grid.geometry, grid.material as THREE.Material];
    const lineMaterials: LineMaterial[] = [];

    for (const route of shown) {
      const color = colorOf(route.key);
      for (const path of route.paths) {
        const pts = path.map(([lat, lng, ele]) => toLocal(frame, lat, lng, ele, exaggeration));
        // 線
        const geometry = new LineGeometry();
        geometry.setPositions(pts.flat());
        const material = new LineMaterial({ color, linewidth: LINE_WIDTH_PX, worldUnits: false });
        material.resolution.set(width, height);
        lineMaterials.push(material);
        scene.add(new Line2(geometry, material));
        disposables.push(geometry, material);
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
      }
    }

    // 出発駅・到着駅の印と名前
    const markers: [typeof departure, string][] = [[departure, SEMANTIC.departure], [arrival, SEMANTIC.arrival]];
    for (const [st, color] of markers) {
      if (!st) continue;
      const ele = elevationNear(shown, st.lat, st.lng);
      if (ele === null) continue; // 表示中の線形から離れた駅は、高さが分からないので描かない
      const pos = toLocal(frame, st.lat, st.lng, ele, exaggeration);
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
  }, [shown, exaggeration, theme, departure, arrival, colorOf, language]); // eslint-disable-line react-hooks/exhaustive-deps

  const overlayText: React.CSSProperties = { fontSize: FS.caption, color: colors.textSecondary, lineHeight: 1.5 };

  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: colors.background }} data-terrain3d>
      <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />

      {/* 説明と操作（左下に浮かべる） */}
      <div style={{
        position: 'absolute', left: L.sp.lg, bottom: overlayBottom, maxWidth: `min(${OVERLAY_MAX_WIDTH_PX}px, calc(100% - ${L.sp.lg} * 2))`,
        padding: `${L.sp.sm} ${L.sp.md}`, ...floatingSurfaceStyle(theme, 'open'),
      }}>
        {!data && !error && <div style={overlayText}>{translateUI('terrain3dLoading', language)}</div>}
        {error && <div style={overlayText}>{translateUI('terrain3dLoadError', language)}</div>}
        {data && shown.length === 0 && (
          <>
            <div style={{ ...overlayText, color: colors.text, marginBottom: L.sp.sm }}>
              {translateUI('terrain3dNoData', language, { count: String(data.routes.length) })}
            </div>
            <Button theme={theme} variant="primary" size="sm" fullWidth onClick={() => onShowRoutes(data.routes.map(r => r.key))}>
              {translateUI('terrain3dShowAvailable', language)}
            </Button>
          </>
        )}
        {data && shown.length > 0 && (
          <>
            <div style={{ ...overlayText, color: colors.text, fontWeight: 'bold' }}>
              {translateUI('terrain3dCoverage', language, { shown: String(shown.length), visible: String(visibleRoutes.size) })}
            </div>
            <div style={overlayText}>{translateUI('terrain3dHeightNote', language)}</div>
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
            <div style={overlayText}>{translateUI('terrain3dHint', language)}</div>
          </>
        )}
        {data && (
          <div style={{ ...overlayText, marginTop: L.sp.xs }}>
            © OpenStreetMap contributors (ODbL) / {data.meta.elevationSource.sourceName}
          </div>
        )}
      </div>
    </div>
  );
};

export default Terrain3DView;
