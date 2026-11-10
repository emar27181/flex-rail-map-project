# リリースの手順とバージョンの付け方

設定パネル（表示切替）のいちばん下の「バージョン」に、いまの版・ビルドした時刻・更新の確認・更新履歴を出している。
中身は `src/data/releases.ts`（更新履歴）と `src/utils/appVersion.ts`（比較・確認）、`src/pages/version.json.ts`（サーバーの版）。

## 番号の付け方（2026-11 に決めた）

- `major.minor.patch`。1.0.0 は最初に PR でまとめて公開した版（PR #1, 2026-05-24）
- **新しい機能を含むリリースは真ん中を上げる**（1.33.6 → 1.34.0）。修正・改善・データ・文書・CI だけなら右端を上げる（1.34.0 → 1.34.1）
- 2026-11 に、それまでに `main` へ入った PR（1つ = 1リリース）の種類から番号を振り直した（1.0.0 〜 1.33.6）。
  それ以降は **`develop` → `main` の PR 1つ = 1リリース**
- 左端（major）を上げるのは、使い方が大きく変わるとき（ユーザーと相談して決める）

## リリースの PR を作るとき

1. `develop` に入っている PR を確かめる（`git log origin/main..origin/develop --merges`）
2. `src/data/releases.ts` の先頭に新しい版を足す
   - `version`: 上の決まりで1つ上げる（`kind` が `feat` なら真ん中）
   - `releasedAt: null`（まだ `main` に入っていないため。画面にはそのビルドの時刻が出る）
   - `prs`: 入っている PR の番号
   - `notes`: 画面に出す短い説明を日本語（`ja`）と英語（`en`）で。同じ数だけ書く。中国語・韓国語の画面では英語を出す
3. ひとつ前の版の `releasedAt` を、`main` に入った時刻（GitHub の `merged_at`、UTC）で埋める
4. `package.json` と `package-lock.json` の `version` を新しい版にそろえる
5. `npm run test:unit`（`tests/unit/data/releases.test.ts` が番号の上がり方・時刻の順・`package.json` との一致を確かめる）→ `build`
6. PR のタイトルは `Release 1.34.0` のようにし、本文に変更点と入っている PR を書く

## 更新の確認

「更新を確認」は `/version.json` をキャッシュを使わずに取りに行き、バージョンかビルドの時刻が違えば「新しい版があります」と再読み込みを出す。
ビルドの時刻とコミットは `astro.config.mjs` がビルドのときに埋め込む（地図のページと `/version.json` は同じビルドなので同じ値になる）。
最後に確認した時刻は、見ている人のブラウザにだけ残す（`localStorage`、無くても動く）。
