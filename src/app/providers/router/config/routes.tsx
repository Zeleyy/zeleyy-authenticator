import { Navigate, type RouteObject } from "react-router-dom";
import { ROUTES } from "@/shared/config";
import { AboutPage, AddManualPage, AddQrPage, EditPage, HomePage, QrConfirmPage, SettingsPage } from "@/pages";
import { AddLayout, AnimatedLayout, MainLayout, SecondaryLayout } from "@/app/layouts";


export const routes: RouteObject[] = [
    {
        element: <AnimatedLayout />,
        children: [
            {
                path: ROUTES.HOME,
                element: <MainLayout/>,
                children: [
                    { index: true, element: <HomePage /> },
                ],
            },
            {
                element: <SecondaryLayout/>,
                children: [
                    {
                        path: ROUTES.SETTINGS,
                        element: <SettingsPage/>,
                        loader: () => ({ titleKey: "settings.title", backTo: "/" }),
                    },
                    {
                        path: ROUTES.ABOUT,
                        element: <AboutPage/>,
                        loader: () => ({ titleKey: "about.title", backTo: "/" }),
                    },
                    {
                        path: ROUTES.ADD.ROOT,
                        element: <AddLayout/>,
                        children: [
                            { index: true, element: <Navigate to={ROUTES.ADD.MANUAL} replace /> },
                            
                            {
                                path: ROUTES.ADD.MANUAL,
                                element: <AddManualPage/>,
                                loader: () => ({ titleKey: "add.title", backTo: "/" }),
                            },
                            {
                                path: ROUTES.ADD.QR.ROOT,
                                element: <AddQrPage/>,
                                loader: () => ({ titleKey: "add.title", backTo: "/" }),
                            },
                            {
                                path: ROUTES.ADD.QR.CONFIRM,
                                element: <QrConfirmPage/>,
                                loader: () => ({ titleKey: "add.title", backTo: ROUTES.ADD.QR.ROOT }),
                            },
                        ],
                    },
                    {
                        path: ROUTES.EDIT_ACCOUNT,
                        element: <EditPage />,
                        loader: () => ({ titleKey: "edit.title", backTo: "/" })
                    },
                ],
            },
        
            { path: "*", element: <Navigate to="/" replace /> },
        ]
    }
];