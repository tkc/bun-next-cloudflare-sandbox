"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { todos } from "@/db/schema";

export async function getTodos() {
  const db = getDb();
  return await db.select().from(todos).orderBy(desc(todos.createdAt));
}

export async function addTodo(formData: FormData) {
  const db = getDb();
  const text = formData.get("text") as string;
  if (!text) return;

  await db.insert(todos).values({ text });
  revalidatePath("/");
}

export async function toggleTodo(id: number, completed: boolean) {
  const db = getDb();
  await db.update(todos).set({ completed }).where(eq(todos.id, id));
  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  const db = getDb();
  await db.delete(todos).where(eq(todos.id, id));
  revalidatePath("/");
}
