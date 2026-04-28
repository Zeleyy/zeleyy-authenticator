import styles from "./AuthGuard.module.scss";
import i18n from "@/shared/config/i18n";
import { Button, Flex, Icon, SpinnerLoader } from "@/shared/ui";

interface AuthGuardProps {
    isLoading?: boolean;
    error?: string;
    onRetry?: () => void;
}

export const AuthGuard = ({
    isLoading,
    error,
    onRetry,
}: AuthGuardProps) => {
    return (
        <Flex 
            direction="column" 
            justify="center" 
            align="center" 
            gap="lg"
            className={styles.authGuard}
        >
            <Icon name="logo" size={150}/>

            {isLoading ? (
                <Flex direction="column" align="center" gap="sm">
                    <SpinnerLoader size="large" />
                    <h2>{i18n.t("auth.lockScreen.loading")}</h2>
                </Flex>
            ) : (
                <Flex direction="column" align="center" gap="md">
                    <h2>{i18n.t("auth.lockScreen.title")}</h2>
                    
                    {error && <p className={styles.authGuard__error}>{error}</p>}
                    
                    <Button onClick={onRetry}>
                        {i18n.t("auth.lockScreen.retry")}
                    </Button>
                </Flex>
            )}
        </Flex>
    );
};