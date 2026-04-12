import { Flex, SpinnerLoader } from "@/shared/ui";
import { useAccounts } from "@/entities/account";
import { AccountList } from "@/widgets/AccountList";

export const HomePage = () => {
    const { data, isLoading } = useAccounts();

    if (isLoading) return <SpinnerLoader isLoading/>;
    if (!data?.length) return <Flex justify="center" align="center">Здесь пока нет аккаунтов</Flex>;

    return (
        <>
            <AccountList accounts={data}/>
        </>
    );
};