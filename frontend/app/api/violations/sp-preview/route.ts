import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateHtmlSp } from "@/utils/htmlSpGenerator";
import { generateSpNumber, SpStudentData } from "@/utils/spGenerator";

export const dynamic = "force-dynamic";

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables are missing.");
    }
    return createClient(supabaseUrl, supabaseKey);
}

// GET /api/violations/sp-preview?id=<violation_id>&print=1
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const violationId = searchParams.get("id") || searchParams.get("violation_id");
        const autoPrint = searchParams.get("print") === "1" || searchParams.get("print") === "true";

        if (!violationId) {
            return new NextResponse(
                "Parameter 'id' pelanggaran wajib disertakan (contoh: /api/violations/sp-preview?id=xxx)",
                { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } }
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
            return new NextResponse(
                `Berkas pelanggaran dengan ID '${violationId}' tidak ditemukan di database.`,
                { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } }
            );
        }

        // 2. Ambil data mahasiswa dari tabel `students`
        let studentData: SpStudentData = {
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

        // 3. Pastikan SP Number ada
        let spNumber = violation.sp_number;
        if (!spNumber) {
            spNumber = generateSpNumber(violation.id, violation.created_at);
            // Update nomor SP ke database secara asinkron
            await supabase
                .from("violations")
                .update({ sp_number: spNumber })
                .eq("id", violation.id);
            violation.sp_number = spNumber;
        }

        // 4. Generate HTML dengan template
        const renderedHtml = await generateHtmlSp(
            {
                id: violation.id,
                created_at: violation.created_at,
                location: violation.location,
                evidence_image_url: violation.evidence_image_url,
                confidence_smoking: violation.confidence_smoking,
                face_similarity: violation.face_similarity,
                sp_number: spNumber,
            },
            studentData,
            { autoPrint }
        );

        return new NextResponse(renderedHtml, {
            status: 200,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "no-store, max-age=0",
            },
        });
    } catch (err: unknown) {
        console.error("GET /api/violations/sp-preview error:", err);
        const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan server.";
        return new NextResponse(`Gagal memuat Surat Peringatan: ${errorMsg}`, {
            status: 500,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    }
}
