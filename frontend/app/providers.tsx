"use client";

import { ThemeProvider } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function Providers({ children }: { children: React.ReactNode }) {
    // Menghindari hydration mismatch menggunakan useSyncExternalStore resmi React 19
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
        </ThemeProvider>
    );
}
