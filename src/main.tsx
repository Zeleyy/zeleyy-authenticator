import "./app/styles/index.scss";
import { createRoot } from "react-dom/client";
import { invoke } from "@tauri-apps/api/core";
import App from "./app/App";
import i18n from "./shared/config/i18n";
import { QueryProvider, ThemeProvider } from "./app/providers";
import { AuthGuard } from "./features/auth";
import { storage } from "./shared/lib/storage";
import { biometryService } from "./shared/lib/authService";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

const init = async () => {
    try {
        const [initialTheme, initialLanguage, biometryStatus] = await Promise.all([
            storage.get<string>("theme").then(res => res || "dark"),
            storage.get<string>("language").then(res => res || "ru"),
            invoke<boolean>("check_biometry_status").catch(() => false),
        ]);

        await i18n.changeLanguage(initialLanguage);

        const startApp = () => {
            root.render(
                <QueryProvider>
                    <ThemeProvider initialTheme={initialTheme}>
                        <App />
                    </ThemeProvider>
                </QueryProvider>
            );
        };

        const runAuth = async () => {
            const result = await biometryService.verify("auth.reason.default");

            if (result.status === "success" || result.status === "not_available") {
                startApp();
            }
        };

        if (biometryStatus) {
            root.render(<AuthGuard onVerify={runAuth} />);
            await runAuth();
        } else {
            startApp();
        }
    } catch (criticalError) {
        console.error("Failed to initialize app:", criticalError);
    }
};

init();