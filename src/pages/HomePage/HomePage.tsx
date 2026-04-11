import styles from "./HomePage.module.scss";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { Flex } from "@/shared/ui";
import { OtpTimer } from "@/features/OtpTimer";

export interface Account {
    account_id: number;
    issuer?: string;
    account_name: string;
    digits: number;
    interval: number;
    code: string;
    remaining_seconds: number;
}

export const HomePage = () => {
    const { data, isLoading } = useQuery<Account[]>({
        queryKey: ["accounts"],
        queryFn: async () => {
            const accounts = await invoke<Account[]>("get_accounts");

            return accounts;
        },
        refetchInterval: 1000,
    });

    if (isLoading) return <Flex justify="center" align="center">Загрузка...</Flex>;
        if (!data || data.length === 0) {
        return <Flex justify="center" align="center">Здесь пока нет аккаунтов</Flex>;
    }

    return (
        <>
            {data.map((item) => (
                <Flex 
                    key={item.account_id}
                    align="center" 
                    justify="space-between" 
                    className={styles.code__card}
                >
                    <Flex direction="column">
                        <div>
                            {item.issuer
                                ? `${item.issuer}: ${item.account_name}`
                                : item.account_name
                            }
                        </div>
                        <div className={styles.code}>{item.code}</div>
                    </Flex>
                    <Flex align="center">
                        <OtpTimer seconds={item.remaining_seconds} maxSeconds={item.interval || 30}/> 
                    </Flex>
                </Flex>
            ))}
        </>
    );
};