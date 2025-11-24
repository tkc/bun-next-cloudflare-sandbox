import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// $inferSelect: データベースから取得したデータの型（読み取り用）。全てのカラムが含まれます。
export type Todo = typeof todos.$inferSelect;

// $inferInsert: データベースに挿入するデータの型（書き込み用）。idやdefault値があるカラムは省略可能です。
export type NewTodo = typeof todos.$inferInsert;
