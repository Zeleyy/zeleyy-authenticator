import styles from "./ContextMenu.module.scss";
import { useEffect, useRef } from "react";
import clsx from "clsx";

interface ContextMenuItem {
    label: string;
    onClick: () => void;
    danger?: boolean;
}

interface ContextMenuProps {
    items: ContextMenuItem[];
    x: number;
    y: number;
    onClose: () => void;
}

export const ContextMenu = ({ items, x, y, onClose }: ContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [onClose]);

    return (
        <div 
            ref={menuRef}
            className={styles.contextMenu}
            style={{ top: y, left: x }}
        >
            {items.map((item, index) => (
                <button
                    key={index}
                    className={clsx(styles.contextMenu__item, { [styles["contextMenu__item--dangerous"]]: item.danger })}
                    onClick={() => {
                        item.onClick();
                        onClose();
                    }}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};