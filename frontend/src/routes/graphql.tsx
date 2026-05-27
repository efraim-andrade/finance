import { createFileRoute } from "@tanstack/react-router";

const DEFAULT_BACKEND_PORT = "4001";
const GRAPHQL_PROXY_TIMEOUT_MS = 10_000;
const MAX_GRAPHQL_BODY_BYTES = 1_000_000;
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);
const FORWARDED_REQUEST_HEADERS = new Set([
  "accept",
  "apollo-require-preflight",
  "authorization",
  "content-type",
]);

function createGraphqlErrorResponse(message: string, status: number) {
  return Response.json(
    {
      errors: [{ message }],
    },
    { status },
  );
}

function getBackendGraphqlUrl() {
  if (process.env.INTERNAL_GRAPHQL_URL) {
    return process.env.INTERNAL_GRAPHQL_URL;
  }

  const backendPort = process.env.BACKEND_PORT ?? DEFAULT_BACKEND_PORT;

  return `http://127.0.0.1:${backendPort}/graphql`;
}

function createProxyRequestHeaders(request: Request) {
  const headers = new Headers();

  for (const [name, value] of request.headers.entries()) {
    if (FORWARDED_REQUEST_HEADERS.has(name.toLowerCase())) {
      headers.set(name, value);
    }
  }

  return headers;
}

function createProxyResponseHeaders(response: Response) {
  const headers = new Headers();

  for (const [name, value] of response.headers.entries()) {
    if (!HOP_BY_HOP_HEADERS.has(name.toLowerCase())) {
      headers.set(name, value);
    }
  }

  return headers;
}

export const Route = createFileRoute("/graphql")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentLength = Number(
          request.headers.get("content-length") ?? 0,
        );

        if (contentLength > MAX_GRAPHQL_BODY_BYTES) {
          return createGraphqlErrorResponse(
            "GraphQL request body is too large.",
            413,
          );
        }

        try {
          const response = await fetch(getBackendGraphqlUrl(), {
            method: "POST",
            headers: createProxyRequestHeaders(request),
            body: await request.text(),
            signal: AbortSignal.timeout(GRAPHQL_PROXY_TIMEOUT_MS),
          });

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: createProxyResponseHeaders(response),
          });
        } catch (error) {
          const isTimeout =
            error instanceof DOMException && error.name === "TimeoutError";

          return createGraphqlErrorResponse(
            isTimeout
              ? "GraphQL upstream timed out."
              : "GraphQL upstream is unavailable.",
            isTimeout ? 504 : 502,
          );
        }
      },
    },
  },
});
