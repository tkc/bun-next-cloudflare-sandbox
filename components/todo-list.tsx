"use client";

import { Plus } from "lucide-react";
import { useRef } from "react";
import { addTodo } from "@/actions/todo";
import type { Todo } from "@/db/schema";
import { TodoItem } from "./todo-item";

function AddTodoForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      action={async (formData) => {
        await addTodo(formData);
        formRef.current?.reset();
      }}
      ref={formRef}
      className="flex w-full max-w-md gap-2"
    >
      <input
        type="text"
        name="text"
        placeholder="Add a new task..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        required
      />
      <button
        type="submit"
        className="flex items-center justify-center rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        <Plus size={24} />
      </button>
    </form>
  );
}

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const todos = initialTodos;

  return (
    <>
      <AddTodoForm />
      {!todos || todos.length === 0 ? (
        <div className="mt-10 text-center text-gray-500">
          <p>No tasks yet. Add one above!</p>
        </div>
      ) : (
        <div className="mt-6 flex w-full max-w-md flex-col gap-3">
          {todos.map((todo: Todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </>
  );
}
