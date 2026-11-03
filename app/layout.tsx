import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import DemoAuthProvider from "./providers/DemoAuthProvider";
import BurgerMenu from "./ui/BurgerMenu/BurgerMenu";
import "./globals.css"; // Импорт глобальных стилей

export const metadata: Metadata = {
    title: "HabitTracker",
    description: "Трекер полезных привычек",
};

export const viewport: Viewport = {
    themeColor: "#f5f5f5",
    colorScheme: "light",
};

export default function RootLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="ru">
            <body>
                <DemoAuthProvider>
                    <BurgerMenu />
                    {children}
                </DemoAuthProvider>
            </body>
        </html>
    );
}