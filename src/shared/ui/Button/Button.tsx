import styles from "./Button.module.scss";
import type { ElementType, ButtonHTMLAttributes, AnchorHTMLAttributes, CSSProperties, ComponentPropsWithoutRef } from "react";
import { Link, NavLink, type LinkProps, type NavLinkProps } from "react-router-dom";
import clsx from "clsx";

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface BaseButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    color?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    square?: boolean;
    noPadding?: boolean;
    className?: string;
}

type ButtonAsButton = BaseButtonProps & 
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
        as?: 'button';
        to?: never;
        href?: never;
        activeClass?: never;
    };

type ButtonAsLink = BaseButtonProps & 
    Omit<LinkProps, keyof BaseButtonProps | 'to'> & {
        as?: never;
        to: string;
        href?: never;
        activeClass?: never;
    };

type ButtonAsNavLink = BaseButtonProps &
    Omit<NavLinkProps, keyof BaseButtonProps | 'to' | 'className'> & {
        as?: never;
        to: string;
        href?: never;
        activeClass?: string;
    };

type ButtonAsAnchor = BaseButtonProps & 
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
        as?: never;
        to?: never;
        href: string;
        activeClass?: never;
    };

type ButtonAsCustom<T extends ElementType> = BaseButtonProps & {
    as: T;
    to?: never;
    href?: never;
    activeClass?: never;
} & Omit<ComponentPropsWithoutRef<T>, keyof BaseButtonProps>;

type ButtonProps<T extends ElementType = 'button'> = 
    | ButtonAsButton
    | ButtonAsNavLink
    | ButtonAsLink
    | ButtonAsAnchor
    | ButtonAsCustom<T>;

export const Button = <T extends ElementType = 'button'>({
    children,
    to,
    href,
    variant = "primary",
    size = "medium",
    color,
    className = "",
    fullWidth = false,
    disabled = false,
    square = false,
    noPadding = false,
    activeClass,
    as,
    ...rest
}: ButtonProps<T>) => {

    const classNames = clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        {
            [styles['button--full-width']]: fullWidth,
            [styles['button--disabled']]: disabled,
            [styles['button--square']]: square,
            [styles['button--no-padding']]: noPadding,
        },
        className,
    );

    let Component: ElementType = "button";

    if (as) {
        Component = as;
    } else if (activeClass && to) {
        Component = NavLink;
    } else if (to) {
        Component = Link;
    } else if (href) {
        Component = "a";
    }

    const componentProps: Record<string, unknown> = {
        ...rest,
        className: classNames,
        style: color ? { '--btn-color': color } as CSSProperties : undefined,
    };

    if (Component === "button") {
        (componentProps as ButtonHTMLAttributes<HTMLButtonElement>).disabled = disabled;
    } else if (disabled) {
        componentProps['aria-disabled'] = true;
    }

    if (Component === Link && to) {
        (componentProps as { to: typeof to }).to = to;
    } else if (Component === NavLink && activeClass) {
        componentProps.to = to;
        componentProps.className = ({ isActive }: { isActive: boolean }) => clsx(
            classNames,
            { [activeClass]: isActive }
        );
    } else if (Component === "a" && href) {
        (componentProps as AnchorHTMLAttributes<HTMLAnchorElement>).href = href;
    }

    return (
        <Component {...componentProps}>
            {children}
        </Component>
    );
};