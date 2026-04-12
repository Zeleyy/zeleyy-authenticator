import styles from "./MainLayout.module.scss";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import clsx from "clsx";
import { Button, Flex, Icon, Input } from "@/shared/ui";

export const MainLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <header className={styles.mainHeader}>
                <Flex align="center" className={styles.mainHeader__content}>
                    <Button variant="ghost" className={styles.mainHeader__menuBtn} onClick={() => setIsOpen(true)} aria-label="Меню">
                        <Icon name="icon-menu" size={24}/>
                    </Button>
                    <Input id="search" type="text" placeholder="Введите запрос" className={styles.mainHeader__search}/>
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
                        <h1 className={styles.sideDrawer__title}>Zeleyy Authenticator</h1>
                        <Flex direction="column" gap="sm">
                            <Button variant="ghost" className={styles.sideDrawer__navItem} to={"/settings"}>
                                <Flex justify="start" align="center" fullWidth>
                                    Настройки
                                </Flex>
                            </Button>
                            <Button variant="ghost" className={styles.sideDrawer__navItem} to={"/about"}>
                                <Flex justify="start" align="center" fullWidth>
                                    О приложении
                                </Flex>
                            </Button>
                        </Flex>
                    </Flex>
                </div>
            </div>
        </>
    );
};