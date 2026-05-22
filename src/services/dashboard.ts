import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";

import type {
	CategorySummary,
	DashboardSummary,
	Transaction,
} from "@/types/dashboard";

type DashboardSummaryData = {
	dashboardSummary: DashboardSummary;
};

type RecentTransactionsData = {
	recentTransactions: Transaction[];
};

type CategorySummariesData = {
	categorySummaries: CategorySummary[];
};

export const GET_DASHBOARD_SUMMARY: TypedDocumentNode<DashboardSummaryData> = gql`
	query GetDashboardSummary {
		dashboardSummary {
			totalBalance
			monthlyIncome
			monthlyExpense
		}
	}
`;

export const GET_RECENT_TRANSACTIONS: TypedDocumentNode<RecentTransactionsData> = gql`
	query GetRecentTransactions {
		recentTransactions {
			id
			description
			amount
			type
			category
			categoryColor
			date
			tag
		}
	}
`;

export const GET_CATEGORY_SUMMARIES: TypedDocumentNode<CategorySummariesData> = gql`
	query GetCategorySummaries {
		categorySummaries {
			id
			name
			color
			itemCount
			total
		}
	}
`;
