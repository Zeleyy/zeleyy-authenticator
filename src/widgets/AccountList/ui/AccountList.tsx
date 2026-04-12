import { useCopyOtp } from "@/entities/account";
import type { Account } from "@/entities/account/model";
import { StatusAlert } from "@/shared/ui/feedback";
import { CodeCard } from "@/widgets/CodeCard";
import { ContextMenu } from "@/widgets/ContextMenu";
import { useContextMenu } from "@/entities/account/hooks";

interface AccountListProps {
    accounts: Account[]
}

export const AccountList = ({
    accounts
}: AccountListProps) => {
    const { copied, copy } = useCopyOtp();
    const { menu, openMenu, closeMenu } = useContextMenu();

    const handleEdit = () => {
        if (menu) {
            closeMenu();
        }
    };

    const handleDelete = () => {
        if (menu && confirm("Удалить аккаунт?")) {
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
                        { label: "Изменить", onClick: () => handleEdit },
                        { label: "Удалить", onClick: () => handleDelete, danger: true },
                    ]}
                />
            )}
        </>
    );
};