import styles from "./UpdateModal.module.scss";
import { useTranslation } from "react-i18next";
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
    const { data: currentVersion, isLoading: isLoadingCurrent } = useCurrentVersion();
    const { data: latestVersion, isLoading: isLoadingLatest } = useLatestVersion();
    const { mutate: install, isPending, isError, error } = useUpdateInstall();

    const resolvedVersion = latestVersion || currentVersion;
    const hasUpdate = resolvedVersion !== currentVersion;

    if (isError) {
        console.error(error);
    }

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <h2 className={styles.updateModal__title}>{t("about.updates.modal.title")}</h2>

                {isLoadingCurrent || isLoadingLatest ? (
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
                            
                            <Flex justify="space-between" align="center">
                                <span>{t("about.updates.modal.latest")}</span>
                                <span className={styles.updateModal__version}>
                                    {resolvedVersion}
                                </span>
                            </Flex>

                            <div className={styles.updateModal__message}>
                                {hasUpdate
                                    ? t("about.updates.modal.available")
                                    : t("about.updates.modal.notAvailable")
                                }
                            </div>
                        </Flex>

                        <Button 
                            disabled={!hasUpdate || isPending}
                            onClick={() => install()}
                        >
                            {t("about.updates.modal.updateButton")}
                        </Button>
                    </>
                )}
            </Modal>
        </>
    );
};