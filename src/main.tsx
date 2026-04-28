import "./app/styles/index.scss";
import i18n from "./shared/config/i18n";
import { storage } from "./shared/lib/storage";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { QueryProvider, ThemeProvider } from "./app/providers";
import "./shared/config/i18n";
import { biometryService } from "./shared/lib/authService";
import { invoke } from "@tauri-apps/api/core";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

const init = async () => {
    try {
        const [initialTheme, initialLanguage, biometryStatus] = await Promise.all([
            storage.get<string>("theme").then(res => res || "dark"),
            storage.get<string>("language").then(res => res || "ru"),
            invoke("check_biometry_status"),
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

        const showLockScreen = (errorMsg?: string) => {
            root.render(
                <div className="lock-screen">
                    <h1>{i18n.t("auth.lockScreen.title")}</h1>
                    {errorMsg && <p className="error">{errorMsg}</p>}
                    <button onClick={() => runAuth()}>
                        {i18n.t("auth.lockScreen.retry")}
                    </button>
                </div>
            );
        };

        const runAuth = async () => {
            const result = await biometryService.verify("auth.reason.default", {
                allowDeviceCredential: true
            });

            if (result.status === "success" || result.status === "not_available") {
                startApp();
            } else {
                showLockScreen(result.message);
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