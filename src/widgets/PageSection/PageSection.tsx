import styles from "./PageSection.module.scss";
import { ReactNode } from "react";
import { Flex } from "@/shared/ui";

interface PageSectionProps {
    children?: ReactNode;
    title?: string;
}

export const PageSection = ({
    children,
    title,
}: PageSectionProps) => {
    return (
        <Flex as={"section"} direction="column" gap="sm" className={styles.pageSection}>
            <h2 className={styles.pageSection__title}>{title}</h2>
            
            <Flex direction="column">
                {children}
            </Flex>
        </Flex>
    );
};