import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/utils/auth";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("session_token")?.value;
    if (!token) {
        return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
        return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user: session });
}
