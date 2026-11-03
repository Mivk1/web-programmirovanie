"use client";

import Image from "next/image";
import Link from "next/link";
import {
    useEffect,
    useRef,
    type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { useDemoAuth } from "../../providers/DemoAuthProvider";
import type { Habit } from "../../data/habits";
import styles from "./PhotoModal.module.css";

type PhotoModalProps = {
    habit: Habit;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onClose: () => void;
    returnFocusTo: HTMLElement | null;
};

const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function PhotoModal({
    habit,
    isFavorite,
    onToggleFavorite,
    onClose,
    returnFocusTo,
}: PhotoModalProps) {
    const { user } = useDemoAuth();
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        function handleEscape(event: globalThis.KeyboardEvent) {
            if (event.key === "Escape") onClose();
        }
        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
            document.documentElement.style.overflow = previousOverflow;
            returnFocusTo?.focus();
        };
    }, [onClose, returnFocusTo]);

    function keepFocusInside(event: ReactKeyboardEvent<HTMLDivElement>) {
        if (event.key !== "Tab") return;
        const focusable = Array.from(
            dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
        );
        if (focusable.length === 0) {
            event.preventDefault();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    return createPortal(
        <div
            className={styles.overlay}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                ref={dialogRef}
                className={styles.dialog}
                role="dialog"
                aria-modal="true"
                aria-labelledby="habit-modal-title"
                onKeyDown={keepFocusInside}
            >
                <button
                    ref={closeButtonRef}
                    className={styles.close}
                    type="button"
                    aria-label="Закрыть окно"
                    onClick={onClose}
                >
                    ×
                </button>
                <h2 id="habit-modal-title">{habit.title}</h2>
                <Image
                    src={habit.image}
                    alt={habit.imageAlt}
                    width={900}
                    height={600}
                    className={styles.image}
                    sizes="(max-width: 700px) calc(100vw - 48px), 720px"
                />
                <p>{habit.description}</p>
                <p>
                    <strong>Частота:</strong> {habit.frequency}
                </p>
                <p>
                    <strong>Место:</strong> {habit.place}
                </p>
                {user ? (
                    <button type="button" onClick={onToggleFavorite}>
                        {isFavorite
                            ? "Убрать из полезных"
                            : "Отметить как полезное место"}
                    </button>
                ) : (
                    <Link href="/auth/login">Войдите, чтобы сохранять места</Link>
                )}
            </div>
        </div>,
        document.body,
    );
}