# Netlifyビルド時間の最適化（Flex Railway Map / Memorio 共通ポリシー）

GitHub Actions（型・Lint・単体/UI/描画テストなど）はこれまでどおり維持。Netlifyは本番デプロイと、明示的に必要なDeploy Previewに集中させる。

| イベント | GitHub Actions | Netlify |
| --- | --- | --- |
| PR作成・更新（通常） | 従来のCIを実行 | Deploy Previewはスキップ |
| プレビューを要求したPRの最新コミット | 従来のCIを実行 | Deploy Previewをビルド |
| mainにコード・画像・データ・設定をマージ | 従来のCIを実行 | 本番ビルド |
| mainでREADME・docs・CI設定・テストのみ変更 | 従来のCIを実行 | 変更差分を安全に確認できたときだけスキップ |
| branch-deploy（本番以外の直接push） | リポジトリのCI設定どおり | スキップ |

## 実装と安全な失敗動作

- netlify.toml の build.ignore から scripts/netlify-ignore.mjs を起動する。Netlify公式仕様は終了コード **0=スキップ、1=ビルド**。
- PRのプレビュー許可は **最新コミットのメッセージに [netlify-preview] が含まれる場合のみ**。PR本文・ラベルでは切り替わらない。
- 本番は Netlifyの COMMIT_REF と CACHED_COMMIT_REF の祖先関係を確認し、両コミット間の累積差分を比較する。source・brain・public・netlify/functions・netlify.toml・ビルドスクリプト・依存関係の変更はビルドする。
- README.md、docs/、.github/、tests/ 等の既知の非デプロイファイルのみならスキップする。**brain/*.mdはMemorioの本番データなので対象外**。
- Git参照が無い・同一・浅い履歴で比較不可・HEAD不一致・未知のコンテキスト等は **本番ビルド実行**。スキップによって必要な公開が失われるより、余分な1回のビルドを許容する。
- GitHub Actionsの既存CI concurrency / cancel-in-progress はすでに設定済み。権限・シークレットの追加やGitHub API呼び出しは不要。
- ビルドフック経由ではNetlifyがignoreを適用しない仕様。第三者連携やhooksによる追加ビルドはNetlify画面で別途調査する。

## プレビューの要求方法

変更を確認したいPRのブランチで、**最後のコミット**に [netlify-preview] を含めてpushする。必要なら次のコマンドで空コミットを作成する。

```bash
git commit --allow-empty -m "chore: request preview [netlify-preview]"
git push
```

後続コミットがマーカー無しなら次回のプレビューはスキップされ、前のプレビューは古くなる。再度必要なときだけマーカー付きコミットを作る。これもNetlifyがビルドできる利用枠に戻ってから確認する。

## 外部PRとシークレット

- [netlify-preview] はPR作成者も指定できる **ビルド要求の目印であり、承認・認可ではない**。パブリックリポジトリの外部PRが無制限にNetlifyビルドや機密値を使える設定にしない。
- Flex Railway Mapのような公開Git連携サイトでは、Netlifyの **Sensitive variable policy** を「Require approval」（推奨）または「Deploy without sensitive variables」にする。**Deploy without restrictions は避ける**。誰がプレビューを要求しても、承認とシークレットの扱いはNetlify側で制御する。
- Memorioのプレビューにも不要な秘密情報・個人データを渡さない。環境変数は本番/プレビューのスコープを分離し、プレビューの公開範囲を確認する。
- GitHub Actionsのpull_requestには新しい書き込み権限やトークンを渡さず、Netlifyの認証情報をこのリポジトリに保存しない。
## Netlify管理画面で確認（このPRからは変更しない）

1. 各サイトの Project configuration → Developer settings → Continuous deployment で **Deploy Previewsが有効**、追加のBranch deployが不要なら無効になっていることを確認。
2. **Build statusを止めない**。サイト全体のビルド停止はmainの本番デプロイも止める。
3. Build hooks / 他のCI / 別のGit連携が二重にNetlifyビルドを要求していないかDeploy履歴で確認。
4. 無料枠リセット後、(a) 通常PRはIgnored、(b) マーカー付きPRはDeploy Preview生成、(c) READMEのみのmain更新は条件が揃えばIgnored、(d) コード変更を含むmain更新は本番更新、を実際のNetlifyログで確認。
5. build.statusやプレビュー設定、月間利用時間の変化を同じ画面で記録する。

## 制約・費用

- Netlify Legacy Freeの300分/月はチーム全体の枠。最も大きな削減はPRビルド停止だが、**50%削減の達成はPR/本番ビルド内訳とNetlify利用実績で検証する必要がある**。
- ignoreコマンド自体にかかる初期化時間が完全に無料になるとは保証しない。キャッシュミスやGit履歴不明時は安全側で本番をビルドする。
- 2026年10月は無料枠超過中のため、Netlifyの実ビルド・公開更新・ログ検証は **未実施**。GitHubのCI成功はNetlify本番デプロイ成功を意味しない。

公式: https://docs.netlify.com/build/configure-builds/ignore-builds/  /  https://docs.netlify.com/build/configure-builds/environment-variables/  /  https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/
