import styles from "./QrScanner.module.scss";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Flex, SpinnerLoader } from "@/shared/ui";
import { useQrScanner } from "@/shared/lib/hooks";
import { useTranslation } from "react-i18next";
import { platform } from "@tauri-apps/plugin-os";

interface QrScannerProps {
    onScan: (data: string) => void;
    onError?: (error: Error) => void;
}

export const QrScanner = ({
    onScan,
    onError,
}: QrScannerProps) => {
const { getInstance, cleanUp, isLoading, setIsLoading } = useQrScanner();
    const { t } = useTranslation();
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkPlatform = async () => {
            const currentPlatform = platform();
            if (currentPlatform === 'windows' || currentPlatform === 'macos' || currentPlatform === 'linux') {
                setIsDesktop(true);
                setIsLoading(false);
                return true;
            }
            return false;
        };

        const startScanner = async () => {
            const desktop = await checkPlatform();
            if (desktop) return;

            const html5QrCode = getInstance("reader");
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
                setTimeout(() => setIsLoading(false), 350);
            }
        };

        startScanner();

        return () => { cleanUp(); };
    }, [onScan, onError, getInstance, cleanUp, setIsLoading]);

    if (isDesktop) {
        return (
            <div className={styles.qrScanner}>
                <Flex direction="column" align="center" justify="center" gap={"md"} className={styles.qrScanner__desktopMsg}>
                    <p>{t("add.qr.errors.desktopNotSupported")}</p>
                </Flex>
            </div>
        );
    }

    return (
        <div className={styles.qrScanner}>
            {isLoading && (
                <Flex direction="column" align="center" justify="center" className={styles.qrScanner__loader}>
                    <SpinnerLoader isLoading/>
                </Flex>
            )}
            
            <div id="reader" className={styles.qrScanner__reader} style={{ opacity: isLoading ? 0 : 1 }} />
            
            {!isLoading && (
                <div className={styles.qrScanner__overlay}>
                    <div className={clsx(styles.qrScanner__corner, styles.qrScanner__corner_tl)}></div>
                    <div className={clsx(styles.qrScanner__corner, styles.qrScanner__corner_tr)}></div>
                    <div className={clsx(styles.qrScanner__corner, styles.qrScanner__corner_bl)}></div>
                    <div className={clsx(styles.qrScanner__corner, styles.qrScanner__corner_br)}></div>
                </div>
            )}
        </div>
    );
};