# アーキテクチャ概要 - デュアル環境サポート

## 全体像

このアプリは **Next.js + Hono + Drizzle ORM** をベースに、

- **ローカル開発**: `better-sqlite3` と Node.js Runtime を使用
- **本番 (Cloudflare Pages)**: Cloudflare D1 と Edge Runtime を使用

ファイル構成は `NODE_ENV` に応じてデータベース接続を切り替える方式を採用しています。

## ディレクトリ構成

```
db/
├── index.ts       # NODE_ENV に応じて dev / prod を条件分岐
├── index.dev.ts   # ローカル開発用 (better-sqlite3)
└── index.prod.ts  # 本番用 (Cloudflare D1)
```

### `db/index.ts`

```typescript
export const getDb =
  process.env.NODE_ENV === "development"
    ? require("./index.dev").getDb
    : require("./index.prod").getDb;
```

### `app/api/[[...route]]/route.ts`

```typescript
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getDb } from "@/db";
import { todos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Cloudflare Pages 用に Edge Runtime を必ず有効化
export const runtime = "edge";

const app = new Hono().basePath("/api");
// ... ルート定義は省略 ...
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
```

> **重要**: `export const runtime = "edge"` は **静的文字列** でなければならず、条件式は使用できません。

## Edge Runtime の制約

- Node.js のビルトインモジュール (`fs`, `path`, `crypto` など) が使用不可
- `better-sqlite3` は `fs` に依存するため **ローカル開発** では Edge Runtime を無効化する必要があります

## 推奨ワークフロー

| フェーズ                  | コマンド                                                   | ランタイム | データベース                |
| ------------------------- | ---------------------------------------------------------- | ---------- | --------------------------- |
| **ローカル開発 (高速)**   | `bun run dev`                                              | Node.js    | `better-sqlite3`            |
| **本番に近いテスト**      | `bun run dev:edge` (内部で `CLOUDFLARE_BUILD=true` が設定) | Edge       | Cloudflare D1 (ローカル D1) |
| **本番ビルド & デプロイ** | `bun run deploy`                                           | Edge       | Cloudflare D1               |

### 手順詳細

1. **ローカル開発**: `app/api/[[...route]]/route.ts` の `export const runtime = "edge"` をコメントアウトし、`bun run dev` を実行します。
2. **本番テスト**: `bun run dev:edge` を実行すると `CLOUDFLARE_BUILD=true` が自動設定され、Edge Runtime が有効化されます。`/api` エンドポイントは D1 に接続します。
3. **デプロイ**: `bun run deploy` (内部で `pages:build` → `wrangler pages deploy`) を実行し、Edge Runtime と D1 が本番環境で動作します。

## 注意点

- **デプロイ前**に必ず `export const runtime = "edge"` が有効になっていることを確認してください。忘れるとローカルで動作したコードが Cloudflare にデプロイできません。
- **Firebase Auth** 等、Node.js 専用ライブラリは API Routes では使用できません。代替として Cloudflare Access、Clerk、Auth0 等を検討してください。
- **`wrangler.toml`** に `preview_database_id = "DB"` を設定し、ローカル D1 開発を有効にします（詳細は `docs/cloudflare-deployment.md` 参照）。

## トラブルシューティング

- **Edge Runtime が `fs` をサポートしない**: `runtime` をコメントアウトしてローカルで実行、または Wrangler でテスト。
- **`DB binding not found`**: `wrangler.toml` の D1 バインディング設定と `process.env.DB` が正しく設定されているか確認。
- **ビルド時に `runtime must be static` エラー**: 条件式ではなく `export const runtime = "edge";` を使用。

## 参考リンク

- [公式ドキュメント: Cloudflare Pages + Next.js](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
- [Hono + Cloudflare Workers REST API 記事](https://zenn.dev/da1/articles/cloudflare-nextjs-hono-drizzle)
- [Edge Runtime の制約一覧](https://developers.cloudflare.com/workers/platform/limitations/)

---

このドキュメントは、**ローカル開発と本番デプロイの両方をスムーズに行うための設計指針** を示しています。上記手順に従って、開発・テスト・デプロイを行ってください。
