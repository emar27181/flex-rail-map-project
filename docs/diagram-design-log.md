# DiagramMap 設計ログ

---

## v0 — 2026-05-10 15:30 JST

**コミット:** `ad06ac6`  
**ブランチ:** `edit`  
**対象ファイル:** `src/components/DiagramMap.tsx`

---

### 概要

H/Vトラック + BLEND による擬似スケマティック配置を廃止し、
純地理座標ベースの無限拡張キャンバス方式に移行した最初の安定版。

---

### 座標系パラメータ

| パラメータ | 値 | 説明 |
|-----------|-----|------|
| `SCALE_PX` | `12000` | px / 緯度1° |
| `LNG_COS` | `Math.cos(35.57° × π/180)` ≈ `0.8131` | 東京緯度での経度→距離補正係数 |
| `ANCHOR_LNG` | `139.7006` | アンカー経度（新宿駅） |
| `ANCHOR_LAT` | `35.6896` | アンカー緯度（新宿駅） |
| `CANVAS_CX` | `5000` | アンカー点の SVG X 座標 (px) |
| `CANVAS_CY` | `5000` | アンカー点の SVG Y 座標 (px) |

**座標変換式:**

```
geoX(lng) = CANVAS_CX + (lng - ANCHOR_LNG) × LNG_COS × SCALE_PX
geoY(lat) = CANVAS_CY - (lat  - ANCHOR_LAT) × SCALE_PX
```

**実効範囲（全路線カバー時の概算）:**

| 方向 | 範囲 | SVG座標 |
|------|------|---------|
| X（西端）| lng ≈ 139.10 | ≈ −860 px |
| X（東端）| lng ≈ 140.12 | ≈ 9091 px |
| Y（北端）| lat ≈ 35.92  | ≈ 2235 px |
| Y（南端）| lat ≈ 35.22  | ≈ 10635 px |

---

### 背景矩形

```
x=−3000, y=1000, width=16000, height=12000
```

全路線の実効範囲より広めに設定し、パン時の白抜けを防止。

---

### ズーム・パン設定

| 項目 | 値 |
|------|-----|
| 初期スケール | `0.08` |
| 初期センター | 新宿（CANVAS_CX=5000, CANVAS_CY=5000）をビューポート中央 |
| ズーム係数（ホイール1ステップ） | `1.12` |
| スケール下限 | `0.12` |
| スケール上限 | `8.0` |
| タッチ操作 | 1本指パン／2本指ピンチズーム（両方 preventDefault） |

---

### 出発/到着駅オートセンタリング

```typescript
let scale = 0.35;  // 片方のみ選択時のデフォルト
if (depPos && arrPos) {
  const span = Math.max(|dx|, |dy|, 400);  // 最小span=400px
  scale = clamp(viewport_min * 0.5 / span, 0.1, 0.6);
}
```

2駅間の距離に応じてズームを動的計算。近距離では拡大、遠距離では縮小。

---

### 路線ライン描画

| 項目 | 値 |
|------|-----|
| 線種 | 直線（`<line>`要素）。octilinear なし |
| 通常線幅 | `strokeWidth=2` |
| ハイライト時線幅 | `strokeWidth=3` |
| 描画順 | 非ハイライト路線 → ハイライト路線（前面） |
| 重複点スキップ | 両端距離 < 0.5px のセグメントは skip |

---

### 駅マーカー

| 項目 | 乗換駅 | 一般駅 |
|------|--------|--------|
| 基準半径 `REF_R` | `2.5 px` | `1.5 px` |
| 実レンダリング半径 | `max(1.5, 2.5/scale)` | `max(1.0, 1.5/scale)` |
| fill | `colors.surfaceElevated` | `colors.textMuted` |
| stroke | `colors.textSecondary` (幅 `0.8/scale`) | なし |

---

### 駅ラベル配置

| 定数 | 値 | 説明 |
|------|-----|------|
| `REF_FS` | `5.5 px` | 基準フォントサイズ |
| `REF_LH` | `REF_FS × 1.5 = 8.25 px` | 基準行高 |
| `REF_GAP` | `0.8 px` | ラベル間最小ギャップ |
| `CELL` | `REF_LH × 3 = 24.75 px` | 衝突判定グリッドセル |

**配置アルゴリズム:** 貪欲法。8方向（右・左・上・下・右上・左上・右下・左下）× 最大8ステップで空き領域を探索。乗換駅を先に配置（優先ソート）。見つからない場合は右 step=9 に強制配置。

**スケール依存調整:**
```
fs    = clamp(REF_FS / scale, 3.5, 9)
sw    = 1.5 / scale  （テキスト背景ストローク幅）
```

---

### 表示対象路線（76路線）

```
JR：yamanote, chuo, keihinTohoku, jrSobuLine, jrJobanLine,
    jrSaikyoLine, jrTakasakiLine, jrTokaidoMainLine, jrMusashinoLine,
    jrYokohamaLine, jrNanbuLine, jrSobuChiba, jrKeiyo,
    jrOmeLine, jrHachikoLine, jrItsukaichiLine, jrUtsunomiyaLine,
    jrNegishiLine, yokosukaLine

東京メトロ：ginzaLine, marunouchiLine, hibiyaLine, tozaiLine, chiyodaLine,
            yurakuchoLine, hanzomonLine, nambokuLine, fukutoshinLine

都営：toeiAsakusaLine, toeiMitaLine, toeiShinjukuLine, toeiOedoLine

小田急：odakyuLine, odakyuEnoshimaLine, odakyuTamaLine
京王：keioLine, keioInokashiraLine, keioSagamiharaLine
東急：tokyuToyokoLine, tokyuDenEnToshiLine, tokyuMeguro,
      tokyuOimachiLine, tokyuTamagawa, tokyuIkegami, tokyuSetagayaLine
西武：seibuIkebukuroLine, seibuShinjukuLine
東武：tobuTojoLine, tobuIsesakiLine, tobuNikkoLine, tobuDaishiLine, tobuKameidoLine
京急：keikyuLine, keikyuKurihamaLine, keikyuAirportLine
京成：keiseiMainLine, keiseiOshiageLine, hokusouLine
相鉄：sotetsuMainLine, sotetsuIzumino, sotetsuJRLine

新交通等：tokyoMonorail, rinkaiLine, yurikamomeLine, tsukubaExpress,
          tamaMonorail, todenArakawaLine, nipporiToneriLiner

横浜・周辺：yokohamaBlueLine, yokohamaGreenLine, shonanMonorail,
            enoshimaElectricRailway

埼玉・その他：saitamaRailway, newShuttle, shinkeisei, toyoRapid
```

---

### 廃止された仕様（v0 以前）

| 廃止項目 | 内容 |
|---------|------|
| `BLEND` | 地理座標とスケマティックトラックの混合率（0.82 だった） |
| `classifyRoute` | 路線を H/V に分類する関数 |
| H/Vトラック | 横路線を y 固定、縦路線を x 固定に並べる擬似スケマティック |
| `makeOctilinearPath` | 線分を 0°/45°/90° に丸める関数 |
| `SVG_W / SVG_H` | 固定キャンバスサイズ（1044 × 900 px だった） |
| `GEO_MIN/MAX_LNG/LAT` | 固定地理範囲（lng 139.10–140.12, lat 35.22–35.92） |

---

### 既知の課題（v0 時点）

- ラベルが密集エリア（山手線内側など）で重なる場合がある
- 近距離駅（同一座標に近い）のラベル配置が最大 step=9 で強制配置になることがある
- 路線図としてのレイアウト調整（直線化・整列）は未実装
