import styles from "./UpdateModal.module.scss";
import { useTranslation } from "react-i18next";
import { openUrl } from "@tauri-apps/plugin-opener";
import { platform } from "@tauri-apps/plugin-os";
import { Button, Flex, Modal, SpinnerLoader } from "@/shared/ui";
import { useCurrentVersion, useLatestVersion, useUpdateInstall } from "@/features/update";

interface UpdateModalProps {
    open?: boolean;
    onClose: () => void;
}

export const UpdateModal = ({
    open = false,
    onClose,
}: UpdateModalProps) => {
    const { t } = useTranslation();
    const isAndroid = platform() === 'android';
    
    const { data: currentVersion, isLoading: isLoadingCurrent } = useCurrentVersion();
    const { data: latestVersion, isLoading: isLoadingLatest } = useLatestVersion({ enabled: !isAndroid });
    const { mutate: install, isPending, isError, error } = useUpdateInstall();

    const resolvedVersion = latestVersion || currentVersion;
    const hasUpdate = resolvedVersion !== currentVersion;

    const handleAndroidUpdate = async () => {
        await openUrl('https://github.com/Zeleyy/zeleyy-authenticator/releases/latest');
    };

    if (isError) {
        console.error(error);
    }

    const isLoading = isLoadingCurrent || isLoadingLatest;

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className={styles.updateModal__title}>{t("about.updates.modal.title")}</h2>

            {isLoading ? (
                <Flex justify="center">
                    <SpinnerLoader isLoading/>
                </Flex>
            ) : (
                <>
                    <Flex direction="column" gap="md">
                        <Flex justify="space-between" align="center">
                            <span>{t("about.updates.modal.current")}</span>
                            <span className={styles.updateModal__version}>{currentVersion}</span>
                        </Flex>
                        
                        {!isAndroid && (
                            <>
                                <Flex justify="space-between" align="center">
                                    <span>{t("about.updates.modal.latest")}</span>
                                    <span className={styles.updateModal__version}>{resolvedVersion}</span>
                                </Flex>

                                <div className={styles.updateModal__message}>
                                    {hasUpdate
                                        ? t("about.updates.modal.available")
                                        : t("about.updates.modal.notAvailable")
                                    }
                                </div>
                            </>
                        )}
                    </Flex>

                    {isAndroid ? (
                        <Button 
                            onClick={handleAndroidUpdate}
                            className={styles.updateModal__button}
                        >
                            {t("about.updates.modal.goToReleases")}
                        </Button>
                    ) : (
                        <Button 
                            disabled={!hasUpdate || isPending}
                            onClick={() => install()}
                        >
                            {t("about.updates.modal.updateButton")}
                        </Button>
                    )}
                </>
            )}
        </Modal>
    );
};