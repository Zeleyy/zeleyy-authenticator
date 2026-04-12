import { useState, type MouseEvent } from "react";

export const useContextMenu = <T>() => {
    const [menu, setMenu] = useState<{ x: number; y: number; data: T } | null>(null);

    const openMenu = (e: MouseEvent, data: T) => {
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY, data });
    };

    const closeMenu = () => setMenu(null);

    return {
        menu,
        openMenu,
        closeMenu,
    };
};