import { useQuery } from "@tanstack/react-query";
import { getVersion } from "@tauri-apps/api/app";
import { queryKeys } from "@/shared/config";

export const useCurrentVersion = () => {
    return useQuery({
        queryKey: queryKeys.versions.current,
        queryFn: async () => {
            return await getVersion();
        },
        staleTime: Infinity,
        gcTime: Infinity,
    });
};