import { Input } from "#/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg text-brand-base">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>

      <div className="flex flex-col gap-4 p-10 mt-10">
        <h2>This is my inputs</h2>

        <Input label="Nome" placeholder="Insira seu nome" />

        <Input label="Email" type="email" placeholder="Insira seu email" />
      </div>
    </div>
  );
}
