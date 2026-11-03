"use client";

import { useEffect, useRef, useState } from "react";
import type { Habit } from "../../data/habits";
import styles from "./PhotoMap.module.css";

type Coordinates = [number, number];

type YandexPlacemark = {
    events: {
        add: (eventName: string, handler: () => void) => void;
    };
};

type YandexMap = {
    container: {
        fitToViewport: () => void;
    };
    geoObjects: {
        add: (placemark: YandexPlacemark) => void;
    };
    destroy: () => void;
};

type YandexMapsApi = {
    ready: (callback: () => void) => void;
    Map: new (
        container: HTMLElement,
        state: { center: Coordinates; zoom: number; controls: string[] },
    ) => YandexMap;
    Placemark: new (
        coordinates: Coordinates,
        properties: { hintContent: string; balloonContent: string },
        options: { preset: string; iconColor: string },
    ) => YandexPlacemark;
};

declare global {
    interface Window {
        ymaps?: YandexMapsApi;
    }
}

const scriptId = "habit-tracker-yandex-maps";
let mapsPromise: Promise<YandexMapsApi> | null = null;

function loadMaps(apiKey: string): Promise<YandexMapsApi> {
    if (window.ymaps) {
        return new Promise((resolve) => {
            window.ymaps?.ready(() => resolve(window.ymaps as YandexMapsApi));
        });
    }
    if (mapsPromise) return mapsPromise;

    mapsPromise = new Promise((resolve, reject) => {
        function resolveWhenReady() {
            if (!window.ymaps) {
                mapsPromise = null;
                reject(new Error("Yandex Maps API is unavailable"));
                return;
            }
            window.ymaps.ready(() => resolve(window.ymaps as YandexMapsApi));
        }

        const existing = document.getElementById(
            scriptId,
        ) as HTMLScriptElement | null;
        if (existing) {
            existing.addEventListener("load", resolveWhenReady, { once: true });
            existing.addEventListener(
                "error",
                () => reject(new Error("Map script error")),
                { once: true },
            );
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(
            apiKey,
        )}&lang=ru_RU`;
        script.async = true;
        script.addEventListener("load", resolveWhenReady, { once: true });
        script.addEventListener(
            "error",
            () => {
                mapsPromise = null;
                reject(new Error("Map script error"));
            },
            { once: true },
        );
        document.head.appendChild(script);
    });

    return mapsPromise;
}

export default function PhotoMap({
    habits,
    onSelect,
}: {
    habits: Habit[];
    onSelect: (habit: Habit) => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY ?? "";

    const [status, setStatus] = useState<"loading" | "ready" | "error">(
        "loading",
    );

    useEffect(() => {
        if (!apiKey) return;
        if (!containerRef.current || habits.length === 0) return;

        let disposed = false;
        let map: YandexMap | null = null;
        let resizeObserver: ResizeObserver | null = null; 

        async function buildMap() {
            try {
                const ymaps = await loadMaps(apiKey);
                if (disposed || !containerRef.current) return;

                const first = habits[0];
                map = new ymaps.Map(containerRef.current, {
                    center: [first.latitude, first.longitude],
                    zoom: 11,
                    controls: ["zoomControl"],
                });

                habits.forEach((habit) => {
                    const placemark = new ymaps.Placemark(
                        [habit.latitude, habit.longitude],
                        { hintContent: habit.title, balloonContent: habit.place },
                        { preset: "islands#circleDotIcon", iconColor: "#2e7d32" }
                    );
                    placemark.events.add("click", () => onSelect(habit));
                    map?.geoObjects.add(placemark);
                });

                if (containerRef.current && typeof ResizeObserver !== "undefined") {
                    resizeObserver = new ResizeObserver(() => {
                        map?.container.fitToViewport();
                    });
                    resizeObserver.observe(containerRef.current);
                }

                setStatus("ready");
            } catch {
                if (!disposed) setStatus("error");
            }
        }

        void buildMap();

        return () => {
            disposed = true;
            resizeObserver?.disconnect();
            map?.destroy();
        };
    }, [apiKey, onSelect, habits]);

    if (!apiKey) {
        return (
            <section className={styles.section} aria-labelledby="map-title">
                <h2 id="map-title">Карта мест для привычек</h2>
                <p className={styles.status}>
                    Добавьте NEXT_PUBLIC_YANDEX_MAPS_API_KEY в файл .env.local.
                </p>
            </section>
        );
    }

    return (
        <section className={styles.section} aria-labelledby="map-title">
            <h2 id="map-title">Карта мест для привычек</h2>
            {status === "error" ? (
                <p className={styles.status}>Не удалось загрузить карту.</p>
            ) : null}
            {status === "loading" ? (
                <p className={styles.status}>Карта загружается…</p>
            ) : null}
            <div
                ref={containerRef}
                className={styles.canvas}
                aria-label="Интерактивная карта мест для привычек"
            />
        </section>
    );
}