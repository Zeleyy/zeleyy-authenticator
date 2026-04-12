import { useDeleteAccount, type Account } from "@/entities/account";
import { Button, Flex, Modal, StatusAlert } from "@/shared/ui";
import { useEffect, useState } from "react";

interface DeleteAccountModalProps {
    open?: boolean;
    account?: Account | null;
    onClose: () => void;
}

export const DeleteAccountModal = ({
    open = false,
    account,
    onClose,
}: DeleteAccountModalProps) => {
    const [error, setError] = useState("");
    const [lastAccount, setLastAccount] = useState(account);
    const { mutate: deleteAccount } = useDeleteAccount();

    useEffect(() => {
        if (account) {
            setLastAccount(account);
            setError("");
        }
    }, [account]);

    const displayAccount = account || lastAccount;

    const handleDeleteConfirm = () => {
        if (!displayAccount) return;
        
        deleteAccount(displayAccount.account_id, {
            onSuccess: () => {
                onClose();
            },
            onError: (error) => {
                setError("Не удалось удалить аккаунт");
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
                        Удалить аккаунт "{displayAccount?.account_name}"?
                    </Flex>
                    <Flex gap="sm" justify="center">
                        <Button variant="ghost" onClick={onClose}>
                            Отмена
                        </Button>
                        <Button 
                            variant="ghost" 
                            color="var(--red)"
                            onClick={handleDeleteConfirm}
                        >
                            Удалить
                        </Button>
                    </Flex>
                </Flex>
            </Modal>
        </>
    );
};