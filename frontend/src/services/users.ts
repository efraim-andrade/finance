import type { TypedDocumentNode } from "@apollo/client";
import { gql } from "@apollo/client";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type CreateUserData = {
  createUser: User;
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
			id
			name
			email
			createdAt
			updatedAt
		}
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
