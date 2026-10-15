# 全国駅ナンバリング調査ログ

更新日: 2026-10-15

## データ管理方針

- 駅番号の正本は `src/data/stationNumbers.ts`。2D・英語表示は既存の `getStationNumber(routeKey, stationName)` を再利用する。
- 公式駅ナンバリングがある路線と、未導入または未調査の路線を区別する。未調査を「番号なし」と断定しない。
- 駅番号は事業者・路線の組合せに紐づく。駅名だけから別路線の番号を流用しない。
- 新しい値は公式路線図・駅案内を確認し、駅名の表記を `routes` に合わせ、出典と確認日を残す。番号の連番推測は禁止。
- データ変更後は `npm run test:data`、`npm run test:types`、`npm run test:unit`、`npm run build` と GitHub CI を確認する。

## 今回確認・追加した路線

| routeKey | 採用駅番号 | 件数 | 公式出典 |
|---|---|---:|---|
| `enoshimaElectricRailway` | EN01〜EN15（藤沢〜鎌倉） | 15 | [江ノ島電鉄による公式ナンバリング一覧](https://www.odakyu.jp/program/info/data.info/8052_1284200_.pdf) |
| `tokyuSetagayaLine` | SG01〜SG10（三軒茶屋〜下高井戸） | 10 | [東急電鉄・世田谷線公式路線図](https://www.tokyu.co.jp/railway/sg/) |

## 継続調査

- 全国各鉄道事業者の公式資料から「ナンバリング導入済みで未登録」の路線を抽出し、地域ごとに追加。
- `src/data/stationNumbers.ts` の既存登録値も公式出典との突合が必要（本PRで全件確認済みと扱わない）。
- カバー率の母数は「リポジトリに登録されている全路線」と「公式ナンバリングを導入している路線・駅」で異なる。単純な登録率を公式カバー率とは呼ばない。
- `getAnyStationNumber(stationName)` は別路線・別地域の同名駅コードを誤って返すリスクがある。UIの呼び出し元を調査し、路線キーで絞る設計に移行する（既存利用への影響を別PRで検証）。
