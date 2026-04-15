import './app/styles/index.scss';
import i18n from './shared/config/i18n';
import { storage } from './shared/lib/storage';
import { createRoot } from 'react-dom/client';
import App from "./app/App";
import { QueryProvider, ThemeProvider } from './app/providers';
import "./shared/config/i18n";

const initialTheme = await storage.get<string>("theme") || "dark";
const initialLanguage = await storage.get<string>("language") || "ru";

await i18n.changeLanguage(initialLanguage);

createRoot(document.getElementById('root')!).render(
    <QueryProvider>
        <ThemeProvider initialTheme={initialTheme}>
            <App />
        </ThemeProvider>
    </QueryProvider>
);
