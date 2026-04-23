import type { CreateAccountDto } from "../model";

export const parseQrData = (rawParams: string): CreateAccountDto => {
    try {
        const url = new URL(rawParams);
        
        if (url.protocol === 'otpauth:') {
            const searchParams = url.searchParams;
            
            const period = searchParams.get('period');
            const digits = searchParams.get('digits');

            return {
                secret: searchParams.get('secret') || '',
                issuer: searchParams.get('issuer') || undefined,
                accountName: decodeURIComponent(url.pathname.split(':').pop() || url.pathname.slice(1)),
                digits: digits ? parseInt(digits, 10) : undefined,
                interval: period ? parseInt(period, 10) : undefined,
            };
        }

        const parsedJson = JSON.parse(rawParams);
        return {
            accountName: parsedJson.accountName || parsedJson.accountName || "",
            secret: parsedJson.secret || "",
            issuer: parsedJson.issuer || undefined,
            digits: parsedJson.digits ? parseInt(parsedJson.digits, 10) : undefined,
            interval: (parsedJson.interval || parsedJson.period) ? 
                parseInt(parsedJson.interval || parsedJson.period, 10) : undefined,
        };
    } catch {
        return { 
            accountName: "",
            secret: rawParams,
        };
    }
};