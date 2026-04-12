import styles from "./Modal.module.scss";
import type { ReactNode } from "react";
import clsx from "clsx";
import { Flex } from "../Flex";

interface ModalProps {
    children?: ReactNode;
    open?: boolean;
    onClose: () => void;
}

export const Modal = ({
    children,
    open = false,
    onClose,
}: ModalProps) => {
    return (
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
                    {children}
                </Flex>
            </div>
        </Flex>
    );
};