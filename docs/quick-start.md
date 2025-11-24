# クイックスタートガイド

## 開発フロー

### ローカル開発（高速）

```bash
bun run dev
# http://localhost:3000 でアクセス
# Node.js Runtime + better-sqlite3 が使用されます
```

### 本番に近い開発（Edge Runtime + D1）

```bash
bun run dev:edge
# CLOUDFLARE_BUILD=true が自動設定され、Edge Runtime が有効化されます
# http://localhost:8788 でアクセス（Wrangler が提供するローカル D1）
```

## 仕組み

- **ランタイム切り替え**: `CLOUDFLARE_BUILD` が `true` のとき `app/api/[[...route]]/route.ts` の `export const runtime = "edge"` が有効になり、Edge Runtime が使用されます。
- **データベース切り替え**: `process.env.NODE_ENV` が `development` のときは `db/index.dev.ts`（`better-sqlite3`）を、`production` のときは `db/index.prod.ts`（Cloudflare D1）をロードします。

## デプロイ手順

```bash
bun run deploy
# 内部で `pages:build` → `wrangler pages deploy` が実行され、Edge Runtime と D1 が本番環境で動作します。
```

## データベース操作（マイグレーション）

```bash
# マイグレーションファイル生成
bun db:generate

# 本番 D1 に適用
bun db:migrate:prod
```

## 注意点

- デプロイ前に必ず `export const runtime = "edge"` がコメントアウトされていないことを確認してください。
- Firebase Auth など Node.js 専用ライブラリは API Routes では使用できません。代替として Cloudflare Access、Clerk、Auth0 などをご検討ください。
- ローカルで D1 を使用する場合は `wrangler.toml` に `preview_database_id = "DB"` を設定してください（`docs/cloudflare-deployment.md` 参照）。

## 参考リンク

- [公式ドキュメント: Cloudflare Pages + Next.js](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
- [Hono + Cloudflare Workers REST API 記事](https://zenn.dev/da1/articles/cloudflare-nextjs-hono-drizzle)
- [Edge Runtime の制約一覧](https://developers.cloudflare.com/workers/platform/limitations/)
