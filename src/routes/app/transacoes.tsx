import { createFileRoute } from "@tanstack/react-router";

import { TransactionsPage } from "~/components/pages/transactions";

export const Route = createFileRoute("/app/transacoes")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TransactionsPage />;
}
