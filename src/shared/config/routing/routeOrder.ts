import { ROUTES } from "./paths"

export const ROUTES_ORDER: Record<string, number> = {
    [ROUTES.HOME]: 0,
    [ROUTES.SETTINGS]: 1,
    [ROUTES.ABOUT]: 2,
    [ROUTES.EDIT_ACCOUNT]: 3,
    [ROUTES.ADD.ROOT]: 4,
    [ROUTES.ADD.MANUAL]: 5,
    [ROUTES.ADD.QR.ROOT]: 6,
    [ROUTES.ADD.QR.CONFIRM]: 7,
};

export const DEFAULT_ORDER = 999;