import styles from "./OtpTimer.module.scss";
import { Flex } from "@/shared/ui";

interface OtpTimerProps {
    seconds: number;
    maxSeconds?: number;
    size?: number;
}

export const OtpTimer = ({
    seconds,
    maxSeconds = 30,
    size = 24
}: OtpTimerProps) => {
    const radius = 6;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (seconds / maxSeconds) * circumference;

    return (
        <Flex align="center" justify="center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 24 24" className={styles.otpTimer__svg}>
                <circle 
                    cx="12" cy="12" 
                    r={radius} 
                    className={styles.otpTimer__progress}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
        </Flex>
    );
};
