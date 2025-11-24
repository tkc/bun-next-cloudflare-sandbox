# Cloudflare デプロイガイド

このガイドでは、Bun + Next.js + Drizzle アプリケーションを Cloudflare Workers (OpenNext) にデプロイする方法を説明します。

## 利用環境

このプロジェクトは以下の環境とツールで構成されています。

| 項目                 | 詳細                                                     |
| -------------------- | -------------------------------------------------------- |
| **OS**               | macOS                                                    |
| **Runtime (Local)**  | Bun                                                      |
| **Runtime (Prod)**   | Cloudflare Workers (workerd)                             |
| **Framework**        | Next.js 16 (App Router)                                  |
| **Adapter**          | @opennextjs/cloudflare                                   |
| **Database**         | Drizzle ORM (Local: better-sqlite3, Prod: Cloudflare D1) |
| **Linter/Formatter** | Biome                                                    |
| **Package Manager**  | Bun                                                      |

## 前提条件

- Cloudflare アカウント
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Bun

## 1. Cloudflare 認証

Wrangler コマンドを使用する前に、Cloudflare にログインします。

```bash
bunx wrangler login
```

## 2. Cloudflare D1 データベースのセットアップ

Cloudflare D1 データベースを作成します。

```bash
bunx wrangler d1 create bun-next-todo
```

作成後、出力された `database_id` を `wrangler.toml` に設定します。

## 3. 設定ファイル

### `wrangler.toml`

```toml
name = "bun-next-todo"
main = ".open-next/worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
assets = { directory = ".open-next/assets", binding = "ASSETS" }

[[d1_databases]]
binding = "DB"
database_name = "bun-next-todo"
database_id = "YOUR_DATABASE_ID"
```

### `next.config.ts`

OpenNext を使用するため、標準的な Next.js 設定で動作します。

## 4. データベースマイグレーション

### ローカル

```bash
bun run db:generate
# ローカルDBは better-sqlite3 を使用するため、アプリ起動時に自動的に初期化されます（実装依存）
```

### 本番 (Cloudflare D1)

```bash
bun run db:migrate:prod
```

## 5. 開発とデプロイ

### ローカル開発

```bash
bun run dev
```

### Worker プレビュー (ローカル)

```bash
bun run dev:worker
```

### 本番デプロイ

```bash
bun run deploy
```

このコマンドは以下を実行します：

1. `bun run build:worker` (@opennextjs/cloudflare build)
2. `bunx wrangler deploy`

## 注意事項

- **OpenNext**: このプロジェクトは `@opennextjs/cloudflare` を使用して Next.js を Cloudflare Workers に適合させています。
- **Server Actions**: Server Actions 内で `getCloudflareContext()` を使用して D1 バインディングにアクセスしています。
