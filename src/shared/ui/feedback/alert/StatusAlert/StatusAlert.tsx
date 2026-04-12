import styles from "./StatusAlert.module.scss";
import type { CSSProperties, HTMLAttributes } from "react";
import clsx from "clsx";

type StatusAlertVariant = "info" | "success" | "error";
type StatusAlertPosition = "relative" | "fixed";
type StatusAlertPlacement = "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface StatusAlertProps extends HTMLAttributes<HTMLDivElement> {
    message?: string;
    variant?: StatusAlertVariant;
    position?: StatusAlertPosition;
    show?: boolean;
    placement?: StatusAlertPlacement;
    offsetX?: number | string;
    offsetY?: number | string;
}

export const StatusAlert = ({
    message,
    variant = "info",
    className,
    position = "relative",
    show = true,
    placement = "top",
    offsetX = 0,
    offsetY = 0,
    ...rest
}: StatusAlertProps) => {
    const classNames = clsx(
        styles.statusAlert,
        styles[`statusAlert--${variant}`],
        styles[`statusAlert--${position}`],
        styles[`statusAlert--${placement}`],
        {
            [styles["statusAlert--show"]]: show && message,
        },
        className,
    );

    return (
        <div
            className={classNames}
            role="alert"
            {...rest}
            style={{
                '--offset-x': typeof offsetX === 'number' ? `${offsetX}px` : offsetX,
                '--offset-y': typeof offsetY === 'number' ? `${offsetY}px` : offsetY,
            } as CSSProperties}
        >
            {message}
        </div>
    );
};