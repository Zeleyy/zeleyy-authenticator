import styles from "./Switch.module.scss";
import { InputHTMLAttributes, useId } from "react";
import clsx from "clsx";

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const Switch = ({
    checked,
    onChange,
    className,
    label = "Toggle switch",
    ...rest
}: SwitchProps) => {
    const generatedId = useId();
    const id = rest.id || generatedId;

    return (
        <label htmlFor={id} className={clsx(styles.switch, className)}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={styles.switch__input}
                aria-label={label}
                {...rest}
            />
            <span className={styles.switch__slider} />
        </label>
    );
};
