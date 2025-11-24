# アーキテクチャ概要 - デュアル環境サポート

## 全体像

このアプリは **Next.js (App Router) + Server Actions + Drizzle ORM** をベースに、

- **ローカル開発**: `better-sqlite3` と Node.js Runtime を使用
- **本番 (Cloudflare Workers)**: Cloudflare D1 と Edge Runtime (OpenNext) を使用

ファイル構成は `NODE_ENV` に応じてデータベース接続を切り替える方式を採用しています。

## ディレクトリ構成

```
db/
├── index.ts       # NODE_ENV に応じて dev / prod を条件分岐
├── index.dev.ts   # ローカル開発用 (better-sqlite3)
└── index.prod.ts  # 本番用 (Cloudflare D1)
actions/
└── todo.ts        # Server Actions (DB操作ロジック)
```

### `db/index.ts`

```typescript
export const getDb =
  process.env.NODE_ENV === "development"
    ? require("./index.dev").getDb
    : require("./index.prod").getDb;
```

### Server Actions (`actions/todo.ts`)

API Routes の代わりに Server Actions を使用してデータの取得・更新を行います。
本番環境では `getCloudflareContext()` を通じて D1 バインディングにアクセスします。

```typescript
"use server";
import { getDb } from "@/db";
// ...
export async function getTodos() {
  const db = getDb();
  // ...
}
```

## ランタイムと互換性

- **OpenNext**: `@opennextjs/cloudflare` を使用して Next.js アプリを Cloudflare Workers に適合させています。
- **`better-sqlite3`**: Node.js 環境専用のため、ローカル開発でのみ使用されます。
- **`drizzle-orm/d1`**: Cloudflare Workers 環境で使用されます。

## 推奨ワークフロー

| フェーズ                  | コマンド             | ランタイム | データベース             |
| ------------------------- | -------------------- | ---------- | ------------------------ |
| **ローカル開発 (高速)**   | `bun run dev`        | Node.js    | `better-sqlite3`         |
| **Worker プレビュー**     | `bun run dev:worker` | Workerd    | Cloudflare D1 (ローカル) |
| **本番ビルド & デプロイ** | `bun run deploy`     | Workerd    | Cloudflare D1            |

## 参考リンク

- [公式ドキュメント: OpenNext](https://opennext.js.org/)
- [Drizzle ORM: Cloudflare D1](https://orm.drizzle.team/docs/get-started-sqlite#cloudflare-d1)

---

このドキュメントは、**ローカル開発と本番デプロイの両方をスムーズに行うための設計指針** を示しています。上記手順に従って、開発・テスト・デプロイを行ってください。
