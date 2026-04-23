import styles from "./QrConfirmPage.module.scss";
import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAddAccount, parseQrData } from "@/entities/account";
import { Button, Flex, Input, StatusAlert } from "@/shared/ui";
import { ROUTES } from "@/shared/config";

export const QrConfirmPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { t } = useTranslation();
    const initialData = useMemo(() => parseQrData(state?.qrData || ""), [state?.qrData]);
    const [accountName, setAccountName] = useState(initialData.accountName);
    const [error, setError] = useState("");
    const { mutate: addAccount, isPending } = useAddAccount();
    
    useEffect(() => {
        if (!state?.qrData || !initialData.secret) {
            navigate(ROUTES.ADD.QR.ROOT, { replace: true });
        }
    }, [state?.qrData, initialData.secret, navigate]);

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        const trimmedName = accountName.trim();
        
        if (trimmedName.length === 0) return setError(t("add.manual.errors.nameTooShort"));

        addAccount(
            { ...initialData, accountName: trimmedName },
            {
                onSuccess: () => navigate(ROUTES.HOME),
                onError: (err: Error) => setError(err.message || t("errors.unknown"))
            }
        );
    };

    const isValid = !!initialData.secret && accountName.trim().length > 0;

    return (
        <>
            <StatusAlert 
                message={error} 
                variant="error" 
                position="fixed" 
                placement="bottom" 
                offsetY={100}
            />

            <Flex direction="column" gap="lg">
                <h2 className={styles.qrConfirmPage}>{t("add.qr.confirm.title")}</h2>

                <Flex as="form" direction="column" gap="md" onSubmit={handleSubmit}>
                    <Input
                        name="accountName"
                        placeholder={t("add.qr.confirm.accountName.placeholder")}
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        disabled={isPending}
                        autoFocus
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        disabled={isPending || !isValid}
                    >
                        {t("common.save")}
                    </Button>
                </Flex>
            </Flex>
        </>
    );
};