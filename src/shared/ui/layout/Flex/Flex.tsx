import styles from "./Flex.module.scss";
import type { ElementType, HTMLAttributes } from "react";
import clsx from "clsx";

type FlexDirection = 'row' | 'column';
type FlexJustify = 'start' | 'center' | 'space-between' | 'flex-end';
type FlexAlign = 'stretch' | 'center' | 'flex-start' | 'baseline';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
type FlexGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type FlexSize = 'card-sm' | 'card-md' | 'card-lg' | 'form-sm' | 'form-md' | 'form-lg' | 'page-sm' | 'page-md' | 'page-lg' | 'full';

interface BaseFlexProps {
    direction?: FlexDirection;
    align?: FlexAlign;
    justify?: FlexJustify;
    wrap?: FlexWrap;
    gap?: FlexGap;
    size?: FlexSize;
    container?: boolean;
    mt?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    mb?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
}

type FlexAsElement<T extends ElementType> = BaseFlexProps & {
    as?: T;
} & Omit<HTMLAttributes<HTMLElement>, keyof BaseFlexProps>;

type FlexProps<T extends ElementType = 'div'> = FlexAsElement<T>;

export const Flex = <T extends ElementType = 'div'>({
    children,
    direction,
    align,
    justify,
    wrap,
    gap,
    className,
    as,
    size,
    container,
    mt,
    mb,
    fullWidth,
    ...rest
}: FlexProps<T>) => {
    const Component = as || 'div';

    const classNames = clsx(
        styles.flex,

        {
            [styles[`flex--direction-${direction}`]]: direction,
            [styles[`flex--justify-${justify}`]]: justify,
            [styles[`flex--align-${align}`]]: align,
            [styles[`flex--wrap-${wrap}`]]: wrap,
            [styles[`flex--gap-${gap}`]]: gap,
            [styles[`flex--${size}`]]: size,
            [styles['flex--container']]: container,
            [styles[`flex--mt-${mt}`]]: mt,
            [styles[`flex--mb-${mb}`]]: mb,
            [styles['flex--full-width']]: fullWidth,
        },

        className,
    );

    return (
        <Component
            className={classNames}
            {...rest}
        >
            {children}
        </Component>
    );
};