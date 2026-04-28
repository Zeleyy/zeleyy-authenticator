import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { queryClient } from "@/shared/api";
import type { CreateAccountDto } from "../model";
import { queryKeys } from "@/shared/config";

export const useAddAccount = () => {
    return useMutation({
        mutationFn: async (payload: CreateAccountDto) => {
            await invoke("add_account", { ...payload });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
        },
    });
};