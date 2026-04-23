import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useRef, useState } from "react";

export const useQrScanner = () => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getInstance = useCallback((elementId: string) => {
        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode(elementId);
        }
        return scannerRef.current;
    }, []);

    const cleanUp = useCallback(() => {
        if (scannerRef.current) {
            if (scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
            scannerRef.current = null;
        }
    }, []);

    const scanFile = useCallback(async (elementId: string, file: File) => {
        const fileScanner = new Html5Qrcode(elementId);
        setIsLoading(true);
        
        try {
            return await fileScanner.scanFile(file, true);
        } finally {
            setIsLoading(false);
            try { fileScanner.clear(); } catch {}
        }
    }, []);

    return {
        isLoading,
        setIsLoading,
        getInstance,
        scanFile,
        cleanUp,
    };
};