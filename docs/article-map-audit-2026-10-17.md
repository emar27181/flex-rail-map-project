# 記事の地図URL全件確認（2026-10-17）

対象: ARTICLE_SOURCES 登録37記事。既存路線データの表示指定だけを変更し、座標・駅・運行データは変更しない。

13記事の比較・乗換対象を補完。詳細は maps.main 参照に統一し、4言語の埋め込み・CTA・画像撮影URLは既存の共通生成処理を使用する。

上野・浅草・江の島・秋葉原・新宿・渋谷/原宿/表参道・東京/大手町の7記事は、既存の `focus` で駅周辺から開く。比較路線は全区間保持するが、遠方の終点まで画面に詰め込まない。上野の結論は4言語で駅の違いと比較方法を具体化し、京成公式の駅案内を出典にする。

札幌ガイドは既に3路線・乗換・空港アクセスへの直接回答があり、今回は日本語タイトルを短くした。JR奈良線の英語ページも既に駅一覧・観光地・地図への導線があるため、この版では本文を重複改稿せず実操作を確認する。

## データ不足

- 川越: JR川越線未収録。埼京線は大宮までであり代用しない。
- 成田: JR成田線は千葉〜銚子で空港支線がない。空港比較に代用しない。
- 富士急: 大月へ接続するJR区間未収録。離れた中央線区間を足さない。
- 羽田: 東京モノレールのターミナル駅が現データで合成されているため、個々のターミナル案内の正確性は別途データ修正が必要。

## 全件判定

| 記事 | 判定 |
|---|---|
| airport-terminal-train-station-names | 複数路線へ修正（冒頭・詳細・CTA共通） |
| akihabara-lines-transfer | 複数路線へ修正（冒頭・詳細・CTA共通） |
| asakusa-multiple-stations | 複数路線へ修正（冒頭・詳細・CTA共通） |
| asakusa-skytree-stations | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| commute-30min-cheap-rent | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| disneyland-maihama-keiyo | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| enoshima-three-station-names | 複数路線へ修正（冒頭・詳細・CTA共通） |
| express-vs-local-stop-check | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| flex-rail-map-introduction | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| fujikyu-railway-transfer | データ不足を4言語の結論・地図説明に明記 |
| fukuoka-airport-subway-map | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| hakone-odakyu-transfer | 複数路線へ修正（冒頭・詳細・CTA共通） |
| haneda-keikyu-monorail-map | 複数路線へ修正（冒頭・詳細・CTA共通） |
| how-to-read-station-numbers | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| kamakura-enoden-stations | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| kawagoe-tobu-vs-jr | データ不足を4言語の結論・地図説明に明記 |
| kyoto-karasuma-subway-first | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| nagoya-higashiyama-first-map | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| narita-jr-keisei-map | データ不足を4言語の結論・地図説明に明記 |
| nikko-tobu-vs-jr | 複数路線へ修正（冒頭・詳細・CTA共通） |
| odaiba-yurikamome-rinkai | 複数路線へ修正（冒頭・詳細・CTA共通） |
| osaka-midosuji-first-map | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| sapporo-namboku-line-map | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| sendai-namboku-subway-map | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| shibuya-harajuku-omotesando-map | 複数路線へ修正（冒頭・詳細・CTA共通） |
| shinjuku-station-line-first | 複数路線へ修正（冒頭・詳細・CTA共通） |
| station-exit-vs-platform-number | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| through-service-line-name-change | 複数路線へ修正（冒頭・詳細・CTA共通） |
| tokyo-metro-line-letters | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| tokyo-rent-by-route | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| tokyo-safe-area-by-route | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| tokyo-sightseeing-routes | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| tokyo-station-otemachi-difference | 複数路線へ修正（冒頭・詳細・CTA共通） |
| tokyo-train-map-beginner | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| ueno-keisei-ueno-difference | 複数路線へ修正（冒頭・詳細・CTA共通） |
| yokohama-blue-line-beginners | 既存の単路線テーマまたは複数路線・駅指定を維持 |
| yokohama-minatomirai-line | 既存の単路線テーマまたは複数路線・駅指定を維持 |

- 秋葉原: 中央・総武線各駅停車の秋葉原区間も未収録。中央線で代用せず、表示可能な4路線と不足を記事内に明記。
