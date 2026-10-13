"use client";

import { useState, useEffect } from "react";
import { 
    Sliders, 
    Shield, 
    Video, 
    UserPlus, 
    Users, 
    Save, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    Server, 
    Key, 
    Building2,
    Lock
} from "lucide-react";

interface UserItem {
    id: string;
    username: string;
    role: string;
    name: string;
    created_at: string;
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"stream" | "users" | "ai">("stream");

    // Form Pengaturan Streaming MediaMTX
    const [streamConfig, setStreamConfig] = useState({
        mediamtxUrl: "https://stream.ucim.my.id",
        webrtcPort: "8889",
        localSubnet: "172.20.32.0/24",
        hlsEnabled: true,
        pinggyTunnel: true,
    });
    const [streamSaved, setStreamSaved] = useState(false);

    // Form Pengaturan AI Detection Threshold
    const [aiConfig, setAiConfig] = useState({
        minConfidence: 85,
        minFrames: 5,
        duplicateSuppressionSeconds: 30,
        enableFaceRecognition: true,
    });
    const [aiSaved, setAiSaved] = useState(false);

    // Manajemen Pengguna (Users)
    const [users, setUsers] = useState<UserItem[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [userForm, setUserForm] = useState({
        username: "",
        password: "",
        name: "",
        role: "admin",
    });
    const [userSubmitting, setUserSubmitting] = useState(false);
    const [userMessage, setUserMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            if (res.ok && data.success && Array.isArray(data.users)) {
                setUsers(data.users);
            }
        } catch {
            // fallback
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (activeTab === "users") {
            loadUsers();
        }
    }, [activeTab]);

    const handleSaveStream = (e: React.FormEvent) => {
        e.preventDefault();
        setStreamSaved(true);
        setTimeout(() => setStreamSaved(false), 3000);
    };

    const handleSaveAi = (e: React.FormEvent) => {
        e.preventDefault();
        setAiSaved(true);
        setTimeout(() => setAiSaved(false), 3000);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setUserSubmitting(true);
        setUserMessage(null);

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userForm),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setUserMessage({ type: "success", text: data.message || "Pengguna berhasil ditambahkan." });
                setUserForm({ username: "", password: "", name: "", role: "admin" });
                loadUsers();
            } else {
                setUserMessage({ type: "error", text: data.message || "Gagal menambahkan pengguna." });
            }
        } catch {
            setUserMessage({ type: "error", text: "Terjadi kesalahan jaringan saat menambahkan pengguna." });
        } finally {
            setUserSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header Pengaturan Sistem */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs">
                <div>
                    <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Konfigurasi Sistem E.S.I.S
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                        Pengaturan & Parameter Operasional
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Kelola parameter MediaMTX, akun hak akses laboran, dan ambang batas inferensi Computer Vision.
                    </p>
                </div>

                {/* Tab Navigasi Pengaturan */}
                <div className="flex border-b border-slate-200 dark:border-neutral-800 mt-5 space-x-4 text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => setActiveTab("stream")}
                        className={`pb-3 flex items-center space-x-1.5 transition-colors border-b-2 -mb-[1px] ${
                            activeTab === "stream"
                                ? "border-blue-700 text-blue-700 dark:text-blue-400 dark:border-blue-400"
                                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                    >
                        <Video className="w-4 h-4" />
                        <span>Streaming & MediaMTX</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("ai")}
                        className={`pb-3 flex items-center space-x-1.5 transition-colors border-b-2 -mb-[1px] ${
                            activeTab === "ai"
                                ? "border-blue-700 text-blue-700 dark:text-blue-400 dark:border-blue-400"
                                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                    >
                        <Shield className="w-4 h-4" />
                        <span>Parameter Deteksi AI</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("users")}
                        className={`pb-3 flex items-center space-x-1.5 transition-colors border-b-2 -mb-[1px] ${
                            activeTab === "users"
                                ? "border-blue-700 text-blue-700 dark:text-blue-400 dark:border-blue-400"
                                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span>Akun & Hak Akses</span>
                    </button>
                </div>
            </div>

            {/* Konten Tab 1: Streaming & MediaMTX */}
            {activeTab === "stream" && (
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs max-w-2xl">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        Konfigurasi Streaming Gateway Raspberry Pi 5
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                        Menghubungkan stream RTSP switch LAN laboratorium (172.20.32.x) ke WebRTC/HLS.
                    </p>

                    {streamSaved && (
                        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Konfigurasi streaming berhasil disimpan.</span>
                        </div>
                    )}

                    <form onSubmit={handleSaveStream} className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 dark:text-slate-300">
                                Domain / URL MediaMTX Tunnel
                            </label>
                            <input
                                type="text"
                                value={streamConfig.mediamtxUrl}
                                onChange={(e) => setStreamConfig({ ...streamConfig, mediamtxUrl: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 font-mono"
                                required
                            />
                            <span className="text-[11px] text-slate-400">
                                Format tunnel Pinggy publik yang diarahkan ke Raspberry Pi 5.
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Port WebRTC TCP/UDP
                                </label>
                                <input
                                    type="text"
                                    value={streamConfig.webrtcPort}
                                    onChange={(e) => setStreamConfig({ ...streamConfig, webrtcPort: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 font-mono"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Subnet LAN CCTV Lab
                                </label>
                                <input
                                    type="text"
                                    value={streamConfig.localSubnet}
                                    onChange={(e) => setStreamConfig({ ...streamConfig, localSubnet: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 font-mono"
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Konfigurasi</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Konten Tab 2: Parameter Deteksi AI */}
            {activeTab === "ai" && (
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs max-w-2xl">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        Parameter Inferensi Computer Vision
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                        Menyesuaikan sensitivitas pendeteksian gestur merokok untuk menekan false positive.
                    </p>

                    {aiSaved && (
                        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Parameter deteksi berhasil diperbarui.</span>
                        </div>
                    )}

                    <form onSubmit={handleSaveAi} className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                            <div className="flex justify-between">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Minimum Confidence Threshold ({aiConfig.minConfidence}%)
                                </label>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="99"
                                value={aiConfig.minConfidence}
                                onChange={(e) => setAiConfig({ ...aiConfig, minConfidence: Number(e.target.value) })}
                                className="w-full accent-blue-600 cursor-pointer"
                            />
                            <p className="text-[11px] text-slate-400">
                                Hanya deteksi dengan tingkat keyakinan di atas nilai ini yang akan dicatat sebagai calon pelanggaran.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 dark:text-slate-300">
                                Supresi Duplikasi Pelanggaran (Detik)
                            </label>
                            <input
                                type="number"
                                min="5"
                                max="300"
                                value={aiConfig.duplicateSuppressionSeconds}
                                onChange={(e) => setAiConfig({ ...aiConfig, duplicateSuppressionSeconds: Number(e.target.value) })}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600"
                            />
                            <p className="text-[11px] text-slate-400">
                                Mencegah penyimpanan frame berulang pada aktivitas yang sama dalam rentang waktu berdekatan.
                            </p>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Parameter AI</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Konten Tab 3: Akun & Hak Akses (Terhubung ke Supabase /api/users) */}
            {activeTab === "users" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Formulir Tambah Pengguna */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                            Tambah Akun Pengawas Lab
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Hanya Superadmin yang memiliki wewenang untuk menambahkan akun baru.
                        </p>

                        {userMessage && (
                            <div className={`p-3 rounded-lg text-xs mb-4 flex items-center space-x-2 ${
                                userMessage.type === "success"
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                            }`}>
                                {userMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                <span>{userMessage.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Lengkap Petugas
                                </label>
                                <input
                                    type="text"
                                    value={userForm.name}
                                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                    placeholder="Contoh: Budi Laboran Komputer"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={userForm.username}
                                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                                    placeholder="Contoh: admin-lab5"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={userForm.password}
                                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                    placeholder="••••••••••••"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Peran (Role)
                                </label>
                                <select
                                    value={userForm.role}
                                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600"
                                >
                                    <option value="admin">Admin (Laboran / Verifikator SP)</option>
                                    <option value="security">Security (Petugas Jaga / Monitoring Saja)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={userSubmitting}
                                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-70 shadow-2xs mt-2"
                            >
                                {userSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Menyimpan Pengguna...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        <span>Tambahkan Akun</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Daftar Pengguna Terdaftar */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Daftar Pengguna Sistem
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Akun dengan izin akses ke dashboard E.S.I.S
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={loadUsers}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Muat Ulang
                            </button>
                        </div>

                        {loadingUsers ? (
                            <div className="py-12 text-center text-slate-400">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                                <span className="text-xs">Mengambil data dari Supabase...</span>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="py-8 text-center text-slate-400 text-xs">
                                Belum ada daftar user atau sesi Anda bukan Superadmin.
                            </div>
                        ) : (
                            <div className="space-y-2.5 max-h-96 overflow-y-auto">
                                {users.map((u) => (
                                    <div 
                                        key={u.id}
                                        className="p-3 bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/60 dark:border-neutral-700/60 rounded-lg flex items-center justify-between text-xs"
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">{u.name || u.username}</p>
                                            <p className="text-[11px] font-mono text-slate-400">@{u.username}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                            u.role === "superadmin"
                                                ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                                                : u.role === "admin"
                                                ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                                : "bg-slate-200 text-slate-700 dark:bg-neutral-700 dark:text-slate-300"
                                        }`}>
                                            {u.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
