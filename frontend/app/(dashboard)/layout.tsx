"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Camera, AlertTriangle, Settings, LogOut, Menu, X, Bell, Search, Info, Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // State untuk kontrol sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        { name: "Main Dashboard", href: "/", icon: Home },
        { name: "CCTV Streaming", href: "/cctv", icon: Camera },
        { name: "Pelanggaran", href: "/violation", icon: AlertTriangle },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    const handleLogout = () => {
        document.cookie = "is_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push("/login");
    };

    const getPageTitle = () => {
        if (pathname === "/") return "Main Dashboard";
        const item = navItems.find(n => pathname.startsWith(n.href) && n.href !== "/");
        return item ? item.name : "Page";
    };

    return (
        <div className="min-h-screen bg-[#F4F7FE] dark:bg-neutral-950 flex font-sans text-[#2B3674] dark:text-white transition-colors duration-300">
            {/* Overlay Sidebar Mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar (Sisi Kiri) */}
            <aside 
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen ${isMinimized ? 'w-[100px]' : 'w-[290px]'} bg-gradient-to-b from-white via-white/95 to-white/40 dark:from-slate-800 dark:via-slate-800/95 dark:to-slate-800/40 backdrop-blur-md border-r border-slate-100 dark:border-neutral-800 transform transition-all duration-300 ease-in-out ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                } flex flex-col shadow-sm`}
            >
                {/* Header Logo */}
                <div className="h-[100px] flex items-center justify-center border-b border-slate-100 dark:border-neutral-800 relative">
                    <span className={`font-extrabold uppercase tracking-tight text-[#2B3674] dark:text-white transition-all ${isMinimized ? 'text-lg' : 'text-2xl'}`}>
                        E.S.I.S
                    </span>
                    {/* Tombol Tutup Sidebar Mobile */}
                    <button 
                        className="absolute right-4 lg:hidden text-slate-400 hover:text-slate-600"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                    {/* Tombol Minimize Sidebar Desktop */}
                    <button 
                        className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-neutral-900 rounded-full border border-slate-200 dark:border-slate-700 items-center justify-center text-[#2B3674] dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                {/* List Menu */}
                <nav className="flex-1 pt-6 pb-4 overflow-y-auto overflow-x-hidden">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                            return (
                                <li key={item.name} className="relative">
                                    {isActive && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-9 bg-[#4318FF] rounded-l-full"></div>
                                    )}
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-8 py-3 transition-colors ${isMinimized ? 'justify-center px-0' : 'space-x-4'} ${
                                            isActive 
                                                ? "text-[#2B3674] font-bold" 
                                                : "text-[#A3AED0] hover:text-[#2B3674] dark:hover:text-white"
                                        }`}
                                        title={isMinimized ? item.name : ""}
                                    >
                                        <item.icon className={`w-[20px] h-[20px] shrink-0 ${isActive ? "text-[#4318FF]" : "text-[#A3AED0]"}`} />
                                        {!isMinimized && <span className="whitespace-nowrap text-sm">{item.name}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bagian Bawah Sidebar (Logout) */}
                <div className={`px-6 pb-8 transition-all ${isMinimized ? 'px-2' : ''}`}>
                    <button
                        onClick={handleLogout}
                        className={`flex items-center text-[#A3AED0] hover:text-red-500 transition-colors w-full ${
                            isMinimized ? 'justify-center py-3' : 'space-x-4 px-2 py-3 mt-4'
                        }`}
                        title={isMinimized ? "Sign Out" : ""}
                    >
                        <LogOut className="w-[20px] h-[20px]" />
                        {!isMinimized && <span className="text-sm font-medium">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Area Utama (Konten & Header) */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
                {/* Header Atas (Navbar) */}
                <header className="relative z-30 flex items-center justify-between pt-6 px-4 lg:px-8 mb-8">
                    <div className="flex flex-col">
                        {/* Tombol Sidebar Mobile */}
                        <div className="flex items-center lg:hidden mb-1">
                            <button onClick={() => setSidebarOpen(true)} className="p-1 mr-2 text-[#2B3674] dark:text-white">
                                <Menu className="w-6 h-6" />
                            </button>
                            <div className="text-sm text-[#707EAE] dark:text-slate-400">Pages / {getPageTitle()}</div>
                        </div>
                        <div className="hidden lg:block text-sm text-[#707EAE] dark:text-slate-400">Pages / {getPageTitle()}</div>
                        <h1 className="text-[34px] font-bold text-[#2B3674] dark:text-white capitalize leading-tight">{getPageTitle()}</h1>
                    </div>

                    {/* Navbar Kanan (Search & Icons) */}
                    <div className="flex items-center bg-white dark:bg-neutral-900 p-2.5 rounded-[30px] shadow-[0_18px_40px_rgba(112,144,176,0.12)] gap-4 transition-colors">
                        <div className="flex items-center bg-[#F4F7FE] dark:bg-neutral-950 rounded-full px-4 py-2 w-32 md:w-56 transition-colors">
                            <Search className="w-4 h-4 text-[#2B3674] dark:text-white" />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="bg-transparent border-none outline-none ml-2 text-sm w-full text-[#2B3674] dark:text-white placeholder:text-[#A3AED0]"
                            />
                        </div>
                        <button className="text-[#A3AED0] hover:text-[#2B3674] dark:hover:text-white transition-colors">
                            <Bell className="w-[18px] h-[18px]" />
                        </button>
                        {/* Tombol Toggle Tema (Terang / Gelap) */}
                        <button 
                            className="text-[#A3AED0] hover:text-[#2B3674] dark:hover:text-white transition-colors"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            aria-label="Toggle Dark Mode"
                        >
                            {mounted && theme === 'dark' ? (
                                <Sun className="w-[18px] h-[18px]" />
                            ) : (
                                <Moon className="w-[18px] h-[18px]" />
                            )}
                        </button>
                        <button className="text-[#A3AED0] hover:text-[#2B3674] dark:hover:text-white transition-colors">
                            <Info className="w-[18px] h-[18px]" />
                        </button>
                        <div className="w-[40px] h-[40px] rounded-full bg-[#4318FF] flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-sm border-2 border-white dark:border-neutral-800">
                            AD
                        </div>
                    </div>
                </header>

                {/* Area Konten Scrollable */}
                <div className="relative z-10 flex-1 overflow-auto px-4 pb-8 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
