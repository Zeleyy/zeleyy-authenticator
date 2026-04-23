import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui";
import { useQrScanner } from "@/shared/lib/hooks";

interface FileQrSelectorProps {
    onScan: (data: string) => void;
    onError: (error: Error) => void;
}

export const FileQrSelector = ({
    onScan,
    onError,
}: FileQrSelectorProps) => {
    const { t } = useTranslation();
    const { scanFile, isLoading } = useQrScanner();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const decodedText = await scanFile("file-scan-temp", file);
            onScan(decodedText);
        } catch {
            onError(new Error(t("add.qr.errors.notFound")));
        } finally {
            e.target.value = ""; 
        }
    };

    return (
        <div>
            <input 
                id="qr-upload" 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
                disabled={isLoading} 
            />
            <Button
                as="label"
                htmlFor="qr-upload"
                disabled={isLoading}
            >
                {t("add.qr.selectFromGallery")}
            </Button>
            <div id="file-scan-temp" style={{ display: 'none' }} />
        </div>
    );
};