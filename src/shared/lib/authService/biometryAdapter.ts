import { platform } from "@tauri-apps/plugin-os";

export const getBiometryAdapter = async () => {
    const currentPlatform = platform();

    if (currentPlatform === "android" || currentPlatform === "ios") {
        const { checkStatus, authenticate } = await import("@tauri-apps/plugin-biometric");
        return {
            checkStatus,
            authenticate,
        };
    } else {
        const { checkStatus, authenticate } = await import("@choochmeque/tauri-plugin-biometry-api");
        return {
            checkStatus,
            authenticate,
        };
    }
};