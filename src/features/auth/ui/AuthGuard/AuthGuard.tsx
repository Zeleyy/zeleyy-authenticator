import styles from "./AuthGuard.module.scss";
import i18n from "@/shared/config/i18n";
import { Button, Flex, Icon } from "@/shared/ui";

interface AuthGuardProps {
    onVerify: () => void;
}

export const AuthGuard = ({ onVerify }: AuthGuardProps) => {
    return (
        <Flex 
            direction="column" 
            justify="center" 
            align="center" 
            gap="md"
            className={styles.authGuard}
        >
            <Icon name="logo" size={150}/>

            <Flex direction="column" align="center" gap="md">
                <h2>{i18n.t("auth.lockScreen.loading")}</h2>
                <Button onClick={onVerify}>
                    {i18n.t("auth.lockScreen.verify")}
                </Button>
            </Flex>
        </Flex>
    );
};