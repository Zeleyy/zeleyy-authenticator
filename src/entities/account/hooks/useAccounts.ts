import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import type { Account, AccountUI } from "../model";
import { queryKeys } from "@/shared/config";

export const useAccounts = (searchQuery?: string) => {
    return useQuery<AccountUI[]>({
        queryKey: queryKeys.accounts.all,
        queryFn: async () => {
            const accounts = await invoke<Account[]>("get_accounts");
            return accounts.map(acc => ({
                ...acc,
                displayName: acc.issuer ? `${acc.issuer}: ${acc.accountName}` : acc.accountName,
            }));
        },
        staleTime: (query) => {
            const accounts = query.state.data;
            if (!accounts || accounts.length === 0) return 0;
            const minRemaining = Math.min(...accounts.map(a => a.expiresAt - Math.floor(Date.now() / 1000)));
            return Math.max(0, minRemaining * 1000);
        },
        refetchOnWindowFocus: false,
        select: (accounts) => {
            if (!searchQuery) return accounts;
            const query = searchQuery.toLowerCase();
            return accounts.filter(account => 
                account.displayName.toLowerCase().includes(query)
            );
        }
    });
};