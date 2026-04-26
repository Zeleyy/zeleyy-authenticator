import styles from "./AnimatedLayout.module.scss";
import { useState } from "react";
import { useLocation, useOutlet, useMatches } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_ORDER, ROUTES_ORDER } from "@/shared/config";

const variants = {
    initial: (direction: string) => ({
        x: direction === "forward" ? "30%" : "-30%",
        opacity: 0,
    }),
    animate: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: string) => ({
        x: direction === "forward" ? "-30%" : "30%",
        opacity: 0,
    }),
};

export const AnimatedLayout = () => {
    const location = useLocation();
    const outlet = useOutlet();
    const matches = useMatches();

    const lastMatch = matches[matches.length - 1];
    const pageKey = lastMatch?.pathname || location.pathname;

    const currentIndex = ROUTES_ORDER[pageKey] ?? DEFAULT_ORDER;

    const [state, setState] = useState({
        prevIndex: currentIndex,
        direction: "forward" as "forward" | "back"
    });

    if (currentIndex !== state.prevIndex) {
        setState({
            prevIndex: currentIndex,
            direction: currentIndex > state.prevIndex ? "forward" : "back"
        });
    }

    return (
        <AnimatePresence mode="wait" custom={state.direction} initial={false} presenceAffectsLayout={false}>
            <motion.div
                key={pageKey}
                custom={state.direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.1, ease: "easeInOut" }}
                className={styles.animatedLayout}
            >
                {outlet}
            </motion.div>
        </AnimatePresence>
    );
};