import styles from "./QrScanner.module.scss";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import clsx from "clsx";
import { Flex, SpinnerLoader } from "@/shared/ui";

export const QrScanner = () => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const startScanner = async () => {
            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 15,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                async (text) => {
                    alert(text);
                    console.log(text)
                },
                () => {}
            );
        };

        try {
            setIsLoading(true);
            startScanner();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }

        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, []);

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