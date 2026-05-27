import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const USER_EMAIL = "efraim.dev@gmail.com";

const TRANSACTIONS: {
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
}[] = [
  // Recurring expenses
  { description: "Aluguel", amount: 1800, type: "EXPENSE", category: "Utilidades" },
  { description: "Condomínio", amount: 450, type: "EXPENSE", category: "Utilidades" },
  { description: "Internet", amount: 119.9, type: "EXPENSE", category: "Utilidades" },
  { description: "Plano de saúde", amount: 299.9, type: "EXPENSE", category: "Saúde" },
  { description: "Academia", amount: 89.9, type: "EXPENSE", category: "Saúde" },
  { description: "Netflix", amount: 55.9, type: "EXPENSE", category: "Entretenimento" },
  { description: "Spotify", amount: 21.9, type: "EXPENSE", category: "Entretenimento" },
  { description: "Seguro auto", amount: 190, type: "EXPENSE", category: "Carro" },
  // Food & market
  { description: "Mercado", amount: 587.3, type: "EXPENSE", category: "Mercado" },
  { description: "Açougue", amount: 89.5, type: "EXPENSE", category: "Mercado" },
  { description: "Feira", amount: 45, type: "EXPENSE", category: "Mercado" },
  // Car
  { description: "Gasolina", amount: 210, type: "EXPENSE", category: "Carro" },
  { description: "Estacionamento", amount: 25, type: "EXPENSE", category: "Carro" },
  { description: "Pedágio", amount: 14.5, type: "EXPENSE", category: "Carro" },
  { description: "Manutenção carro", amount: 850, type: "EXPENSE", category: "Carro" },
  // Health
  { description: "Farmácia", amount: 67.8, type: "EXPENSE", category: "Saúde" },
  { description: "Dentista", amount: 350, type: "EXPENSE", category: "Saúde" },
  { description: "Exames", amount: 180, type: "EXPENSE", category: "Saúde" },
  { description: "Psicólogo", amount: 200, type: "EXPENSE", category: "Saúde" },
  // Entertainment
  { description: "Cinema", amount: 42, type: "EXPENSE", category: "Entretenimento" },
  { description: "Jantar fora", amount: 134.5, type: "EXPENSE", category: "Entretenimento" },
  { description: "Livros", amount: 79.9, type: "EXPENSE", category: "Entretenimento" },
  { description: "Show", amount: 250, type: "EXPENSE", category: "Entretenimento" },
  // Incomes
  { description: "Salário mensal", amount: 8500, type: "INCOME", category: "Salário" },
  { description: "Freelance", amount: 2200, type: "INCOME", category: "Salário" },
  { description: "Dividendos", amount: 350, type: "INCOME", category: "Investimentos" },
  { description: "CDB", amount: 400, type: "INCOME", category: "Renda Fixa" },
  { description: "FII", amount: 180, type: "INCOME", category: "Investimentos" },
  { description: "Tesouro Direto", amount: 250, type: "INCOME", category: "Renda Fixa" },
  // Miscellaneous
  { description: "Seguro celular", amount: 39.9, type: "EXPENSE", category: "Utilidades" },
  { description: "iCloud", amount: 10.9, type: "EXPENSE", category: "Utilidades" },
  { description: "Vestuário", amount: 320, type: "EXPENSE", category: "Utilidades" },
  { description: "Cabelereiro", amount: 65, type: "EXPENSE", category: "Saúde" },
  { description: "Uber", amount: 38.5, type: "EXPENSE", category: "Carro" },
  { description: "Transporte público", amount: 220, type: "EXPENSE", category: "Carro" },
  { description: "Curso online", amount: 29.9, type: "EXPENSE", category: "Entretenimento" },
  { description: "Presente", amount: 150, type: "EXPENSE", category: "Utilidades" },
  { description: "Assinatura anual", amount: 180, type: "EXPENSE", category: "Entretenimento" },
  { description: "Aplicativo", amount: 19.9, type: "EXPENSE", category: "Utilidades" },
  { description: "Tarifa bancária", amount: 29.8, type: "EXPENSE", category: "Utilidades" },
  // More incomes for balance
  { description: "Bônus anual", amount: 3000, type: "INCOME", category: "Salário" },
  { description: "Venda de usados", amount: 600, type: "INCOME", category: "Salário" },
  { description: "Cashback", amount: 23.5, type: "INCOME", category: "Investimentos" },
  // Extra items to reach 50
  { description: "Mercado", amount: 720.1, type: "EXPENSE", category: "Mercado" },
  { description: "Mercado", amount: 498.5, type: "EXPENSE", category: "Mercado" },
  { description: "Gasolina", amount: 178, type: "EXPENSE", category: "Carro" },
  { description: "Salário mensal", amount: 8500, type: "INCOME", category: "Salário" },
  { description: "Freelance", amount: 1800, type: "INCOME", category: "Salário" },
  { description: "CDB", amount: 300, type: "INCOME", category: "Renda Fixa" },
  { description: "Mercado", amount: 612.4, type: "EXPENSE", category: "Mercado" },
];

function randomDate(): Date {
  const now = new Date();
  const past = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

async function seed() {
  const user = await prisma.user.findUnique({ where: { email: USER_EMAIL } });

  if (!user) {
    console.error(`User ${USER_EMAIL} not found`);
    process.exit(1);
  }

  const categories = await prisma.category.findMany({ where: { userId: user.id } });
  const categoryNames = new Set(categories.map((c) => c.name));

  const validTransactions = TRANSACTIONS.filter((t) => categoryNames.has(t.category));
  const skipped = TRANSACTIONS.length - validTransactions.length;

  console.log(
    `Creating ${validTransactions.length} transactions for ${user.name} (${user.email})${skipped > 0 ? `, ${skipped} skipped (unknown categories)` : ""}`,
  );

  const data = validTransactions.map((t) => ({
    description: t.description,
    amount: t.amount,
    type: t.type,
    category: t.category,
    date: randomDate(),
    userId: user.id,
    isExample: false,
  }));

  await prisma.transaction.createMany({ data });

  console.log(`Done. Created ${data.length} transactions.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
