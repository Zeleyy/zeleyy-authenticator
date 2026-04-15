import styles from "./MainLayout.module.scss";
import { useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button, Flex, Icon, Input } from "@/shared/ui";

export const MainLayout = () => {
    const { t } = useTranslation();
    const [_, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const handleSearch = (value: string) => {
        if (value) {
            setSearchParams({ q: value });
        } else {
            setSearchParams({});
        }
    };

    return (
        <>
            <header className={styles.mainHeader}>
                <Flex align="center" className={styles.mainHeader__content}>
                    <Button variant="ghost" className={styles.mainHeader__menuBtn} onClick={() => setIsOpen(true)} aria-label={t("common.menu")}>
                        <Icon name="icon-menu" size={24}/>
                    </Button>
                    <Input
                        id="search"
                        type="text"
                        placeholder={t("home.search.placeholder")}
                        className={styles.mainHeader__search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </Flex>
            </header>

            <main>
                <Flex direction="column" gap="xs" size="form-lg" container>
                    <Outlet/>
                </Flex>
            </main>

            <Button to="/add/manual" className={styles.fab} size="small" square>
                <Icon name="icon-plus" size={32}/>
            </Button>

            <div className={clsx(styles.sideDrawer__overlay, { [styles["sideDrawer__overlay--open"]]: isOpen })} onClick={() => setIsOpen(false)}>
                <div className={styles.sideDrawer__container} onClick={(e) => e.stopPropagation()}>
                    <Flex direction="column" gap="md" className={styles.sideDrawer__content}>
                        <h1 className={styles.sideDrawer__title}>{t("common.appName")}</h1>
                        <Flex direction="column" gap="sm">
                            <Button variant="ghost" className={styles.sideDrawer__navItem} to={"/settings"}>
                                <Flex justify="start" align="center" fullWidth>
                                    {t("settings.title")}
                                </Flex>
                            </Button>
                            <Button variant="ghost" className={styles.sideDrawer__navItem} to={"/about"}>
                                <Flex justify="start" align="center" fullWidth>
                                    {t("about.title")}
                                </Flex>
                            </Button>
                        </Flex>
                    </Flex>
                </div>
            </div>
        </>
    );
};