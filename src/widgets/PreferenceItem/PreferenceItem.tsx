import styles from "./PreferenceItem.module.scss";
import { ReactNode } from "react";
import { Flex } from "@/shared/ui";

interface PreferenceItemProps {
    label?: string;
    description?: string;
    control?: ReactNode
}

export const PreferenceItem = ({
    label,
    description,
    control,
}: PreferenceItemProps) => {
    return (
        <Flex justify="space-between" align="center" className={styles.preferenceItem}>
            <Flex direction="column" gap="xs" className={styles.preferenceItem__info}>
                <span className={styles.preferenceItem__label}>{label}</span>
                <span className={styles.preferenceItem__description}>
                    {description}
                </span>
            </Flex>
            
            {control}
        </Flex>
    );
};