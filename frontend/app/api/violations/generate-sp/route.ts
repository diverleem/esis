import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateSpNumber } from "@/utils/spGenerator";

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

        // 2. Tentukan nomor SP dan URL preview
        const spNumber = violation.sp_number || generateSpNumber(violation.id, violation.created_at);
        const spFileUrl = `/api/violations/sp-preview?id=${violation.id}`;

        // 3. Update data violation di Supabase
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
