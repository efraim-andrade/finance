import { describe, expect, it } from "vitest";

import { createGraphQLSchema } from "@/app/server.js";
import * as transactionService from "@/modules/transactions/transaction.service.js";
import * as userService from "@/modules/users/user.service.js";

type IntrospectionField = {
  name: string;
};

type SchemaOperationsResult = {
  __schema: {
    mutationType: { fields: IntrospectionField[] };
    queryType: { fields: IntrospectionField[] };
  };
};

describe("GraphQL schema contract", () => {
  it("keeps public operation names stable", async () => {
    const schema = await createGraphQLSchema();
    const data: SchemaOperationsResult = {
      __schema: {
        mutationType: { fields: Object.values(schema.getMutationType()?.getFields() ?? {}) },
        queryType: { fields: Object.values(schema.getQueryType()?.getFields() ?? {}) },
      },
    };

    expect(
      data.__schema.queryType.fields.map((field) => field.name).sort(),
    ).toEqual(["categories", "category", "transaction", "transactionPeriods", "transactions", "user"]);
    expect(
      data.__schema.mutationType.fields.map((field) => field.name).sort(),
    ).toEqual([
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

  it("rejects anonymous transaction reads before database access", async () => {
    await expect(transactionService.listTransactions()).rejects.toMatchObject({
      extensions: { code: "UNAUTHENTICATED" },
    });
  });

  it("rejects anonymous user reads before exposing profile fields", async () => {
    await expect(userService.getUserById("user-id")).rejects.toMatchObject({
      extensions: { code: "UNAUTHENTICATED" },
    });
  });
});
