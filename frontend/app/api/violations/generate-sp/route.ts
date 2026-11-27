import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateSpPdf, generateSpNumber } from "@/utils/spGenerator";
import { uploadToR2 } from "@/utils/r2";

export const dynamic = "force-dynamic";

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables are missing.");
    }
    return createClient(supabaseUrl, supabaseKey);
}

// POST /api/violations/generate-sp
// Body: { violation_id: string }
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const violationId = body.violation_id || body.id;

        if (!violationId) {
            return NextResponse.json(
                { success: false, message: "Field 'violation_id' wajib diisi." },
                { status: 400 }
            );
        }

        const supabase = getSupabaseClient();

        // 1. Ambil data pelanggaran
        const { data: violation, error: vError } = await supabase
            .from("violations")
            .select("*")
            .eq("id", violationId)
            .single();

        if (vError || !violation) {
            return NextResponse.json(
                { success: false, message: `Berkas pelanggaran '${violationId}' tidak ditemukan.` },
                { status: 404 }
            );
        }

        // 2. Ambil data mahasiswa dari tabel `students`
        let studentData = {
            full_name: violation.student_name || "Mahasiswa",
            student_id: violation.student_id || "-",
            department: violation.student_department || "Teknik Informatika",
            faculty: "Fakultas Sains dan Teknologi",
            entry_year: 2021,
            gender: "L",
            email: violation.student_email || "-",
        };

        if (violation.student_id) {
            const { data: student } = await supabase
                .from("students")
                .select("*")
                .eq("student_id", violation.student_id)
                .maybeSingle();

            if (student) {
                studentData = {
                    full_name: student.full_name || studentData.full_name,
                    student_id: student.student_id || studentData.student_id,
                    department: student.department || studentData.department,
                    faculty: student.faculty || studentData.faculty,
                    entry_year: student.entry_year || studentData.entry_year,
                    gender: student.gender || studentData.gender,
                    email: student.email || studentData.email,
                };
            }
        } else if (violation.student_name && !violation.student_name.includes("Tidak Dikenal")) {
            const { data: student } = await supabase
                .from("students")
                .select("*")
                .ilike("full_name", `%${violation.student_name}%`)
                .maybeSingle();

            if (student) {
                studentData = {
                    full_name: student.full_name || studentData.full_name,
                    student_id: student.student_id || studentData.student_id,
                    department: student.department || studentData.department,
                    faculty: student.faculty || studentData.faculty,
                    entry_year: student.entry_year || studentData.entry_year,
                    gender: student.gender || studentData.gender,
                    email: student.email || studentData.email,
                };
            }
        }

        // 3. Tentukan nomor SP
        const spNumber = violation.sp_number || generateSpNumber(violation.id, violation.created_at);

        // 4. Generate PDF
        const pdfBytes = await generateSpPdf(
            {
                id: violation.id,
                created_at: violation.created_at,
                location: violation.location,
                location_group: violation.location_group,
                evidence_image_url: violation.evidence_image_url,
                confidence_smoking: violation.confidence_smoking,
                face_similarity: violation.face_similarity,
                verified_by: violation.verified_by,
                sp_number: spNumber,
            },
            studentData
        );

        // 5. Upload PDF ke Cloudflare R2
        const cleanId = String(violation.id).replace(/[^a-zA-Z0-9_-]/g, "_");
        const filename = `sp_${cleanId}.pdf`;
        const spFileUrl = await uploadToR2(pdfBytes, filename, "application/pdf");

        // 6. Update data violation di Supabase
        const { data: updated, error: updateError } = await supabase
            .from("violations")
            .update({
                sp_number: spNumber,
                sp_file_url: spFileUrl,
            })
            .eq("id", violation.id)
            .select()
            .single();

        if (updateError) {
            console.error("Gagal mengupdate sp_file_url di violations:", updateError);
        }

        return NextResponse.json({
            success: true,
            message: "Surat Peringatan berhasil dibuat dan diunggah ke Cloudflare R2.",
            sp_number: spNumber,
            sp_file_url: spFileUrl,
            violation: updated || violation,
        });
    } catch (err: unknown) {
        console.error("POST /api/violations/generate-sp error:", err);
        const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan server saat membuat Surat Peringatan.";
        return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
    }
}
