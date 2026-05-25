import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime

  enum TransactionType {
    INCOME
    EXPENSE
  }

  type User {
    id: ID!
    name: String!
    email: String!
    transactions: [Transaction!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Transaction {
    id: ID!
    description: String!
    amount: Float!
    type: TransactionType!
    category: String!
    date: DateTime!
    user: User!
    isExample: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Category {
    id: ID!
    name: String!
    description: String!
    color: String!
    icon: String!
    userId: ID
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type TransactionPeriod {
    month: String!
    year: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    userByEmail(email: String!): User
    transactions(userId: ID, month: String, year: String): [Transaction!]!
    transaction(id: ID!): Transaction
    categories(userId: ID): [Category!]!
    category(id: ID!): Category
    transactionPeriods(userId: ID): [TransactionPeriod!]!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateTransactionInput {
    description: String!
    amount: Float!
    type: TransactionType!
    category: String!
    date: DateTime!
    userId: ID!
    isExample: Boolean
  }

  input UpdateTransactionInput {
    description: String
    amount: Float
    type: TransactionType
    category: String
    date: DateTime
  }

  input UpdateUserInput {
    name: String
  }

  input CreateCategoryInput {
    name: String!
    description: String
    color: String!
    icon: String!
    userId: ID
  }

  input UpdateCategoryInput {
    name: String
    description: String
    color: String
    icon: String
  }

  input RequestPasswordResetInput {
    email: String!
  }

  input ResetPasswordInput {
    token: String!
    password: String!
  }

  type MessagePayload {
    message: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): ID!
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): ID!
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): ID!
    deleteExampleTransactions(userId: ID!): Int!
    requestPasswordReset(input: RequestPasswordResetInput!): MessagePayload!
    resetPassword(input: ResetPasswordInput!): MessagePayload!
  }
`;
