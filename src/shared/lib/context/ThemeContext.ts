import { createContext } from "react";

export interface ThemeContextProps {
    theme?: string,
    isDark?: boolean,
    setTheme?: (theme: string) => void,
    toggleTheme?: () => void,
}

export const ThemeContext = createContext<ThemeContextProps>({});