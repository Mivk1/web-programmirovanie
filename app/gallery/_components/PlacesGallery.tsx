"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { habits, type Habit } from "../../data/habits";
import PhotoModal from "./PhotoModal";
import styles from "./PlacesGallery.module.css";
import dynamic from "next/dynamic";
const PhotoMap = dynamic(() => import("./PhotoMap"), { ssr: false });

export default function PlacesGallery() {
    const [selected, setSelected] = useState<Habit | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
        () => new Set<string>(),
    );
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [returnFocusTo, setReturnFocusTo] = useState<HTMLButtonElement | null>(
        null,
    );

    function openFromCard(habit: Habit, button: HTMLButtonElement) {
        triggerRef.current = button;
        setReturnFocusTo(button);
        setSelected(habit);
    }

    function openFromMap(habit: Habit) {
        triggerRef.current = null;
        setReturnFocusTo(null);
        setSelected(habit);
    }

    function closeModal() {
        setSelected(null);
    }

    function toggleFavorite(id: string) {
        setFavoriteIds((current) => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    return (
        <>
            <div className={styles.grid}>
                {habits.map((habit, index) => (
                    <button
                        className={styles.card}
                        type="button"
                        key={habit.id}
                        onClick={(event) => openFromCard(habit, event.currentTarget)}
                    >
                        <span className={styles.imageWrap}>
                            <Image
                                src={habit.image}
                                alt={habit.imageAlt}
                                fill
                                /*  адаптивный sizes */
                                sizes="(max-width: 47.99rem) calc(100vw - 2rem), (max-width: 74.99rem) 45vw, 22rem"
                                className={styles.image}
                                priority={index === 0}
                            />
                        </span>
                        <span className={styles.cardBody}>
                            <span className={styles.title}>{habit.title}</span>
                            <span className={styles.summary}>{habit.description}</span>
                        </span>
                    </button>
                ))}
            </div>

            <p className={styles.demoNote}>
                Избранное в этой работе хранится только до обновления страницы.
            </p>

            <PhotoMap habits={habits} onSelect={openFromMap} />

            {selected ? (
                <PhotoModal
                    habit={selected}
                    isFavorite={favoriteIds.has(selected.id)}
                    onToggleFavorite={() => toggleFavorite(selected.id)}
                    onClose={closeModal}
                    returnFocusTo={returnFocusTo}
                />
            ) : null}
        </>
    );
}