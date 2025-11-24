import { D1Database } from "@cloudflare/workers-types";

declare global {
  interface CloudflareEnv {
    DB: D1Database;
  }

  namespace NodeJS {
    interface ProcessEnv {
      DB: D1Database;
    }
  }
}
