export const queryKeys = {
    settings: {
        all: ["settings"] as const,
        animations: ["settings", "animations"] as const,
        biometry: ["settings", "biometry"] as const,
        theme: ["settings", "theme"] as const,
    } as const,
    accounts: {
        all: ["accounts"] as const,
    } as const,
    versions: {
        all: ["version"] as const,
        current: ["version", "current"] as const,
        last: ["version", "last"] as const,
    } as const,
};