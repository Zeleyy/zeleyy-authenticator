import { useTranslation } from "react-i18next";
import { Flex, SpinnerLoader } from "@/shared/ui";
import { useAccounts } from "@/entities/account";
import { AccountList } from "@/widgets/AccountList";

export const HomePage = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useAccounts();

    if (isLoading) return <SpinnerLoader isLoading/>;
    if (!data?.length) return <Flex justify="center" align="center">{t("home.empty")}</Flex>;

    return (
        <>
            <AccountList accounts={data}/>
        </>
    );
};