import styles from "./AddLayout.module.scss";
import { Outlet } from "react-router-dom";
import { Button, Flex } from "@/shared/ui";

export const AddLayout = () => {
    return (
        <>
            <header className={styles.addHeader}>
                <Flex className={styles.addHeader__content}>
                    <Button
                        to="/add/manual"
                        variant="ghost"
                        className={styles.addHeader__tab}
                        activeClass={styles["addHeader__tab--active"]}
                    >
                        Вручную
                    </Button>
                    <Button
                        to="/add/qr"
                        variant="ghost"
                        className={styles.addHeader__tab}
                        activeClass={styles["addHeader__tab--active"]}
                    >
                        По QR
                    </Button>
                </Flex>
            </header>

            <Flex direction="column">
                <Outlet/>
            </Flex>
        </>
    );
};