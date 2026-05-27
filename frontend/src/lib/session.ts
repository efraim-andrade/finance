export type SessionState = {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
};

type PersistSessionOptions = SessionState & {
  token?: string | null;
};

const AUTH_KEY = "finance:auth";
const USER_ID_KEY = "finance:user-id";
const USER_NAME_KEY = "finance:user-name";
const USER_EMAIL_KEY = "finance:user-email";
const TOKEN_KEY = "finance:token";

export const SESSION_EXPIRED_EVENT = "finance:session-expired";
export const SESSION_EXPIRED_MESSAGE =
  "Sua sessão expirou. Faça login novamente.";

let sessionExpiryNotified = false;

const emptySession: SessionState = {
  isAuthenticated: false,
  userId: null,
  userName: null,
  userEmail: null,
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function loadSession(): SessionState {
  if (!canUseStorage()) return emptySession;

  try {
    const isAuthenticated = localStorage.getItem(AUTH_KEY) === "true";
    const userId = localStorage.getItem(USER_ID_KEY);
    const userName = localStorage.getItem(USER_NAME_KEY);
    const userEmail = localStorage.getItem(USER_EMAIL_KEY);

    return { isAuthenticated, userId, userName, userEmail };
  } catch {
    return emptySession;
  }
}

export function getToken(): string | null {
  if (!canUseStorage()) return null;

  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function persistSession({
  token,
  userId,
  userName,
  userEmail,
  isAuthenticated,
}: PersistSessionOptions) {
  if (!canUseStorage()) return;

  if (!isAuthenticated) {
    clearSession();

    return;
  }

  try {
    localStorage.setItem(AUTH_KEY, "true");

    if (userId) {
      localStorage.setItem(USER_ID_KEY, userId);
    } else {
      localStorage.removeItem(USER_ID_KEY);
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

    if (token !== undefined) {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  } catch {
    // Storage can be blocked in private browsing modes.
  }
}

export function clearSession() {
  if (!canUseStorage()) return;

  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage can be blocked in private browsing modes.
  }
}

export function resetSessionExpiredNotification() {
  sessionExpiryNotified = false;
}

export function notifySessionExpired(message = SESSION_EXPIRED_MESSAGE) {
  if (typeof window === "undefined" || sessionExpiryNotified) return;

  sessionExpiryNotified = true;
  window.dispatchEvent(
    new CustomEvent(SESSION_EXPIRED_EVENT, {
      detail: { message },
    }),
  );
}
