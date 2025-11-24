import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// biome-ignore lint/suspicious/noExplicitAny: env can be any object
export function getDb(env?: any) {
  let dbBinding = env?.DB || process.env.DB;

  if (!dbBinding) {
    try {
      const context = getCloudflareContext();
      dbBinding = context.env.DB;
    } catch (e) {
      console.warn("Failed to get Cloudflare context:", e);
    }
  }

  if (!dbBinding) {
    throw new Error(
      "DB binding not found. Ensure 'DB' is bound in wrangler.toml and passed to getDb().",
    );
  }
  return drizzle(dbBinding, { schema });
}
