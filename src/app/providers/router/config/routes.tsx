import { Navigate, type RouteObject } from "react-router-dom";
import { ROUTES } from "@/shared/config";
import { AboutPage, AddManualPage, AddQrPage, HomePage, SettingsPage } from "@/pages";
import { AddLayout, MainLayout, SecondaryLayout } from "@/app/layouts";


export const routes: RouteObject[] = [
    {
        path: ROUTES.HOME,
        element: <MainLayout/>,
        children: [
            { index: true, element: <HomePage /> },
        ],
    },
    {
        element: <SecondaryLayout/>,
        loader: () => ({ title: 'Secondary' }),
        children: [
            {
                path: ROUTES.SETTINGS,
                element: <SettingsPage/>,
                loader: () => ({ title: 'Настройки', backTo: '/' }),
            },
            {
                path: ROUTES.ABOUT,
                element: <AboutPage/>,
                loader: () => ({ title: 'О приложении', backTo: '/' }),
            },
            {
                path: ROUTES.ADD.ROOT,
                element: <AddLayout/>,
                children: [
                    { index: true, element: <Navigate to={ROUTES.ADD.MANUAL} replace /> },
                    
                    {
                        path: ROUTES.ADD.MANUAL,
                        element: <AddManualPage/>,
                        loader: () => ({ title: 'Добавление', backTo: '/' }),
                    },
                    {
                        path: ROUTES.ADD.QR,
                        element: <AddQrPage/>,
                        loader: () => ({ title: 'Добавление', backTo: '/' }),
                    },
                ],
            },
        ],
    },

    { path: '*', element: <Navigate to="/" replace /> },
];