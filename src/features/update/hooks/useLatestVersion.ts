import { useQuery } from "@tanstack/react-query";
import { check } from "@tauri-apps/plugin-updater";
import { queryKeys } from "@/shared/config";

export const useLatestVersion = ({ enabled = true }: { enabled: boolean }) => {
    return useQuery({
        queryKey: queryKeys.versions.last,
        queryFn: async (): Promise<string | null> => {
            const update = await check();

            if (update) {
                return update.version;
            } else {
                return null
            }
        },
        staleTime: 10 * 60 * 1000,
        enabled: enabled,
    });
};