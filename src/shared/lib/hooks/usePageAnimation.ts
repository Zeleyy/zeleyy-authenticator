import { useEffect } from "react";
import { storage } from "../storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/shared/api";

export const settingsKeys = {
    animations: ["settings", "animations"],
}

export const usePageAnimation = () => {
    const { data: enabled, isLoading } = useQuery({
        queryKey: settingsKeys.animations,
        queryFn: async () => {
            return (await storage.get<boolean>("pageAnimations")) ?? true;
        },
        staleTime: Infinity,
    });

    const mutation = useMutation({
        mutationFn: async (enabled: boolean) => {
            await storage.set("pageAnimations", enabled);
            return enabled;
        },
        onMutate: async (newValue) => {
            await queryClient.cancelQueries({ queryKey: settingsKeys.animations });
            const previousValue = queryClient.getQueryData(settingsKeys.animations);
            queryClient.setQueryData(settingsKeys.animations, newValue);
            return { previousValue };
        },
        onError: (_error, _newValue, context) => {
            queryClient.setQueryData(settingsKeys.animations, context?.previousValue);
        },
    });

    useEffect(() => {
        const unlistenPromise = storage.onKeyChange<boolean>("pageAnimations", (value) => {
            if (value !== undefined) {
                queryClient.setQueryData(settingsKeys.animations, value);
            }
        });

        return () => {
            unlistenPromise.then(unlisten => unlisten());
        };
    }, [])

    return {
        enabled: enabled ?? true,
        isLoading,
        toggle: () => mutation.mutate(!enabled),
    };
};