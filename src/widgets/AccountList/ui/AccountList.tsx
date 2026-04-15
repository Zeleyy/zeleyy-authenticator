import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContextMenu, useCopyOtp, type Account } from "@/entities/account";
import { ROUTES } from "@/shared/config";
import { StatusAlert } from "@/shared/ui";
import { CodeCard } from "@/widgets/CodeCard";
import { ContextMenu } from "@/widgets/ContextMenu";
import { DeleteAccountModal } from "@/features/DeleteAccountModal";

interface AccountListProps {
    accounts: Account[];
}

export const AccountList = ({ accounts }: AccountListProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const { copied, copy } = useCopyOtp();
    const { menu, openMenu, closeMenu } = useContextMenu<Account>();

    const actions = {
        edit: (account: Account) => {
            closeMenu();
            const path = ROUTES.EDIT_ACCOUNT.replace(":accountId", String(account.account_id));
            navigate(path, { state: { accountName: account.account_name } });
        },
        delete: (account: Account) => {
            closeMenu();
            setSelectedAccount(account);
        }
    };

    return (
        <>
            <StatusAlert
                message={t("home.copied")}
                position="fixed"
                show={copied}
                placement="bottom"
                offsetY={100}
            />

            <DeleteAccountModal
                open={!!selectedAccount}
                account={selectedAccount}
                onClose={() => setSelectedAccount(null)}
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
                            label: t("common.edit"),
                            onClick: () => actions.edit(menu.data),
                        },
                        { 
                            label: t("common.delete"),
                            onClick: () => actions.delete(menu.data),
                            danger: true,
                        },
                    ]}
                />
            )}
        </>
    );
};