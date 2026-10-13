"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Video, 
    ShieldAlert, 
    Sliders, 
    LogOut, 
    Menu, 
    X, 
    Bell, 
    Search, 
    Info, 
    Moon, 
    Sun, 
    ChevronLeft, 
    ChevronRight,
    Shield,
    CheckCircle2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // State untuk kontrol sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    // State untuk popover notifikasi dan info sistem
    const [showNotifications, setShowNotifications] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const notifRef = useRef<HTMLDivElement>(null);
    const [currentUser, setCurrentUser] = useState<{ username: string; role: string; name?: string } | null>(null);

    // Notifikasi operasional KTR
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Indikasi Aktivitas Merokok",
            location: "Lab Programming (Lt. 5)",
            time: "10 menit lalu",
            unread: true,
            severity: "high"
        },
        {
            id: 2,
            title: "Koneksi Stream MediaMTX Tersambung",
            location: "Lab Jaringan (Lt. 6)",
            time: "35 menit lalu",
            unread: false,
            severity: "info"
        },
        {
            id: 3,
            title: "Verifikasi SP-1 Mahasiswa Disetujui",
            location: "Lab Sistem Digital",
            time: "2 jam lalu",
            unread: false,
            severity: "success"
        }
    ]);

    useEffect(() => {
        setMounted(true);
        fetch("/api/auth/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.authenticated && data?.user) {
                    setCurrentUser(data.user);
                }
            })
            .catch(() => {});

        // Tutup dropdown notifikasi saat klik di luar
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navItems = [
        { name: "Dashboard Utama", href: "/", icon: LayoutDashboard },
        { name: "Monitoring CCTV", href: "/cctv", icon: Video },
        { name: "Log Pelanggaran", href: "/violation", icon: ShieldAlert },
        { name: "Pengaturan Sistem", href: "/settings", icon: Sliders },
    ];

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch {
            // ignore
        }
        window.location.href = "/login";
    };

    const getPageTitle = () => {
        if (pathname === "/") return "Dashboard Utama";
        const item = navItems.find(n => pathname.startsWith(n.href) && n.href !== "/");
        return item ? item.name : "Halaman";
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllNotificationsAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-neutral-950 flex font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
            {/* Overlay Sidebar Mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Tutup menu sidebar"
                />
            )}

            {/* Sidebar (Sisi Kiri) */}
            <aside 
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen ${isMinimized ? 'w-[74px]' : 'w-[245px]'} bg-white dark:bg-neutral-900 border-r border-slate-200 dark:border-neutral-800 transform transition-all duration-300 ease-in-out ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                } flex flex-col shadow-xs select-none`}
            >
                {/* Header Logo & Identitas VMS Akademik */}
                <div className="h-[70px] flex items-center justify-between px-4 border-b border-slate-200 dark:border-neutral-800 relative bg-slate-50/70 dark:bg-neutral-900/90">
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-blue-700 dark:bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                            <Shield className="w-4 h-4" />
                        </div>
                        {!isMinimized && (
                            <div className="flex flex-col min-w-0">
                                <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base leading-none">
                                    E.S.I.S
                                </span>
                                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                    VMS Lab Terpadu
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Tombol Tutup Sidebar Mobile */}
                    <button 
                        type="button"
                        aria-label="Tutup navigasi"
                        className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Tombol Minimize Sidebar Desktop */}
                    <button 
                        type="button"
                        aria-label={isMinimized ? "Perluas menu sidebar" : "Perkecil menu sidebar"}
                        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-neutral-800 rounded-full border border-slate-300 dark:border-neutral-700 items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors z-10"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                    </button>
                </div>

                {/* Status Lingkungan Pengawasan */}
                {!isMinimized && (
                    <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-slate-100 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-700/60 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Sistem Pengawasan</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                            AKTIF
                        </span>
                    </div>
                )}

                {/* Navigasi Menu */}
                <nav className="flex-1 pt-3 pb-3 px-2 overflow-y-auto overflow-x-hidden">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center rounded-lg py-2.5 transition-all text-[13px] ${
                                            isMinimized ? 'justify-center px-0' : 'px-3 space-x-3'
                                        } ${
                                            isActive 
                                                ? "bg-blue-700 text-white font-semibold shadow-xs" 
                                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                        title={isMinimized ? item.name : ""}
                                    >
                                        <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-400"}`} />
                                        {!isMinimized && <span className="whitespace-nowrap">{item.name}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Profil Pengguna & Keluar */}
                <div className="p-3 border-t border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50">
                    {!isMinimized && currentUser && (
                        <div className="mb-2 px-1 flex items-center justify-between">
                            <div className="truncate pr-2">
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                    {currentUser.name || currentUser.username}
                                </p>
                                <span className="inline-block text-[10px] font-mono font-medium uppercase px-1.5 py-0.2 rounded bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-slate-300">
                                    {currentUser.role}
                                </span>
                            </div>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className={`flex items-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors w-full ${
                            isMinimized ? 'justify-center py-2' : 'space-x-2.5 px-3 py-2 text-[13px] font-medium'
                        }`}
                        title="Keluar dari Sistem"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {!isMinimized && <span>Keluar Sistem</span>}
                    </button>
                </div>
            </aside>

            {/* Area Utama (Konten & Header) */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
                {/* Header Atas (Top Bar VMS) */}
                <header className="relative z-30 flex items-center justify-between h-[70px] px-4 lg:px-6 bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800 shadow-2xs">
                    <div className="flex items-center space-x-3">
                        <button 
                            type="button"
                            aria-label="Buka navigasi mobile"
                            onClick={() => setSidebarOpen(true)} 
                            className="p-1.5 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg lg:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col">
                            <div className="text-[11px] font-medium text-slate-400 dark:text-slate-400 flex items-center space-x-1.5">
                                <span>Pusat Lab Terpadu</span>
                                <span>/</span>
                                <span className="text-blue-700 dark:text-blue-400">{getPageTitle()}</span>
                            </div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                {getPageTitle()}
                            </h1>
                        </div>
                    </div>

                    {/* Toolbar Kanan (Pencarian, Notifikasi, Mode Gelap, Info Sistem) */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Kolom Pencarian Cepat Lokasi / Kamera */}
                        <div className="relative hidden md:block">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari lab / nomor CCTV..." 
                                className="pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs w-48 lg:w-64 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-neutral-900 transition-all"
                            />
                        </div>

                        {/* Popover Notifikasi Deteksi */}
                        <div className="relative" ref={notifRef}>
                            <button 
                                type="button"
                                aria-label="Lihat notifikasi insiden"
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <Bell className="w-4 h-4" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-slate-200 dark:border-neutral-800 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <div className="px-3 py-2 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                                        <div className="flex items-center space-x-1.5">
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">Notifikasi Deteksi</span>
                                            {unreadCount > 0 && (
                                                <span className="text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-1.5 py-0.2 rounded-full">
                                                    {unreadCount} baru
                                                </span>
                                            )}
                                        </div>
                                        {unreadCount > 0 && (
                                            <button 
                                                type="button"
                                                onClick={markAllNotificationsAsRead}
                                                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                Tandai dibaca
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-neutral-800">
                                        {notifications.map((n) => (
                                            <div 
                                                key={n.id} 
                                                className={`p-3 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-neutral-800/50 ${
                                                    n.unread ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <span className={`font-semibold ${
                                                        n.severity === "high" ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"
                                                    }`}>
                                                        {n.title}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                                                </div>
                                                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{n.location}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-3 pt-2 pb-1 border-t border-slate-100 dark:border-neutral-800 text-center">
                                        <Link 
                                            href="/violation" 
                                            onClick={() => setShowNotifications(false)}
                                            className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            Buka Semua Log Pelanggaran →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tombol Info Sistem & Deskripsi Prototype */}
                        <button 
                            type="button"
                            aria-label="Informasi sistem E.S.I.S"
                            onClick={() => setShowInfoModal(true)}
                            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                            <Info className="w-4 h-4" />
                        </button>

                        {/* Tombol Toggle Tema (Terang / Gelap) */}
                        <button 
                            type="button"
                            aria-label={mounted && theme === 'dark' ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                            {mounted && theme === 'dark' ? (
                                <Sun className="w-4 h-4 text-amber-400" />
                            ) : (
                                <Moon className="w-4 h-4" />
                            )}
                        </button>

                        {/* Indikator Akun Operator / Admin */}
                        <div className="flex items-center space-x-2 pl-1 border-l border-slate-200 dark:border-neutral-800">
                            <div 
                                className="w-7 h-7 rounded-lg bg-slate-800 dark:bg-neutral-700 text-white flex items-center justify-center font-bold text-xs shadow-xs"
                                title={currentUser ? `${currentUser.username} (${currentUser.role})` : "Administrator"}
                            >
                                {currentUser?.username?.slice(0, 2).toUpperCase() || "AD"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Modal Informasi Sistem E.S.I.S */}
                {showInfoModal && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
                            <button 
                                type="button"
                                aria-label="Tutup modal informasi"
                                onClick={() => setShowInfoModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        E.S.I.S (Electronic Smoking Identification System)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Sistem Pengawasan Kawasan Tanpa Rokok (KTR)
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-neutral-800 pt-3">
                                <p>
                                    Platform Video Management System (VMS) berbasis web untuk pemantauan kamera CCTV di lingkungan <strong>Pusat Laboratorium Terpadu (PLT)</strong>, khususnya laboratorium komputer kampus.
                                </p>
                                <div className="bg-slate-50 dark:bg-neutral-800/70 p-3 rounded-lg space-y-1.5 font-mono text-[11px]">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Infrastruktur Streaming:</span>
                                        <span className="text-slate-700 dark:text-slate-200 font-semibold">Raspberry Pi 5 + MediaMTX (WebRTC/HLS)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Total Kamera:</span>
                                        <span className="text-slate-700 dark:text-slate-200 font-semibold">13 Kamera Lab Terdaftar</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Integrasi Database:</span>
                                        <span className="text-slate-700 dark:text-slate-200 font-semibold">Supabase PostgreSQL</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Dikembangkan sebagai prototype penelitian skripsi S1 Teknik Informatika untuk penegakan tata tertib akademik.
                                </p>
                            </div>
                            <div className="mt-5 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowInfoModal(false)}
                                    className="px-4 py-2 bg-slate-800 dark:bg-neutral-700 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 transition-colors"
                                >
                                    Tutup Informasi
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Area Konten Scrollable */}
                <div className="relative z-10 flex-1 overflow-y-auto px-4 py-5 lg:px-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
