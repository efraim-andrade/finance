import { useMutation } from "@apollo/client/react";
import { createContext, useCallback, useContext, useState } from "react";
import { toast } from "sonner";

import { CREATE_USER, DELETE_USER, LOGIN, UPDATE_USER } from "#/services/users";

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  deletingAccount: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "finance:auth";
const USER_ID_KEY = "finance:user-id";
const USER_NAME_KEY = "finance:user-name";
const USER_EMAIL_KEY = "finance:user-email";
const TOKEN_KEY = "finance:token";

export function loadAuth(): {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
} {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      userId: null,
      userName: null,
      userEmail: null,
    };
  }

  try {
    const isAuthenticated = localStorage.getItem(AUTH_KEY) === "true";
    const userId = localStorage.getItem(USER_ID_KEY);
    const userName = localStorage.getItem(USER_NAME_KEY);
    const userEmail = localStorage.getItem(USER_EMAIL_KEY);

    return { isAuthenticated, userId, userName, userEmail };
  } catch {
    return {
      isAuthenticated: false,
      userId: null,
      userName: null,
      userEmail: null,
    };
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function persistAuth(
  value: boolean,
  userId: string | null,
  token?: string,
  userName?: string | null,
  userEmail?: string | null,
) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(AUTH_KEY, String(value));

    if (userId) {
      localStorage.setItem(USER_ID_KEY, userId);
    } else {
      localStorage.removeItem(USER_ID_KEY);
    }

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (userName) {
      localStorage.setItem(USER_NAME_KEY, userName);
    } else {
      localStorage.removeItem(USER_NAME_KEY);
    }

    if (userEmail) {
      localStorage.setItem(USER_EMAIL_KEY, userEmail);
    } else {
      localStorage.removeItem(USER_EMAIL_KEY);
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
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(loadAuth);
  const [error, setError] = useState<string | null>(null);

  const [doCreateUser] = useMutation(CREATE_USER);
  const [doLogin] = useMutation(LOGIN);
  const [doUpdateUser] = useMutation(UPDATE_USER);
  const [doDeleteUser, { loading: deletingAccount }] = useMutation(DELETE_USER);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);

      try {
        const { data } = await doLogin({
          variables: { input: { email, password } },
        });

        const payload = data?.login;

        if (!payload) {
          throw new Error("E-mail ou senha inválidos");
        }

        setState({
          isAuthenticated: true,
          userId: payload.user.id,
          userName: payload.user.name,
          userEmail: payload.user.email,
        });
        persistAuth(
          true,
          payload.user.id,
          payload.token,
          payload.user.name,
          payload.user.email,
        );

        toast.success("Login efetuado com sucesso!");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao fazer login";

        setError(message);
        throw err;
      }
    },
    [doLogin],
  );

  const logout = useCallback(() => {
    setState({
      isAuthenticated: false,
      userId: null,
      userName: null,
      userEmail: null,
    });
    clearStorage();
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null);

      try {
        const { data } = await doCreateUser({
          variables: { input: { name, email, password } },
        });

        const payload = data?.createUser;

        if (!payload) throw new Error("Falha ao criar usuário");

        setState({
          isAuthenticated: true,
          userId: payload.user.id,
          userName: payload.user.name,
          userEmail: payload.user.email,
        });
        persistAuth(
          true,
          payload.user.id,
          payload.token,
          payload.user.name,
          payload.user.email,
        );

        toast.success("Conta criada com sucesso!");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao criar conta";

        setError(message);
        throw err;
      }
    },
    [doCreateUser],
  );

  const updateProfile = useCallback(
    async (name: string) => {
      if (!state.userId) return;

      try {
        const { data } = await doUpdateUser({
          variables: { id: state.userId, input: { name } },
        });

        const updated = data?.updateUser;

        if (!updated) {
          throw new Error("Falha ao atualizar perfil");
        }

        setState((prev) => ({ ...prev, userName: updated.name }));
        persistAuth(
          true,
          state.userId,
          undefined,
          updated.name,
          state.userEmail ?? undefined,
        );
        toast.success("Perfil atualizado");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao atualizar perfil";

        toast.error(message);
      }
    },
    [doUpdateUser, state.userId, state.userEmail],
  );

  const deleteAccount = useCallback(async () => {
    if (!state.userId) return;

    try {
      await doDeleteUser({ variables: { id: state.userId } });

      setState({
        isAuthenticated: false,
        userId: null,
        userName: null,
        userEmail: null,
      });
      clearStorage();
      toast.success("Conta excluída com sucesso");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir conta";

      toast.error(message);
      throw err;
    }
  }, [doDeleteUser, state.userId]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        deletingAccount,
        error,
        login,
        logout,
        register,
        updateProfile,
        deleteAccount,
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
