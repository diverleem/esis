"use client";

import { useState } from "react";
import { User, Lock, AlertCircle, Loader2, Shield, Eye, EyeOff, Video } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setErrorMsg(data.message || "Gagal masuk. Periksa nama pengguna dan kata sandi Anda.");
                setIsLoading(false);
                return;
            }

            // Redirect ke dashboard
            window.location.href = "/";
        } catch {
            setErrorMsg("Gagal terhubung ke server. Silakan coba lagi nanti.");
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex overflow-hidden bg-slate-100 dark:bg-neutral-950 font-sans">
            {/* Sisi Kiri: Branding VMS & Layanan Akademik Laboratorium */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 text-white flex-col justify-between p-12 border-r border-slate-800">
                {/* Background Pattern halus & bernuansa surveillance */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>

                {/* Header Kiri */}
                <div className="relative z-10 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight">E.S.I.S</h2>
                        <p className="text-xs text-slate-400">Pusat Laboratorium Terpadu</p>
                    </div>
                </div>

                {/* Tengah: Ringkasan Sistem */}
                <div className="relative z-10 max-w-md space-y-4">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold">
                        <Video className="w-3.5 h-3.5" />
                        <span>Sistem Manajemen Video & KTR</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
                        Pengawasan Kawasan Tanpa Rokok Laboratorium Kampus
                    </h1>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Pemantauan CCTV live terintegrasi dengan Computer Vision untuk deteksi aktivitas merokok di area laboratorium.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-3 text-xs font-mono">
                        <div className="bg-slate-800/80 border border-slate-700/70 p-3 rounded-lg">
                            <span className="text-slate-400 block text-[11px]">Kamera CCTV Lab:</span>
                            <span className="text-white font-bold text-sm">13 Titik Pantau</span>
                        </div>
                        <div className="bg-slate-800/80 border border-slate-700/70 p-3 rounded-lg">
                            <span className="text-slate-400 block text-[11px]">Protokol Stream:</span>
                            <span className="text-white font-bold text-sm">WebRTC MediaMTX</span>
                        </div>
                    </div>
                </div>

                {/* Footer Kiri */}
                <div className="relative z-10 text-xs text-slate-500 font-medium">
                    Prototype Skripsi S1 Teknik Informatika • Hak Akses Terbatas Operator
                </div>
            </div>

            {/* Sisi Kanan: Formulir Masuk */}
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 sm:p-10 bg-white dark:bg-neutral-900">
                <div className="w-full max-w-sm space-y-6">
                    {/* Header Formulir */}
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Masuk ke Sistem
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs">
                            Masukkan akun petugas pengawas atau administrator laboratorium.
                        </p>
                    </div>

                    {/* Alert Pesan Error */}
                    {errorMsg && (
                        <div className="flex items-start space-x-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-600 dark:text-rose-400 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Form Input */}
                    <form onSubmit={handleLogin} className="space-y-4 text-xs">
                        {/* Input Username */}
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                                Nama Pengguna
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-neutral-800 transition-all"
                                    placeholder="Nama pengguna"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-neutral-800 transition-all"
                                    placeholder="••••••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Tombol Submit Masuk */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-xs mt-3"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memverifikasi...</span>
                                </>
                            ) : (
                                <span>Masuk</span>
                            )}
                        </button>
                    </form>

                    {/* Catatan Hak Akses Sistem */}
                    <div className="pt-2 text-center border-t border-slate-100 dark:border-neutral-800 text-[11px] text-slate-400">
                        Pusat Laboratorium Terpadu • Akses terbatas petugas
                    </div>
                </div>
            </div>
        </div>
    );
}
