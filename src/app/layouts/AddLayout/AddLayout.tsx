import styles from "./AddLayout.module.scss";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { Button, Flex } from "@/shared/ui";

export const AddLayout = () => {
    const { t } = useTranslation();

    return (
        <>
            <header className={styles.addHeader}>
                <Flex className={styles.addHeader__content}>
                    <Button
                        to="/add/manual"
                        variant="ghost"
                        className={styles.addHeader__tab}
                        activeClass={styles["addHeader__tab--active"]}
                        fullWidth
                    >
                        {t("add.tabs.manual")}
                    </Button>
                    <Button
                        to="/add/qr"
                        variant="ghost"
                        className={styles.addHeader__tab}
                        activeClass={styles["addHeader__tab--active"]}
                        fullWidth
                    >
                        {t("add.tabs.qr")}
                    </Button>
                </Flex>
            </header>

            <Flex direction="column">
                <Outlet/>
            </Flex>
        </>
    );
};