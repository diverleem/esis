import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ success: true, message: "Berhasil logout." });
    
    // Hapus cookies session
    response.cookies.set("session_token", "", { path: "/", maxAge: 0 });
    response.cookies.set("user_role", "", { path: "/", maxAge: 0 });
    response.cookies.set("is_logged_in", "", { path: "/", maxAge: 0 });

    return response;
}
