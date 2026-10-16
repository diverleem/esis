import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/utils/auth";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) are missing.");
    }
    return createClient(supabaseUrl, supabaseKey);
}

// GET /api/users - Hanya superadmin yang bisa melihat daftar user
export async function GET(request: NextRequest) {
    const supabase = getSupabaseClient();
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
        const supabase = getSupabaseClient();
        const body = await request.json();
        const { username, password, role, name } = body;

        if (!username || !password || !role) {
            return NextResponse.json(
                { success: false, message: "Username, password, dan role wajib diisi." },
                { status: 400 }
            );
        }

        // Validasi role yang boleh dibuat (hanya admin dan staff)
        if (!["admin", "staff", "security"].includes(role)) {
            return NextResponse.json(
                { success: false, message: "Peran harus berupa 'admin' atau 'staff'." },
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
            if (insertError.message.includes("users_role_check")) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Tabel pengguna di Supabase belum diperbarui untuk role 'staff'. Silakan jalankan query di update_role_constraint.sql pada SQL Editor Supabase: ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check; ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('superadmin', 'admin', 'staff', 'security'));",
                    },
                    { status: 400 }
                );
            }
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

// DELETE /api/users - Hanya superadmin yang dapat menghapus user
export async function DELETE(request: NextRequest) {
    const token = request.cookies.get("session_token")?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "superadmin") {
        return NextResponse.json(
            { success: false, message: "Akses ditolak. Hanya superadmin yang diizinkan menghapus pengguna." },
            { status: 403 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const username = searchParams.get("username");

        if (!id && !username) {
            return NextResponse.json(
                { success: false, message: "ID atau username pengguna wajib disertakan." },
                { status: 400 }
            );
        }

        // Cegah superadmin menghapus akun yang sedang dipakai login
        if ((username && username === session.username) || (id && id === session.id)) {
            return NextResponse.json(
                { success: false, message: "Anda tidak dapat menghapus akun Anda sendiri saat sedang masuk." },
                { status: 400 }
            );
        }

        const supabase = getSupabaseClient();
        let query = supabase.from("users").delete();
        if (id) {
            query = query.eq("id", id);
        } else if (username) {
            query = query.eq("username", username);
        }

        const { error } = await query;
        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Pengguna ${username || id} berhasil dihapus.`,
        });
    } catch (err: unknown) {
        console.error("Error deleting user:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan pada server saat menghapus pengguna." },
            { status: 500 }
        );
    }
}
