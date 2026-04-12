import styles from "./SecondaryLayout.module.scss";
import { Outlet, useLoaderData, useMatches, useNavigate } from "react-router-dom";
import { Button, Flex, Icon } from "@/shared/ui";

export const SecondaryLayout = () => {
    const navigate = useNavigate();
    const loaderData = useLoaderData() as { title?: string; backTo?: string };
    const matches = useMatches();
    const currentMatch = matches[matches.length - 1];
    const childLoaderData = currentMatch?.loaderData as { title?: string; backTo?: string } | undefined;
    
    const { title, backTo } = childLoaderData || loaderData || {};

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
                    <h1 className={styles.secondaryHeader__title}>{title}</h1>
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