import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/utils/auth";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const DEFAULT_GROUPS = ["Lantai 5 Gedung PLT", "Lantai 6 Gedung PLT"];

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables are missing.");
    }
    return createClient(supabaseUrl, supabaseKey);
}

// GET /api/streaming/groups - Mengambil daftar grouping lokasi
export async function GET() {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from("streaming_groups")
            .select("id, name, created_at")
            .order("id", { ascending: true });

        if (error || !data || data.length === 0) {
            // Fallback default groups
            return NextResponse.json({
                success: true,
                groups: DEFAULT_GROUPS.map((name, i) => ({ id: i + 1, name })),
                is_fallback: true,
            });
        }

        return NextResponse.json({
            success: true,
            groups: data,
            is_fallback: false,
        });
    } catch {
        return NextResponse.json({
            success: true,
            groups: DEFAULT_GROUPS.map((name, i) => ({ id: i + 1, name })),
            is_fallback: true,
        });
    }
}

// POST /api/streaming/groups - Menambah grup lokasi baru (Superadmin)
export async function POST(request: NextRequest) {
    const token = request.cookies.get("session_token")?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "superadmin") {
        return NextResponse.json(
            { success: false, message: "Akses ditolak. Fitur kelola grup khusus role superadmin." },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();
        const { name } = body;

        if (!name || !name.trim()) {
            return NextResponse.json(
                { success: false, message: "Nama grup lokasi tidak boleh kosong." },
                { status: 400 }
            );
        }

        const cleanName = name.trim();
        const supabase = getSupabaseClient();

        // Cek apakah grup dengan nama yang sama sudah ada (case-insensitive)
        const { data: existingGroup } = await supabase
            .from("streaming_groups")
            .select("id, name")
            .ilike("name", cleanName)
            .maybeSingle();

        if (existingGroup) {
            return NextResponse.json(
                { success: false, message: `Grup lokasi "${existingGroup.name}" sudah ada.` },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("streaming_groups")
            .insert({ name: cleanName })
            .select("id, name, created_at")
            .single();

        if (error) {
            if (error.code === "23505") {
                return NextResponse.json(
                    { success: false, message: `Grup lokasi "${cleanName}" sudah ada.` },
                    { status: 400 }
                );
            }
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Grup lokasi "${cleanName}" berhasil ditambahkan.`,
            group: data,
        });
    } catch (err: unknown) {
        console.error("POST /api/streaming/groups error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan pada server saat menambahkan grup." },
            { status: 500 }
        );
    }
}

// DELETE /api/streaming/groups - Menghapus grup lokasi (Superadmin)
export async function DELETE(request: NextRequest) {
    const token = request.cookies.get("session_token")?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "superadmin") {
        return NextResponse.json(
            { success: false, message: "Akses ditolak. Fitur kelola grup khusus role superadmin." },
            { status: 403 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get("name");
        const id = searchParams.get("id");

        if (!name && !id) {
            return NextResponse.json(
                { success: false, message: "ID atau nama grup wajib disertakan." },
                { status: 400 }
            );
        }

        const supabase = getSupabaseClient();

        // Cari grup target terlebih dahulu
        let findQuery = supabase.from("streaming_groups").select("id, name");
        if (id) {
            findQuery = findQuery.eq("id", id);
        } else if (name) {
            findQuery = findQuery.eq("name", name);
        }

        const { data: targetGroup, error: findError } = await findQuery.maybeSingle();

        if (findError) {
            return NextResponse.json({ success: false, message: findError.message }, { status: 500 });
        }

        if (!targetGroup) {
            return NextResponse.json(
                { success: false, message: "Grup lokasi tidak ditemukan." },
                { status: 404 }
            );
        }

        // Cek apakah ada kamera yang saat ini menggunakan grup ini
        const { count } = await supabase
            .from("streaming")
            .select("id", { count: "exact", head: true })
            .or(`location_group.eq."${targetGroup.name}",floor.eq."${targetGroup.name}"`);

        if (count && count > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Grup "${targetGroup.name}" tidak dapat dihapus karena masih digunakan oleh ${count} kamera CCTV.`,
                },
                { status: 400 }
            );
        }

        const { error: deleteError } = await supabase
            .from("streaming_groups")
            .delete()
            .eq("id", targetGroup.id);

        if (deleteError) {
            return NextResponse.json({ success: false, message: deleteError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Grup lokasi "${targetGroup.name}" berhasil dihapus.`,
        });
    } catch (err: unknown) {
        console.error("DELETE /api/streaming/groups error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan pada server saat menghapus grup." },
            { status: 500 }
        );
    }
}
