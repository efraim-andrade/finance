import { createContext, useCallback, useContext, useState } from "react";

type AuthContextType = {
	isAuthenticated: boolean;
	login: (email: string, password: string) => void;
	logout: () => void;
	register: (name: string, email: string, password: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "finance:auth";

export function loadAuth(): boolean {
	if (typeof window === "undefined") return false;

	try {
		return localStorage.getItem(AUTH_KEY) === "true";
	} catch {
		return false;
	}
}

function persistAuth(value: boolean) {
	if (typeof window === "undefined") return;

	try {
		localStorage.setItem(AUTH_KEY, String(value));
	} catch {
		// storage blocked — ignore
	}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(loadAuth);

	const login = useCallback((_email: string, _password: string) => {
		setIsAuthenticated(true);
		persistAuth(true);
	}, []);

	const logout = useCallback(() => {
		setIsAuthenticated(false);
		persistAuth(false);
	}, []);

	const register = useCallback(
		(_name: string, _email: string, _password: string) => {
			setIsAuthenticated(true);
			persistAuth(true);
		},
		[],
	);

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
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
