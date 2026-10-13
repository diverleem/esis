"use client";

import { useState } from "react";
import { 
    ShieldAlert, 
    Search, 
    Filter, 
    CheckCircle2, 
    XCircle, 
    FileText, 
    Eye, 
    Download, 
    Calendar, 
    Building2,
    Clock,
    UserCheck,
    AlertTriangle,
    X,
    FileSpreadsheet
} from "lucide-react";

interface ViolationRecord {
    id: string;
    date: string;
    time: string;
    location: string;
    camera: string;
    confidence: string;
    studentName?: string;
    studentId?: string;
    status: "pending" | "verified_sp1" | "verified_sp2" | "rejected";
    statusLabel: string;
    notes: string;
}

const initialViolations: ViolationRecord[] = [
    {
        id: "PLG-202610-001",
        date: "13 Okt 2026",
        time: "10:14 WIB",
        location: "Lab Programming (Lt. 5)",
        camera: "CAM_03",
        confidence: "94.2%",
        studentName: "Fulan A. Pratama",
        studentId: "2021081023",
        status: "pending",
        statusLabel: "Menunggu Verifikasi",
        notes: "Terdeteksi gestur merokok elektrik (vape) di deretan meja belakang lab."
    },
    {
        id: "PLG-202610-002",
        date: "13 Okt 2026",
        time: "08:45 WIB",
        location: "Lab Sistem Digital (Lt. 5)",
        camera: "CAM_01",
        confidence: "91.8%",
        studentName: "Ahmad R. Fauzi",
        studentId: "2022081045",
        status: "verified_sp1",
        statusLabel: "Terverifikasi SP-1",
        notes: "Terbukti merokok saat jeda praktikum hardware. SP-1 diterbitkan."
    },
    {
        id: "PLG-202610-003",
        date: "12 Okt 2026",
        time: "15:20 WIB",
        location: "Lab Jaringan Komputer (Lt. 6)",
        camera: "CAM_06",
        confidence: "88.5%",
        studentName: "Budi Santoso",
        studentId: "2020081012",
        status: "verified_sp2",
        statusLabel: "Terverifikasi SP-2",
        notes: "Pelanggaran berulang di ruang server jaringan. SP-2 diterbitkan."
    },
    {
        id: "PLG-202610-004",
        date: "12 Okt 2026",
        time: "11:05 WIB",
        location: "Lab Multimedia 2 (Lt. 6)",
        camera: "CAM_08",
        confidence: "64.1%",
        studentName: "Tidak Teridentifikasi",
        studentId: "-",
        status: "rejected",
        statusLabel: "Ditolak (Bukan Merokok)",
        notes: "Hasil tinjauan rekaman menunjukkan objek adalah solder/alat kerja elektronik."
    },
    {
        id: "PLG-202610-005",
        date: "11 Okt 2026",
        time: "14:10 WIB",
        location: "Lab Riset Lt 5",
        camera: "CAM_04",
        confidence: "89.0%",
        studentName: "Dimas Saputra",
        studentId: "2021081099",
        status: "verified_sp1",
        statusLabel: "Terverifikasi SP-1",
        notes: "Merokok di area pojok lab riset robotika."
    }
];

export default function ViolationPage() {
    const [records, setRecords] = useState<ViolationRecord[]>(initialViolations);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedRecord, setSelectedRecord] = useState<ViolationRecord | null>(null);
    const [modalAction, setModalAction] = useState<"sp1" | "sp2" | "reject" | null>(null);

    const filteredRecords = records.filter((item) => {
        const matchesSearch = 
            item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.studentName && item.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.studentId && item.studentId.includes(searchQuery));

        if (!matchesSearch) return false;
        if (selectedStatus === "all") return true;
        return item.status === selectedStatus;
    });

    const handleVerifyAction = (record: ViolationRecord, action: "sp1" | "sp2" | "reject") => {
        setRecords(prev => prev.map(r => {
            if (r.id === record.id) {
                if (action === "sp1") {
                    return { ...r, status: "verified_sp1", statusLabel: "Terverifikasi SP-1" };
                } else if (action === "sp2") {
                    return { ...r, status: "verified_sp2", statusLabel: "Terverifikasi SP-2" };
                } else {
                    return { ...r, status: "rejected", statusLabel: "Ditolak (False Positive)" };
                }
            }
            return r;
        }));
        setSelectedRecord(null);
    };

    return (
        <div className="space-y-5">
            {/* Header Ringkasan Halaman */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                Buku Induk Pelanggaran Tata Tertib PLT
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                            Log Pelanggaran Kawasan Tanpa Rokok (KTR)
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Pencatatan riwayat deteksi aktivitas merokok, verifikasi rekaman, dan penertiban Surat Peringatan akademik.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => alert("Format Berita Acara Pelanggaran (PDF) telah disiapkan untuk dicetak.")}
                            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 dark:bg-neutral-800 hover:bg-slate-900 dark:hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Cetak Berita Acara</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter & Toolbar Pencarian */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs">
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                    {/* Input Pencarian */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari berdasarkan No. Berkas, Nama, NIM, atau Lab..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-blue-600 transition-all"
                        />
                    </div>

                    {/* Filter Status */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("all")}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                selectedStatus === "all"
                                    ? "bg-slate-800 dark:bg-neutral-700 text-white font-semibold"
                                    : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                            }`}
                        >
                            Semua ({records.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("pending")}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                selectedStatus === "pending"
                                    ? "bg-amber-600 text-white font-semibold"
                                    : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                            }`}
                        >
                            Menunggu Verifikasi
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("verified_sp1")}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                selectedStatus === "verified_sp1"
                                    ? "bg-blue-600 text-white font-semibold"
                                    : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                            }`}
                        >
                            SP-1
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("verified_sp2")}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                selectedStatus === "verified_sp2"
                                    ? "bg-rose-600 text-white font-semibold"
                                    : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                            }`}
                        >
                            SP-2
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("rejected")}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                selectedStatus === "rejected"
                                    ? "bg-slate-600 text-white font-semibold"
                                    : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                            }`}
                        >
                            Ditolak
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabel Data Berkas Pelanggaran */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xs">
                {filteredRecords.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                        <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Tidak Ditemukan Berkas Pelanggaran
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                            Sesuaikan kata kunci pencarian atau filter status untuk melihat data lain.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-neutral-800/60 border-b border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-300 font-semibold">
                                <tr>
                                    <th className="py-3 px-4">No. Berkas</th>
                                    <th className="py-3 px-3">Waktu & Tanggal</th>
                                    <th className="py-3 px-3">Lokasi Laboratorium</th>
                                    <th className="py-3 px-3">Tingkat Keyakinan AI</th>
                                    <th className="py-3 px-3">Identitas Terduga</th>
                                    <th className="py-3 px-3">Status Verifikasi</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                                {filteredRecords.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/40 transition-colors">
                                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                            {item.id}
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <p className="font-medium text-slate-800 dark:text-slate-200">{item.time}</p>
                                            <span className="text-[11px] text-slate-400">{item.date}</span>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{item.location}</p>
                                            <span className="text-[10px] font-mono text-slate-400">{item.camera}</span>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <span className="font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-200/50 dark:border-blue-900/50">
                                                {item.confidence}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <p className="font-medium text-slate-800 dark:text-slate-200">{item.studentName || "Belum Terdata"}</p>
                                            <span className="text-[11px] font-mono text-slate-400">NIM: {item.studentId || "-"}</span>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                                item.status === "pending"
                                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                                    : item.status === "verified_sp1"
                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                                    : item.status === "verified_sp2"
                                                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                                    : "bg-slate-200 text-slate-700 dark:bg-neutral-800 dark:text-slate-400"
                                            }`}>
                                                {item.statusLabel}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedRecord(item)}
                                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium text-xs transition-colors border border-slate-200 dark:border-neutral-700 inline-flex items-center space-x-1"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>Tinjau Bukti</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Detail Berkas & Aksi Verifikasi */}
            {selectedRecord && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl max-w-xl w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
                        <button
                            type="button"
                            aria-label="Tutup modal"
                            onClick={() => setSelectedRecord(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center shrink-0">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Berkas {selectedRecord.id}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {selectedRecord.location} • {selectedRecord.date} {selectedRecord.time}
                                </p>
                            </div>
                        </div>

                        {/* Snapshot Bukti Deteksi (Honest CCTV Frame Box) */}
                        <div className="bg-neutral-950 rounded-lg p-3 text-center border border-neutral-800 mb-4">
                            <div className="aspect-video w-full bg-neutral-900 rounded flex flex-col items-center justify-center text-slate-400 border border-neutral-800 relative overflow-hidden">
                                <Building2 className="w-10 h-10 mb-2 opacity-40 text-blue-400" />
                                <span className="text-xs font-mono text-slate-300">
                                    FRAME REKAMAN CCTV: {selectedRecord.camera}
                                </span>
                                <span className="text-[10px] text-slate-500 mt-0.5">
                                    Objek: Deteksi Gestur Merokok ({selectedRecord.confidence} Confidence)
                                </span>
                                <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                                    TIMESTAMP: {selectedRecord.time}
                                </div>
                            </div>
                        </div>

                        {/* Rincian Berkas */}
                        <div className="space-y-2 text-xs border-t border-slate-100 dark:border-neutral-800 pt-3">
                            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-neutral-800/60">
                                <span className="text-slate-500">Terduga Mahasiswa:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {selectedRecord.studentName} ({selectedRecord.studentId})
                                </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-neutral-800/60">
                                <span className="text-slate-500">Status Saat Ini:</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {selectedRecord.statusLabel}
                                </span>
                            </div>
                            <div className="py-1">
                                <span className="text-slate-500 block mb-1">Catatan Laboran:</span>
                                <p className="p-2.5 rounded-lg bg-slate-50 dark:bg-neutral-800 text-slate-700 dark:text-slate-300">
                                    {selectedRecord.notes}
                                </p>
                            </div>
                        </div>

                        {/* Tombol Aksi Verifikasi Laboran */}
                        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-neutral-800 flex flex-wrap gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => handleVerifyAction(selectedRecord, "reject")}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                            >
                                Tolak (False Positive)
                            </button>
                            <button
                                type="button"
                                onClick={() => handleVerifyAction(selectedRecord, "sp1")}
                                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                            >
                                Terbitkan SP-1
                            </button>
                            <button
                                type="button"
                                onClick={() => handleVerifyAction(selectedRecord, "sp2")}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                            >
                                Terbitkan SP-2
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
