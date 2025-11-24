import { getTodos } from "@/actions/todo";
import { TodoList } from "@/components/todo-list";

export const dynamic = "force-dynamic";

export default async function Home() {
  const todos = await getTodos();

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-8 font-sans text-gray-900 md:p-24 dark:bg-gray-950 dark:text-gray-100">
      <div className="z-10 mb-12 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed top-0 left-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pt-8 pb-6 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:dark:bg-zinc-800/30">
          Bun + Next.js + Drizzle TODO App
        </p>
      </div>

      <div className="flex w-full max-w-2xl flex-col items-center">
        <h1 className="mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-4xl font-bold text-transparent">
          My Tasks
        </h1>

        <TodoList initialTodos={todos} />
      </div>
    </main>
  );
}
