"use client";

import { useState } from "react";
import {
    Video,
    RefreshCw,
    Layers,
    Maximize2,
    Grid2X2,
    Grid3X3,
    Square,
    Filter,
    ShieldCheck,
    AlertTriangle,
    Eye,
    Building2,
    RotateCcw,
} from "lucide-react";

interface CameraItem {
    id: number;
    name: string;
    zone: string;
    floor: "Lt. 5" | "Lt. 6";
    url: string;
    protocol: "WebRTC" | "HLS";
}

export default function CCTVPage() {
    const cameras: CameraItem[] = [
        {
            id: 1,
            name: "Lab Sisdig",
            zone: "Laboratorium Sistem Digital",
            floor: "Lt. 5",
            url: "https://stream.ucim.my.id/cam_lab_sisdig",
            protocol: "WebRTC",
        },
        {
            id: 2,
            name: "Lab OS",
            zone: "Laboratorium Sistem Operasi",
            floor: "Lt. 5",
            url: "https://stream.ucim.my.id/cam_lab_os",
            protocol: "WebRTC",
        },
        {
            id: 3,
            name: "Lab Programming",
            zone: "Laboratorium Pemrograman",
            floor: "Lt. 5",
            url: "https://stream.ucim.my.id/cam_lab_programming",
            protocol: "WebRTC",
        },
        {
            id: 4,
            name: "Lab Riset Lt 5",
            zone: "Laboratorium Riset & Robotika",
            floor: "Lt. 5",
            url: "https://stream.ucim.my.id/cam_lab_riset_lt5",
            protocol: "WebRTC",
        },
        {
            id: 5,
            name: "Lab ELC",
            zone: "Laboratorium Elektronika",
            floor: "Lt. 5",
            url: "https://stream.ucim.my.id/cam_lab_elc",
            protocol: "WebRTC",
        },
        {
            id: 6,
            name: "Lab Jaringan",
            zone: "Laboratorium Jaringan Komputer",
            floor: "Lt. 6",
            url: "https://stream.ucim.my.id/cam_lab_jaringan",
            protocol: "WebRTC",
        },
        {
            id: 7,
            name: "Lab Multimedia 1",
            zone: "Laboratorium Multimedia & Desain 1",
            floor: "Lt. 6",
            url: "https://stream.ucim.my.id/cam_lab_multimedia1",
            protocol: "WebRTC",
        },
        {
            id: 8,
            name: "Lab Multimedia 2",
            zone: "Laboratorium Multimedia & Desain 2",
            floor: "Lt. 6",
            url: "https://stream.ucim.my.id/cam_lab_multimedia2",
            protocol: "WebRTC",
        },
        {
            id: 9,
            name: "Lab APL 1",
            zone: "Laboratorium Algoritma & Pemrograman 1",
            floor: "Lt. 6",
            url: "https://stream.ucim.my.id/cam_lab_apl1",
            protocol: "WebRTC",
        },
        {
            id: 10,
            name: "Lab APL 2",
            zone: "Laboratorium Algoritma & Pemrograman 2",
            floor: "Lt. 6",
            url: "https://stream.ucim.my.id/cam_lab_apl2",
            protocol: "WebRTC",
        },
        {
            id: 11,
            name: "Lab Riset Lt 6",
            zone: "Laboratorium Riset Lanjut",
            floor: "Lt. 6",
            url: "https://stream.ucim.my.id/cam_lab_riset_lt6",
            protocol: "WebRTC",
        },
        {
            id: 12,
            name: "Lab Tambang",
            zone: "Laboratorium Komputasi Tambang",
            floor: "Lt. 6",
            url: "https://stream.ucim.my.id/cam_lab_tambang",
            protocol: "WebRTC",
        },
        {
            id: 13,
            name: "Lab Matematika",
            zone: "Laboratorium Komputasi Matematika",
            floor: "Lt. 6",
            url: "https://stream.ucim.my.id/cam_lab_mtk",
            protocol: "WebRTC",
        },
    ];

    const [viewMode, setViewMode] = useState<"grid" | "single">("grid");
    const [selectedCamId, setSelectedCamId] = useState<number>(1);
    const [selectedFloor, setSelectedFloor] = useState<"all" | "Lt. 5" | "Lt. 6">("all");
    const [isHDMode, setIsHDMode] = useState<boolean>(false);
    const [streamReloadKey, setStreamReloadKey] = useState<number>(0);
    const [expandedCamera, setExpandedCamera] = useState<number | null>(null);

    const filteredCameras = cameras.filter((cam) => {
        if (selectedFloor === "all") return true;
        return cam.floor === selectedFloor;
    });

    const activeCamera = cameras.find((c) => c.id === selectedCamId) || cameras[0];

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
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                MediaMTX Streaming Server — Live Feeds
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                            Matriks Pemantauan CCTV Laboratorium
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Menampilkan feed video kamera pengawas di Gedung Pusat Laboratorium Terpadu (PLT).
                        </p>
                    </div>

                    {/* Toolbar VMS: Filter Lantai, Mode Tampilan, Kualitas & Refresh */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Filter Lantai Gedung */}
                        <div className="flex items-center bg-slate-100 dark:bg-neutral-800 p-1 rounded-lg text-xs border border-slate-200 dark:border-neutral-700">
                            <button
                                type="button"
                                onClick={() => setSelectedFloor("all")}
                                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                                    selectedFloor === "all"
                                        ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xs font-semibold"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                }`}
                            >
                                Semua Lab ({cameras.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedFloor("Lt. 5")}
                                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                                    selectedFloor === "Lt. 5"
                                        ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xs font-semibold"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                }`}
                            >
                                Lantai 5
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedFloor("Lt. 6")}
                                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                                    selectedFloor === "Lt. 6"
                                        ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xs font-semibold"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                }`}
                            >
                                Lantai 6
                            </button>
                        </div>

                        {/* Switcher Mode: Matriks vs Kamera Tunggal */}
                        <div className="flex items-center bg-slate-100 dark:bg-neutral-800 p-1 rounded-lg text-xs border border-slate-200 dark:border-neutral-700">
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                                    viewMode === "grid"
                                        ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xs font-semibold"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                }`}
                                title="Tampilan Kisi Matriks"
                            >
                                <Grid2X2 className="w-3.5 h-3.5" />
                                <span>Matriks</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("single")}
                                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                                    viewMode === "single"
                                        ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xs font-semibold"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                }`}
                                title="Tampilan Satu Kamera"
                            >
                                <Square className="w-3.5 h-3.5" />
                                <span>Tunggal</span>
                            </button>
                        </div>

                        {/* Mode HD Toggle */}
                        <label className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 dark:bg-neutral-800 rounded-lg text-xs cursor-pointer border border-slate-200 dark:border-neutral-700 select-none">
                            <input
                                type="checkbox"
                                checked={isHDMode}
                                onChange={(e) => setIsHDMode(e.target.checked)}
                                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                            />
                            <span className="font-semibold text-slate-700 dark:text-slate-200">Mode HD</span>
                        </label>

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

            {/* Selector Kamera Cepat (Ketika dalam Mode Tunggal) */}
            {viewMode === "single" && (
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-3 shadow-2xs">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-1">
                        Pilih Kamera untuk Ditampilkan:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {filteredCameras.map((cam) => (
                            <button
                                key={cam.id}
                                type="button"
                                onClick={() => setSelectedCamId(cam.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    selectedCamId === cam.id
                                        ? "bg-blue-700 text-white shadow-2xs font-bold"
                                        : "bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-neutral-700"
                                }`}
                            >
                                {cam.name} ({cam.floor})
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Matriks Tampilan Video (VMS Wall) */}
            <div
                className={
                    viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"
                        : "w-full max-w-4xl mx-auto"
                }
            >
                {(viewMode === "grid" ? filteredCameras : [activeCamera]).map((cam) => (
                    <div
                        key={`${cam.id}-${streamReloadKey}`}
                        className="bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs relative flex flex-col group"
                    >
                        {/* Header Atas Feed Video */}
                        <div className="px-3.5 py-2.5 bg-neutral-900/95 border-b border-neutral-800 text-white flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 truncate">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                                <div className="truncate">
                                    <h3 className="font-bold text-white text-xs truncate leading-tight">{cam.name}</h3>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        {cam.zone} ({cam.floor})
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-1.5 shrink-0">
                                <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded tracking-wider">
                                    LIVE
                                </span>
                                <span className="bg-neutral-800 text-slate-300 text-[9px] font-mono px-1 py-0.2 rounded">
                                    {isHDMode ? "1080p" : "720p"}
                                </span>
                            </div>
                        </div>

                        {/* Player Container */}
                        <div className="w-full aspect-video bg-black relative flex items-center justify-center">
                            <iframe
                                src={isHDMode ? cam.url : cam.url.replace("stream.ucim.my.id/cam_", "stream.ucim.my.id/ecam_")}
                                className="w-full h-full border-none"
                                allowFullScreen
                                title={`Feed CCTV ${cam.name}`}
                            />
                        </div>

                        {/* Footer Status & Informasi Saluran */}
                        <div className="px-3 py-2 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-slate-300">CH_{cam.id.toString().padStart(2, "0")}</span>
                                <span>•</span>
                                <span className="text-[10px] text-emerald-400 font-semibold">WebRTC Active</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-[10px] text-slate-400">Tunnel Pinggy</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Petunjuk Operasional Laboratorium */}
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-neutral-800 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                            Pusat Laboratorium Terpadu — Infrastruktur Jaringan Lokal
                        </p>
                        <p className="text-[11px] text-slate-500">
                            CCTV terhubung ke LAN switch khusus (172.20.32.x) dan ditransmisikan melalui Raspberry Pi 5 MediaMTX.
                        </p>
                    </div>
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                    Protokol: RTSP → WebRTC / HLS
                </div>
            </div>
        </div>
    );
}
