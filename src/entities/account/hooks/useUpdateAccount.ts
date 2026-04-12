import { queryClient } from "@/shared/api";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

interface UpdateAccountParams {
    accountId: number;
    newName: string;
}

export const useUpdateAccount = () => {
    return useMutation({
        mutationFn: async ({ accountId, newName }: UpdateAccountParams) => {
            await invoke("update_account", { accountId, newName });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
};