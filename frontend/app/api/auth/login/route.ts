import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { signSession } from "@/utils/auth";

export const dynamic = "force-dynamic";

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) are missing.");
    }
    return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: NextRequest) {
    try {
        const supabase = getSupabaseClient();
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: "Username dan password wajib diisi." },
                { status: 400 }
            );
        }

        // Cari user di tabel public.users
        const { data: user, error } = await supabase
            .from("users")
            .select("id, username, password_hash, role, name")
            .eq("username", username.trim())
            .single();

        if (error || !user) {
            return NextResponse.json(
                { success: false, message: "Username atau password salah." },
                { status: 401 }
            );
        }

        // Verifikasi password hash bcrypt
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Username atau password salah." },
                { status: 401 }
            );
        }

        // Buat token session JWT
        const token = await signSession({
            id: user.id,
            username: user.username,
            role: user.role,
            name: user.name,
        });

        // Simpan token di cookie HTTP-only
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name,
            },
        });

        response.cookies.set("session_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 jam
        });

        // Set juga legacy/helper cookie jika diperlukan untuk client state
        response.cookies.set("user_role", user.role, {
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return response;
    } catch (err: unknown) {
        console.error("Login error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan pada server." },
            { status: 500 }
        );
    }
}
