import { type ReactNode, useCallback, useEffect, useMemo } from "react";
import { ThemeContext } from "@/shared/lib/context";
import { setStatusBarColor } from "tauri-plugin-status-bar-color-api";
import { useThemeQuery } from "../hooks";

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: string;
};

export const ThemeProvider = ({
    children,
    initialTheme = "dark",
}: ThemeProviderProps) => {
    const { theme, setQueryTheme } = useThemeQuery(initialTheme);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "light") {
            root.setAttribute("data-theme", "light");
            setStatusBarColor("#eef3ef").catch(() => {});
        } else {
            root.removeAttribute("data-theme");
            setStatusBarColor("#000000").catch(() => {});
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setQueryTheme(theme === "dark" ? "light" : "dark");
    }, [theme, setQueryTheme]);

    const contextValue = useMemo(() => ({
        theme,
        isDark: theme === "dark",
        toggleTheme,
    }), [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};
