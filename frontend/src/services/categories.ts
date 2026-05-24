import type { TypedDocumentNode } from "@apollo/client";
import { gql } from "@apollo/client";

import type { CategoryDetail } from "#/types/dashboard";

type ListCategoriesData = {
  categories: CategoryDetail[];
};

type CreateCategoryData = {
  createCategory: CategoryDetail;
};

type UpdateCategoryData = {
  updateCategory: CategoryDetail;
};

type DeleteCategoryData = {
  deleteCategory: string;
};

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  color: string;
  icon: string;
  userId?: string;
};

export type UpdateCategoryInput = {
  name?: string;
  description?: string | null;
  color?: string;
  icon?: string;
};

export const LIST_CATEGORIES: TypedDocumentNode<
  ListCategoriesData,
  { userId?: string | null }
> = gql`
	query ListCategories($userId: ID) {
		categories(userId: $userId) {
			id
			name
			description
			color
			icon
			userId
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
			userId
		}
	}
`;

export const UPDATE_CATEGORY: TypedDocumentNode<
  UpdateCategoryData,
  { id: string; input: UpdateCategoryInput }
> = gql`
	mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
		updateCategory(id: $id, input: $input) {
			id
			name
			description
			color
			icon
			userId
		}
	}
`;

export const DELETE_CATEGORY: TypedDocumentNode<
  DeleteCategoryData,
  { id: string }
> = gql`
	mutation DeleteCategory($id: ID!) {
		deleteCategory(id: $id)
	}
`;
