import styles from "./CodeCard.module.scss";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { Flex } from "@/shared/ui";
import { queryClient } from "@/shared/api";
import { queryKeys } from "@/shared/config";
import { OtpTimer } from "@/features/OtpTimer";

interface CodeCardProps {
    accountId: number;
    displayName: string;
    code: string;
    expiresAt: number;
    interval: number;
    onContextMenu: (e: MouseEvent) => void;
    onCopy: () => void;
}

export const CodeCard = ({
    accountId,
    displayName,
    code,
    expiresAt,
    interval,
    onContextMenu,
    onCopy,
}: CodeCardProps) => {
    const calculateRemaining = useCallback(() => {
        return Math.max(0, expiresAt - Math.floor(Date.now() / 1000));
    }, [expiresAt]);

    const [seconds, setSeconds] = useState(calculateRemaining);

    useEffect(() => {
        setSeconds(calculateRemaining());
    }, [calculateRemaining]);

    useEffect(() => {
        const timer = setInterval(() => {
            const timeLeft = calculateRemaining();
            setSeconds(timeLeft);

            if (timeLeft <= 0) {
                queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateRemaining]);

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
                    <OtpTimer seconds={seconds} maxSeconds={interval}/> 
                </Flex>
            </Flex>
        </>
    );
};