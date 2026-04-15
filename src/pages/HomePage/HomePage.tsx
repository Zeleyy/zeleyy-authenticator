import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Flex, SpinnerLoader } from "@/shared/ui";
import { useAccounts } from "@/entities/account";
import { AccountList } from "@/widgets/AccountList";

export const HomePage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q") || "";
    const { data: filteredAccounts, isLoading } = useAccounts(searchQuery);

    if (isLoading) return <SpinnerLoader isLoading/>;
    if (!filteredAccounts?.length) return <Flex justify="center" align="center">{t("home.empty")}</Flex>;

    return (
        <>
            <AccountList accounts={filteredAccounts}/>
        </>
    );
};