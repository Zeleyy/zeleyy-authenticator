import styles from "./UpdateModal.module.scss";
import clsx from "clsx";
import { Button, Flex, SpinnerLoader } from "@/shared/ui";
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
            <Flex
                direction="column"
                justify="center"
                align="center"
                className={clsx(styles.modal__overlay, { [styles["modal__overlay--open"]]: open })}
                onClick={onClose}
            >
                <div className={styles.modal__container} onClick={(e) => e.stopPropagation()}>
                    <Flex
                        direction="column"
                        justify="center"
                        gap="lg"
                        className={styles.modal__content}
                    >
                        <h2 className={styles.modal__title}>Проверка обновлений</h2>

                        {isLoadingCurrent || isLoadingLatest ? (
                            <Flex justify="center">
                                <SpinnerLoader isLoading/>
                            </Flex>
                        ) : (
                            <>
                                <Flex direction="column" gap="md">
                                    <Flex justify="space-between" align="center">
                                        <span>Текущая версия</span>
                                        <span className={styles.modal__version}>{currentVersion}</span>
                                    </Flex>
                                    
                                    <Flex justify="space-between" align="center">
                                        <span>Последняя версия</span>
                                        <span className={styles.modal__version}>
                                            {resolvedVersion}
                                        </span>
                                    </Flex>

                                    <div className={styles.modal__message}>
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
                    </Flex>
                </div>
            </Flex>

        </>
    );
};