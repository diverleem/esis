"use client";

import { useState, useEffect } from "react";
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
    Zap,
    ShieldAlert
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
    const [viewMode, setViewMode] = useState<"grid" | "single">("grid");
    const [selectedCamId, setSelectedCamId] = useState<number | string>(1);
    const [selectedGroup, setSelectedGroup] = useState<string>("all");
    const [isHDMode, setIsHDMode] = useState<boolean>(false);
    const [streamReloadKey, setStreamReloadKey] = useState<number>(0);
    const [expandedCamera, setExpandedCamera] = useState<number | string | null>(null);

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

                        {/* Switcher Mode: Matriks vs Kamera Tunggal */}
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
                        </div>

                        {/* Mode Kualitas Toggle */}
                        <label 
                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs cursor-pointer border select-none transition-all ${
                                isHDMode 
                                    ? "bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-700 dark:text-blue-300 font-bold"
                                    : "bg-slate-100 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300"
                            }`}
                            title="Alihkan Kualitas HD atau Standar"
                        >
                            <input
                                type="checkbox"
                                checked={isHDMode}
                                onChange={(e) => setIsHDMode(e.target.checked)}
                                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                            />
                            <span>{isHDMode ? "Kualitas HD" : "Kualitas Standar"}</span>
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

            {/* Matriks Tampilan Video (VMS Wall) */}
            <div
                className={
                    viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"
                        : "w-full max-w-4xl mx-auto"
                }
            >
                {(viewMode === "grid" ? filteredCameras : [activeCamera]).map((cam) => {
                    const activePath = isHDMode ? cam.cam_path : cam.ecam_path;
                    const streamUrl = `https://stream.ucim.my.id/${activePath}`;

                    return (
                        <div
                            key={`${cam.id}-${streamReloadKey}-${isHDMode ? "hd" : "ecam"}`}
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

            {/* Petunjuk Operasional Laboratorium */}
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-neutral-800 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                            Pusat Laboratorium Terpadu: Infrastruktur Jaringan Lokal
                        </p>
                        <p className="text-[11px] text-slate-500">
                            CCTV terhubung ke LAN switch khusus di Gedung PLT untuk pemantauan disiplin dan kawasan KTR.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
