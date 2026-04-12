import { useContextMenu, useCopyOtp, useDeleteAccount, type Account } from "@/entities/account";
import { StatusAlert } from "@/shared/ui";
import { CodeCard } from "@/widgets/CodeCard";
import { ContextMenu } from "@/widgets/ContextMenu";

interface AccountListProps {
    accounts: Account[]
}

export const AccountList = ({
    accounts
}: AccountListProps) => {
    const { copied, copy } = useCopyOtp();
    const { menu, openMenu, closeMenu } = useContextMenu<number>();
    const { mutate: deleteAccount } = useDeleteAccount();

    const handleEdit = () => {
        if (menu) {
            closeMenu();
        }
    };

    const handleDelete = () => {
        if (menu && confirm("Удалить аккаунт?")) {
            const accountId = menu.data;
            console.log("Edit account:", accountId);
            deleteAccount(accountId, {
                onSuccess: () => {
                    console.log("Account deleted successfully");
                    closeMenu();
                },
                onError: (error) => {
                    console.error("Failed to delete account:", error);
                    alert("Не удалось удалить аккаунт");
                }
            })
            closeMenu();
        }
    };

    return (
        <>
            <StatusAlert
                message="Скопировано в буфер обмена"
                position="fixed"
                show={copied}
                offsetY={100}
            />

            {accounts.map((item) => (
                <CodeCard
                    key={item.account_id}
                    accountId={item.account_id}
                    issuer={item.issuer}
                    accountName={item.account_name}
                    code={item.code}
                    remainingSeconds={item.remaining_seconds}
                    interval={item.interval}
                    onContextMenu={(e) => openMenu(e, item.account_id)}
                    onCopy={() => copy(item.code)}
                />        
            ))}

            {menu && (
                <ContextMenu
                    x={menu.x}
                    y={menu.y}
                    onClose={closeMenu}
                    items={[
                        { label: "Изменить", onClick: handleEdit },
                        { label: "Удалить", onClick: handleDelete, danger: true },
                    ]}
                />
            )}
        </>
    );
};