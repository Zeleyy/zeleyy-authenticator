import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/shared/api";
import { storage } from "@/shared/lib/storage";


export const useThemeQuery = (initialTheme?: string) => {
    const queryKey = ["settings", "theme"];

    const query = useQuery({
        queryKey,
        queryFn: async () => (await storage.get<string>("theme")) ?? "dark",
        initialData: initialTheme,
        staleTime: Infinity,
    });

    const { mutate } = useMutation({
        mutationFn: async (newTheme: string) => {
            await storage.set("theme", newTheme);
            await storage.save();
            return newTheme;
        },
        onMutate: (newTheme) => {
            queryClient.setQueryData(queryKey, newTheme);
        }
    });

    return { theme: query.data, setQueryTheme: mutate };
};