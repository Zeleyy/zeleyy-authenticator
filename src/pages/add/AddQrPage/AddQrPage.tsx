import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, StatusAlert } from "@/shared/ui";
import { QrScanner } from "@/features/QrScanner";
import { ROUTES } from "@/shared/config";

export const AddQrPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");

    const handleScan = useCallback((data: string) => {
        if (!data) return;
        navigate(ROUTES.ADD.QR.CONFIRM, { state: { qrData: data } });
    }, [navigate]);

    const handleError = useCallback((err: Error) => {
        setError(err.message);
        console.error("QR Scan Error:", err);
    }, []);

    return (
        <>
            <StatusAlert
                message={error}
                variant="error"
                position="fixed"
                placement="bottom"
                offsetY={100}
            />

            <Flex align="center" justify="center" direction="column">
                <QrScanner
                    onScan={handleScan}
                    onError={handleError}
                />
            </Flex>
        </>
    );
};