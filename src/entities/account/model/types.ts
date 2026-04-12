export interface Account {
    account_id: number;
    issuer?: string;
    account_name: string;
    digits: number;
    interval: number;
    code: string;
    remaining_seconds: number;
}