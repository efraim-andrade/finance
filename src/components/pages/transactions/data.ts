import {
	BriefcaseBusiness,
	CarFront,
	PiggyBank,
	ShoppingCart,
	Ticket,
	Utensils,
} from "lucide-react";

export type TransactionType = "income" | "expense";

export const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
	income: "Entrada",
	expense: "Saída",
};

export type CategoryVariant =
	| "blue"
	| "purple"
	| "orange"
	| "green"
	| "yellow"
	| "pink";

export type Transaction = {
	id: string;
	description: string;
	date: string;
	category: string;
	categoryVariant: CategoryVariant;
	iconBg: string;
	iconColor: string;
	Icon: typeof Utensils;
	type: TransactionType;
	value: number;
};

export const categories = [
	{ label: "Alimentação", value: "Alimentação" },
	{ label: "Transporte", value: "Transporte" },
	{ label: "Mercado", value: "Mercado" },
	{ label: "Investimento", value: "Investimento" },
	{ label: "Utilidades", value: "Utilidades" },
	{ label: "Salário", value: "Salário" },
	{ label: "Entretenimento", value: "Entretenimento" },
] as const;

export const categoryMeta: Record<
	string,
	{
		variant: CategoryVariant;
		iconBg: string;
		iconColor: string;
		Icon: typeof Utensils;
	}
> = {
	Alimentação: {
		variant: "blue",
		iconBg: "bg-blue-light",
		iconColor: "text-blue-base",
		Icon: Utensils,
	},
	Transporte: {
		variant: "purple",
		iconBg: "bg-purple-light",
		iconColor: "text-purple-base",
		Icon: CarFront,
	},
	Mercado: {
		variant: "orange",
		iconBg: "bg-orange-light",
		iconColor: "text-orange-base",
		Icon: ShoppingCart,
	},
	Investimento: {
		variant: "green",
		iconBg: "bg-green-light",
		iconColor: "text-green-base",
		Icon: PiggyBank,
	},
	Utilidades: {
		variant: "yellow",
		iconBg: "bg-yellow-light",
		iconColor: "text-yellow-base",
		Icon: BriefcaseBusiness,
	},
	Salário: {
		variant: "green",
		iconBg: "bg-green-light",
		iconColor: "text-green-base",
		Icon: BriefcaseBusiness,
	},
	Entretenimento: {
		variant: "pink",
		iconBg: "bg-pink-light",
		iconColor: "text-pink-base",
		Icon: Ticket,
	},
};

type CreateTransactionProps = {
	id: number;
	description: string;
	date: string;
	category: string;
	type: TransactionType;
	value: number;
};

function createTransaction({
	id,
	description,
	date,
	category,
	type,
	value,
}: CreateTransactionProps): Transaction {
	const meta = categoryMeta[category];

	if (!meta) {
		throw new Error(`Unknown category: ${category}`);
	}

	return {
		id: String(id),
		description,
		date,
		category,
		categoryVariant: meta.variant,
		iconBg: meta.iconBg,
		iconColor: meta.iconColor,
		Icon: meta.Icon,
		type,
		value,
	};
}

export const allTransactions: Transaction[] = [
	createTransaction({
		id: 1,
		description: "Jantar no Restaurante",
		date: "30/11/2025",
		category: "Alimentação",
		type: "expense",
		value: 89.5,
	}),
	createTransaction({
		id: 2,
		description: "Posto de Gasolina",
		date: "29/11/2025",
		category: "Transporte",
		type: "expense",
		value: 100.0,
	}),
	createTransaction({
		id: 3,
		description: "Compras no Mercado",
		date: "28/11/2025",
		category: "Mercado",
		type: "expense",
		value: 156.8,
	}),
	createTransaction({
		id: 4,
		description: "Retorno de Investimento",
		date: "26/11/2025",
		category: "Investimento",
		type: "income",
		value: 340.25,
	}),
	createTransaction({
		id: 5,
		description: "Aluguel",
		date: "26/11/2025",
		category: "Utilidades",
		type: "expense",
		value: 1700.0,
	}),
	createTransaction({
		id: 6,
		description: "Freelance",
		date: "24/11/2025",
		category: "Salário",
		type: "income",
		value: 2500.0,
	}),
	createTransaction({
		id: 7,
		description: "Compras Jantar",
		date: "22/11/2025",
		category: "Mercado",
		type: "expense",
		value: 150.0,
	}),
	createTransaction({
		id: 8,
		description: "Cinema",
		date: "18/12/2025",
		category: "Entretenimento",
		type: "expense",
		value: 88.0,
	}),
	createTransaction({
		id: 9,
		description: "Supermercado Extra",
		date: "20/11/2025",
		category: "Mercado",
		type: "expense",
		value: 234.5,
	}),
	createTransaction({
		id: 10,
		description: "Uber para reunião",
		date: "19/11/2025",
		category: "Transporte",
		type: "expense",
		value: 45.0,
	}),
	createTransaction({
		id: 11,
		description: "Almoço com cliente",
		date: "18/11/2025",
		category: "Alimentação",
		type: "expense",
		value: 67.0,
	}),
	createTransaction({
		id: 12,
		description: "Dividendos FII",
		date: "17/11/2025",
		category: "Investimento",
		type: "income",
		value: 520.0,
	}),
	createTransaction({
		id: 13,
		description: "Conta de luz",
		date: "15/11/2025",
		category: "Utilidades",
		type: "expense",
		value: 320.0,
	}),
	createTransaction({
		id: 14,
		description: "Conta de água",
		date: "15/11/2025",
		category: "Utilidades",
		type: "expense",
		value: 89.0,
	}),
	createTransaction({
		id: 15,
		description: "Netflix",
		date: "14/11/2025",
		category: "Entretenimento",
		type: "expense",
		value: 39.9,
	}),
	createTransaction({
		id: 16,
		description: "Spotify",
		date: "14/11/2025",
		category: "Entretenimento",
		type: "expense",
		value: 19.9,
	}),
	createTransaction({
		id: 17,
		description: "Salário mensal",
		date: "10/11/2025",
		category: "Salário",
		type: "income",
		value: 8500.0,
	}),
	createTransaction({
		id: 18,
		description: "Padaria",
		date: "09/11/2025",
		category: "Alimentação",
		type: "expense",
		value: 23.5,
	}),
	createTransaction({
		id: 19,
		description: "Gasolina semanal",
		date: "08/11/2025",
		category: "Transporte",
		type: "expense",
		value: 180.0,
	}),
	createTransaction({
		id: 20,
		description: "Feira livre",
		date: "07/11/2025",
		category: "Mercado",
		type: "expense",
		value: 95.0,
	}),
	createTransaction({
		id: 21,
		description: "Internet",
		date: "05/11/2025",
		category: "Utilidades",
		type: "expense",
		value: 129.9,
	}),
	createTransaction({
		id: 22,
		description: "Cinema com amigos",
		date: "03/11/2025",
		category: "Entretenimento",
		type: "expense",
		value: 120.0,
	}),
	createTransaction({
		id: 23,
		description: "Venda de curso",
		date: "02/11/2025",
		category: "Salário",
		type: "income",
		value: 450.0,
	}),
	createTransaction({
		id: 24,
		description: "Juros poupança",
		date: "01/11/2025",
		category: "Investimento",
		type: "income",
		value: 12.3,
	}),
	createTransaction({
		id: 25,
		description: "Farmácia",
		date: "25/11/2025",
		category: "Mercado",
		type: "expense",
		value: 78.4,
	}),
	createTransaction({
		id: 26,
		description: "Estacionamento",
		date: "21/11/2025",
		category: "Transporte",
		type: "expense",
		value: 25.0,
	}),
	createTransaction({
		id: 27,
		description: "Pizza sexta",
		date: "21/11/2025",
		category: "Alimentação",
		type: "expense",
		value: 55.0,
	}),
];
