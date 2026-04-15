import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import type { Account } from "../model";

export const useAccounts = (searchQuery?: string) => {
    return useQuery<Account[]>({
        queryKey: ["accounts"],
        queryFn: async () => {
            return await invoke<Account[]>("get_accounts");
        },
        refetchInterval: 1000,
        select: (accounts) => {
            if (!searchQuery) return accounts;
            const query = searchQuery.toLowerCase();
            return accounts.filter(account => 
                account.account_name.toLowerCase().includes(query) ||
                account.issuer?.toLowerCase().includes(query)
            );
        }
    });
};