"use client";

import { Check, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteTodo, toggleTodo } from "@/actions/todo";
import type { Todo } from "@/db/schema";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useState(
    todo.completed,
  );

  const handleToggle = () => {
    const newCompleted = !optimisticCompleted;
    setOptimisticCompleted(newCompleted);

    startTransition(async () => {
      try {
        await toggleTodo(todo.id, newCompleted);
      } catch (error) {
        console.error("Failed to toggle todo:", error);
        setOptimisticCompleted(todo.completed);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTodo(todo.id);
      } catch (error) {
        console.error("Failed to delete todo:", error);
      }
    });
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800",
        optimisticCompleted && "bg-gray-50 opacity-75 dark:bg-gray-900",
      )}
    >
      <div className="flex flex-1 items-center gap-3 overflow-hidden">
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            optimisticCompleted
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-400 text-transparent hover:border-green-500",
          )}
          disabled={isPending}
        >
          <Check size={14} strokeWidth={3} />
        </button>
        <span
          className={cn(
            "truncate text-lg transition-all",
            optimisticCompleted
              ? "text-gray-500 line-through"
              : "text-gray-800 dark:text-gray-100",
          )}
        >
          {todo.text}
        </span>
      </div>
      <button
        type="button"
        onClick={handleDelete}
        className="rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
        disabled={isPending}
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
