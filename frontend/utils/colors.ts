/**
 * Utility untuk mendapatkan styling warna badge grouping lokasi CCTV secara konsisten dan berbeda-beda
 */
export function getGroupBadgeColor(groupName?: string): string {
    if (!groupName) {
        return "bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-slate-300 border-slate-200 dark:border-neutral-700";
    }

    const lower = groupName.toLowerCase();

    // Lantai 5 -> Nuansa Indigo/Biru
    if (lower.includes("5") || lower.includes("lima")) {
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80";
    }
    // Lantai 6 -> Nuansa Ungu/Violet
    if (lower.includes("6") || lower.includes("enam")) {
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800/80";
    }

    // Variasi grup lainnya
    const palette = [
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80",
        "bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800/80",
        "bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800/80",
        "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/80",
        "bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200 dark:border-teal-800/80",
    ];

    let hash = 0;
    for (let i = 0; i < groupName.length; i++) {
        hash = groupName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
}
