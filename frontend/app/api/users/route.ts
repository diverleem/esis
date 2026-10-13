import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/utils/auth";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/users - Hanya superadmin yang bisa melihat daftar user
export async function GET(request: NextRequest) {
    const token = request.cookies.get("session_token")?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "superadmin") {
        return NextResponse.json(
            { success: false, message: "Akses ditolak. Hanya superadmin yang diizinkan." },
            { status: 403 }
        );
    }

    const { data: users, error } = await supabase
        .from("users")
        .select("id, username, role, name, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, users });
}

// POST /api/users - Hanya superadmin yang bisa menambahkan user (admin / security)
export async function POST(request: NextRequest) {
    const token = request.cookies.get("session_token")?.value;
    const session = token ? await verifySession(token) : null;

    // Rule: superadmin bisa nambah admin dan security, sementara keduanya tidak bisa nambah user
    if (!session || session.role !== "superadmin") {
        return NextResponse.json(
            { success: false, message: "Akses ditolak. Anda tidak memiliki izin untuk menambah user." },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();
        const { username, password, role, name } = body;

        if (!username || !password || !role) {
            return NextResponse.json(
                { success: false, message: "Username, password, dan role wajib diisi." },
                { status: 400 }
            );
        }

        // Validasi role yang boleh dibuat (hanya admin dan security)
        if (!["admin", "security"].includes(role)) {
            return NextResponse.json(
                { success: false, message: "Role harus berupa 'admin' atau 'security'." },
                { status: 400 }
            );
        }

        // Cek apakah username sudah dipakai
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("username", username.trim())
            .maybeSingle();

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Username sudah digunakan." },
                { status: 400 }
            );
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert ke database
        const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({
                username: username.trim(),
                password_hash,
                role,
                name: name || username.trim(),
            })
            .select("id, username, role, name, created_at")
            .single();

        if (insertError) {
            return NextResponse.json({ success: false, message: insertError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `User ${newUser.username} dengan role ${newUser.role} berhasil ditambahkan.`,
            user: newUser,
        });
    } catch (err: unknown) {
        console.error("Error creating user:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan pada server." },
            { status: 500 }
        );
    }
}
