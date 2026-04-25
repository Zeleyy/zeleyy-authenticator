import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteAccount, type Account, type AccountUI } from "@/entities/account";
import { Button, Flex, Modal, StatusAlert } from "@/shared/ui";

interface DeleteAccountModalProps {
    open?: boolean;
    account?: AccountUI | null;
    onClose: () => void;
}

export const DeleteAccountModal = ({
    open = false,
    account,
    onClose,
}: DeleteAccountModalProps) => {
    const { t } = useTranslation();
    const [error, setError] = useState("");
    const [lastAccount, setLastAccount] = useState(account);
    const { mutate: deleteAccount } = useDeleteAccount();

    if (account && account !== lastAccount) {
        setLastAccount(account);
        setError("");
    }

    const displayAccount = account || lastAccount;

    const handleDeleteConfirm = () => {
        if (!displayAccount) return;
        
        deleteAccount(displayAccount.accountId, {
            onSuccess: () => {
                onClose();
            },
            onError: (error) => {
                setError(t("home.deleteModal.error"));
                console.error("Delete account error:", error);
            }
        });
    };

    return (
        <>
            <StatusAlert
                message={error}
                variant="error"
                position="fixed"
                placement="bottom"
                offsetY={100}
            />

            <Modal open={open} onClose={onClose}>
                <Flex direction="column" gap="md">
                    <Flex justify="center">
                        {t("home.deleteModal.confirm", { name: displayAccount?.displayName })}
                    </Flex>
                    <Flex gap="sm" justify="center">
                        <Button variant="ghost" onClick={onClose}>
                            {t("common.cancel")}
                        </Button>
                        <Button 
                            variant="ghost" 
                            color="var(--red)"
                            onClick={handleDeleteConfirm}
                        >
                            {t("common.delete")}
                        </Button>
                    </Flex>
                </Flex>
            </Modal>
        </>
    );
};