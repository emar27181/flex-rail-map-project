/**
 * いま公開しているサイトのバージョンとビルドの時刻（設定パネルの「更新を確認」が取りに行く）。
 * 地図のページと同じビルドで作られるので、地図のページが古いままなら中身が食い違い、新しい版があると分かる。
 */
import type { APIRoute } from 'astro';
import { VERSION_INFO } from '../utils/appVersion';

export const GET: APIRoute = () => new Response(JSON.stringify(VERSION_INFO), {
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});
