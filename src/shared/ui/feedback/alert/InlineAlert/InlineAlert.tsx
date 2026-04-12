import styles from "./InlineAlert.module.scss";
import type { HTMLAttributes } from "react";
import clsx from "clsx";

type InlineAlertVariant = 'info' | 'success' | 'error';

interface InlineAlertProps extends HTMLAttributes<HTMLDivElement> {
    message?: string;
    variant?: InlineAlertVariant;
}

export const InlineAlert = ({
    message,
    variant = 'info',
    className,
    ...rest
}: InlineAlertProps) => {
    const classNames = clsx(
        styles.inlineAlert,
        styles[`inlineAlert--${variant}`],
        {
            [styles['inlineAlert--show']]: message,
        },
        className,
    );

    return (
        <div
            className={classNames}
            role="alert"
            {...rest}
        >
            {message}
        </div>
    );
};