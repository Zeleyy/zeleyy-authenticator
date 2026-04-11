import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "@/shared/lib/context";
import { storage } from "@/shared/lib/storage";

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: string;
};

export const ThemeProvider = ({
    children,
    initialTheme = "dark",
}: ThemeProviderProps) => {
    const [theme, setThemeState] = useState(initialTheme);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "light") {
            root.setAttribute("data-theme", "light");
        } else {
            root.removeAttribute("data-theme")
        }
        storage.set("theme", theme);
    }, [theme]);

    const setTheme = useCallback((newTheme: string) => {
        setThemeState(newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    }, []);

    const contextValue = useMemo(() => ({
        theme,
        isDark: theme === 'dark',
        setTheme,
        toggleTheme,
    }), [theme, setTheme, toggleTheme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};
