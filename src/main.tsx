import "./app/styles/index.scss";
import i18n from "./shared/config/i18n";
import { storage } from "./shared/lib/storage";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { QueryProvider, ThemeProvider } from "./app/providers";
import "./shared/config/i18n";
import { biometryService } from "./shared/lib/authService";
import { invoke } from "@tauri-apps/api/core";
import { AuthGuard } from "./features/auth";

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

        root.render(<AuthGuard isLoading />);

        const startApp = () => {
            root.render(
                <QueryProvider>
                    <ThemeProvider initialTheme={initialTheme}>
                        <App />
                    </ThemeProvider>
                </QueryProvider>
            );
        };

        const showAuthGuard = (errorMsg?: string) => {
            root.render(
                <AuthGuard
                    error={errorMsg}
                    onRetry={runAuth}
                />
            );
        };

        const runAuth = async () => {
            const result = await biometryService.verify("auth.reason.default", {
                allowDeviceCredential: true
            });

            if (result.status === "success" || result.status === "not_available") {
                startApp();
            } else {
                showAuthGuard(result.message);
            }
        };

        if (biometryStatus) {
            await runAuth();
        } else {
            startApp();
        }
    } catch (criticalError) {
        console.error("Failed to initialize app:", criticalError);
    }
};

init();