# 怪獣発生日 Webプロトタイプ

`/docs/` の企画資料をもとにした、ブラウザで動く怪獣育成ローグライトの MVP プロトタイプです。

## 含まれる要素

- 発生核 / 媒介環境 / 増幅要因の組み合わせによる怪獣ビルド
- 4 層の前兆マップ進行
- 都市攻略カードバトル
- 図鑑 / ラン履歴のローカル保存

## 起動方法

Docker で起動します。ローカルの言語ランタイムには依存しません。

```bash
docker compose up --build
```

起動後に `http://localhost:4173` を開いてください。

停止する場合は次を実行します。

```bash
docker compose down
```

## 構成

- `Dockerfile`: Nginx ベースの配信用イメージ
- `docker-compose.yml`: ローカル起動用の標準構成
- `nginx/default.conf`: 静的ファイル配信設定
- `.github/workflows/deploy-pages.yml`: GitHub Pages 自動デプロイ

## GitHub で公開する

GitHub Pages でそのままプレイできます。必要な workflow は追加済みです。

1. このディレクトリを GitHub リポジトリへ push する
2. デフォルトブランチを `main` にする
3. GitHub の `Settings > Pages` で `Build and deployment` の `Source` を `GitHub Actions` にする
4. `main` へ push すると自動で公開される

最初のデプロイ前に `Settings > Pages` を一度保存して、Pages を有効化してください。これが未設定だと workflow は `Get Pages site failed` で失敗します。

公開 URL は通常、次の形式です。

```text
https://<GitHubユーザー名>.github.io/<リポジトリ名>/
```
