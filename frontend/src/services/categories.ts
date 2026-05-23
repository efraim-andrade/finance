import type { TypedDocumentNode } from "@apollo/client";
import { gql } from "@apollo/client";

import type { CategoryDetail } from "#/types/dashboard";

type ListCategoriesData = {
  categories: CategoryDetail[];
};

type CreateCategoryData = {
  createCategory: CategoryDetail;
};

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  color: string;
  icon: string;
};

export const LIST_CATEGORIES: TypedDocumentNode<ListCategoriesData> = gql`
	query ListCategories {
		categories {
			id
			name
			description
			color
			icon
		}
	}
`;

export const CREATE_CATEGORY: TypedDocumentNode<
  CreateCategoryData,
  { input: CreateCategoryInput }
> = gql`
	mutation CreateCategory($input: CreateCategoryInput!) {
		createCategory(input: $input) {
			id
			name
			description
			color
			icon
		}
	}
`;
