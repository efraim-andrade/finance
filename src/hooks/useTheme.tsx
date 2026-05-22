import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
	theme: Theme;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_KEY = "finance:theme";

function loadTheme(): Theme {
	if (typeof window === "undefined") return "light";

	try {
		const stored = localStorage.getItem(THEME_KEY);
		if (stored === "dark" || stored === "light") return stored;
	} catch {
		// storage blocked — ignore
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function persistTheme(theme: Theme) {
	if (typeof window === "undefined") return;

	try {
		localStorage.setItem(THEME_KEY, theme);
	} catch {
		// storage blocked — ignore
	}
}

function applyTheme(theme: Theme) {
	if (typeof window === "undefined") return;

	document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(loadTheme);

	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	const toggleTheme = useCallback(() => {
		setTheme((prev) => {
			const next: Theme = prev === "light" ? "dark" : "light";
			persistTheme(next);

			return next;
		});
	}, []);

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const ctx = useContext(ThemeContext);

	if (!ctx) {
		throw new Error("useTheme must be used within ThemeProvider");
	}

	return ctx;
}
