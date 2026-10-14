import type { PerspectiveCamera, Vector3 } from 'three';

type Position = [number, number, number];
export interface TerrainCameraSnapshot {
  frame: string; position: Position; target: Position; up: Position;
  zoom: number; near: number; far: number;
}
const position = (v: Vector3): Position => [v.x, v.y, v.z];

/** シーンの表示設定を変更しても、見ていた位置・向き・拡大率を維持する。 */
export function captureTerrainCamera(camera: PerspectiveCamera, target: Vector3, frame: string): TerrainCameraSnapshot {
  return { frame, position: position(camera.position), target: position(target), up: position(camera.up),
    zoom: camera.zoom, near: camera.near, far: camera.far };
}

/** 路線選択で座標系・範囲が変わったときだけ初期の全体表示を使う。 */
export function restoreTerrainCamera(camera: PerspectiveCamera, target: Vector3, frame: string, snapshot: TerrainCameraSnapshot | null): boolean {
  if (!snapshot || snapshot.frame !== frame) return false;
  camera.position.set(...snapshot.position);
  target.set(...snapshot.target);
  camera.up.set(...snapshot.up);
  camera.zoom = snapshot.zoom;
  camera.near = snapshot.near;
  camera.far = snapshot.far;
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  return true;
}
