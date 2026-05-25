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
  const existing = await prisma.category.findFirst();

  if (existing) {
    console.log("Categories already seeded. Skipping.");

    return;
  }

  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES,
  });

  console.log(`Seeded ${DEFAULT_CATEGORIES.length} global categories.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
