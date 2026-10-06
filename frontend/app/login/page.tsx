"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    // State untuk email dan password form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // Fungsi submit form login
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Simulasikan login dengan mengeset cookie
        document.cookie = "is_logged_in=true; path=/; max-age=86400";
        // Arahkan ke dashboard (root)
        router.push("/");
    };

    return (
        // Container utama full layar dengan flex layout
        <div className="min-h-screen flex">
            {/* Sisi Kiri: Gambar Background (Tersembunyi di layar kecil) */}
            <div className="hidden lg:block lg:w-1/2 relative bg-slate-900">
                <Image
                    src="https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2000&auto=format&fit=crop"
                    alt="Login Background"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
            </div>

            {/* Sisi Kanan: Form Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-neutral-950">
                <div className="w-full max-w-md space-y-8">
                    {/* Header Brand */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">E.S.I.S</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Welcome back!</p>
                    </div>

                    {/* Tombol Login Google (Mock) */}
                    <button className="w-full flex items-center justify-center space-x-2 py-3 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span>Sign in with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-neutral-950 text-slate-500 dark:text-slate-400">OR LOGIN WITH EMAIL</span>
                        </div>
                    </div>

                    {/* Form Input */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Input Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-neutral-900 border border-transparent rounded-lg focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all dark:text-white"
                                placeholder="admin@e.s.i.s.local"
                                required
                            />
                        </div>

                        {/* Input Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Password</label>
                                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Forget Password?
                                </a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-neutral-900 border border-transparent rounded-lg focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Tombol Login */}
                        <button
                            type="submit"
                            className="w-full bg-[#343A40] dark:bg-blue-600 hover:bg-[#212529] dark:hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-colors"
                        >
                            Login
                        </button>
                    </form>

                    {/* Divider Bawah */}
                    <div className="relative mt-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-neutral-950 text-slate-500 dark:text-slate-400">OR SIGN UP</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
