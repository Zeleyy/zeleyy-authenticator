import { useMutation, useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { queryClient } from "@/shared/api";
import { biometryService } from "../authService";
import { queryKeys } from "@/shared/config";

export const useBiometry = () => {
    const { data: enabled, isLoading } = useQuery({
        queryKey: queryKeys.settings.biometry,
        queryFn: async () => {
            return await invoke<boolean>("check_biometry_status");
        },
        staleTime: Infinity,
    });

    const { mutate } = useMutation({
        mutationFn: async (newValue: boolean) => {
            const result = await biometryService.verify(
                newValue 
                    ? "auth.reason.enableBiometry" 
                    : "auth.reason.disableBiometry"
            );

            if (result.status !== "success") {
                throw new Error("Authentication failed or cancelled");
            }

            await invoke("set_biometry_status", { enabled: newValue });
            return newValue;
        },
        onMutate: async (newValue) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.settings.biometry });
            const previousValue = queryClient.getQueryData(queryKeys.settings.biometry);
            queryClient.setQueryData(queryKeys.settings.biometry, newValue);
            return { previousValue };
        },
        onError: (_error, _newValue, context) => {
            queryClient.setQueryData(queryKeys.settings.biometry, context?.previousValue);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.settings.biometry });
        },
    });

    return {
        enabled: enabled ?? false,
        isLoading,
        toggle: () => mutate(!enabled),
    };
};