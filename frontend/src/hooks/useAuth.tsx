import { useApolloClient, useMutation } from "@apollo/client/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import {
  clearSession,
  loadSession,
  persistSession,
  resetSessionExpiredNotification,
  SESSION_EXPIRED_EVENT,
  SESSION_EXPIRED_MESSAGE,
} from "#/lib/session";
import {
  CREATE_USER,
  DELETE_USER,
  LOGIN,
  ME_QUERY,
  REQUEST_PASSWORD_RESET,
  RESET_PASSWORD,
  UPDATE_USER,
} from "#/services/users";

import { FullPageLoader } from "~/components/full-page-loader";

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  deletingAccount: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const loggedOutState = {
  isAuthenticated: false,
  userId: null,
  userName: null,
  userEmail: null,
};

export function loadAuth(): {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
} {
  return loadSession();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const apolloClient = useApolloClient();
  const [state, setState] = useState(loadAuth);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const isInitializingRef = useRef(true);
  const sessionExpiredToastShown = useRef(false);

  isInitializingRef.current = initializing;

  const [doCreateUser] = useMutation(CREATE_USER);
  const [doLogin] = useMutation(LOGIN);
  const [doUpdateUser] = useMutation(UPDATE_USER);
  const [doDeleteUser, { loading: deletingAccount }] = useMutation(DELETE_USER);
  const [doRequestPasswordReset] = useMutation(REQUEST_PASSWORD_RESET);
  const [doResetPassword] = useMutation(RESET_PASSWORD);

  const clearSessionCache = useCallback(async () => {
    try {
      await apolloClient.clearStore();
    } catch {
      toast.error("Não foi possível limpar os dados da sessão");
    }
  }, [apolloClient]);

  useEffect(
    function subscribeToSessionExpired() {
      function handleSessionExpired(event: Event) {
        if (isInitializingRef.current) return;

        const message =
          event instanceof CustomEvent &&
          typeof event.detail?.message === "string"
            ? event.detail.message
            : SESSION_EXPIRED_MESSAGE;

        setError(null);
        setState(loggedOutState);
        clearSession();
        void clearSessionCache();

        if (!sessionExpiredToastShown.current) {
          sessionExpiredToastShown.current = true;
          toast.error(message);
        }
      }

      window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

      return function unsubscribeFromSessionExpired() {
        window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
      };
    },
    [clearSessionCache],
  );

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

        await clearSessionCache();

        setState({
          isAuthenticated: true,
          userId: payload.user.id,
          userName: payload.user.name,
          userEmail: payload.user.email,
        });
        persistSession({
          isAuthenticated: true,
          token: payload.token,
          userId: payload.user.id,
          userName: payload.user.name,
          userEmail: payload.user.email,
        });
        resetSessionExpiredNotification();
        sessionExpiredToastShown.current = false;

        toast.success("Login efetuado com sucesso!");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao fazer login";

        setError(message);
      }
    },
    [clearSessionCache, doLogin],
  );

  const logout = useCallback(async () => {
    setState(loggedOutState);
    clearSession();
    resetSessionExpiredNotification();
    sessionExpiredToastShown.current = false;
    await clearSessionCache();
  }, [clearSessionCache]);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null);

      try {
        const { data } = await doCreateUser({
          variables: { input: { name, email, password } },
        });

        const payload = data?.createUser;

        if (!payload) throw new Error("Falha ao criar usuário");

        await clearSessionCache();

        setState({
          isAuthenticated: true,
          userId: payload.user.id,
          userName: payload.user.name,
          userEmail: payload.user.email,
        });
        persistSession({
          isAuthenticated: true,
          token: payload.token,
          userId: payload.user.id,
          userName: payload.user.name,
          userEmail: payload.user.email,
        });
        resetSessionExpiredNotification();
        sessionExpiredToastShown.current = false;

        toast.success("Conta criada com sucesso!");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao criar conta";

        setError(message);
        throw err;
      }
    },
    [clearSessionCache, doCreateUser],
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
        persistSession({
          isAuthenticated: true,
          userId: state.userId,
          userName: updated.name,
          userEmail: state.userEmail,
        });
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

      setState(loggedOutState);
      clearSession();
      resetSessionExpiredNotification();
      sessionExpiredToastShown.current = false;
      await clearSessionCache();
      toast.success("Conta excluída com sucesso");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir conta";

      toast.error(message);
      throw err;
    }
  }, [clearSessionCache, doDeleteUser, state.userId]);

  const requestPasswordReset = useCallback(
    async (email: string) => {
      const { data } = await doRequestPasswordReset({
        variables: { input: { email } },
      });

      if (!data?.requestPasswordReset) {
        throw new Error("Falha ao solicitar recuperação de senha");
      }

      toast.success(data.requestPasswordReset.message);
    },
    [doRequestPasswordReset],
  );

  const resetPassword = useCallback(
    async (token: string, password: string) => {
      const { data } = await doResetPassword({
        variables: { input: { token, password } },
      });

      if (!data?.resetPassword) {
        throw new Error("Falha ao redefinir senha");
      }

      toast.success(data.resetPassword.message);
    },
    [doResetPassword],
  );

  useEffect(() => {
    if (!state.isAuthenticated) {
      isInitializingRef.current = false;
      setInitializing(false);

      return;
    }

    apolloClient
      .query({ query: ME_QUERY })
      .then(() => {
        isInitializingRef.current = false;
        setInitializing(false);
      })
      .catch(() => {
        clearSession();
        isInitializingRef.current = false;
        setState(loggedOutState);
        setInitializing(false);
      });
  }, [apolloClient, state.isAuthenticated]);

  const clearError = useCallback(() => setError(null), []);

  if (initializing) {
    return <FullPageLoader />;
  }

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
        requestPasswordReset,
        resetPassword,
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
