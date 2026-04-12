import styles from "./Skeleton.module.scss";
import type { HTMLAttributes } from "react";
import clsx from "clsx";

type SkeletonRadius = 'sm' | 'md' | 'lg' | 'full';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    width?: string | number;
    height?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
    radius?: SkeletonRadius;
}

export const Skeleton = ({
    className,
    width,
    height,
    maxWidth,
    maxHeight,
    radius,
    ...rest
}: SkeletonProps) => {
    const classNames = clsx(
        styles.skeleton,
        {
            [styles[`skeleton--radius-${radius}`]]: radius,
        },
        className,
    );

    const style = {
        width,
        height,
        maxWidth,
        maxHeight,
    };

    return (
        <div
            className={classNames}
            style={style}
            {...rest}
        />
    );
};