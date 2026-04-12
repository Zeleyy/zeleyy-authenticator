import { useContextMenu, useCopyOtp, useDeleteAccount, type Account } from "@/entities/account";
import { ROUTES } from "@/shared/config";
import { StatusAlert } from "@/shared/ui";
import { CodeCard } from "@/widgets/CodeCard";
import { ContextMenu } from "@/widgets/ContextMenu";
import { useNavigate } from "react-router-dom";

interface AccountListProps {
    accounts: Account[];
}

export const AccountList = ({ accounts }: AccountListProps) => {
    const navigate = useNavigate();
    const { copied, copy } = useCopyOtp();
    const { menu, openMenu, closeMenu } = useContextMenu<Account>();
    const { mutate: deleteAccount } = useDeleteAccount();

    const actions = {
        edit: (account: Account) => {
            const path = ROUTES.EDIT_ACCOUNT.replace(':accountId', String(account.account_id));
            navigate(path, { state: { accountName: account.account_name } });
            closeMenu();
        },
        delete: (accountId: number) => {
            if (!confirm("Удалить аккаунт?")) return;
            
            deleteAccount(accountId, {
                onSuccess: () => closeMenu(),
                onError: () => alert("Не удалось удалить аккаунт")
            });
        }
    };

    return (
        <>
            <StatusAlert
                message="Скопировано в буфер обмена"
                position="fixed"
                show={copied}
                placement="bottom"
                offsetY={100}
            />

            {accounts.map((account) => (
                <CodeCard
                    key={account.account_id}
                    accountId={account.account_id}
                    issuer={account.issuer}
                    accountName={account.account_name}
                    code={account.code}
                    remainingSeconds={account.remaining_seconds}
                    interval={account.interval}
                    onContextMenu={(e) => openMenu(e, account)}
                    onCopy={() => copy(account.code)}
                />
            ))}

            {menu && (
                <ContextMenu
                    x={menu.x}
                    y={menu.y}
                    onClose={closeMenu}
                    items={[
                        { 
                            label: "Изменить", 
                            onClick: () => actions.edit(menu.data) 
                        },
                        { 
                            label: "Удалить", 
                            onClick: () => actions.delete(menu.data.account_id), 
                            danger: true 
                        },
                    ]}
                />
            )}
        </>
    );
};