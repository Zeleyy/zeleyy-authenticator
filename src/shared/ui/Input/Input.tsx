import styles from "./Input.module.scss";
import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const Input = ({
    type = "text",
    id,
    name,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    placeholder = "",
    className = "",
    ...rest
}: InputProps) => {
    const classNames = clsx(
        styles.input,
        {
            [styles['input--error']]: error,
        },
        className,
    );

    return (
        <input
            className={classNames}
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            {...rest}
        />
    );
};
