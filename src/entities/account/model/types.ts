export interface Account {
    accountId: number;
    issuer?: string;
    accountName: string;
    digits: number;
    interval: number;
    code: string;
    expiresAt: number;
}

export interface AccountUI extends Account {
    displayName: string;
}

export interface CreateAccountDto {
    accountName: string;
    secret: string;
    issuer?: string;
    digits?: number;
    interval?: number;
}
