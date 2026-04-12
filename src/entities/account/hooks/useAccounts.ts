import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import type { Account } from "../model";

export const useAccounts = () => {
    return useQuery<Account[]>({
        queryKey: ["accounts"],
        queryFn: async () => {
            return await invoke<Account[]>("get_accounts");
        },
        refetchInterval: 1000,
    });
};