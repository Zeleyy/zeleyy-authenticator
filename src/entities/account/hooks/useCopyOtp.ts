import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useState } from "react";

export const useCopyOtp = () => {
    const [copied, setCopiet] = useState(false);
    const copy = async (code: string) => {
        await writeText(code);
        setCopiet(true);
        setTimeout(() => setCopiet(false), 2000);
    };
    return {
        copied,
        copy,
    };
};