import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { queryClient } from "@/shared/api";
import { queryKeys } from "@/shared/config";

export const useDeleteAccount = () => {
    return useMutation({
        mutationFn: async (accountId: number) => {
            await invoke("delete_account", { accountId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
        },
    });
};