"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
    Shield, 
    Video, 
    UserPlus, 
    Users, 
    Save, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    Plus,
    Trash2,
    Edit3,
    RefreshCw,
    Eye,
    EyeOff,
    ExternalLink,
    Copy,
    Check,
    Search,
    Database,
    Radio,
    FolderPlus,
    Tag,
    X,
    ShieldAlert
} from "lucide-react";

interface UserItem {
    id: string;
    username: string;
    role: string;
    name: string;
    created_at: string;
}

export interface StreamItem {
    id: number | string;
    name: string;
    label: string;
    location_group: string;
    ip_address: string;
    port: number;
    username_rtsp: string;
    password_rtsp: string;
    ecam_path: string;
    cam_path: string;
    ecam_source: string;
    cam_source: string;
    protocol: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

interface GroupItem {
    id: number | string;
    name: string;
}

export default function SettingsPage() {
    // Current user session & role
    const [currentUser, setCurrentUser] = useState<{ id: string; username: string; role: string; name?: string } | null>(null);
    const [activeTab, setActiveTab] = useState<"cctv_crud" | "users" | "ai">("cctv_crud");

    // State CCTV Streaming CRUD
    const [streams, setStreams] = useState<StreamItem[]>([]);
    const [loadingStreams, setLoadingStreams] = useState(false);
    const [dbTableMissing, setDbTableMissing] = useState(false);
    const [streamSearch, setStreamSearch] = useState("");
    const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("all");
    const [revealedPasswords, setRevealedPasswords] = useState<Record<string | number, boolean>>({});
    const [copiedIndex, setCopiedIndex] = useState<string | number | null>(null);
    const [isSyncingMtx, setIsSyncingMtx] = useState(false);

    // Universal Floating Alert/Toast State (z-[100] selalu di atas semua modal)
    const [alertToast, setAlertToast] = useState<{
        type: "success" | "error" | "info";
        title: string;
        message: string;
    } | null>(null);

    const showAlert = (type: "success" | "error" | "info", message: string, title?: string) => {
        const defaultTitle = type === "success" ? "Berhasil" : type === "error" ? "Terjadi Kesalahan" : "Pemberitahuan";
        setAlertToast({
            type,
            title: title || defaultTitle,
            message,
        });
    };

    // Auto-dismiss alert toast setelah 5 detik
    useEffect(() => {
        if (!alertToast) return;
        const timer = setTimeout(() => {
            setAlertToast(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [alertToast]);

    // Grouping Lokasi State
    const [groups, setGroups] = useState<GroupItem[]>([
        { id: 1, name: "Lantai 5 Gedung PLT" },
        { id: 2, name: "Lantai 6 Gedung PLT" },
    ]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [groupSubmitting, setGroupSubmitting] = useState(false);
    const [groupModalMsg, setGroupModalMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Modal Form (Tambah & Edit Kamera Sederhana)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [showFormPassword, setShowFormPassword] = useState(false);
    const [cameraModalError, setCameraModalError] = useState<string | null>(null);

    // Form data sederhana sesuai kebutuhan user
    const [formData, setFormData] = useState({
        id: undefined as number | string | undefined,
        label: "", // nama kamera
        ip_address: "", // alamat IP CCTV
        port: 554, // port RTSP (default 554)
        username_rtsp: "", // username (opsional)
        password_rtsp: "", // password (opsional)
        location_group: "Lantai 5 Gedung PLT", // grouping lokasi
    });

    // Modal Konfirmasi Hapus Kamera
    const [deleteTarget, setDeleteTarget] = useState<StreamItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteModalError, setDeleteModalError] = useState<string | null>(null);

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
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    // 1. Cek Sesi Pengguna (Hanya Superadmin)
    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.authenticated && data?.user) {
                    setCurrentUser(data.user);
                    if (data.user.role === "superadmin") {
                        setActiveTab("cctv_crud");
                    } else {
                        window.location.href = "/";
                    }
                } else {
                    window.location.href = "/login";
                }
            })
            .catch(() => {});
    }, []);

    // 2. Load Groups Lokasi
    const loadGroups = async () => {
        try {
            const res = await fetch("/api/streaming/groups");
            const data = await res.json();
            if (res.ok && data.success && Array.isArray(data.groups)) {
                setGroups(data.groups);
            }
        } catch {
            // fallback to default
        }
    };

    // 3. Load Data Streaming CCTV
    const loadStreams = async () => {
        setLoadingStreams(true);
        try {
            const res = await fetch("/api/streaming");
            const data = await res.json();
            if (res.ok && data.success && Array.isArray(data.streams)) {
                setStreams(data.streams);
                setDbTableMissing(Boolean(data.db_table_missing));
            } else if (data.message) {
                showAlert("error", data.message);
            }
        } catch {
            showAlert("error", "Gagal memuat data streaming dari server.");
        } finally {
            setLoadingStreams(false);
        }
    };

    // 4. Load Users
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
        loadGroups();
        if (activeTab === "cctv_crud") {
            loadStreams();
        } else if (activeTab === "users") {
            loadUsers();
        }
    }, [activeTab]);

    // Buka Modal Tambah
    const handleOpenAdd = () => {
        setModalMode("add");
        setFormData({
            id: undefined,
            label: "",
            ip_address: "172.20.32.",
            port: 554,
            username_rtsp: "",
            password_rtsp: "",
            location_group: groups[0]?.name || "Lantai 5 Gedung PLT",
        });
        setIsModalOpen(true);
    };

    // Buka Modal Edit
    const handleOpenEdit = (item: StreamItem) => {
        setModalMode("edit");
        setFormData({
            id: item.id,
            label: item.label,
            ip_address: item.ip_address,
            port: item.port || 554,
            username_rtsp: item.username_rtsp || "",
            password_rtsp: item.password_rtsp || "",
            location_group: item.location_group || "Lantai 5 Gedung PLT",
        });
        setIsModalOpen(true);
    };

    // Submit Modal Form (Tambah atau Edit)
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitting(true);
        setCameraModalError(null);

        try {
            const method = modalMode === "add" ? "POST" : "PATCH";
            const res = await fetch("/api/streaming", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                showAlert("success", data.message || `Kamera "${formData.label}" berhasil disimpan.`);
                setIsModalOpen(false);
                loadStreams();
            } else {
                const errMsg = data.message || "Gagal menyimpan data streaming.";
                setCameraModalError(errMsg);
                showAlert("error", errMsg);
            }
        } catch {
            const errMsg = "Terjadi kesalahan jaringan saat menyimpan kamera.";
            setCameraModalError(errMsg);
            showAlert("error", errMsg);
        } finally {
            setFormSubmitting(false);
        }
    };

    // Konfirmasi Hapus Kamera
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        setDeleteModalError(null);

        try {
            const res = await fetch(`/api/streaming?id=${deleteTarget.id}&name=${encodeURIComponent(deleteTarget.name)}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (res.ok && data.success) {
                showAlert("success", data.message || `Kamera "${deleteTarget.label}" berhasil dihapus.`);
                setDeleteTarget(null);
                loadStreams();
            } else {
                const errMsg = data.message || "Gagal menghapus kamera.";
                setDeleteModalError(errMsg);
                showAlert("error", errMsg);
            }
        } catch {
            const errMsg = "Terjadi kesalahan jaringan saat menghapus kamera.";
            setDeleteModalError(errMsg);
            showAlert("error", errMsg);
        } finally {
            setIsDeleting(false);
        }
    };

    // Sinkronisasi dengan MediaMTX
    const handleSyncMediaMtx = async () => {
        setIsSyncingMtx(true);

        try {
            const res = await fetch("/api/streaming/sync", { method: "POST" });
            const data = await res.json();

            if (res.ok && data.success) {
                showAlert("success", data.message || "Sinkronisasi MediaMTX berhasil diselesaikan.");
                loadStreams();
            } else {
                const errMsg = data.message || "Gagal menyinkronkan data dengan MediaMTX.";
                showAlert("error", errMsg);
            }
        } catch {
            showAlert("error", "Terjadi kesalahan koneksi ke server MediaMTX.");
        } finally {
            setIsSyncingMtx(false);
        }
    };

    // Tambah Grup Baru
    const handleAddGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanName = newGroupName.trim();
        if (!cleanName) {
            setGroupModalMsg({ type: "error", text: "Nama grup lokasi tidak boleh kosong." });
            showAlert("error", "Nama grup lokasi tidak boleh kosong.");
            return;
        }
        setGroupSubmitting(true);
        setGroupModalMsg(null);

        try {
            const res = await fetch("/api/streaming/groups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: cleanName }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setNewGroupName("");
                loadGroups();
                setGroupModalMsg({ type: "success", text: data.message || `Grup "${cleanName}" berhasil ditambahkan.` });
                showAlert("success", data.message || `Grup "${cleanName}" berhasil ditambahkan.`);
            } else {
                const errMsg = data.message || "Gagal menambah grup.";
                setGroupModalMsg({ type: "error", text: errMsg });
                showAlert("error", errMsg);
            }
        } catch {
            const errMsg = "Terjadi kesalahan jaringan saat menambah grup.";
            setGroupModalMsg({ type: "error", text: errMsg });
            showAlert("error", errMsg);
        } finally {
            setGroupSubmitting(false);
        }
    };

    // Hapus Grup Lokasi
    const handleDeleteGroup = async (groupName: string) => {
        if (!confirm(`Hapus grup lokasi "${groupName}"?`)) return;
        setGroupModalMsg(null);

        try {
            const res = await fetch(`/api/streaming/groups?name=${encodeURIComponent(groupName)}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok && data.success) {
                loadGroups();
                if (selectedGroupFilter === groupName) {
                    setSelectedGroupFilter("all");
                }
                setGroupModalMsg({ type: "success", text: data.message || `Grup "${groupName}" berhasil dihapus.` });
                showAlert("success", data.message || `Grup "${groupName}" berhasil dihapus.`);
            } else {
                const errMsg = data.message || "Gagal menghapus grup.";
                setGroupModalMsg({ type: "error", text: errMsg });
                showAlert("error", errMsg);
            }
        } catch {
            const errMsg = "Terjadi kesalahan jaringan saat menghapus grup.";
            setGroupModalMsg({ type: "error", text: errMsg });
            showAlert("error", errMsg);
        }
    };

    // Salin string RTSP atau nama path
    const handleCopyText = (text: string, id: string | number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(id);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Toggle reveal password
    const toggleRevealPassword = (id: string | number) => {
        setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Filter Kamera berdasarkan grup dan pencarian
    const filteredStreams = streams.filter((item) => {
        const matchesGroup = selectedGroupFilter === "all" || item.location_group === selectedGroupFilter;
        const q = streamSearch.toLowerCase();
        const matchesSearch =
            !streamSearch ||
            item.label.toLowerCase().includes(q) ||
            item.name.toLowerCase().includes(q) ||
            item.ip_address.toLowerCase().includes(q) ||
            item.location_group.toLowerCase().includes(q);
        return matchesGroup && matchesSearch;
    });

    const isSuperadmin = currentUser?.role === "superadmin";

    const handleSaveAi = (e: React.FormEvent) => {
        e.preventDefault();
        setAiSaved(true);
        showAlert("success", "Parameter deteksi AI berhasil disimpan.");
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
                const successMsg = data.message || "Pengguna berhasil ditambahkan.";
                setUserMessage({ type: "success", text: successMsg });
                showAlert("success", successMsg);
                setUserForm({ username: "", password: "", name: "", role: "admin" });
                loadUsers();
            } else {
                const errMsg = data.message || "Gagal menambahkan pengguna.";
                setUserMessage({ type: "error", text: errMsg });
                showAlert("error", errMsg);
            }
        } catch {
            const errMsg = "Terjadi kesalahan jaringan saat menambahkan pengguna.";
            setUserMessage({ type: "error", text: errMsg });
            showAlert("error", errMsg);
        } finally {
            setUserSubmitting(false);
        }
    };

    const handleDeleteUser = async (user: UserItem) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.name || user.username}"?`)) {
            return;
        }
        setDeletingUserId(user.id);
        setUserMessage(null);

        try {
            const res = await fetch(`/api/users?id=${encodeURIComponent(user.id)}&username=${encodeURIComponent(user.username)}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (res.ok && data.success) {
                const successMsg = data.message || `Pengguna "${user.name || user.username}" berhasil dihapus.`;
                setUserMessage({ type: "success", text: successMsg });
                showAlert("success", successMsg);
                loadUsers();
            } else {
                const errMsg = data.message || "Gagal menghapus pengguna.";
                setUserMessage({ type: "error", text: errMsg });
                showAlert("error", errMsg);
            }
        } catch {
            const errMsg = "Terjadi kesalahan jaringan saat menghapus pengguna.";
            setUserMessage({ type: "error", text: errMsg });
            showAlert("error", errMsg);
        } finally {
            setDeletingUserId(null);
        }
    };

    if (currentUser && currentUser.role !== "superadmin") {
        return (
            <div className="py-20 text-center space-y-3">
                <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Akses Terbatas</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Halaman pengaturan hanya dapat diakses oleh Superadmin.
                </p>
                <div className="pt-2">
                    <Link
                        href="/"
                        className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold inline-block"
                    >
                        Kembali ke Dasbor
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 relative">
            {/* Floating Alert Toast (z-[100] Selalu Muncul di Pojok Atas, Tampak Jelas Baik Saat Modal Terbuka Maupun Tertutup) */}
            {alertToast && (
                <div className="fixed top-5 right-5 sm:right-8 z-[100] max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
                    <div
                        className={`p-4 rounded-xl border shadow-2xl flex items-start justify-between gap-3 backdrop-blur-md ${
                            alertToast.type === "success"
                                ? "bg-white/95 dark:bg-neutral-900/95 border-emerald-500 text-slate-900 dark:text-white"
                                : alertToast.type === "error"
                                ? "bg-white/95 dark:bg-neutral-900/95 border-rose-500 text-slate-900 dark:text-white"
                                : "bg-white/95 dark:bg-neutral-900/95 border-blue-500 text-slate-900 dark:text-white"
                        }`}
                    >
                        <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg shrink-0 ${
                                alertToast.type === "success"
                                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                                    : alertToast.type === "error"
                                    ? "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                                    : "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                            }`}>
                                {alertToast.type === "success" ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : alertToast.type === "error" ? (
                                    <AlertCircle className="w-5 h-5" />
                                ) : (
                                    <Radio className="w-5 h-5" />
                                )}
                            </div>
                            <div className="space-y-0.5">
                                <h4 className={`text-xs font-bold leading-tight ${
                                    alertToast.type === "success"
                                        ? "text-emerald-700 dark:text-emerald-400"
                                        : alertToast.type === "error"
                                        ? "text-rose-700 dark:text-rose-400"
                                        : "text-blue-700 dark:text-blue-400"
                                }`}>
                                    {alertToast.title}
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                    {alertToast.message}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAlertToast(null)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 shrink-0 transition-colors"
                            aria-label="Tutup alert"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

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
                        Kelola parameter MediaMTX, feed CCTV RTSP otomatis, grouping lokasi, dan akun hak akses laboran.
                    </p>
                </div>

                {/* Tab Navigasi Pengaturan Khusus Superadmin */}
                <div className="flex flex-wrap border-b border-slate-200 dark:border-neutral-800 mt-5 gap-y-2 space-x-4 text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => setActiveTab("cctv_crud")}
                        className={`pb-3 flex items-center space-x-1.5 transition-colors border-b-2 -mb-[1px] ${
                            activeTab === "cctv_crud"
                                ? "border-blue-700 text-blue-700 dark:text-blue-400 dark:border-blue-400"
                                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                    >
                        <Radio className="w-4 h-4 text-blue-600" />
                        <span>Streaming CCTV</span>
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
                        <span>Manajemen Pengguna</span>
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
                </div>
            </div>

            {/* KONTEN TAB KHUSUS SUPERADMIN: CRUD STREAMING CCTV */}
            {activeTab === "cctv_crud" && isSuperadmin && (
                <div className="space-y-4">
                    {/* Banner Peringatan jika Tabel Database Belum Dibuat */}
                    {dbTableMissing && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs space-y-2 text-amber-900 dark:text-amber-200">
                            <div className="flex items-center space-x-2 font-bold">
                                <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                <span>Tabel Database `streaming` Belum Dibuat di Supabase</span>
                            </div>
                            <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                                Sistem membaca konfigurasi langsung dari MediaMTX Control API (`config.ucim.my.id`). Untuk mengaktifkan penyimpanan permanen ke Supabase, silakan jalankan query SQL dari berkas <code className="font-mono font-bold">streaming_schema.sql</code> di SQL Editor Supabase.
                            </p>
                        </div>
                    )}

                    {/* Ringkasan & Action Bar */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Manajemen Kamera CCTV & MediaMTX
                                    </h3>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Kelola daftar kamera CCTV, alamat IP, kredensial RTSP, dan grouping lokasi laboratorium.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsGroupModalOpen(true)}
                                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs"
                                    title="Kelola Grouping Lokasi (Lantai PLT & Grup Baru)"
                                >
                                    <Tag className="w-3.5 h-3.5" />
                                    <span>Kelola Grup Lokasi ({groups.length})</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSyncMediaMtx}
                                    disabled={isSyncingMtx}
                                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 disabled:opacity-60 shadow-2xs"
                                    title="Tarik seluruh stream yang ada di MediaMTX ke database"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMtx ? "animate-spin" : ""}`} />
                                    <span>{isSyncingMtx ? "Menyinkronkan..." : "Sinkronkan MediaMTX"}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleOpenAdd}
                                    className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Kamera Baru</span>
                                </button>
                            </div>
                        </div>

                        {/* Filter Grouping & Pencarian Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-neutral-800">
                            {/* Filter Grouping Lokasi Dinamis */}
                            <div className="flex items-center space-x-1.5 text-xs overflow-x-auto pb-1 sm:pb-0">
                                <span className="text-slate-500 font-medium shrink-0">Lokasi:</span>
                                <div className="inline-flex bg-slate-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-slate-200 dark:border-neutral-700">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedGroupFilter("all")}
                                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shrink-0 ${
                                            selectedGroupFilter === "all"
                                                ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xs font-semibold"
                                                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                                        }`}
                                    >
                                        Semua ({streams.length})
                                    </button>
                                    {groups.map((grp) => (
                                        <button
                                            key={grp.id}
                                            type="button"
                                            onClick={() => setSelectedGroupFilter(grp.name)}
                                            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shrink-0 ${
                                                selectedGroupFilter === grp.name
                                                    ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xs font-semibold"
                                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                                            }`}
                                        >
                                            {grp.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pencarian */}
                            <div className="relative w-full sm:w-64 shrink-0">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                                <input
                                    type="text"
                                    value={streamSearch}
                                    onChange={(e) => setStreamSearch(e.target.value)}
                                    placeholder="Cari nama kamera atau IP..."
                                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 font-sans"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabel Streaming CCTV */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xs">
                        {loadingStreams ? (
                            <div className="py-16 text-center text-slate-400 text-xs">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                                <span>Memuat daftar kamera CCTV...</span>
                            </div>
                        ) : filteredStreams.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 text-xs space-y-2">
                                <Video className="w-8 h-8 mx-auto text-slate-300 dark:text-neutral-700" />
                                <p className="font-semibold text-slate-600 dark:text-slate-300">
                                    {streamSearch ? "Tidak ada kamera yang cocok dengan kata kunci pencarian." : "Belum ada kamera CCTV yang terdaftar."}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    Klik tombol <span className="font-bold">Tambah Kamera Baru</span> untuk menambah kamera.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-neutral-800/80 border-b border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                                            <th className="py-3 px-4">Nama Kamera</th>
                                            <th className="py-3 px-4">Alamat IP & Port</th>
                                            <th className="py-3 px-4">Kredensial RTSP</th>
                                            <th className="py-3 px-4">Grouping Lokasi</th>
                                            <th className="py-3 px-4">Status Stream</th>
                                            <th className="py-3 px-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                                        {filteredStreams.map((item) => {
                                            const isPassRevealed = Boolean(revealedPasswords[item.id]);
                                            const hasAuth = Boolean(item.username_rtsp);

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-slate-50/70 dark:hover:bg-neutral-800/50 transition-colors"
                                                >
                                                    {/* Nama Kamera */}
                                                    <td className="py-3 px-4">
                                                        <div className="font-bold text-slate-900 dark:text-white">
                                                            {item.label}
                                                        </div>
                                                    </td>

                                                    {/* IP Address & Port */}
                                                    <td className="py-3 px-4">
                                                        <div className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                                                            {item.ip_address}
                                                        </div>
                                                        <div className="text-[11px] font-mono text-slate-400">
                                                            Port RTSP: {item.port || 554}
                                                        </div>
                                                    </td>

                                                    {/* RTSP Credentials (Opsional) */}
                                                    <td className="py-3 px-4">
                                                        {hasAuth ? (
                                                            <>
                                                                <div className="flex items-center space-x-1.5 font-mono text-slate-700 dark:text-slate-300">
                                                                    <span className="text-[11px] text-slate-400">user:</span>
                                                                    <span className="font-bold">{item.username_rtsp}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1.5 font-mono mt-0.5">
                                                                    <span className="text-[11px] text-slate-400">pass:</span>
                                                                    <span className="text-slate-800 dark:text-slate-200">
                                                                        {isPassRevealed ? item.password_rtsp : "••••••••"}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => toggleRevealPassword(item.id)}
                                                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                                                                        aria-label={isPassRevealed ? "Sembunyikan password" : "Lihat password"}
                                                                    >
                                                                        {isPassRevealed ? (
                                                                            <EyeOff className="w-3 h-3" />
                                                                        ) : (
                                                                            <Eye className="w-3 h-3" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-neutral-800 text-slate-500">
                                                                Tanpa Autentikasi
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Grouping Lokasi */}
                                                    <td className="py-3 px-4">
                                                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                                                            {item.location_group}
                                                        </span>
                                                    </td>

                                                    {/* Status Stream */}
                                                    <td className="py-3 px-4">
                                                        <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                            <span>Tersambung</span>
                                                        </div>
                                                    </td>

                                                    {/* Tombol Aksi */}
                                                    <td className="py-3 px-4 text-right">
                                                        <div className="flex items-center justify-end space-x-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenEdit(item)}
                                                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                                                                title="Edit informasi kamera"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleteTarget(item)}
                                                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                                                                title="Hapus kamera dan kedua path MediaMTX"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL FORM TAMBAH / EDIT KAMERA (SIMPLIFIED SESUAI PERMINTAAN USER) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-5 shadow-xl space-y-4 my-8">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
                            <div className="flex items-center space-x-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                                    <Video className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                    {modalMode === "add" ? "Tambah Kamera CCTV Baru" : `Edit Kamera: ${formData.label}`}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Alert Error di dalam Modal Kamera */}
                        {cameraModalError && (
                            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-800 dark:text-rose-300 text-xs flex items-start justify-between shadow-2xs animate-in fade-in duration-200">
                                <div className="flex items-start space-x-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                                    <span className="font-medium leading-relaxed">{cameraModalError}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCameraModalError(null)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">
                            {/* 1. Nama Kamera */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Kamera <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="Contoh: Lab Sisdig"
                                    required
                                    autoFocus
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-600"
                                />
                            </div>

                            {/* 2. Alamat IP CCTV & Port RTSP (Default 554) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2 space-y-1">
                                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                                        Alamat IP CCTV <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ip_address}
                                        onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                                        placeholder="172.20.32.43"
                                        required
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white font-mono outline-none focus:border-blue-600"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                                        Port RTSP <span className="text-slate-400 font-normal">(Opsional)</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.port}
                                        onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value, 10) || 554 })}
                                        placeholder="554"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white font-mono outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            {/* 3. Username & Password RTSP (Opsional) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                                        Username RTSP <span className="text-slate-400 font-normal">(Opsional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.username_rtsp}
                                        onChange={(e) => setFormData({ ...formData, username_rtsp: e.target.value })}
                                        placeholder="Kosongkan jika tanpa auth"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white font-mono outline-none focus:border-blue-600"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                                        Password RTSP <span className="text-slate-400 font-normal">(Opsional)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showFormPassword ? "text" : "password"}
                                            value={formData.password_rtsp}
                                            onChange={(e) => setFormData({ ...formData, password_rtsp: e.target.value })}
                                            placeholder="Kosongkan jika tanpa auth"
                                            className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white font-mono outline-none focus:border-blue-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowFormPassword(!showFormPassword)}
                                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        >
                                            {showFormPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Grouping Lokasi */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                                        Grouping Lokasi
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setIsGroupModalOpen(true)}
                                        className="text-blue-600 dark:text-blue-400 hover:underline text-[11px] font-semibold flex items-center space-x-1"
                                    >
                                        <Plus className="w-3 h-3" />
                                        <span>Kelola / Buat Grup</span>
                                    </button>
                                </div>
                                <select
                                    value={formData.location_group}
                                    onChange={(e) => setFormData({ ...formData, location_group: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-600"
                                >
                                    {groups.map((grp) => (
                                        <option key={grp.id} value={grp.name}>
                                            {grp.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Keterangan Otomasi Gateway */}
                            <div className="p-3 bg-slate-50 dark:bg-neutral-800/80 rounded-lg border border-slate-200 dark:border-neutral-700 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>Kamera akan otomatis tersambung ke gateway streaming untuk pemantauan realtime.</span>
                            </div>

                            {/* Tombol Aksi Modal */}
                            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-3.5 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={formSubmitting}
                                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-60 shadow-2xs"
                                >
                                    {formSubmitting ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Menyimpan ke MediaMTX...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-3.5 h-3.5" />
                                            <span>{modalMode === "add" ? "Simpan Kamera & Buat 2 Path" : "Perbarui Kamera"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL KELOLA GROUPING LOKASI (BUAT & HAPUS GRUP) */}
            {isGroupModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl max-w-md w-full p-5 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
                            <div className="flex items-center space-x-2">
                                <Tag className="w-4 h-4 text-blue-600" />
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                    Kelola Grouping Lokasi CCTV
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsGroupModalOpen(false);
                                    setGroupModalMsg(null);
                                }}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Alert Status di dalam Modal Kelola Grup */}
                        {groupModalMsg && (
                            <div
                                className={`p-3 rounded-lg border text-xs flex items-start justify-between shadow-2xs animate-in fade-in duration-200 ${
                                    groupModalMsg.type === "success"
                                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                                        : "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                                }`}
                            >
                                <div className="flex items-start space-x-2">
                                    {groupModalMsg.type === "success" ? (
                                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                                    )}
                                    <span className="font-medium leading-relaxed">{groupModalMsg.text}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setGroupModalMsg(null)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Form Tambah Grup Baru */}
                        <form onSubmit={handleAddGroup} className="space-y-2">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                Buat Grup Lokasi Baru:
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="Contoh: Gedung Dekanat Lt. 1"
                                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-600"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={groupSubmitting}
                                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1 disabled:opacity-60 shrink-0"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah</span>
                                </button>
                            </div>
                        </form>

                        {/* Daftar Grup Lokasi yang Ada */}
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                Daftar Grup Tersedia:
                            </label>
                            <div className="space-y-1.5 max-h-52 overflow-y-auto">
                                {groups.map((grp) => {
                                    const isDefault = grp.name === "Lantai 5 Gedung PLT" || grp.name === "Lantai 6 Gedung PLT";
                                    return (
                                        <div
                                            key={grp.id}
                                            className="p-2.5 bg-slate-50 dark:bg-neutral-800 rounded-lg border border-slate-200 dark:border-neutral-700 flex items-center justify-between text-xs"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {grp.name}
                                                </span>
                                                {isDefault && (
                                                    <span className="text-[10px] text-slate-400 font-mono">
                                                        (Default)
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteGroup(grp.name)}
                                                className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                                                title={`Hapus grup ${grp.name}`}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end border-t border-slate-100 dark:border-neutral-800">
                            <button
                                type="button"
                                onClick={() => setIsGroupModalOpen(false)}
                                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL KONFIRMASI HAPUS KAMERA */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl max-w-sm w-full p-5 shadow-xl space-y-4">
                        <div className="flex items-center space-x-3 text-rose-600">
                            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                    Hapus Kamera & 2 Path MediaMTX?
                                </h3>
                                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            Kamera <span className="font-bold text-slate-900 dark:text-white">{deleteTarget.label}</span> akan dihapus dari basis data dan kedua path di MediaMTX Control API (<code className="font-mono text-rose-600">{deleteTarget.ecam_path}</code> & <code className="font-mono text-rose-600">{deleteTarget.cam_path}</code>) akan ditiadakan.
                        </p>

                        {deleteModalError && (
                            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-800 dark:text-rose-300 text-xs flex items-start justify-between shadow-2xs">
                                <div className="flex items-start space-x-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                                    <span className="font-medium leading-relaxed">{deleteModalError}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setDeleteModalError(null)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-neutral-800 text-xs">
                            <button
                                type="button"
                                onClick={() => {
                                    setDeleteTarget(null);
                                    setDeleteModalError(null);
                                }}
                                className="px-3.5 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-60 shadow-2xs"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Menghapus...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Ya, Hapus Kamera</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {/* TAB 3: PARAMETER DETEKSI AI */}
            {activeTab === "ai" && (
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs max-w-2xl">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        Ambang Batas Computer Vision & Logika SP
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                        Menentukan tingkat sensitivitas deteksi rokok dan algoritma face recognition pelaku.
                    </p>

                    {aiSaved && (
                        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Parameter AI berhasil diperbarui.</span>
                        </div>
                    )}

                    <form onSubmit={handleSaveAi} className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Minimum Confidence Level Deteksi Rokok
                                </label>
                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                    {aiConfig.minConfidence}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="99"
                                value={aiConfig.minConfidence}
                                onChange={(e) => setAiConfig({ ...aiConfig, minConfidence: parseInt(e.target.value) })}
                                className="w-full h-1.5 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Minimum Frame Berturut-turut
                                </label>
                                <input
                                    type="number"
                                    value={aiConfig.minFrames}
                                    onChange={(e) => setAiConfig({ ...aiConfig, minFrames: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Supresi Duplikasi (Detik)
                                </label>
                                <input
                                    type="number"
                                    value={aiConfig.duplicateSuppressionSeconds}
                                    onChange={(e) => setAiConfig({ ...aiConfig, duplicateSuppressionSeconds: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600"
                                />
                            </div>
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

            {/* TAB 4: AKUN & HAK AKSES */}
            {activeTab === "users" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Form Tambah Pengguna Baru */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs">
                        <div className="flex items-center space-x-2 mb-1">
                            <UserPlus className="w-4 h-4 text-blue-600" />
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Tambah Akun Petugas
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Hanya Superadmin yang memiliki wewenang membuat akun operator laboran atau security.
                        </p>

                        {userMessage && (
                            <div className={`mb-4 p-3 rounded-lg border text-xs flex items-center space-x-2 ${
                                userMessage.type === "success"
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                            }`}>
                                {userMessage.type === "success" ? (
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                )}
                                <span>{userMessage.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={userForm.name}
                                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                    placeholder="Contoh: Budi Santoso"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Username Akun
                                </label>
                                <input
                                    type="text"
                                    value={userForm.username}
                                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                                    placeholder="Contoh: laboran-sisdig"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Kata Sandi Akun
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
                                    <option value="admin">Admin (Verifikator Catatan Pelanggaran)</option>
                                    <option value="staff">Staff (Pemantauan CCTV & Catatan Pelanggaran Saja)</option>
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
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                                u.role === "superadmin"
                                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                                                    : u.role === "admin"
                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                            }`}>
                                                {u.role}
                                            </span>
                                            {/* Tombol Hapus Pengguna */}
                                            {currentUser?.username !== u.username && currentUser?.id !== u.id && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteUser(u)}
                                                    disabled={deletingUserId === u.id}
                                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors disabled:opacity-50"
                                                    title={`Hapus pengguna ${u.username}`}
                                                >
                                                    {deletingUserId === u.id ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                                                    ) : (
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
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
