import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/utils/auth";
import { createClient } from "@supabase/supabase-js";
import { parseRtspUrl, slugifyCameraName } from "@/utils/rtsp";

export const dynamic = "force-dynamic";

const MEDIAMTX_CONFIG_URL = process.env.MEDIAMTX_CONFIG_URL || "https://config.ucim.my.id";

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables are missing.");
    }
    return createClient(supabaseUrl, supabaseKey);
}

// POST /api/streaming/sync - Sinkronisasi otomatis path MediaMTX dengan database Supabase (Superadmin only)
export async function POST(request: NextRequest) {
    const token = request.cookies.get("session_token")?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "superadmin") {
        return NextResponse.json(
            { success: false, message: "Akses ditolak. Fitur sinkronisasi MediaMTX khusus untuk role superadmin." },
            { status: 403 }
        );
    }

    try {
        const cleanBase = MEDIAMTX_CONFIG_URL.replace(/\/+$/, "");
        const mtxRes = await fetch(`${cleanBase}/v3/config/paths/list`, {
            cache: "no-store",
        });

        if (!mtxRes.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Gagal menghubungi MediaMTX Control API di ${cleanBase} (Status HTTP: ${mtxRes.status}).`,
                },
                { status: 502 }
            );
        }

        const mtxData = await mtxRes.json();
        const rawItems = Array.isArray(mtxData?.items) ? mtxData.items : [];

        // Kumpulkan dan gabungkan pasangan cam_* & ecam_* menjadi 1 kamera
        const cameraMap = new Map<string, {
            slug: string;
            label: string;
            location_group: string;
            ip_address: string;
            port: number;
            username_rtsp: string;
            password_rtsp: string;
            ecam_path: string;
            cam_path: string;
            ecam_source: string;
            cam_source: string;
        }>();

        for (const item of rawItems) {
            if (!item.source || !item.source.startsWith("rtsp://")) continue;

            const isEcam = item.name.startsWith("ecam_");
            const isCam = item.name.startsWith("cam_");
            if (!isEcam && !isCam) continue;

            const slug = slugifyCameraName(item.name);
            const parsed = parseRtspUrl(item.source);

            const label = slug
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());

            const isLt6 =
                slug.includes("lt6") ||
                slug.includes("multimedia") ||
                slug.includes("apl") ||
                slug.includes("jaringan") ||
                slug.includes("tambang") ||
                slug.includes("mtk");

            const locationGroup = isLt6 ? "Lantai 6 Gedung PLT" : "Lantai 5 Gedung PLT";

            const existing = cameraMap.get(slug) || {
                slug,
                label,
                location_group: locationGroup,
                ip_address: parsed.ip,
                port: parsed.port,
                username_rtsp: parsed.username,
                password_rtsp: parsed.password,
                ecam_path: `ecam_${slug}`,
                cam_path: `cam_${slug}`,
                ecam_source: "",
                cam_source: "",
            };

            if (isEcam) {
                existing.ecam_source = item.source;
                if (!existing.ip_address) existing.ip_address = parsed.ip;
                if (!existing.username_rtsp) existing.username_rtsp = parsed.username;
                if (!existing.password_rtsp) existing.password_rtsp = parsed.password;
            }
            if (isCam) {
                existing.cam_source = item.source;
                if (!existing.ip_address) existing.ip_address = parsed.ip;
                if (!existing.username_rtsp) existing.username_rtsp = parsed.username;
                if (!existing.password_rtsp) existing.password_rtsp = parsed.password;
            }

            cameraMap.set(slug, existing);
        }

        const supabase = getSupabaseClient();
        let successCount = 0;
        const failedItems: string[] = [];

        for (const cam of Array.from(cameraMap.values())) {
            // Jika salah satu source kosong, buat fallback berdasarkan IP & port yang ada
            const authPrefix = cam.username_rtsp
                ? `${encodeURIComponent(cam.username_rtsp)}:${encodeURIComponent(cam.password_rtsp || "")}@`
                : "";

            const ecamSrc = cam.ecam_source || `rtsp://${authPrefix}${cam.ip_address}:${cam.port}/Streaming/Channels/102`;
            const camSrc = cam.cam_source || `rtsp://${authPrefix}${cam.ip_address}:${cam.port}/Streaming/Channels/101`;

            const upsertPayload = {
                name: cam.slug,
                label: cam.label,
                location_group: cam.location_group,
                ip_address: cam.ip_address,
                port: cam.port || 554,
                username_rtsp: cam.username_rtsp || null,
                password_rtsp: cam.password_rtsp || null,
                ecam_path: cam.ecam_path,
                cam_path: cam.cam_path,
                ecam_source: ecamSrc,
                cam_source: camSrc,
                protocol: "WebRTC",
                is_active: true,
                updated_at: new Date().toISOString(),
            };

            const { error: upsertError } = await supabase
                .from("streaming")
                .upsert(upsertPayload, { onConflict: "name" });

            if (upsertError) {
                failedItems.push(`${cam.slug} (${upsertError.message})`);
            } else {
                successCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Sinkronisasi berhasil! ${successCount} kamera fisik (masing-masing memiliki path ecam & cam) telah disesuaikan dengan database.`,
            synced_count: successCount,
            total_cameras: cameraMap.size,
            failed_items: failedItems,
        });
    } catch (err: unknown) {
        console.error("POST /api/streaming/sync error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan saat menyinkronkan data dengan MediaMTX." },
            { status: 500 }
        );
    }
}
