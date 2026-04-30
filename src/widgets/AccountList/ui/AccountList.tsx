import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContextMenu, useCopyOtp, type AccountUI } from "@/entities/account";
import { ROUTES } from "@/shared/config";
import { StatusAlert } from "@/shared/ui";
import { CodeCard } from "@/widgets/CodeCard";
import { ContextMenu } from "@/widgets/ContextMenu";
import { DeleteAccountModal } from "@/features/DeleteAccountModal";

interface AccountListProps {
    accounts: AccountUI[];
}

export const AccountList = ({ accounts }: AccountListProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedAccount, setSelectedAccount] = useState<AccountUI | null>(null);
    const { copied, copy } = useCopyOtp();
    const { menu, openMenu, closeMenu } = useContextMenu<AccountUI>();

    const actions = {
        edit: (account: AccountUI) => {
            closeMenu();
            const path = ROUTES.EDIT_ACCOUNT.replace(":accountId", String(account.accountId));
            navigate(path, { state: { accountName: account.accountName } });
        },
        delete: (account: AccountUI) => {
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
                    key={account.accountId}
                    accountId={account.accountId}
                    displayName={account.displayName}
                    code={account.code}
                    expiresAt={account.expiresAt}
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