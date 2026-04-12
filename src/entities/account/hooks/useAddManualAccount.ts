import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { queryClient } from "@/shared/api";

interface AddManualAccountParams {
    accountName: string;
    secret: string;
}

export const useAddManualAccount = () => {
    return useMutation({
        mutationFn: async ({ accountName, secret }: AddManualAccountParams) => {
            await invoke("add_account", { accountName, secret });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
};