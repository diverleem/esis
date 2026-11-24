import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface BoundingBox {
    x: number; // 0.0 to 1.0 (relative to frame width)
    y: number; // 0.0 to 1.0 (relative to frame height)
    w: number; // 0.0 to 1.0
    h: number; // 0.0 to 1.0
    conf: number;
}

interface TelemetryData {
    current_lab: string;
    cam_key: string;
    ecam_path: string;
    is_smoking: boolean;
    smoking_duration: number;
    boxes: BoundingBox[];
    fps: number;
    has_person: boolean;
    auto_skip_countdown: number;
    status: string;
    timestamp: number;
}

// In-memory module-level storage untuk telemetri terbaru dari AI Server Laptop
let latestTelemetry: TelemetryData | null = null;
let lastUpdateTimestamp: number = 0;

/**
 * POST /api/ai/live-feed
 * Menerima telemetri patroli & koordinat bounding box rokok dari AI Server Laptop (Plan B).
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        latestTelemetry = {
            current_lab: body.current_lab || "Lab Sistem Digital",
            cam_key: body.cam_key || "lab_sisdig",
            ecam_path: body.ecam_path || "ecam_lab_sisdig",
            is_smoking: Boolean(body.is_smoking),
            smoking_duration: typeof body.smoking_duration === "number" ? body.smoking_duration : 0,
            boxes: Array.isArray(body.boxes) ? body.boxes : [],
            fps: typeof body.fps === "number" ? body.fps : 0,
            has_person: Boolean(body.has_person),
            auto_skip_countdown: typeof body.auto_skip_countdown === "number" ? body.auto_skip_countdown : 10,
            status: body.status || "patrolling",
            timestamp: Date.now(),
        };
        lastUpdateTimestamp = Date.now();

        return NextResponse.json({ success: true, received_at: lastUpdateTimestamp });
    } catch {
        return NextResponse.json({ success: false, error: "Invalid telemetry payload" }, { status: 400 });
    }
}

/**
 * GET /api/ai/live-feed
 * Digunakan oleh Web UI (Mode AI di /cctv) untuk mengecek lab mana yang sedang dipatroli
 * dan menampilkan bounding box rokok secara real-time.
 */
export async function GET() {
    const now = Date.now();
    // Anggap offline jika dalam 4 detik tidak ada sinyal dari AI Server Laptop
    const isOnline = latestTelemetry !== null && (now - lastUpdateTimestamp) < 4000;

    if (!isOnline || !latestTelemetry) {
        return NextResponse.json({
            online: false,
            message: "AI Server Laptop belum terhubung atau offline.",
            current_lab: latestTelemetry?.current_lab || "Lab Sistem Digital",
            cam_key: latestTelemetry?.cam_key || "lab_sisdig",
            ecam_path: latestTelemetry?.ecam_path || "ecam_lab_sisdig",
            boxes: [],
            is_smoking: false,
            smoking_duration: 0,
            fps: 0,
            has_person: false,
            auto_skip_countdown: 10,
            status: "offline",
        });
    }

    return NextResponse.json({
        online: true,
        age_ms: now - lastUpdateTimestamp,
        ...latestTelemetry,
    });
}
