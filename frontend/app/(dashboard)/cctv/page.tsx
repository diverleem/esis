"use client";

import { useState, useEffect } from "react";
import {
    Grid2X2,
    Square,
    RotateCcw,
    Maximize2,
    Flame,
    ExternalLink,
    Check,
    RefreshCw
} from "lucide-react";
import { getGroupBadgeColor } from "@/utils/colors";

interface CameraItem {
    id: number | string;
    label: string;
    location_group: string;
    ecam_path: string;
    cam_path: string;
    hls_source?: string;
}

interface GroupItem {
    id: number | string;
    name: string;
}

const DEFAULT_CAMERAS: CameraItem[] = [
    {
        id: 1,
        label: "Lab Sisdig",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lab_sisdig",
        cam_path: "cam_lab_sisdig",
    },
    {
        id: 2,
        label: "Lab OS",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lab_os",
        cam_path: "cam_lab_os",
    },
    {
        id: 3,
        label: "Lab Programming",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lab_programming",
        cam_path: "cam_lab_programming",
    },
    {
        id: 4,
        label: "Lab Riset Lt 5",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lab_riset_lt5",
        cam_path: "cam_lab_riset_lt5",
    },
    {
        id: 5,
        label: "Lab ELC",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lab_elc",
        cam_path: "cam_lab_elc",
    },
    {
        id: 6,
        label: "Lab Jaringan",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_jaringan",
        cam_path: "cam_lab_jaringan",
    },
    {
        id: 7,
        label: "Lab Multimedia 1",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_multimedia1",
        cam_path: "cam_lab_multimedia1",
    },
    {
        id: 8,
        label: "Lab Multimedia 2",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_multimedia2",
        cam_path: "cam_lab_multimedia2",
    },
    {
        id: 9,
        label: "Lab APL 1",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_apl1",
        cam_path: "cam_lab_apl1",
    },
    {
        id: 10,
        label: "Lab APL 2",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_apl2",
        cam_path: "cam_lab_apl2",
    },
    {
        id: 11,
        label: "Lab Riset Lt 6",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_riset_lt6",
        cam_path: "cam_lab_riset_lt6",
    },
    {
        id: 12,
        label: "Lab Tambang",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_tambang",
        cam_path: "cam_lab_tambang",
    },
    {
        id: 13,
        label: "Lab Matematika",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_mtk",
        cam_path: "cam_lab_mtk",
    },
    {
        id: 14,
        label: "Lobby Lt 5",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lobby_lt5",
        cam_path: "cam_lobby_lt5",
    },
    {
        id: 15,
        label: "Lorong Kiri Lt 5",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lorongkiri_lt5",
        cam_path: "cam_lorongkiri_lt5",
    },
    {
        id: 16,
        label: "Ruang Podcast",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_ruang_podcast",
        cam_path: "cam_ruang_podcast",
    },
    {
        id: 17,
        label: "Ruang Server",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_ruang_server",
        cam_path: "cam_ruang_server",
    },
    {
        id: 18,
        label: "Lobby Lt 6",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lobby_lt6",
        cam_path: "cam_lobby_lt6",
    },
    {
        id: 19,
        label: "Lorong Kanan Lt 6",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lorongkanan_lt6",
        cam_path: "cam_lorongkanan_lt6",
    },
];

export default function CCTVPage() {
    const [cameras, setCameras] = useState<CameraItem[]>(DEFAULT_CAMERAS);
    const [groups, setGroups] = useState<GroupItem[]>([
        { id: 1, name: "Lantai 5 Gedung PLT" },
        { id: 2, name: "Lantai 6 Gedung PLT" },
    ]);
    const [viewMode, setViewMode] = useState<"grid" | "single" | "ai_stream">("grid");
    const [selectedCamId, setSelectedCamId] = useState<number | string>(1);
    const [selectedGroup, setSelectedGroup] = useState<string>("all");
    const [streamReloadKey, setStreamReloadKey] = useState<number>(0);

    // WebRTC Stream via Pinggy Raspi States
    const [pinggyWebRtcBase, setPinggyWebRtcBase] = useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("esis_pinggy_webrtc_url") || "https://stream.ucim.my.id";
        }
        return "https://stream.ucim.my.id";
    });
    const [inputPinggyWebRtc, setInputPinggyWebRtc] = useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("esis_pinggy_webrtc_url") || "https://stream.ucim.my.id";
        }
        return "https://stream.ucim.my.id";
    });

    // AI Telemetry States (AI Laptop di Mainstream 101 -> Kirim Lokasi Patroli & Koordinat Rokok)
    const [telemetry, setTelemetry] = useState<{
        online: boolean;
        current_lab: string;
        cam_key: string;
        ecam_path: string;
        is_smoking: boolean;
        smoking_duration: number;
        boxes: Array<{ x: number; y: number; w: number; h: number; conf: number }>;
        fps: number;
        has_person: boolean;
        auto_skip_countdown: number;
        status: string;
    }>({
        online: false,
        current_lab: "Lab Sistem Digital",
        cam_key: "lab_sisdig",
        ecam_path: "ecam_lab_sisdig",
        is_smoking: false,
        smoking_duration: 0,
        boxes: [],
        fps: 0,
        has_person: false,
        auto_skip_countdown: 10,
        status: "offline",
    });
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    // Polling telemetri AI patroli saat berada di tab "ai_stream"
    useEffect(() => {
        if (viewMode !== "ai_stream") return;

        let isMounted = true;
        const fetchTelemetry = async () => {
            try {
                // 1. Coba ambil dari Next.js Web API
                const res = await fetch("/api/ai/live-feed", { cache: "no-store" });
                if (res.ok && isMounted) {
                    const data = await res.json();
                    if (data.online) {
                        setTelemetry(data);
                        return;
                    }
                }

                // 2. Fallback Langsung: Hubungi AI Server Lokal di http://localhost:8001/telemetry
                try {
                    const localController = new AbortController();
                    const localTimeout = setTimeout(() => localController.abort(), 1200);
                    const localRes = await fetch("http://localhost:8001/telemetry", {
                        cache: "no-store",
                        signal: localController.signal,
                    });
                    clearTimeout(localTimeout);

                    if (localRes.ok && isMounted) {
                        const localData = await localRes.json();
                        setTelemetry({
                            online: true,
                            current_lab: localData.current_lab || "Lab Sistem Digital",
                            cam_key: localData.cam_key || "lab_sisdig",
                            ecam_path: localData.ecam_path || "ecam_lab_sisdig",
                            is_smoking: Boolean(localData.is_smoking),
                            smoking_duration: localData.smoking_duration || 0,
                            boxes: localData.boxes || [],
                            fps: localData.fps || 0,
                            has_person: Boolean(localData.has_person),
                            auto_skip_countdown: localData.auto_skip_countdown || 10,
                            status: localData.status || "online",
                        });
                        return;
                    }
                } catch {
                    // Port 8001 tidak dapat dihubungi
                }

                if (isMounted) {
                    setTelemetry((prev) => ({ ...prev, online: false }));
                }
            } catch {
                if (isMounted) {
                    setTelemetry((prev) => ({ ...prev, online: false }));
                }
            }
        };

        fetchTelemetry();
        const interval = setInterval(fetchTelemetry, 400);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [viewMode, streamReloadKey]);

    const handleSavePinggyWebRtc = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputPinggyWebRtc.trim().replace(/\/+$/, "");
        if (trimmed) {
            setPinggyWebRtcBase(trimmed);
            if (typeof window !== "undefined") {
                localStorage.setItem("esis_pinggy_webrtc_url", trimmed);
            }
            setStreamReloadKey((prev) => prev + 1);
        }
    };

    const handleRemoteAction = async (endpoint: string, actionName: string) => {
        setActionLoading(true);
        setActionMessage(null);
        try {
            const res = await fetch(`http://localhost:8001${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                const data = await res.json().catch(() => ({}));
                setActionMessage(`Sukses: ${data.message || actionName}`);
                setStreamReloadKey((prev) => prev + 1);
            } else {
                setActionMessage(`Gagal: Server mengembalikan kode ${res.status}`);
            }
        } catch {
            setActionMessage("Gagal menghubungi AI Server lokal (port 8001).");
        } finally {
            setActionLoading(false);
            setTimeout(() => setActionMessage(null), 4000);
        }
    };

    // Ambil daftar grouping lokasi dinamis
    useEffect(() => {
        fetch("/api/streaming/groups")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.success && Array.isArray(data.groups) && data.groups.length > 0) {
                    setGroups(data.groups);
                }
            })
            .catch(() => {});
    }, []);

    // Ambil data kamera streaming dinamis dari basis data Supabase / MediaMTX
    useEffect(() => {
        fetch("/api/streaming")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.success && Array.isArray(data.streams) && data.streams.length > 0) {
                    interface ApiStream {
                        id: number | string;
                        label: string;
                        location_group?: string;
                        ecam_path?: string;
                        cam_path?: string;
                        hls_source?: string;
                    }

                    const mapped: CameraItem[] = data.streams.map((s: ApiStream) => {
                        const ecam = s.ecam_path || "ecam_cam";
                        const cam = s.cam_path || "cam_cam";
                        const group = s.location_group || "Lantai 5 Gedung PLT";

                        return {
                            id: s.id,
                            label: s.label,
                            location_group: group,
                            ecam_path: ecam,
                            cam_path: cam,
                            hls_source: s.hls_source,
                        };
                    });

                    setCameras(mapped);
                    if (mapped[0]) {
                        setSelectedCamId(mapped[0].id);
                    }
                }
            })
            .catch(() => {});
    }, []);

    // Filter Kamera berdasarkan grouping lokasi
    const filteredCameras = cameras.filter((cam) => {
        if (selectedGroup === "all") return true;
        return cam.location_group === selectedGroup;
    });

    const activeCamera = cameras.find((c) => String(c.id) === String(selectedCamId)) || cameras[0];

    const handleRefreshAll = () => {
        setStreamReloadKey((prev) => prev + 1);
    };

    return (
        <div className="space-y-5">
            {/* VMS Header & Toolbar Kontrol */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Identitas Halaman */}
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                Streaming CCTV Terpadu
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                            Matriks Pemantauan CCTV Laboratorium
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Menampilkan feed video kamera pengawas di Gedung Pusat Laboratorium Terpadu (PLT).
                        </p>
                    </div>

                    {/* Toolbar VMS: Filter Grouping Lokasi, Mode Tampilan, Kualitas & Refresh */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Dropdown Filter Grup CCTV (Mode Matriks) */}
                        {viewMode === "grid" && (
                            <div className="flex items-center space-x-2 text-xs">
                                <span className="text-slate-500 font-medium shrink-0">Filter Grup:</span>
                                <select
                                    value={selectedGroup}
                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                    className="px-3 py-1.5 bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs font-semibold outline-none focus:border-blue-600 transition-colors cursor-pointer"
                                    aria-label="Pilih grup kamera"
                                >
                                    <option value="all">Semua CCTV ({cameras.length})</option>
                                    {groups.map((grp) => {
                                        const count = cameras.filter((c) => c.location_group === grp.name).length;
                                        return (
                                            <option key={grp.id} value={grp.name}>
                                                {grp.name} ({count})
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}

                        {/* Switcher Mode: Matriks vs Kamera Tunggal vs Live AI Rokok */}
                        <div className="flex items-center bg-slate-100 dark:bg-neutral-800 p-1 rounded-lg text-xs border border-slate-200 dark:border-neutral-700">
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center space-x-1 ${
                                    viewMode === "grid"
                                        ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xs font-semibold"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                }`}
                                title="Tampilan Matriks Grid"
                            >
                                <Grid2X2 className="w-3.5 h-3.5" />
                                <span>Matriks</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("single")}
                                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center space-x-1 ${
                                    viewMode === "single"
                                        ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xs font-semibold"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                }`}
                                title="Tampilan Satu Kamera"
                            >
                                <Square className="w-3.5 h-3.5" />
                                <span>Tunggal</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("ai_stream")}
                                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
                                    viewMode === "ai_stream"
                                        ? "bg-amber-600 text-white shadow-2xs font-semibold"
                                        : "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                                }`}
                                title="Live Stream AI (Hanya Bounding Box Objek Rokok)"
                            >
                                <Flame className="w-3.5 h-3.5" />
                                <span>Live AI Rokok</span>
                            </button>
                        </div>

                        {/* Status Otomatis Substream */}
                        <div 
                            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs border bg-slate-100 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 select-none font-medium"
                            title="Streaming CCTV otomatis menggunakan Substream (ecam) hemat bandwidth; Mainstream dialokasikan untuk inferensi AI"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Substream (ecam)</span>
                        </div>

                        {/* Tombol Muat Ulang Stream */}
                        <button
                            type="button"
                            onClick={handleRefreshAll}
                            className="p-1.5 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-neutral-700 transition-colors"
                            title="Muat ulang seluruh stream kamera"
                            aria-label="Muat ulang stream"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Selector Mode Tunggal: Dropdown Grup & Dropdown Kamera */}
            {viewMode === "single" && (
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="single-group-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                Pilihan Grup CCTV:
                            </label>
                            <select
                                id="single-group-select"
                                value={selectedGroup}
                                onChange={(e) => {
                                    const newGrp = e.target.value;
                                    setSelectedGroup(newGrp);
                                    const validCams = newGrp === "all" ? cameras : cameras.filter((c) => c.location_group === newGrp);
                                    if (validCams.length > 0 && !validCams.some((c) => String(c.id) === String(selectedCamId))) {
                                        setSelectedCamId(validCams[0].id);
                                    }
                                }}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 cursor-pointer"
                            >
                                <option value="all">Semua Grup ({cameras.length} Kamera)</option>
                                {groups.map((grp) => {
                                    const count = cameras.filter((c) => c.location_group === grp.name).length;
                                    return (
                                        <option key={grp.id} value={grp.name}>
                                            {grp.name} ({count} Kamera)
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="single-camera-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                Pilihan Kamera untuk Ditampilkan:
                            </label>
                            <select
                                id="single-camera-select"
                                value={String(selectedCamId)}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const matched = cameras.find((c) => String(c.id) === val);
                                    if (matched) {
                                        setSelectedCamId(matched.id);
                                    }
                                }}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 cursor-pointer"
                            >
                                {filteredCameras.map((cam) => (
                                    <option key={cam.id} value={String(cam.id)}>
                                        {cam.label} ({cam.location_group})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* View Mode: Live AI Rokok (WebRTC Substream via Pinggy / MediaMTX + AI Bounding Box Rokok) */}
            {viewMode === "ai_stream" && (
                <div className="space-y-4">
                    {/* Control Card for Pinggy MediaMTX WebRTC + AI Telemetry */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            {/* Input Form Pinggy WebRTC Base URL */}
                            <form onSubmit={handleSavePinggyWebRtc} className="flex-1 flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={inputPinggyWebRtc}
                                        onChange={(e) => setInputPinggyWebRtc(e.target.value)}
                                        placeholder="URL Base WebRTC Pinggy / MediaMTX (misal: https://stream.ucim.my.id atau https://xxxx.a.free.pinggy.link)"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-amber-600"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Simpan URL Stream</span>
                                </button>
                            </form>

                            {/* Status Indikator AI Server */}
                            <div className="flex items-center space-x-3 shrink-0">
                                <div
                                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                                        telemetry.online
                                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                            : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                                    }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            telemetry.online ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                                        }`}
                                    ></span>
                                    <span>
                                        {telemetry.online
                                            ? `AI Aktif (${telemetry.current_lab} • ${telemetry.fps} FPS)`
                                            : "AI Offline (Jalankan run_local_gui.bat)"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Remote Actions & Lab Info Bar */}
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    disabled={actionLoading || !telemetry.online}
                                    onClick={() => handleRemoteAction("/api/patrol/switch", "Ganti Lab Patroli")}
                                    className="px-3 py-1.5 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 rounded-md font-medium transition-colors flex items-center space-x-1 cursor-pointer"
                                    title="Pindahkan kamera patroli AI ke lab berikutnya"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? "animate-spin" : ""}`} />
                                    <span>Ganti Lab Patroli</span>
                                </button>
                                <button
                                    type="button"
                                    disabled={actionLoading || !telemetry.online}
                                    onClick={() => handleRemoteAction("/api/simulate", "Simulasi Pelanggaran Rokok")}
                                    className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 disabled:opacity-50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-md font-medium transition-colors flex items-center space-x-1 cursor-pointer"
                                    title="Kirim event tes simulasi deteksi rokok"
                                >
                                    <Flame className="w-3.5 h-3.5" />
                                    <span>Tes Simulasi Deteksi</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStreamReloadKey((prev) => prev + 1)}
                                    className="p-1.5 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-md transition-colors"
                                    title="Muat ulang stream WebRTC"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {actionMessage && (
                                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                    {actionMessage}
                                </span>
                            )}

                            <div className="flex items-center space-x-3">
                                {telemetry.online && !telemetry.has_person && (
                                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                                        Lab sepi: auto-skip dalam {telemetry.auto_skip_countdown}s
                                    </span>
                                )}
                                <a
                                    href={`${pinggyWebRtcBase.replace(/\/+$/, "")}/${telemetry.ecam_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-1 font-medium"
                                >
                                    <span>Buka WebRTC Tab Baru</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Stream Video Container */}
                    <div className="bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-xl overflow-hidden shadow-md">
                        {/* Header Stream */}
                        <div className="px-4 py-3 bg-neutral-900/95 border-b border-neutral-800 text-white flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 truncate">
                                <span className={`w-2.5 h-2.5 rounded-full ${telemetry.online ? "bg-emerald-500 animate-pulse" : "bg-rose-500"} shrink-0`}></span>
                                <h3 className="font-bold text-white text-sm truncate">
                                    Live Substream: {telemetry.current_lab} ({telemetry.ecam_path})
                                </h3>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0">
                                {telemetry.is_smoking ? (
                                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-600 text-white animate-pulse flex items-center space-x-1 shadow">
                                        <Flame className="w-3 h-3" />
                                        <span>TERDETEKSI MEROKOK ({telemetry.smoking_duration.toFixed(1)}s)</span>
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
                                        <Check className="w-3 h-3" />
                                        <span>Tidak Ada Rokok</span>
                                    </span>
                                )}
                                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-900/60 text-amber-300 border border-amber-700 flex items-center space-x-1">
                                    <Flame className="w-3 h-3" />
                                    <span>Bounding Box: Objek Rokok Saja</span>
                                </span>
                            </div>
                        </div>

                        {/* Stream Feed Body: WebRTC Substream via Pinggy / MediaMTX + Cigarette Bounding Box Overlay */}
                        <div className="w-full aspect-video bg-black relative flex items-center justify-center min-h-[380px] max-h-[70vh] overflow-hidden">
                            {/* Iframe WebRTC Substream */}
                            <iframe
                                key={`${telemetry.ecam_path}-${streamReloadKey}`}
                                src={`${pinggyWebRtcBase.replace(/\/+$/, "")}/${telemetry.ecam_path}`}
                                className="w-full h-full border-none pointer-events-auto"
                                allowFullScreen
                                title={`Live WebRTC Substream ${telemetry.current_lab}`}
                            />

                            {/* Bounding Box Overlay (HANYA OBJEK ROKOK) */}
                            {telemetry.online && telemetry.boxes && telemetry.boxes.length > 0 && (
                                <div className="absolute inset-0 pointer-events-none">
                                    {telemetry.boxes.map((box, idx) => (
                                        <div
                                            key={idx}
                                            className="absolute border-2 border-rose-500 bg-rose-500/25 rounded shadow-[0_0_15px_rgba(244,63,94,0.9)] transition-all duration-150 animate-pulse pointer-events-none"
                                            style={{
                                                left: `${Math.max(0, Math.min(95, box.x * 100))}%`,
                                                top: `${Math.max(0, Math.min(95, box.y * 100))}%`,
                                                width: `${Math.max(2, Math.min(100, box.w * 100))}%`,
                                                height: `${Math.max(2, Math.min(100, box.h * 100))}%`,
                                            }}
                                        >
                                            <span className="absolute -top-6 left-0 bg-rose-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                                                ROKOK: {Math.round(box.conf * 100)}% ({telemetry.smoking_duration.toFixed(1)}s)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Overlay jika AI Server Offline */}
                            {!telemetry.online && (
                                <div className="absolute top-3 left-3 bg-neutral-900/90 border border-neutral-700 px-3 py-1.5 rounded-lg text-xs text-amber-400 font-medium pointer-events-none flex items-center space-x-2 backdrop-blur-xs">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                                    <span>AI Server belum terhubung. Jalankan `run_local_gui.bat` di laptop.</span>
                                </div>
                            )}
                        </div>

                        {/* Footer Deskripsi */}
                        <div className="px-4 py-2.5 bg-neutral-900 text-slate-400 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-neutral-800">
                            <span>
                                💡 <strong>WebRTC Substream via Raspi:</strong> Video streaming menggunakan Substream (ecam) dari MediaMTX Raspi sehingga ringan & lancar. AI Server di laptop memproses Mainstream 1080p dan mengirimkan koordinat rokok secara real-time.
                            </span>
                            <span className="text-slate-500 shrink-0 font-mono text-[10px]">
                                Target Substream: {telemetry.ecam_path}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Matriks Tampilan Video (VMS Wall) */}
            {viewMode !== "ai_stream" && (
                <div
                    className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4"
                            : "w-full max-w-4xl mx-auto"
                    }
                >
                    {(viewMode === "grid" ? filteredCameras : [activeCamera]).map((cam) => {
                        const streamUrl = cam.hls_source || `https://stream.ucim.my.id/${cam.ecam_path}`;

                        return (
                            <div
                                key={`${cam.id}-${streamReloadKey}`}
                                className="bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs relative flex flex-col group"
                            >
                                {/* Header Atas Feed Video */}
                                <div className="px-3.5 py-2.5 bg-neutral-900/95 border-b border-neutral-800 text-white flex items-center justify-between text-xs">
                                    <div className="flex items-center space-x-2 truncate">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                                        <h3 className="font-bold text-white text-xs truncate leading-tight">{cam.label}</h3>
                                    </div>

                                    <div className="flex items-center space-x-2 shrink-0">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getGroupBadgeColor(cam.location_group)}`}>
                                            {cam.location_group}
                                        </span>
                                        <a
                                            href={streamUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                                            title="Buka Stream Penuh di Tab Baru"
                                        >
                                            <Maximize2 className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>

                                {/* Player Container */}
                                <div className="w-full aspect-video bg-black relative flex items-center justify-center">
                                    <iframe
                                        src={streamUrl}
                                        className="w-full h-full border-none"
                                        allowFullScreen
                                        title={`Feed CCTV ${cam.label}`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
