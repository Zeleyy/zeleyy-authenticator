import { useQuery } from "@tanstack/react-query";
import { getVersion } from "@tauri-apps/api/app";

export const useCurrentVersion = () => {
    return useQuery({
        queryKey: ["current", "version"],
        queryFn: async () => {
            return await getVersion();
        },
        staleTime: Infinity,
        gcTime: Infinity,
    });
};