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
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    userByEmail(email: String!): User
    transactions(userId: ID): [Transaction!]!
    transaction(id: ID!): Transaction
  }

  input CreateUserInput {
    name: String!
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
  }

  input UpdateTransactionInput {
    description: String
    amount: Float
    type: TransactionType
    category: String
    date: DateTime
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): ID!
  }
`;
