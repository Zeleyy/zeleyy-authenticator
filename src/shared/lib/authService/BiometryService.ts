import { authenticate, checkStatus, type AuthOptions } from "@choochmeque/tauri-plugin-biometry-api";
import i18n from "@/shared/config/i18n";

export type BiometryResult = 
    | { status: "success" }
    | { status: "not_available" }
    | { status: "error"; message: string };

export const biometryService = {
    async verify(reason: string = "auth.reason.default", options?: AuthOptions): Promise<BiometryResult> {
        try {
            const { isAvailable } = await checkStatus();
            if (!isAvailable) return { status: "not_available" };

            await authenticate(i18n.t(reason), {
                title: i18n.t("auth.title"),
                cancelTitle: i18n.t("auth.cancel"),
                ...options
            });

            return { status: "success" };
        } catch (error) {
            return { 
                status: "error", 
                message: error instanceof Error ? error.message : String(error) 
            };
        }
    }
};