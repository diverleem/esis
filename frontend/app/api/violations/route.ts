import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifySession } from "@/utils/auth";

export const dynamic = "force-dynamic";

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables are missing.");
    }
    return createClient(supabaseUrl, supabaseKey);
}

// ---------------------------------------------------------------------------
// GET /api/violations - Mengambil daftar riwayat pelanggaran merokok
// Query Params:
// - status: "all" | "pending" | "verified_sp1" | "verified_sp2" | "rejected"
// - search: kata kunci pencarian (ID, Nama, NIM, atau Lab)
// - limit: jumlah maksimal data (default 100)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "all";
        const search = searchParams.get("search")?.trim() || "";
        const limit = parseInt(searchParams.get("limit") || "100", 10);

        const supabase = getSupabaseClient();
        let query = supabase
            .from("violations")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (status !== "all") {
            query = query.eq("status", status);
        }

        if (search) {
            query = query.or(
                `id.ilike.%${search}%,student_name.ilike.%${search}%,student_id.ilike.%${search}%,location.ilike.%${search}%`
            );
        }

        const { data: violations, error } = await query;

        if (error) {
            console.error("GET /api/violations error:", error);
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            total: violations ? violations.length : 0,
            violations: violations || [],
        });
    } catch (err: unknown) {
        console.error("GET /api/violations server error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan server saat memuat data pelanggaran." },
            { status: 500 }
        );
    }
}

// ---------------------------------------------------------------------------
// POST /api/violations - Menerima laporan deteksi pelanggaran dari AI Server / Postman
// Payload JSON:
// - location: string (wajib, misal "Lab Riset Lantai 5")
// - evidence_image_url: string (wajib, URL foto dari Cloudflare R2)
// - location_group: string (opsional, misal "Lantai 5 Gedung PLT")
// - student_id: string (opsional, NIM)
// - student_name: string (opsional, nama mahasiswa)
// - student_department: string (opsional)
// - student_email: string (opsional)
// - confidence_smoking: number (opsional, rentang 0.0 - 1.0)
// - face_similarity: number (opsional, rentang 0.0 - 1.0)
// - notes: string (opsional)
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
    try {
        let body: Record<string, unknown> = {};
        const contentType = request.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            body = await request.json();
        } else if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
            const formData = await request.formData();
            formData.forEach((val, key) => {
                body[key] = val;
            });
        } else {
            try {
                body = await request.json();
            } catch {
                // jika parsing json gagal
            }
        }

        // Ekstraksi nilai dengan dukungan alias variasi penamaan (case-insensitive / bahasa Indonesia)
        const id = body.id ? String(body.id) : undefined;
        const rawLocation = body.location || body.Location || body.lokasi || body.lab;
        const rawImageUrl = body.evidence_image_url || body.image_url || body.imageUrl || body.evidence_url || body.foto;
        const rawStudentId = body.student_id || body.studentId || body.nim || body.NIM;
        const rawStudentName = body.student_name || body.studentName || body.nama || body.name;
        const rawLocationGroup = body.location_group || body.locationGroup || body.group;
        const rawConfidence = body.confidence_smoking ?? body.confidenceSmoking ?? body.confidence;
        const rawSimilarity = body.face_similarity ?? body.faceSimilarity ?? body.similarity;
        const rawNotes = body.notes || body.catatan || body.keterangan;
        const rawDepartment = body.student_department || body.jurusan || body.prodi;
        const rawEmail = body.student_email || body.email;

        // Validasi field wajib
        if (!rawLocation || !String(rawLocation).trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Field 'location' (lokasi laboratorium) wajib diisi. Pastikan di Postman Anda memilih tab 'Body' -> 'raw' -> format 'JSON'.",
                },
                { status: 400 }
            );
        }

        if (!rawImageUrl || !String(rawImageUrl).trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Field 'evidence_image_url' (URL bukti foto) wajib diisi.",
                },
                { status: 400 }
            );
        }

        const location = String(rawLocation).trim();
        const evidence_image_url = String(rawImageUrl).trim();

        const supabase = getSupabaseClient();

        // Resolusi otomatis data mahasiswa dari tabel `mahasiswa` jika ada NIM / Nama
        let resolvedStudentId = rawStudentId ? String(rawStudentId).trim() : null;
        let resolvedName = rawStudentName ? String(rawStudentName).trim() : "Mahasiswa Tidak Terdaftar";
        let resolvedDepartment = rawDepartment ? String(rawDepartment).trim() : null;
        let resolvedEmail = rawEmail ? String(rawEmail).trim() : null;

        // 1. Jika ada NIM yang dikirim, cari data lengkap di tabel mahasiswa
        if (resolvedStudentId) {
            const { data: student } = await supabase
                .from("mahasiswa")
                .select("nama_lengkap, nim, jurusan, email")
                .eq("nim", resolvedStudentId)
                .maybeSingle();

            if (student) {
                resolvedName = resolvedName !== "Mahasiswa Tidak Terdaftar" ? resolvedName : student.nama_lengkap;
                resolvedDepartment = resolvedDepartment || student.jurusan;
                resolvedEmail = resolvedEmail || student.email;
            }
        }
        // 2. Jika NIM tidak ada tetapi nama dikenali oleh FaceNet, coba cari berdasarkan kemiripan nama
        else if (resolvedName && resolvedName !== "Mahasiswa Tidak Terdaftar" && !resolvedName.includes("Tidak Dikenal")) {
            const { data: student } = await supabase
                .from("mahasiswa")
                .select("nama_lengkap, nim, jurusan, email")
                .ilike("nama_lengkap", `%${resolvedName}%`)
                .maybeSingle();

            if (student) {
                resolvedStudentId = student.nim;
                resolvedName = student.nama_lengkap;
                resolvedDepartment = resolvedDepartment || student.jurusan;
                resolvedEmail = resolvedEmail || student.email;
            }
        }

        // 3. Syarat 3: Cooldown 1 jam untuk pelanggar yang sama
        // Menunda laporan pelanggaran pada pelanggar yang sama selama 1 jam sejak laporan tercatat.
        // Jika laporan sebelumnya sudah di-ACC ('verified', 'verified_sp1', 'verified_sp2', 'verified_staff')
        // atau masih dalam antrean telaah ('pending'), maka laporan baru ditunda agar tidak duplikat.
        // Jika laporan sebelumnya ditolak ('rejected'), maka mahasiswa tetap bisa dilaporkan kembali.
        const bypassCooldown = Boolean(body.bypass_cooldown);
        const isKnownStudent =
            Boolean(resolvedStudentId) ||
            (Boolean(resolvedName) && resolvedName !== "Mahasiswa Tidak Terdaftar" && !resolvedName.includes("Tidak Dikenal"));

        if (!bypassCooldown && isKnownStudent) {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            let cooldownQuery = supabase
                .from("violations")
                .select("id, student_name, student_id, status, created_at, location")
                .gte("created_at", oneHourAgo)
                .in("status", ["pending", "verified", "verified_sp1", "verified_sp2", "verified_staff"])
                .order("created_at", { ascending: false })
                .limit(1);

            if (resolvedStudentId && resolvedName && resolvedName !== "Mahasiswa Tidak Terdaftar") {
                cooldownQuery = cooldownQuery.or(`student_id.eq.${resolvedStudentId},student_name.ilike.%${resolvedName}%`);
            } else if (resolvedStudentId) {
                cooldownQuery = cooldownQuery.eq("student_id", resolvedStudentId);
            } else {
                cooldownQuery = cooldownQuery.ilike("student_name", resolvedName);
            }

            const { data: activeViolations, error: cooldownError } = await cooldownQuery;

            if (!cooldownError && activeViolations && activeViolations.length > 0) {
                const active = activeViolations[0];
                const activeTime = new Date(active.created_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                return NextResponse.json(
                    {
                        success: true,
                        cooldown_active: true,
                        message: `Laporan pelanggaran ditunda (Cooldown 1 Jam Aktif): Mahasiswa "${resolvedName}" telah tercatat pada pukul ${activeTime} WIB di ${active.location} (Status: ${active.status}, ID: ${active.id}). Pelaporan baru diabaikan selama 1 jam.`,
                        existing_violation: active,
                    },
                    { status: 200 }
                );
            }
        }

        // Resolusi default location_group jika tidak dikirim
        let resolvedLocationGroup = rawLocationGroup ? String(rawLocationGroup).trim() : "";
        if (!resolvedLocationGroup) {
            if (location.toLowerCase().includes("5") || location.toLowerCase().includes("lt 5") || location.toLowerCase().includes("lantai 5")) {
                resolvedLocationGroup = "Lantai 5 Gedung PLT";
            } else if (location.toLowerCase().includes("6") || location.toLowerCase().includes("lt 6") || location.toLowerCase().includes("lantai 6")) {
                resolvedLocationGroup = "Lantai 6 Gedung PLT";
            } else {
                resolvedLocationGroup = "Gedung PLT";
            }
        }

        // Buat record pelanggaran baru
        interface ViolationInsertPayload {
            id?: string;
            location: string;
            location_group: string;
            student_id: string | null;
            student_name: string;
            student_department: string | null;
            student_email: string | null;
            confidence_smoking: number | null;
            face_similarity: number | null;
            evidence_image_url: string;
            status: "pending" | "verified" | "verified_sp1" | "verified_sp2" | "verified_staff" | "rejected";
            notes: string;
            verified_by?: string | null;
            verified_at?: string | null;
        }

        const validStatuses = ["pending", "verified", "verified_sp1", "verified_sp2", "verified_staff", "rejected"];
        const customStatus = body.status && validStatuses.includes(String(body.status))
            ? (String(body.status) as ViolationInsertPayload["status"])
            : "pending";

        const newRecord: ViolationInsertPayload = {
            location: String(location).trim(),
            location_group: resolvedLocationGroup,
            student_id: resolvedStudentId,
            student_name: resolvedName,
            student_department: resolvedDepartment,
            student_email: resolvedEmail,
            confidence_smoking: rawConfidence != null ? Number(rawConfidence) : null,
            face_similarity: rawSimilarity != null ? Number(rawSimilarity) : null,
            evidence_image_url: String(evidence_image_url).trim(),
            status: customStatus,
            notes: rawNotes
                ? String(rawNotes).trim()
                : customStatus === "verified_staff"
                  ? "Laporan langsung petugas di lokasi."
                  : "",
            verified_by: customStatus === "verified_staff" ? String(body.verified_by || "Petugas") : null,
            verified_at: customStatus === "verified_staff" ? new Date().toISOString() : null,
        };

        if (id && String(id).trim()) {
            newRecord.id = String(id).trim();
        }

        const { data: inserted, error: insertError } = await supabase
            .from("violations")
            .insert(newRecord)
            .select()
            .single();

        if (insertError) {
            console.error("POST /api/violations insert error:", insertError);
            return NextResponse.json({ success: false, message: insertError.message }, { status: 500 });
        }

        return NextResponse.json(
            {
                success: true,
                message: `Insiden pelanggaran merokok di "${inserted.location}" berhasil dicatat.`,
                violation: inserted,
            },
            { status: 201 }
        );
    } catch (err: unknown) {
        console.error("POST /api/violations server error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan format data atau server error saat menyimpan pelanggaran." },
            { status: 500 }
        );
    }
}

// ---------------------------------------------------------------------------
// PATCH /api/violations - Memperbarui status verifikasi / tindak lanjut berkas SP
// Payload JSON:
// - id: string (wajib, kode berkas misal "PLG-20261124-ABC123")
// - status: "pending" | "verified_sp1" | "verified_sp2" | "rejected" (opsional)
// - notes: string (opsional, catatan laboran)
// - verified_by: string (opsional, nama laboran/admin)
// - sp_number: string (opsional, nomor surat SP resmi)
// - sp_file_url: string (opsional, link PDF)
// ---------------------------------------------------------------------------
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, notes, verified_by, sp_number, sp_file_url } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "ID berkas ('id') wajib disertakan." }, { status: 400 });
        }

        const supabase = getSupabaseClient();

        // Cari record yang ada terlebih dahulu
        const { data: existing, error: findError } = await supabase
            .from("violations")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (findError || !existing) {
            return NextResponse.json(
                { success: false, message: "Berkas pelanggaran tidak ditemukan." },
                { status: 404 }
            );
        }

        // Ambil sesi user jika ada
        const token = request.cookies.get("session_token")?.value;
        const session = token ? await verifySession(token) : null;
        const laboranName = verified_by || session?.name || session?.username || "Admin Laboran";

        interface ViolationUpdatePayload {
            status?: string;
            notes?: string;
            verified_by?: string;
            verified_at?: string;
            sp_number?: string;
            sp_file_url?: string;
        }

        const updateData: ViolationUpdatePayload = {};

        if (status) {
            const validStatuses = ["pending", "verified", "verified_sp1", "verified_sp2", "verified_staff", "rejected"];
            if (!validStatuses.includes(status)) {
                return NextResponse.json(
                    { success: false, message: `Status tidak valid. Pilihan: ${validStatuses.join(", ")}` },
                    { status: 400 }
                );
            }
            updateData.status = status;
            updateData.verified_by = laboranName;
            updateData.verified_at = new Date().toISOString();
        }

        if (notes !== undefined) {
            updateData.notes = notes;
        }

        if (sp_number !== undefined) {
            updateData.sp_number = sp_number;
        }

        if (sp_file_url !== undefined) {
            updateData.sp_file_url = sp_file_url;
        }

        const { data: updated, error: updateError } = await supabase
            .from("violations")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            console.error("PATCH /api/violations update error:", updateError);
            return NextResponse.json({ success: false, message: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Status berkas "${id}" berhasil diperbarui.`,
            violation: updated,
        });
    } catch (err: unknown) {
        console.error("PATCH /api/violations server error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan server saat memperbarui berkas pelanggaran." },
            { status: 500 }
        );
    }
}

// ---------------------------------------------------------------------------
// DELETE /api/violations - Menghapus catatan pelanggaran (contoh: data uji coba)
// Query params: ?id=PLG-xxx
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        let id = searchParams.get("id");

        if (!id) {
            try {
                const body = await request.json();
                id = body.id;
            } catch {
                // jika tidak ada body JSON
            }
        }

        if (!id) {
            return NextResponse.json({ success: false, message: "ID pelanggaran wajib disertakan." }, { status: 400 });
        }

        const supabase = getSupabaseClient();
        const { error: deleteError } = await supabase.from("violations").delete().eq("id", id);

        if (deleteError) {
            return NextResponse.json({ success: false, message: deleteError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Berkas pelanggaran "${id}" berhasil dihapus.`,
        });
    } catch (err: unknown) {
        console.error("DELETE /api/violations error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan server saat menghapus data pelanggaran." },
            { status: 500 }
        );
    }
}
