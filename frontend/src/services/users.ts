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

type MeData = {
  me: User | null;
};

export const ME_QUERY: TypedDocumentNode<MeData> = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;

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

type RequestPasswordResetData = {
  requestPasswordReset: {
    message: string;
  };
};

export type RequestPasswordResetInput = {
  email: string;
};

export const REQUEST_PASSWORD_RESET: TypedDocumentNode<
  RequestPasswordResetData,
  { input: RequestPasswordResetInput }
> = gql`
	mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
		requestPasswordReset(input: $input) {
			message
		}
	}
`;

type ResetPasswordData = {
  resetPassword: {
    message: string;
  };
};

export type ResetPasswordInput = {
  token: string;
  password: string;
};

export const RESET_PASSWORD: TypedDocumentNode<
  ResetPasswordData,
  { input: ResetPasswordInput }
> = gql`
	mutation ResetPassword($input: ResetPasswordInput!) {
		resetPassword(input: $input) {
			message
		}
	}
`;
