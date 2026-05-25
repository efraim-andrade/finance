import type { TypedDocumentNode } from "@apollo/client";
import { gql } from "@apollo/client";

import type { Transaction } from "#/types/dashboard";

type User = {
  id: string;
  name: string;
  email: string;
  transactions?: Transaction[];
  createdAt: string;
  updatedAt: string;
};

type AuthPayload = {
  user: User;
  token: string;
};

type CreateUserData = {
  createUser: AuthPayload;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export const CREATE_USER: TypedDocumentNode<
  CreateUserData,
  { input: CreateUserInput }
> = gql`
	mutation CreateUser($input: CreateUserInput!) {
		createUser(input: $input) {
			user {
				id
				name
				email
				createdAt
				updatedAt
			}
			token
		}
	}
`;

type LoginData = {
  login: AuthPayload;
};

export type LoginInput = {
  email: string;
  password: string;
};

export const LOGIN: TypedDocumentNode<LoginData, { input: LoginInput }> = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			user {
				id
				name
				email
				createdAt
				updatedAt
			}
			token
		}
	}
`;

type UpdateUserData = {
  updateUser: {
    id: string;
    name: string;
    email: string;
  };
};

export type UpdateUserInput = {
  name?: string;
};

export const UPDATE_USER: TypedDocumentNode<
  UpdateUserData,
  { id: string; input: UpdateUserInput }
> = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
    }
  }
`;

type DeleteUserData = {
  deleteUser: string;
};

export const DELETE_USER: TypedDocumentNode<DeleteUserData, { id: string }> =
  gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

type UserByEmailData = {
  userByEmail: User | null;
};

export const USER_BY_EMAIL: TypedDocumentNode<
  UserByEmailData,
  { email: string }
> = gql`
	query UserByEmail($email: String!) {
		userByEmail(email: $email) {
			id
			name
			email
			createdAt
			updatedAt
		}
	}
`;
