import { ApolloServer } from "@apollo/server";
import { describe, expect, it } from "vitest";

import { createGraphQLSchema } from "@/app/server.js";
import { authenticationMiddleware } from "@/modules/shared/middlewares/authentication.js";
import type { GraphQLContext } from "@/types/index.js";

type IntrospectionField = {
  name: string;
};

type SchemaOperationsResult = {
  __schema: {
    mutationType: { fields: IntrospectionField[] };
    queryType: { fields: IntrospectionField[] };
  };
};

function createTestContext(userId?: string): GraphQLContext {
  return {
    loaders: {
      user: { load: async () => null } as never,
    },
    userId,
  };
}

describe("GraphQL schema contract", () => {
  async function executeOperation(query: string, contextValue = createTestContext()) {
    const schema = await createGraphQLSchema();
    const server = new ApolloServer({ schema });

    return server.executeOperation({ query }, { contextValue });
  }

  it("keeps public operation names stable", async () => {
    const schema = await createGraphQLSchema();
    const data: SchemaOperationsResult = {
      __schema: {
        mutationType: { fields: Object.values(schema.getMutationType()?.getFields() ?? {}) },
        queryType: { fields: Object.values(schema.getQueryType()?.getFields() ?? {}) },
      },
    };

    expect(data.__schema.queryType.fields.map((field) => field.name).sort()).toEqual([
      "categories",
      "category",
      "transaction",
      "transactionPeriods",
      "transactions",
      "user",
    ]);
    expect(data.__schema.mutationType.fields.map((field) => field.name).sort()).toEqual([
      "createCategory",
      "createTransaction",
      "createUser",
      "deleteCategory",
      "deleteExampleTransactions",
      "deleteTransaction",
      "deleteUser",
      "login",
      "requestPasswordReset",
      "resetPassword",
      "updateCategory",
      "updateTransaction",
      "updateUser",
    ]);
  });

  it("rejects anonymous protected operations through real GraphQL execution", async () => {
    const operations = [
      'query { user(id: "user-id") { id } }',
      "query { categories { id } }",
      'query { category(id: "category-id") { id } }',
      "query { transactions { id } }",
      'query { transaction(id: "transaction-id") { id } }',
      "query { transactionPeriods { month year } }",
      'mutation { deleteCategory(id: "category-id") }',
      'mutation { deleteTransaction(id: "transaction-id") }',
      'mutation { deleteUser(id: "user-id") }',
    ];

    for (const query of operations) {
      const result = await executeOperation(query);

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe("UNAUTHENTICATED");
      }
    }
  });

  it("stores authenticated user id in context for protected resolvers", async () => {
    const context = createTestContext("user-id");

    await expect(
      authenticationMiddleware(
        {
          args: {},
          context,
          info: {} as never,
          root: undefined,
        },
        async () => "resolved",
      ),
    ).resolves.toBe("resolved");
    expect(context.authenticatedUserId).toBe("user-id");
  });
});
