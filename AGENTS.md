# AGENTS.md

このリポジトリを編集する AI エージェント（ChatGPT / Genspark / Claude Code ほか）向けの入口。

1. プロジェクトの規約は `CLAUDE.md` にある（コミット・デザイン・データの絶対ルール）。
2. **データ（路線・駅・直通運転・運行系統・駅統計・時刻表・ガイド）を編集する前に、
   `docs/data-editing-guide.md` を読むこと。**
3. 編集したら次を実行し、すべて通ってから変更を渡すこと。

   ```bash
   npm run test:data
   npm run test:types
   npm run test:design
   npm run test:unit
   npm run build
   ```

   同じものを GitHub Actions（`.github/workflows/ci.yml`）が PR ごとに実行する。
   **UI を書く・直すときは `docs/design-system.md` の「規則一覧（CI で検査）」と「どの部品を使うか」を先に読むこと**
   （色・文字サイズ・余白・角の丸み・影・開閉の印は定義元から取り、直書きすると CI が落ちる）。

4. 推測した値・出典の無い値をデータに書かない。分からないものは空けておく。
5. `main` に直接マージしない（ユーザーがプレビューで目視確認してからマージする）。
6. **記事（/articles）を書く・足すときは `docs/article-writing.md` を読むこと。**
   記事は `src/data/articles/{slug}.ts` に1記事1ファイル（ひな形 `docs/templates/article-template.ts`、
   指示文 `docs/templates/article-prompt.md`）。
