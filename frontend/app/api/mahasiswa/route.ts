import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables are missing.");
    }
    return createClient(supabaseUrl, supabaseKey);
}

// GET /api/mahasiswa?search=...&limit=...
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search")?.trim() || "";
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        const supabase = getSupabaseClient();
        let query = supabase
            .from("mahasiswa")
            .select("nim, nama_lengkap, jurusan, fakultas, email")
            .limit(limit);

        if (search) {
            query = query.or(`nim.ilike.%${search}%,nama_lengkap.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: data || [],
        });
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan server.";
        return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
    }
}
