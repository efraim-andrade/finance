import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: "Carro", description: "", color: "purple", icon: "car" },
  { name: "Entretenimento", description: "", color: "pink", icon: "ticket" },
  { name: "Investimentos", description: "", color: "green", icon: "receipt" },
  { name: "Mercado", description: "", color: "orange", icon: "cart" },
  { name: "Renda Fixa", description: "", color: "green", icon: "piggy" },
  { name: "Salário", description: "", color: "green", icon: "piggy" },
  { name: "Saúde", description: "", color: "red", icon: "dumbbell" },
  { name: "Utilidades", description: "", color: "yellow", icon: "wrench" },
];

async function seed() {
  const users = await prisma.user.findMany({ select: { id: true } });

  if (users.length === 0) {
    console.log("No users found. Skipping category seed.");

    return;
  }

  let created = 0;

  for (const user of users) {
    const insertedCount = await prisma.$transaction(async (transaction) => {
      const existing = await transaction.category.findMany({
        where: { userId: user.id },
        select: { name: true },
      });
      const existingNames = new Set(existing.map((category) => category.name));
      const categories = DEFAULT_CATEGORIES.filter(
        (category) => !existingNames.has(category.name),
      );

      if (categories.length === 0) {
        return 0;
      }

      const result = await transaction.category.createMany({
        data: categories.map((category) => ({
          ...category,
          userId: user.id,
        })),
      });

      return result.count;
    });

    created += insertedCount;
  }

  console.log(`Seeded ${created} user categories.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
