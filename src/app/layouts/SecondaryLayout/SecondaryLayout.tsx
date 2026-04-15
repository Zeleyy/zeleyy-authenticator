import styles from "./SecondaryLayout.module.scss";
import { Outlet, useLoaderData, useMatches, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Flex, Icon } from "@/shared/ui";

export const SecondaryLayout = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const loaderData = useLoaderData() as { titleKey: string; backTo?: string };
    const matches = useMatches();
    const currentMatch = matches[matches.length - 1];
    const childLoaderData = currentMatch?.loaderData as { titleKey: string; backTo?: string } | undefined;
    
    const { titleKey, backTo } = childLoaderData || loaderData || {};

    const handleBack = () => {
        if (backTo) {
            navigate(backTo);
        } else {
            navigate("/");
        }
    };

    return (
        <>
            <header className={styles.secondaryHeader}>
                <Flex align="center" gap="sm">
                    <Button
                        variant="ghost"
                        size="small"
                        square
                        onClick={handleBack}
                    >
                        <Icon name="icon-arrow-left" size={30} />
                    </Button>
                    <h1 className={styles.secondaryHeader__title}>{t(titleKey)}</h1>
                </Flex>
            </header>
            <main>
                <Flex direction="column" gap="md" size="form-lg" container>
                    <Outlet/>
                </Flex>
            </main>
        </>
    );
};