/**
 * 画面の撮影（PNG）から「描けているか」を数える小さな読み取り。
 * ライブラリを増やさず、Node の zlib だけで 8bit RGB / RGBA の PNG を読む（Playwright の撮影はこの形式）。
 */
import { inflateSync } from 'node:zlib';

export interface PngStats {
  width: number;
  height: number;
  /** 色の種類（4bit ずつに丸めて数える。描けていない一色の画面は 1〜2 になる） */
  distinctColors: number;
  /** いちばん多い色以外の画素の割合（真っ黒・真っ白の画面は 0 に近い） */
  nonDominantRatio: number;
}

export function pngStats(buf: Buffer): PngStats {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('PNG ではない');
  let pos = 8, width = 0, height = 0, colorType = 0;
  const idat: Buffer[] = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      if (data[8] !== 8) throw new Error('8bit 以外の PNG は読まない');
      colorType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  const bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
  if (!bpp) throw new Error(`色の形式 ${colorType} は読まない`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * bpp;
  const prev = new Uint8Array(stride), cur = new Uint8Array(stride);
  const counts = new Map<number, number>();
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0, b = prev[x], c = x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      cur[x] = v & 0xff;
    }
    for (let x = 0; x < width; x++) {
      const i = x * bpp;
      const key = ((cur[i] >> 4) << 8) | ((cur[i + 1] >> 4) << 4) | (cur[i + 2] >> 4);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    prev.set(cur);
  }
  const total = width * height;
  const dominant = Math.max(...counts.values());
  return { width, height, distinctColors: counts.size, nonDominantRatio: 1 - dominant / total };
}
