import { useMutation } from "@tanstack/react-query";
import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";

export const useUpdateInstall = () => {
    return useMutation({
        mutationFn: async () => {
            const update = await check();

            if (!update) {
                throw new Error("Нет доступных обновлений");
            }

            await update.downloadAndInstall();

            await relaunch();
        },
    });
};