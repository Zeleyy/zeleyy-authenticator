import styles from "./UpdateModal.module.scss";
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
                <h2 className={styles.updateModal__title}>Проверка обновлений</h2>

                {isLoadingCurrent || isLoadingLatest ? (
                    <Flex justify="center">
                        <SpinnerLoader isLoading/>
                    </Flex>
                ) : (
                    <>
                        <Flex direction="column" gap="md">
                            <Flex justify="space-between" align="center">
                                <span>Текущая версия</span>
                                <span className={styles.updateModal__version}>{currentVersion}</span>
                            </Flex>
                            
                            <Flex justify="space-between" align="center">
                                <span>Последняя версия</span>
                                <span className={styles.updateModal__version}>
                                    {resolvedVersion}
                                </span>
                            </Flex>

                            <div className={styles.updateModal__message}>
                                {hasUpdate
                                    ? "Доступна новая версия!"
                                    : "У вас последняя версия"
                                }
                            </div>
                        </Flex>

                        <Button 
                            disabled={!hasUpdate || isPending}
                            onClick={() => install()}
                        >
                            Обновить
                        </Button>
                    </>
                )}
            </Modal>
        </>
    );
};