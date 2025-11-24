import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getDb } from "@/db";
import { todos } from "@/db/schema";

const app = new Hono().basePath("/api");

// GET /api/todos - Fetch all todos
app.get("/todos", async (c) => {
  try {
    const db = getDb(c.env);
    const allTodos = await db
      .select()
      .from(todos)
      .orderBy(desc(todos.createdAt));
    return c.json(allTodos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return c.json(
      {
        error: "Failed to fetch todos",
        details: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

// POST /api/todos - Add a new todo
app.post("/todos", async (c) => {
  try {
    const { text } = await c.req.json();
    if (!text) {
      return c.json({ error: "Text is required" }, 400);
    }

    const db = getDb(c.env);
    await db.insert(todos).values({ text });

    return c.json({ success: true }, 201);
  } catch (error) {
    console.error("Error adding todo:", error);
    return c.json({ error: "Failed to add todo" }, 500);
  }
});

// PATCH /api/todos/:id - Toggle todo completion
app.patch("/todos/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    const { completed } = await c.req.json();

    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid ID" }, 400);
    }

    const db = getDb(c.env);
    await db.update(todos).set({ completed }).where(eq(todos.id, id));

    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating todo:", error);
    return c.json({ error: "Failed to update todo" }, 500);
  }
});

// DELETE /api/todos/:id - Delete a todo
app.delete("/todos/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);

    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid ID" }, 400);
    }

    const db = getDb(c.env);
    await db.delete(todos).where(eq(todos.id, id));

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return c.json({ error: "Failed to delete todo" }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
