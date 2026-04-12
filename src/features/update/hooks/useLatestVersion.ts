import { useQuery } from "@tanstack/react-query";
import { check } from "@tauri-apps/plugin-updater";

export const useLatestVersion = () => {
    return useQuery({
        queryKey: ["last", "version"],
        queryFn: async (): Promise<string | null> => {
            const update = await check();

            if (update) {
                return update.version;
            } else {
                return null
            }
        },
        staleTime: 10 * 60 * 1000,
    });
};