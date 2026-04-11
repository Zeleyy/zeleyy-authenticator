import './app/styles/index.scss';
import { storage } from './shared/lib/storage';
import { createRoot } from 'react-dom/client';
import App from "./app/App";
import { QueryProvider, ThemeProvider } from './app/providers';

const initialTheme = await storage.get<string>("theme") || "dark";

createRoot(document.getElementById('root')!).render(
    <QueryProvider>
        <ThemeProvider initialTheme={initialTheme}>
            <App />
        </ThemeProvider>
    </QueryProvider>
);
