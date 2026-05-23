import DataLoader from "dataloader";
import { prisma } from "@/lib/prisma.js";

// ─── User loader ─────────────────────────────────────────────────────────────

function batchUsers(ids: readonly string[]) {
  return prisma.user
    .findMany({
      where: { id: { in: [...ids] } },
    })
    .then((users) => {
      const map = new Map(users.map((u) => [u.id, u]));

      return ids.map((id) => map.get(id) ?? null);
    });
}

export function createLoaders() {
  return {
    user: new DataLoader(batchUsers),
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
