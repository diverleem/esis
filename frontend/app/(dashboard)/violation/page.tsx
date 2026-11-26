"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
    Search, 
    CheckCircle2, 
    Eye, 
    Building2, 
    X, 
    Plus, 
    UploadCloud, 
    Loader2, 
    MapPin, 
    User, 
    FileText, 
    Check, 
    ExternalLink,
    Camera,
    Trash2,
    RefreshCw,
    AlertCircle
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
    studentDepartment?: string;
    studentEmail?: string;
    status: "pending" | "verified" | "verified_sp1" | "verified_sp2" | "verified_staff" | "rejected";
    statusLabel: string;
    notes: string;
    evidence_image_url?: string;
    verifiedBy?: string;
    verifiedAt?: string;
}

interface ApiViolation {
    id: string;
    created_at: string;
    location: string;
    location_group?: string;
    confidence_smoking?: number | null;
    face_similarity?: number | null;
    student_name: string;
    student_id?: string | null;
    student_department?: string | null;
    student_email?: string | null;
    status: "pending" | "verified" | "verified_sp1" | "verified_sp2" | "verified_staff" | "rejected";
    notes?: string | null;
    evidence_image_url?: string;
    verified_by?: string | null;
    verified_at?: string | null;
}

const statusMap: Record<string, string> = {
    pending: "Menunggu Verifikasi",
    verified: "Terverifikasi",
    verified_staff: "Terverifikasi",
    verified_sp1: "Terverifikasi",
    verified_sp2: "Terverifikasi",
    rejected: "Ditolak",
};

const initialViolations: ViolationRecord[] = [
    {
        id: "PLG-202610-001",
        date: "13 Okt 2026",
        time: "10:14 WIB",
        location: "Lab Programming (Lt. 5)",
        camera: "CAM_03",
        confidence: "94%",
        studentName: "Fulan A. Pratama",
        studentId: "2021081023",
        status: "pending",
        statusLabel: "Menunggu Verifikasi",
        notes: "Terdeteksi aktivitas merokok di deretan meja belakang lab.",
    },
    {
        id: "PLG-202610-002",
        date: "13 Okt 2026",
        time: "08:45 WIB",
        location: "Lab Sistem Digital (Lt. 5)",
        camera: "CAM_01",
        confidence: "92%",
        studentName: "Ahmad R. Fauzi",
        studentId: "2022081045",
        status: "verified",
        statusLabel: "Terverifikasi",
        notes: "Terbukti merokok di ruang praktikum hardware.",
        verifiedBy: "Admin",
    },
    {
        id: "PLG-202610-003",
        date: "12 Okt 2026",
        time: "15:20 WIB",
        location: "Lab Jaringan Komputer (Lt. 6)",
        camera: "CAM_06",
        confidence: "88%",
        studentName: "Budi Santoso",
        studentId: "2020081012",
        status: "verified",
        statusLabel: "Terverifikasi",
        notes: "Pelanggaran di area server jaringan.",
        verifiedBy: "Admin",
    },
    {
        id: "PLG-202610-004",
        date: "12 Okt 2026",
        time: "11:05 WIB",
        location: "Lab Multimedia 2 (Lt. 6)",
        camera: "CAM_08",
        confidence: "64%",
        studentName: "Tidak Teridentifikasi",
        studentId: "-",
        status: "rejected",
        statusLabel: "Ditolak",
        notes: "Objek terdeteksi merupakan solder kerja elektronik.",
        verifiedBy: "Admin",
    },
    {
        id: "PLG-202610-005",
        date: "11 Okt 2026",
        time: "14:10 WIB",
        location: "Lorong Lantai 5",
        camera: "Temuan Lapangan",
        confidence: "Temuan Lapangan",
        studentName: "Dimas Saputra",
        studentId: "2021081099",
        status: "verified_staff",
        statusLabel: "Terverifikasi",
        notes: "Ditemukan merokok di area lorong gedung.",
        verifiedBy: "Petugas",
    }
];

const PREDEFINED_LOCATIONS = [
    "Lab Riset Lantai 5",
    "Lab Sistem Digital (Lt. 5)",
    "Lab Programming (Lt. 5)",
    "Lab Sistem Operasi (Lt. 5)",
    "Lab Jaringan Komputer (Lt. 6)",
    "Lab Multimedia 1 (Lt. 6)",
    "Lab Multimedia 2 (Lt. 6)",
    "Lorong Lantai 5",
    "Lorong Lantai 6",
    "Balkon Lantai 5",
    "Lobby Lantai 6",
    "Lainnya (Tulis Manual)",
];

const isVerified = (status: string) => 
    status === "verified" || status === "verified_staff" || status === "verified_sp1" || status === "verified_sp2";

export default function ViolationPage() {
    const [records, setRecords] = useState<ViolationRecord[]>([]);
    const [currentUser, setCurrentUser] = useState<{ id: string; username: string; role: string; name?: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedRecord, setSelectedRecord] = useState<ViolationRecord | null>(null);
    const [adminNotes, setAdminNotes] = useState("");

    // Modal Tambah Pelanggaran Manual (Hanya Role Staff)
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgressText, setUploadProgressText] = useState("");

    // Form inputs
    const [formNIM, setFormNIM] = useState("");
    const [formStudentName, setFormStudentName] = useState("");
    const [formDepartment, setFormDepartment] = useState("");
    const [formLocationOption, setFormLocationOption] = useState("Lab Riset Lantai 5");
    const [formCustomLocation, setFormCustomLocation] = useState("");
    const [formNotes, setFormNotes] = useState("");

    // State Bukti Foto: MAKSIMAL 1 GAMBAR
    const [formImageFile, setFormImageFile] = useState<File | null>(null);
    const [formImagePreview, setFormImagePreview] = useState<string | null>(null);

    // State Kamera Langsung (getUserMedia)
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Auto-complete Mahasiswa State
    const [studentSuggestions, setStudentSuggestions] = useState<Array<{ nim: string; nama_lengkap: string; jurusan: string }>>([]);
    const [isSearchingStudent, setIsSearchingStudent] = useState(false);

    // Role checks
    const isAdmin = currentUser?.role === "admin" || currentUser?.role === "superadmin";
    const isStaff = currentUser?.role === "staff";

    // Load user login
    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.authenticated && data?.user) {
                    setCurrentUser(data.user);
                }
            })
            .catch(() => {});
    }, []);

    // Load data violations from API
    const loadViolations = useCallback(() => {
        fetch("/api/violations")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.success && Array.isArray(data.violations)) {
                    const mapped: ViolationRecord[] = data.violations.map((v: ApiViolation) => {
                        const dt = new Date(v.created_at);
                        const dateStr = dt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
                        const timeStr = dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
                        
                        let confLabel = "AI Detected";
                        if (v.status === "verified_staff") {
                            confLabel = "Temuan Lapangan";
                        } else if (v.confidence_smoking != null) {
                            confLabel = `${Math.round(v.confidence_smoking * 100)}%`;
                        }

                        return {
                            id: v.id,
                            date: dateStr,
                            time: timeStr,
                            location: v.location,
                            camera: v.location_group || "Gedung PLT",
                            confidence: confLabel,
                            studentName: v.student_name,
                            studentId: v.student_id || "-",
                            studentDepartment: v.student_department || undefined,
                            studentEmail: v.student_email || undefined,
                            status: v.status,
                            statusLabel: statusMap[v.status] || v.status,
                            notes: v.notes || "-",
                            evidence_image_url: v.evidence_image_url,
                            verifiedBy: v.verified_by || undefined,
                            verifiedAt: v.verified_at ? new Date(v.verified_at).toLocaleString("id-ID") : undefined,
                        };
                    });
                    setRecords(mapped);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        loadViolations();
        const interval = setInterval(loadViolations, 4000);
        return () => clearInterval(interval);
    }, [loadViolations]);

    // Menghentikan stream kamera perangkat
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
    }, []);

    // Membuka kamera perangkat langsung
    const startCamera = async () => {
        setCameraError(null);
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error("Perangkat atau browser tidak mendukung fitur akses kamera langsung.");
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });
            streamRef.current = stream;
            setIsCameraActive(true);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Tidak dapat mengakses kamera.";
            setCameraError(
                errorMsg.includes("Permission") || errorMsg.includes("NotAllowed")
                    ? "Akses kamera ditolak. Harap izinkan akses kamera di peramban Anda."
                    : errorMsg
            );
        }
    };

    // Sambungkan video stream saat state kamera aktif berubah
    useEffect(() => {
        if (isCameraActive && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(() => {});
        }
    }, [isCameraActive]);

    const handleCloseModal = () => {
        stopCamera();
        setCameraError(null);
        setIsManualModalOpen(false);
    };

    // Bersihkan track media saat komponen di-unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        };
    }, []);

    // Mengambil foto snapshot dari video feed kamera (1 foto maksimal)
    const handleCapturePhoto = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) return;
            const now = Date.now();
            const file = new File([blob], `bukti_kamera_${now}.jpg`, { type: "image/jpeg" });
            
            // Simpan HANYA 1 foto (menggantikan foto lama jika ada)
            setFormImageFile(file);
            setFormImagePreview(URL.createObjectURL(blob));
            stopCamera();
        }, "image/jpeg", 0.85);
    };

    // Handler upload file gambar dari galeri/folder (maksimal 1 file saja)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Hanya ambil 1 file pertama
        if (file) {
            setFormImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setFormImagePreview(previewUrl);
            stopCamera();
        }
        e.target.value = "";
    };

    // Hapus foto yang sudah dipilih/diambil
    const handleRemovePhoto = () => {
        setFormImageFile(null);
        if (formImagePreview) {
            URL.revokeObjectURL(formImagePreview);
            setFormImagePreview(null);
        }
    };

    // Pencarian Mahasiswa untuk autocomplete Form Staff
    const handleSearchMahasiswa = (query: string) => {
        setFormNIM(query);
        if (!query.trim() || query.trim().length < 2) {
            setStudentSuggestions([]);
            return;
        }

        setIsSearchingStudent(true);
        fetch(`/api/mahasiswa?search=${encodeURIComponent(query.trim())}&limit=5`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.success && Array.isArray(data.data)) {
                    setStudentSuggestions(data.data);
                } else {
                    setStudentSuggestions([]);
                }
            })
            .catch(() => {
                setStudentSuggestions([]);
            })
            .finally(() => {
                setIsSearchingStudent(false);
            });
    };

    const handleSelectStudent = (student: { nim: string; nama_lengkap: string; jurusan: string }) => {
        setFormNIM(student.nim);
        setFormStudentName(student.nama_lengkap);
        setFormDepartment(student.jurusan || "");
        setStudentSuggestions([]);
    };

    // Submit Laporan Pelanggaran Manual (Staff)
    const handleSubmitManual = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalLocation = formLocationOption === "Lainnya (Tulis Manual)" 
            ? formCustomLocation.trim() 
            : formLocationOption;

        if (!finalLocation) {
            alert("Pilih atau tuliskan lokasi kejadian.");
            return;
        }

        if (!formStudentName.trim()) {
            alert("Nama mahasiswa wajib diisi.");
            return;
        }

        if (!formImageFile) {
            alert("Harap ambil atau lampirkan 1 foto bukti kejadian.");
            return;
        }

        setIsSubmitting(true);
        setUploadProgressText("Mengunggah foto bukti ke Cloudflare R2...");

        try {
            // 1. Upload foto bukti ke Cloudflare R2
            const uploadFormData = new FormData();
            uploadFormData.append("file", formImageFile);
            uploadFormData.append("location", finalLocation);

            const uploadRes = await fetch("/api/violations/upload", {
                method: "POST",
                body: uploadFormData,
            });

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok || !uploadData.success || !uploadData.url) {
                throw new Error(uploadData.message || "Gagal mengunggah foto bukti ke Cloudflare R2.");
            }

            const imageUrl = uploadData.url;

            // 2. Simpan record pelanggaran dengan status langsung 'verified_staff'
            setUploadProgressText("Menyimpan data pelanggaran...");

            const staffReporterName = currentUser?.name || currentUser?.username || "Petugas";

            const postPayload = {
                location: finalLocation,
                location_group: finalLocation.includes("5") ? "Lantai 5" : finalLocation.includes("6") ? "Lantai 6" : "Gedung PLT",
                evidence_image_url: imageUrl,
                student_id: formNIM.trim() || undefined,
                student_name: formStudentName.trim(),
                student_department: formDepartment.trim() || undefined,
                status: "verified_staff",
                notes: formNotes.trim() || "Ditemukan langsung di lokasi.",
                verified_by: staffReporterName,
            };

            const violationRes = await fetch("/api/violations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postPayload),
            });

            const violationData = await violationRes.json();
            if (!violationRes.ok || !violationData.success) {
                throw new Error(violationData.message || "Gagal menyimpan data pelanggaran.");
            }

            // Reset form
            setFormNIM("");
            setFormStudentName("");
            setFormDepartment("");
            setFormLocationOption("Lab Riset Lantai 5");
            setFormCustomLocation("");
            setFormNotes("");
            handleRemovePhoto();
            handleCloseModal();

            // Refresh tabel
            loadViolations();
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses laporan.";
            alert(`Gagal: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
            setUploadProgressText("");
        }
    };

    // Evaluasi Admin (Hanya ACC atau Tolak)
    const handleVerifyAction = async (record: ViolationRecord, action: "acc" | "reject") => {
        const nextStatus = action === "acc" ? "verified" : "rejected";
        const adminName = currentUser?.name || currentUser?.username || "Admin";
        const finalNotes = adminNotes.trim();

        try {
            await fetch("/api/violations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: record.id,
                    status: nextStatus,
                    verified_by: adminName,
                    notes: finalNotes,
                }),
            });
        } catch {
            // fallback offline
        }

        setRecords(prev => prev.map(r => {
            if (r.id === record.id) {
                return {
                    ...r,
                    status: nextStatus,
                    statusLabel: nextStatus === "verified" ? "Terverifikasi" : "Ditolak",
                    verifiedBy: adminName,
                    notes: finalNotes || "-",
                };
            }
            return r;
        }));
        setSelectedRecord(null);
        setAdminNotes("");
    };

    // FILTER ATURAN VISIBILITAS:
    // Jika role Staff: HANYA melihat pelanggaran yang telah terverifikasi.
    // Jika role Admin / Superadmin: Melihat semua pelanggaran (pending, terverifikasi, ditolak).
    const baseRecords = isStaff 
        ? records.filter((r) => isVerified(r.status))
        : records;

    const filteredRecords = baseRecords.filter((item) => {
        const matchesSearch = 
            item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.studentName && item.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.studentId && item.studentId.includes(searchQuery));

        if (!matchesSearch) return false;
        if (selectedStatus === "all") return true;
        if (selectedStatus === "verified") return isVerified(item.status);
        return item.status === selectedStatus;
    });

    const pendingCount = records.filter(r => r.status === "pending").length;
    const verifiedCount = records.filter(r => isVerified(r.status)).length;
    const rejectedCount = records.filter(r => r.status === "rejected").length;

    return (
        <div className="space-y-5">
            {/* Header Halaman */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Catatan Pelanggaran KTR
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {isStaff 
                                ? "Daftar pelanggaran kawasan tanpa rokok yang telah diverifikasi." 
                                : "Pemantauan aktivitas merokok, verifikasi rekaman, dan penertiban berkas."}
                        </p>
                    </div>

                    {/* Tombol Tambah Pelanggaran Manual: HANYA UNTUK ROLE STAFF */}
                    {isStaff && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setIsManualModalOpen(true)}
                                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>+ Tambah Pelanggaran Manual</span>
                            </button>
                        </div>
                    )}
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
                            placeholder="Cari berdasarkan No. Berkas, Nama, NIM, atau Lokasi..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-blue-600 transition-all"
                        />
                    </div>

                    {/* Filter Status: Admin melihat semua tab, Staff hanya melihat tab terverifikasi */}
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
                            Semua ({baseRecords.length})
                        </button>

                        {/* Tab Menunggu Verifikasi & Ditolak HANYA muncul untuk Admin */}
                        {isAdmin && (
                            <button
                                type="button"
                                onClick={() => setSelectedStatus("pending")}
                                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                    selectedStatus === "pending"
                                        ? "bg-amber-600 text-white font-semibold"
                                        : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                }`}
                            >
                                Menunggu Verifikasi ({pendingCount})
                            </button>
                        )}

                        {isAdmin && (
                            <button
                                type="button"
                                onClick={() => setSelectedStatus("verified")}
                                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                    selectedStatus === "verified"
                                        ? "bg-emerald-600 text-white font-semibold"
                                        : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                }`}
                            >
                                Terverifikasi ({verifiedCount})
                            </button>
                        )}

                        {isAdmin && (
                            <button
                                type="button"
                                onClick={() => setSelectedStatus("rejected")}
                                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                    selectedStatus === "rejected"
                                        ? "bg-slate-600 text-white font-semibold"
                                        : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                }`}
                            >
                                Ditolak ({rejectedCount})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabel Data Berkas Pelanggaran */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xs">
                {filteredRecords.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                        <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Tidak Ada Data Pelanggaran
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                            {isStaff 
                                ? "Belum ada catatan pelanggaran yang terverifikasi." 
                                : "Sesuaikan kata kunci pencarian atau filter status untuk melihat data lain."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-1 sm:mx-0">
                        <table className="w-full text-left text-xs min-w-[720px]">
                            <thead className="bg-slate-50 dark:bg-neutral-800/60 border-b border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-300 font-semibold">
                                <tr>
                                    <th className="py-3 px-4">No. Berkas</th>
                                    <th className="py-3 px-3">Waktu & Tanggal</th>
                                    <th className="py-3 px-3">Lokasi Kejadian</th>
                                    <th className="py-3 px-3">Keterangan Sumber</th>
                                    <th className="py-3 px-3">Identitas Pelanggar</th>
                                    <th className="py-3 px-3">Status</th>
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
                                            <span className="text-[10px] text-slate-400">{item.camera}</span>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <span className="font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-neutral-800 px-2 py-0.5 rounded border border-slate-200 dark:border-neutral-700">
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
                                                    : isVerified(item.status)
                                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                    : "bg-slate-200 text-slate-700 dark:bg-neutral-800 dark:text-slate-400"
                                            }`}>
                                                {isVerified(item.status) && <Check className="w-3 h-3 mr-1 shrink-0" />}
                                                {item.statusLabel}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedRecord(item);
                                                    setAdminNotes(item.status === "pending" ? "" : (item.notes !== "-" ? item.notes : ""));
                                                }}
                                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium text-xs transition-colors border border-slate-200 dark:border-neutral-700 inline-flex items-center space-x-1"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>Detail</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Detail Berkas & Aksi Evaluasi Admin */}
            {selectedRecord && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 my-auto">
                        <button
                            type="button"
                            aria-label="Tutup modal"
                            onClick={() => setSelectedRecord(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-4">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Berkas {selectedRecord.id}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {selectedRecord.location} • {selectedRecord.date} {selectedRecord.time}
                            </p>
                        </div>

                        {/* Snapshot Bukti Foto */}
                        <div className="bg-neutral-950 rounded-lg p-2 text-center border border-neutral-800 mb-4">
                            <div className="aspect-video w-full bg-neutral-900 rounded flex flex-col items-center justify-center text-slate-400 border border-neutral-800 relative overflow-hidden group">
                                {selectedRecord.evidence_image_url ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={selectedRecord.evidence_image_url}
                                            alt="Bukti Pelanggaran"
                                            className="w-full h-full object-contain bg-black/90"
                                        />
                                        <a
                                            href={selectedRecord.evidence_image_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/75 hover:bg-black text-white text-[10px] rounded inline-flex items-center space-x-1 transition-all opacity-80 group-hover:opacity-100"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            <span>Lihat Gambar Penuh</span>
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <Building2 className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
                                        <span className="text-xs font-mono text-slate-300">
                                            {selectedRecord.camera}
                                        </span>
                                    </>
                                )}
                                <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                                    {selectedRecord.time}
                                </div>
                            </div>
                        </div>

                        {/* Rincian Berkas */}
                        <div className="space-y-2 text-xs border-t border-slate-100 dark:border-neutral-800 pt-3">
                            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-neutral-800/60">
                                <span className="text-slate-500">Pelanggar:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {selectedRecord.studentName} ({selectedRecord.studentId})
                                    {selectedRecord.studentDepartment ? ` • ${selectedRecord.studentDepartment}` : ""}
                                </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-neutral-800/60">
                                <span className="text-slate-500">Status:</span>
                                <span className={`font-semibold ${
                                    isVerified(selectedRecord.status)
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : selectedRecord.status === "pending"
                                        ? "text-amber-600 dark:text-amber-400"
                                        : "text-slate-600 dark:text-slate-400"
                                }`}>
                                    {selectedRecord.statusLabel}
                                </span>
                            </div>
                            {selectedRecord.verifiedBy && (
                                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-neutral-800/60">
                                    <span className="text-slate-500">Diverifikasi Oleh:</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200">
                                        {selectedRecord.verifiedBy}
                                    </span>
                                </div>
                            )}
                            <div className="py-1">
                                <label className="text-slate-500 font-medium block mb-1 flex items-center justify-between">
                                    <span>Catatan:</span>
                                    {isAdmin && selectedRecord.status === "pending" && (
                                        <span className="text-[10px] text-slate-400 font-normal">
                                            (Dikosongkan dari AI — Anda dapat mengisi catatan sebelum validasi atau tolak)
                                        </span>
                                    )}
                                </label>
                                {isAdmin && selectedRecord.status === "pending" ? (
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Tulis catatan evaluasi di sini (opsional)..."
                                        rows={3}
                                        className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 text-xs outline-none focus:border-blue-600 transition-all resize-none"
                                    />
                                ) : (
                                    <p className="p-2.5 rounded-lg bg-slate-50 dark:bg-neutral-800 text-slate-700 dark:text-slate-300">
                                        {selectedRecord.notes || "-"}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Area Aksi Evaluasi */}
                        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                            {/* Tombol Evaluasi (HANYA MUNCUL JIKA ADMIN & STATUS PENDING) */}
                            {isAdmin && selectedRecord.status === "pending" ? (
                                <>
                                    <span className="text-[11px] text-slate-400">
                                        Evaluasi Berkas
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleVerifyAction(selectedRecord, "reject")}
                                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                                        >
                                            Tolak
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleVerifyAction(selectedRecord, "acc")}
                                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                                        >
                                            ACC Pelanggaran
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRecord(null)}
                                        className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Input Pelanggaran Manual (Khusus Role Staff) */}
            {isStaff && isManualModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 my-auto">
                        <button
                            type="button"
                            aria-label="Tutup modal"
                            disabled={isSubmitting}
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-4">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Tambah Pelanggaran Manual
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Catat temuan pelanggaran langsung di area kampus.
                            </p>
                        </div>

                        <form onSubmit={handleSubmitManual} className="space-y-4 text-xs">
                            {/* Data Diri Pelanggar */}
                            <div className="space-y-3 bg-slate-50 dark:bg-neutral-800/60 p-3.5 rounded-lg border border-slate-200 dark:border-neutral-700">
                                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Identitas Mahasiswa</span>
                                </span>

                                {/* Input NIM & Auto-suggest */}
                                <div className="relative">
                                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        NIM Mahasiswa
                                    </label>
                                    <input
                                        type="text"
                                        value={formNIM}
                                        onChange={(e) => handleSearchMahasiswa(e.target.value)}
                                        placeholder="Ketik NIM untuk mencari..."
                                        className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg outline-none focus:border-blue-600 text-slate-800 dark:text-slate-200 text-xs"
                                    />
                                    {isSearchingStudent && (
                                        <div className="absolute right-3 top-7">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                                        </div>
                                    )}

                                    {/* Hasil Pencarian Mahasiswa Dropdown */}
                                    {studentSuggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg shadow-lg z-20 max-h-44 overflow-y-auto">
                                            {studentSuggestions.map((s) => (
                                                <button
                                                    key={s.nim}
                                                    type="button"
                                                    onClick={() => handleSelectStudent(s)}
                                                    className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/40 border-b border-slate-100 dark:border-neutral-700/60 last:border-b-0 transition-colors"
                                                >
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{s.nama_lengkap}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">NIM: {s.nim} • {s.jurusan}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Nama Lengkap */}
                                <div>
                                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Nama Lengkap <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formStudentName}
                                        onChange={(e) => setFormStudentName(e.target.value)}
                                        placeholder="Nama mahasiswa"
                                        className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg outline-none focus:border-blue-600 text-slate-800 dark:text-slate-200 text-xs"
                                    />
                                </div>

                                {/* Program Studi */}
                                <div>
                                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Program Studi
                                    </label>
                                    <input
                                        type="text"
                                        value={formDepartment}
                                        onChange={(e) => setFormDepartment(e.target.value)}
                                        placeholder="Contoh: Teknik Informatika"
                                        className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg outline-none focus:border-blue-600 text-slate-800 dark:text-slate-200 text-xs"
                                    />
                                </div>
                            </div>

                            {/* Lokasi Kejadian */}
                            <div>
                                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Lokasi Kejadian <span className="text-rose-500">*</span></span>
                                </label>
                                <select
                                    value={formLocationOption}
                                    onChange={(e) => setFormLocationOption(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg outline-none focus:border-blue-600 text-slate-800 dark:text-slate-200 text-xs"
                                >
                                    {PREDEFINED_LOCATIONS.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>

                                {formLocationOption === "Lainnya (Tulis Manual)" && (
                                    <input
                                        type="text"
                                        required
                                        value={formCustomLocation}
                                        onChange={(e) => setFormCustomLocation(e.target.value)}
                                        placeholder="Tuliskan nama area atau lokasi..."
                                        className="w-full mt-2 px-3 py-2 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg outline-none focus:border-blue-600 text-slate-800 dark:text-slate-200 text-xs"
                                    />
                                )}
                            </div>

                            {/* Foto Bukti Kejadian (Buka Kamera Langsung / Upload - MAKSIMAL 1 GAMBAR) */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Foto Bukti Kejadian <span className="text-rose-500">*</span></span>
                                    </label>
                                    <span className="text-[10px] text-slate-400">
                                        Maksimal 1 foto
                                    </span>
                                </div>

                                {/* Hidden native file input (dengan capture environment untuk kamera bawaan smartphone) */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {/* KONDISI 1: Kamera Sedang Aktif (Live Feed Video) */}
                                {isCameraActive ? (
                                    <div className="border border-slate-200 dark:border-neutral-700 rounded-lg p-3 bg-neutral-950 text-center space-y-3">
                                        <div className="relative aspect-video w-full max-h-60 rounded overflow-hidden bg-black flex items-center justify-center">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Bingkai Bidik */}
                                            <div className="absolute inset-4 border border-dashed border-white/40 rounded pointer-events-none" />
                                            <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                                                KAMERA AKTIF
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={stopCamera}
                                                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-slate-300 text-xs rounded-lg transition-colors"
                                            >
                                                Tutup Kamera
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCapturePhoto}
                                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg inline-flex items-center space-x-1.5 shadow-sm transition-colors active:scale-95"
                                            >
                                                <Camera className="w-3.5 h-3.5" />
                                                <span>Ambil Foto</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : formImagePreview ? (
                                    /* KONDISI 2: 1 Foto Sudah Terpilih / Terambil */
                                    <div className="border border-slate-200 dark:border-neutral-700 rounded-lg p-3 bg-slate-50 dark:bg-neutral-800/40 space-y-2.5">
                                        <div className="relative max-h-48 rounded overflow-hidden border border-slate-200 dark:border-neutral-700 bg-black/90 flex items-center justify-center">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={formImagePreview}
                                                alt="Foto Bukti Terpilih"
                                                className="max-h-48 w-auto object-contain"
                                            />
                                            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-medium shadow">
                                                1 Foto Bukti Terpasang
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-neutral-700/60">
                                            <span className="truncate max-w-[200px] font-mono text-[10px]">
                                                {formImageFile?.name || "bukti_foto.jpg"}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={startCamera}
                                                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                                                >
                                                    <RefreshCw className="w-3 h-3" />
                                                    <span>Ambil Ulang</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleRemovePhoto}
                                                    className="inline-flex items-center space-x-1 text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium ml-2"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    <span>Hapus</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* KONDISI 3: Belum Ada Foto (Pilihan Buka Kamera atau Pilih File) */
                                    <div className="border-2 border-dashed border-slate-200 dark:border-neutral-700 rounded-lg p-4 text-center bg-slate-50 dark:bg-neutral-800/40 space-y-3">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Camera className="w-8 h-8 text-slate-400 mb-1" />
                                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                                Ambil foto langsung atau unggah 1 gambar bukti
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                Format JPG/PNG (maksimal 1 foto untuk efisiensi penyimpanan & surat peringatan)
                                            </p>
                                        </div>

                                        {cameraError && (
                                            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                <span>{cameraError}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-center gap-2 pt-1">
                                            <button
                                                type="button"
                                                onClick={startCamera}
                                                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors shadow-2xs"
                                            >
                                                <Camera className="w-3.5 h-3.5" />
                                                <span>Buka Kamera</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors"
                                            >
                                                <UploadCloud className="w-3.5 h-3.5" />
                                                <span>Pilih File</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Catatan */}
                            <div>
                                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Keterangan Kejadian</span>
                                </label>
                                <textarea
                                    rows={2}
                                    value={formNotes}
                                    onChange={(e) => setFormNotes(e.target.value)}
                                    placeholder="Keterangan singkat temuan di lokasi..."
                                    className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg outline-none focus:border-blue-600 text-slate-800 dark:text-slate-200 text-xs resize-none"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium text-xs transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors inline-flex items-center space-x-1.5 shadow-2xs disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>{uploadProgressText || "Menyimpan..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Simpan Pelanggaran</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
