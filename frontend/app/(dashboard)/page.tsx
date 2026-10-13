"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
    Video, 
    ShieldAlert, 
    Clock, 
    FileCheck, 
    ExternalLink, 
    Play, 
    Pause, 
    CheckCircle2, 
    AlertCircle, 
    Maximize2, 
    Eye, 
    Building2,
    Calendar,
    Filter
} from "lucide-react";
import { 
    AreaChart, 
    Area, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from "recharts";
import { useTheme } from "next-themes";

// Data tren deteksi mingguan di Pusat Laboratorium Terpadu (PLT)
const weeklyIncidentData = [
    { day: "Senin", deteksi: 4, terverifikasi: 3 },
    { day: "Selasa", deteksi: 2, terverifikasi: 2 },
    { day: "Rabu", deteksi: 5, terverifikasi: 4 },
    { day: "Kamis", deteksi: 1, terverifikasi: 1 },
    { day: "Jumat", deteksi: 3, terverifikasi: 3 },
    { day: "Sabtu", deteksi: 0, terverifikasi: 0 },
];

// Data distribusi per lantai laboratorium
const zoneDistribution = [
    { zone: "Lantai 5 (Lab Hardware & Riset)", count: 7, percentage: "47%" },
    { zone: "Lantai 6 (Lab Software & Jaringan)", count: 8, percentage: "53%" },
];

// 4 Kamera prioritas untuk quick-view di dashboard
const quickCameras = [
    { id: 1, name: "Lab Sisdig", zone: "Lantai 5", url: "https://stream.ucim.my.id/Ecam_lab_sisdig" },
    { id: 3, name: "Lab Programming", zone: "Lantai 5", url: "https://stream.ucim.my.id/Ecam_lab_programming" },
    { id: 6, name: "Lab Jaringan", zone: "Lantai 6", url: "https://stream.ucim.my.id/Ecam_lab_jaringan" },
    { id: 7, name: "Lab Multimedia 1", zone: "Lantai 6", url: "https://stream.ucim.my.id/Ecam_lab_multimedia1" },
];

// Data riwayat pelanggaran terkini untuk tabel pemantauan
const initialRecentIncidents = [
    {
        id: "PLG-202610-001",
        time: "10:14 WIB, Hari ini",
        location: "Lab Programming (Lt. 5)",
        camera: "CAM_03",
        confidence: "94.2%",
        status: "Menunggu Verifikasi",
        statusType: "pending",
        pelaku: "Mahasiswa (Perlu Konfirmasi)"
    },
    {
        id: "PLG-202610-002",
        time: "08:45 WIB, Hari ini",
        location: "Lab Sistem Digital (Lt. 5)",
        camera: "CAM_01",
        confidence: "91.8%",
        status: "Terverifikasi (SP-1)",
        statusType: "verified",
        pelaku: "Mhs 2021-081023 (Fulan A.)"
    },
    {
        id: "PLG-202610-003",
        time: "15:20 WIB, Kemarin",
        location: "Lab Jaringan (Lt. 6)",
        camera: "CAM_06",
        confidence: "88.5%",
        status: "Terverifikasi (Peringatan Lisan)",
        statusType: "verified",
        pelaku: "Tamu / Eksternal Lab"
    },
    {
        id: "PLG-202610-004",
        time: "11:05 WIB, Kemarin",
        location: "Lab Multimedia 2 (Lt. 6)",
        camera: "CAM_08",
        confidence: "64.1%",
        status: "Ditolak (False Positive)",
        statusType: "rejected",
        pelaku: "Bukan Aktivitas Merokok (Vape/Pena)"
    },
];

export default function DashboardPage() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [incidents, setIncidents] = useState(initialRecentIncidents);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && theme === "dark";

    const filteredIncidents = incidents.filter(item => {
        if (filterStatus === "all") return true;
        return item.statusType === filterStatus;
    });

    const handleVerify = (id: string) => {
        setIncidents(prev => prev.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    status: "Terverifikasi (SP-1)",
                    statusType: "verified"
                };
            }
            return item;
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header Ringkasan Operasional VMS */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                PUSAT LABORATORIUM TERPADU (PLT)
                            </span>
                            <span className="text-slate-300 dark:text-neutral-700">|</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                Pengawasan Kawasan Tanpa Rokok (KTR)
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Status Operasional Pemantauan & Disiplin Lab
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Streaming kamera RTSP/WebRTC terpusat via MediaMTX & deteksi aktivitas merokok berbasis Computer Vision.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/cctv"
                            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                        >
                            <Video className="w-3.5 h-3.5" />
                            <span>Buka Live CCTV Matrix</span>
                        </Link>
                        <Link
                            href="/violation"
                            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-200 dark:border-neutral-700"
                        >
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            <span>Log Deteksi</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 4 Kartu Metrik Operasional VMS & KTR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metrik 1: Total Kamera */}
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Kamera Lab Terhubung</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">13 / 13</h3>
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                                <span>100% Signal MediaMTX</span>
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-neutral-800 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Video className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Metrik 2: Deteksi Hari Ini */}
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Deteksi Hari Ini</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">2 Kejadian</h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                Lab Lt. 5 (Sisdig & Programming)
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Metrik 3: Menunggu Verifikasi */}
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Menunggu Verifikasi</p>
                            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">1 Laporan</h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                Perlu tinjauan rekaman laboran
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Metrik 4: Tindak Lanjut SP */}
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Surat Peringatan (SP)</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">2 Diterbitkan</h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                Penegakan Tata Tertib Lab
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <FileCheck className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Live CCTV Matrix (Cuplikan 4 Kamera Langsung di Dashboard) */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            Quick Video Wall — Feed CCTV Laboratorium Prioritas
                        </h3>
                    </div>
                    <Link
                        href="/cctv"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                    >
                        <span>Lihat Seluruh 13 Kamera</span>
                        <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                    {quickCameras.map((cam) => (
                        <div 
                            key={cam.id}
                            className="bg-neutral-950 rounded-lg border border-slate-200 dark:border-neutral-800 overflow-hidden relative group"
                        >
                            {/* Bar atas keterangan kamera */}
                            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-2.5 z-10 flex items-center justify-between text-white text-[11px] pointer-events-none">
                                <div className="truncate">
                                    <p className="font-semibold leading-tight">{cam.name}</p>
                                    <p className="text-[10px] text-slate-300">{cam.zone}</p>
                                </div>
                                <span className="bg-red-600/90 text-white font-bold text-[9px] px-1.5 py-0.2 rounded tracking-wider">
                                    LIVE
                                </span>
                            </div>

                            {/* Player Frame */}
                            <div className="aspect-video w-full bg-neutral-900 relative">
                                <iframe
                                    src={cam.url}
                                    className="w-full h-full border-none"
                                    title={`Feed ${cam.name}`}
                                    allowFullScreen
                                />
                            </div>

                            {/* Bar bawah status sinyal */}
                            <div className="p-2 bg-slate-900 text-[10px] font-mono text-slate-400 flex items-center justify-between border-t border-neutral-800">
                                <span>CAM_{cam.id.toString().padStart(2, "0")}</span>
                                <span className="flex items-center space-x-1 text-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span>WebRTC OK</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bagian Analitik Pengawasan: Grafik Tren & Distribusi Zona Lab */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Grafik Tren Deteksi Mingguan (2 Kolom) */}
                <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Tren Deteksi Pelanggaran KTR Mingguan
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Perbandingan insiden terdeteksi oleh AI vs hasil verifikasi laboran
                            </p>
                        </div>
                        <div className="flex items-center space-x-3 text-xs">
                            <div className="flex items-center space-x-1.5">
                                <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block"></span>
                                <span className="text-slate-600 dark:text-slate-400 text-[11px]">Deteksi AI</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
                                <span className="text-slate-600 dark:text-slate-400 text-[11px]">Terverifikasi</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyIncidentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#262626" : "#f1f5f9"} />
                                <XAxis 
                                    dataKey="day" 
                                    tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }} 
                                    axisLine={false} 
                                    tickLine={false} 
                                />
                                <YAxis 
                                    allowDecimals={false}
                                    tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }} 
                                    axisLine={false} 
                                    tickLine={false} 
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? "#171717" : "#ffffff",
                                        borderColor: isDark ? "#262626" : "#e2e8f0",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                />
                                <Bar dataKey="deteksi" fill="#2563eb" radius={[4, 4, 0, 0]} name="Deteksi AI" />
                                <Bar dataKey="terverifikasi" fill="#10b981" radius={[4, 4, 0, 0]} name="Terverifikasi" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cakupan Zona Laboratorium PLT (1 Kolom) */}
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                            Cakupan Wilayah Laboratorium
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Distribusi kamera aktif di Gedung Pusat Lab Terpadu
                        </p>

                        <div className="space-y-4">
                            {zoneDistribution.map((item, idx) => (
                                <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/60 dark:border-neutral-700/60">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.zone}</span>
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.count} Kamera</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-blue-600 h-full rounded-full transition-all"
                                            style={{ width: item.percentage }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 p-3 rounded-lg border border-blue-100 dark:border-blue-950 bg-blue-50/50 dark:bg-blue-950/20 text-xs text-slate-600 dark:text-slate-300">
                        <p className="font-semibold text-blue-900 dark:text-blue-300 mb-0.5">Tata Tertib KTR Kampus</p>
                        <p className="text-[11px] leading-relaxed">
                            Berdasarkan SK Rektor, seluruh ruang laboratorium komputer PLT merupakan zona terlarang untuk rokok konvensional maupun rokok elektronik.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabel Log Deteksi Pelanggaran Terkini */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            Log Kejadian Deteksi Terbaru
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Daftar aktivitas mencurigakan yang terekam oleh kamera pengawas
                        </p>
                    </div>

                    {/* Filter Status Sederhana & Fungsional */}
                    <div className="flex items-center space-x-1.5">
                        <button
                            type="button"
                            onClick={() => setFilterStatus("all")}
                            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                                filterStatus === "all"
                                    ? "bg-slate-800 dark:bg-neutral-700 text-white"
                                    : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterStatus("pending")}
                            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                                filterStatus === "pending"
                                    ? "bg-amber-600 text-white"
                                    : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                            }`}
                        >
                            Perlu Verifikasi
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterStatus("verified")}
                            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                                filterStatus === "verified"
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                            }`}
                        >
                            Terverifikasi
                        </button>
                    </div>
                </div>

                {filteredIncidents.length === 0 ? (
                    /* State Kosong (Empty State) */
                    <div className="py-12 text-center text-slate-400">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Tidak ada insiden dengan filter ini
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Semua kondisi laboratorium terpantau tertib dan aman.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400 font-semibold">
                                    <th className="pb-3 pl-1">No. Berkas</th>
                                    <th className="pb-3">Waktu Kejadian</th>
                                    <th className="pb-3">Lokasi Lab & CCTV</th>
                                    <th className="pb-3">Confidence AI</th>
                                    <th className="pb-3">Status Verifikasi</th>
                                    <th className="pb-3">Keterangan Pelaku</th>
                                    <th className="pb-3 text-right pr-1">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                                {filteredIncidents.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/40 transition-colors">
                                        <td className="py-3 pl-1 font-mono font-semibold text-slate-800 dark:text-slate-200">
                                            {row.id}
                                        </td>
                                        <td className="py-3 text-slate-600 dark:text-slate-300">
                                            {row.time}
                                        </td>
                                        <td className="py-3">
                                            <p className="font-medium text-slate-800 dark:text-slate-200">{row.location}</p>
                                            <span className="text-[10px] text-slate-400 font-mono">{row.camera}</span>
                                        </td>
                                        <td className="py-3">
                                            <span className="font-mono font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
                                                {row.confidence}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                                row.statusType === "pending"
                                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                                    : row.statusType === "verified"
                                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                    : "bg-slate-200 text-slate-700 dark:bg-neutral-800 dark:text-slate-400"
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-slate-600 dark:text-slate-300">
                                            {row.pelaku}
                                        </td>
                                        <td className="py-3 text-right pr-1">
                                            {row.statusType === "pending" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleVerify(row.id)}
                                                    className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded font-medium text-[11px] transition-colors shadow-2xs"
                                                >
                                                    Verifikasi Bukti
                                                </button>
                                            ) : (
                                                <Link
                                                    href="/violation"
                                                    className="inline-flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium text-[11px]"
                                                >
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    Detail
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
