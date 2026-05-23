import { useLazyQuery, useMutation } from "@apollo/client/react";
import { createContext, useCallback, useContext, useState } from "react";

import { CREATE_USER, USER_BY_EMAIL } from "#/services/users";

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "finance:auth";
const USER_ID_KEY = "finance:user-id";

export function loadAuth(): {
  isAuthenticated: boolean;
  userId: string | null;
} {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, userId: null };
  }

  try {
    const isAuthenticated = localStorage.getItem(AUTH_KEY) === "true";
    const userId = localStorage.getItem(USER_ID_KEY);

    return { isAuthenticated, userId };
  } catch {
    return { isAuthenticated: false, userId: null };
  }
}

function persistAuth(value: boolean, userId: string | null) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(AUTH_KEY, String(value));

    if (userId) {
      localStorage.setItem(USER_ID_KEY, userId);
    } else {
      localStorage.removeItem(USER_ID_KEY);
    }
  } catch {
    // storage blocked — ignore
  }
}

function clearStorage() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_ID_KEY);
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(loadAuth);
  const [error, setError] = useState<string | null>(null);

  const [doCreateUser] = useMutation(CREATE_USER);
  const [doFetchUser] = useLazyQuery(USER_BY_EMAIL);

  const login = useCallback(
    async (email: string, _password: string) => {
      setError(null);

      try {
        const { data } = await doFetchUser({ variables: { email } });
        const user = data?.userByEmail;

        if (!user) {
          throw new Error(
            "Usuário não encontrado. Verifique o e-mail ou crie uma conta.",
          );
        }

        setState({ isAuthenticated: true, userId: user.id });
        persistAuth(true, user.id);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao fazer login";

        setError(message);
        throw err;
      }
    },
    [doFetchUser],
  );

  const logout = useCallback(() => {
    setState({ isAuthenticated: false, userId: null });
    clearStorage();
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null);

      try {
        const { data } = await doCreateUser({
          variables: { input: { name, email, password } },
        });

        const userId = data?.createUser?.id;

        if (!userId) throw new Error("Falha ao criar usuário");

        setState({ isAuthenticated: true, userId });
        persistAuth(true, userId);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao criar conta";

        setError(message);
        throw err;
      }
    },
    [doCreateUser],
  );

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        error,
        login,
        logout,
        register,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
