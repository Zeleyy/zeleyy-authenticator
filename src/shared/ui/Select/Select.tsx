import styles from "./Select.module.scss";
import type { ChangeEvent, HTMLAttributes } from "react";
import clsx from "clsx";

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps extends Omit<HTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options?: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

export const Select = ({
    children,
    className,
    options,
    value,
    onChange,
    placeholder,
    ...rest
}: SelectProps) => {
    const classNames = clsx(
        styles.select,
        {

        },
        className,
    );

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value);
    };

    return (
        <select 
            className={classNames} 
            value={value}
            onChange={handleChange}
            {...rest}
        >
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {options
                ? options.map(({ value, label, disabled }) => (
                    <option key={value} value={value} disabled={disabled} className={styles.select__option}>
                        {label}
                    </option>
                ))
                : children
            }
        </select>
    );
};