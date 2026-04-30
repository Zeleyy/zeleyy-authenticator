import styles from "./CodeCard.module.scss";
import { type MouseEvent } from "react";
import { Flex } from "@/shared/ui";
import { OtpTimer } from "@/features/OtpTimer";

interface CodeCardProps {
    accountId: number;
    displayName: string;
    code: string;
    remainingSeconds: number;
    interval: number;
    onContextMenu: (e: MouseEvent) => void;
    onCopy: () => void;
}
// @TODO изменить логику получения данных инвалидировать по истечению interval добавить в ответ от rust expire_at
export const CodeCard = ({
    accountId,
    displayName,
    code,
    remainingSeconds,
    interval,
    onContextMenu,
    onCopy,
}: CodeCardProps) => {
    return (
        <>
            <Flex
                data-account-id={accountId}
                align="center" 
                justify="space-between" 
                className={styles.codeCard}
                onContextMenu={onContextMenu}
                onClick={onCopy}
            >
                <Flex direction="column">
                    <div>{displayName}</div>
                    <div className={styles.codeCard__code}>{code}</div>
                </Flex>
                <Flex align="center">
                    <OtpTimer seconds={remainingSeconds} maxSeconds={interval}/> 
                </Flex>
            </Flex>
        </>
    );
};