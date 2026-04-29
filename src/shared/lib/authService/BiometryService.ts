import i18n from "@/shared/config/i18n";
import { info } from "@tauri-apps/plugin-log"
import { getBiometryAdapter } from "./biometryAdapter";

export type BiometryResult = 
    | { status: "success" }
    | { status: "not_available" }
    | { status: "error"; message: string };

export const biometryService = {
    async verify(reason: string = "auth.reason.default"): Promise<BiometryResult> {
        try {
            info("[Biometry] Starting verification...");

            const biometry = await getBiometryAdapter();

            info("[Biometry] Checking status...");
            const { isAvailable } = await biometry.checkStatus();
            info(`[Biometry] Status check completed. Available: ${isAvailable}`);
            if (!isAvailable) return { status: "not_available" };

            info("[Biometry] Requesting user authentication...");
            await biometry.authenticate(i18n.t(reason), {
                title: i18n.t("auth.title"),
                cancelTitle: i18n.t("auth.cancel"),
                allowDeviceCredential: true,
            });

            info("[Biometry] Authentication successful!");

            return { status: "success" };
        } catch (error) {
            return { 
                status: "error", 
                message: error instanceof Error ? error.message : String(error) 
            };
        }
    }
};