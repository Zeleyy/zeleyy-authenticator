import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { storage } from "../storage";
import { queryClient } from "@/shared/api";
import { queryKeys } from "@/shared/config";

export const usePageAnimation = () => {
    const { data: enabled, isLoading } = useQuery({
        queryKey: queryKeys.settings.animations,
        queryFn: async () => {
            return (await storage.get<boolean>("pageAnimations")) ?? true;
        },
        staleTime: Infinity,
    });

    const { mutate } = useMutation({
        mutationFn: async (enabled: boolean) => {
            await storage.set("pageAnimations", enabled);
            return enabled;
        },
        onMutate: async (newValue) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.settings.animations });
            const previousValue = queryClient.getQueryData(queryKeys.settings.animations);
            queryClient.setQueryData(queryKeys.settings.animations, newValue);
            return { previousValue };
        },
        onError: (_error, _newValue, context) => {
            queryClient.setQueryData(queryKeys.settings.animations, context?.previousValue);
        },
    });

    useEffect(() => {
        const unlistenPromise = storage.onKeyChange<boolean>("pageAnimations", (value) => {
            if (value !== undefined) {
                queryClient.setQueryData(queryKeys.settings.animations, value);
            }
        });

        return () => {
            unlistenPromise.then(unlisten => unlisten());
        };
    }, [])

    return {
        enabled: enabled ?? true,
        isLoading,
        toggle: () => mutate(!enabled),
    };
};