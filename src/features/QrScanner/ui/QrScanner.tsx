import styles from "./QrScanner.module.scss";
import { useEffect } from "react";
import clsx from "clsx";
import { Flex, SpinnerLoader } from "@/shared/ui";
import { useQrScanner } from "@/shared/lib/hooks";

interface QrScannerProps {
    onScan: (data: string) => void;
    onError?: (error: Error) => void;
}

export const QrScanner = ({
    onScan,
    onError,
}: QrScannerProps) => {
    const { getInstance, cleanUp, isLoading, setIsLoading } = useQrScanner();

    useEffect(() => {
        const html5QrCode = getInstance("reader");

        const startScanner = async () => {
            setIsLoading(true);
            try {
                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 15,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    async (text) => {
                        cleanUp();
                        onScan(text);
                    },
                    () => {}
                );
            } catch (error) {
                onError?.(error as Error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 400);
            }
        };

        startScanner();

        return () => { cleanUp(); };
    }, [onScan, onError, getInstance, cleanUp, setIsLoading]);

    return (
        <div className={styles.qrScanner}>
            {isLoading && (
                <Flex direction="column" align="center" justify="center" className={styles.qrScanner__loader}>
                    <SpinnerLoader isLoading/>
                </Flex>
            )}
            
            <div id="reader" className={styles.qrScanner__reader} />
            
            {!isLoading &&
                <div className={styles.qrScanner__overlay}>
                    <div className={clsx(styles.qrScanner__corner, styles.qrScanner__corner_tl)}></div>
                    <div className={clsx(styles.qrScanner__corner, styles.qrScanner__corner_tr)}></div>
                    <div className={clsx(styles.qrScanner__corner, styles.qrScanner__corner_bl)}></div>
                    <div className={clsx(styles.qrScanner__corner, styles.qrScanner__corner_br)}></div>
                </div>
            }
        </div>
    );
};