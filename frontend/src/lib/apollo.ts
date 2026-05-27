import {
  ApolloClient,
  CombinedGraphQLErrors,
  from,
  HttpLink,
  InMemoryCache,
  ServerError,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";

import {
  clearSession,
  getToken,
  notifySessionExpired,
  SESSION_EXPIRED_MESSAGE,
} from "#/lib/session";

function handleExpiredSession(message = SESSION_EXPIRED_MESSAGE) {
  clearSession();
  notifySessionExpired(message);
}

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_BACKEND_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const unauthenticatedError = error.errors.find(
      (err) => err.extensions?.code === "UNAUTHENTICATED",
    );

    if (unauthenticatedError) {
      handleExpiredSession(unauthenticatedError.message);
    }
  }

  if (ServerError.is(error) && error.statusCode === 401) {
    handleExpiredSession();
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
