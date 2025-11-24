import { Database } from "bun:sqlite";
import { beforeEach, describe, expect, it } from "bun:test";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { todos } from "@/db/schema";

describe("Local DB Tests", () => {
  let sqlite: Database;
  let db: ReturnType<typeof drizzle>;

  beforeEach(() => {
    // Use in-memory database for testing
    sqlite = new Database(":memory:");
    db = drizzle(sqlite);

    // Apply migrations
    migrate(db, { migrationsFolder: "./drizzle" });
  });

  it("should create a new todo", async () => {
    const newTodo = {
      text: "Test Todo",
    };

    const result = await db.insert(todos).values(newTodo).returning();

    expect(result.length).toBe(1);
    expect(result[0].text).toBe(newTodo.text);
    expect(result[0].completed).toBe(false);
    expect(result[0].id).toBeDefined();
  });

  it("should fetch todos", async () => {
    await db.insert(todos).values({ text: "Todo 1" });
    await db.insert(todos).values({ text: "Todo 2" });

    const allTodos = await db.select().from(todos);

    expect(allTodos.length).toBe(2);
  });

  it("should update a todo", async () => {
    const [created] = await db
      .insert(todos)
      .values({ text: "Update Me" })
      .returning();

    await db
      .update(todos)
      .set({ completed: true })
      .where(eq(todos.id, created.id));

    const [updated] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, created.id));

    expect(updated.completed).toBe(true);
  });

  it("should delete a todo", async () => {
    const [created] = await db
      .insert(todos)
      .values({ text: "Delete Me" })
      .returning();

    await db.delete(todos).where(eq(todos.id, created.id));

    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.id, created.id));

    expect(result.length).toBe(0);
  });
});
