# AGENTS.md

このリポジトリを編集する AI エージェント（ChatGPT / Genspark / Claude Code ほか）向けの入口。

1. プロジェクトの規約は `CLAUDE.md` にある（コミット・デザイン・データの絶対ルール）。
2. **データ（路線・駅・直通運転・運行系統・駅統計・時刻表・ガイド）を編集する前に、
   `docs/data-editing-guide.md` を読むこと。**
3. 編集したら次を実行し、すべて通ってから変更を渡すこと。

   ```bash
   npm run test:data
   npm run test:types
   npm run test:unit
   npm run build
   ```

4. 推測した値・出典の無い値をデータに書かない。分からないものは空けておく。
5. `main` に直接マージしない（ユーザーがプレビューで目視確認してからマージする）。
