import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/utils/auth";
import { createClient } from "@supabase/supabase-js";
import { generateDualRtspPaths } from "@/utils/rtsp";

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

// Helper untuk menambah atau memperbarui (patch) path di MediaMTX Control API
async function syncPathToMtx(pathName: string, source: string, baseUrl: string): Promise<boolean> {
    try {
        // Coba tambah path baru via POST
        const addRes = await fetch(`${baseUrl}/v3/config/paths/add/${encodeURIComponent(pathName)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source }),
        });

        if (addRes.ok) {
            return true;
        }

        // Jika path sudah ada (misal return 400 "path already exists"), lakukan PATCH
        const patchRes = await fetch(`${baseUrl}/v3/config/paths/patch/${encodeURIComponent(pathName)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source }),
        });

        return patchRes.ok;
    } catch (err) {
        console.error(`MediaMTX sync error for path "${pathName}":`, err);
        return false;
    }
}

// Helper untuk menghapus path lama yang sudah tidak ada di database
async function deletePathFromMtx(pathName: string, baseUrl: string): Promise<boolean> {
    try {
        const res = await fetch(`${baseUrl}/v3/config/paths/delete/${encodeURIComponent(pathName)}`, {
            method: "DELETE",
        });
        return res.ok;
    } catch {
        return false;
    }
}

// POST /api/streaming/sync - Sinkronisasi konfigurasi streaming dari database Supabase ke MediaMTX Control API (Superadmin only)
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

        // 1. Periksa ketersediaan MediaMTX Control API
        let mtxItems: Array<{ name: string; source?: string }> = [];
        try {
            const testRes = await fetch(`${cleanBase}/v3/config/paths/list`, {
                cache: "no-store",
            });
            if (!testRes.ok) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Server MediaMTX tidak merespons di ${cleanBase} (Status HTTP: ${testRes.status}). Pastikan streaming server aktif.`,
                    },
                    { status: 502 }
                );
            }
            const testData = await testRes.json();
            if (Array.isArray(testData?.items)) {
                mtxItems = testData.items;
            }
        } catch (connErr: unknown) {
            console.error("Gagal terhubung ke MediaMTX Control API:", connErr);
            return NextResponse.json(
                {
                    success: false,
                    message: `Tidak dapat menghubungi streaming server MediaMTX di ${cleanBase}. Pastikan koneksi atau IP server MediaMTX dapat diakses.`,
                },
                { status: 502 }
            );
        }

        // 2. Ambil seluruh data kamera aktif dari basis data Supabase
        const supabase = getSupabaseClient();
        const { data: streams, error: dbError } = await supabase
            .from("streaming")
            .select("*")
            .order("id", { ascending: true });

        if (dbError) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Gagal membaca basis data streaming: ${dbError.message}`,
                },
                { status: 500 }
            );
        }

        if (!streams || streams.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tidak ada data kamera di database untuk disinkronkan ke MediaMTX.",
                },
                { status: 400 }
            );
        }

        // 3. Sinkronkan setiap kamera di database ke MediaMTX Control API
        const validPathNames = new Set<string>();
        let syncedCamerasCount = 0;
        let syncedPathsCount = 0;
        const failedItems: string[] = [];

        for (const cam of streams) {
            if (cam.is_active === false) {
                continue; // Lewati kamera yang dinonaktifkan
            }

            // Dapatkan atau buat path RTSP ganda (ecam & cam)
            let ecamPath = cam.ecam_path;
            let camPath = cam.cam_path;
            let ecamSource = cam.ecam_source;
            let camSource = cam.cam_source;

            if (!ecamPath || !camPath || !ecamSource || !camSource) {
                const generated = generateDualRtspPaths(cam.label || cam.name, {
                    ip: cam.ip_address,
                    port: cam.port || 554,
                    username: cam.username_rtsp || "",
                    password: cam.password_rtsp || "",
                });
                ecamPath = ecamPath || generated.ecamPath;
                camPath = camPath || generated.camPath;
                ecamSource = ecamSource || generated.ecamSource;
                camSource = camSource || generated.camSource;
            }

            validPathNames.add(ecamPath);
            validPathNames.add(camPath);

            // Sinkronkan ecam (substream channel 102)
            const ecamOk = await syncPathToMtx(ecamPath, ecamSource, cleanBase);
            if (ecamOk) {
                syncedPathsCount++;
            } else {
                failedItems.push(`${ecamPath} (Gagal push ke MediaMTX)`);
            }

            // Sinkronkan cam (mainstream HD channel 101)
            const camOk = await syncPathToMtx(camPath, camSource, cleanBase);
            if (camOk) {
                syncedPathsCount++;
            } else {
                failedItems.push(`${camPath} (Gagal push ke MediaMTX)`);
            }

            if (ecamOk && camOk) {
                syncedCamerasCount++;
            }
        }

        // 4. Bersihkan path kamera lawas di MediaMTX yang sudah tidak terdaftar di database
        let prunedPathsCount = 0;
        for (const item of mtxItems) {
            const isCameraPath = item.name.startsWith("cam_") || item.name.startsWith("ecam_");
            if (isCameraPath && !validPathNames.has(item.name)) {
                const delOk = await deletePathFromMtx(item.name, cleanBase);
                if (delOk) {
                    prunedPathsCount++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Sinkronisasi berhasil! ${syncedCamerasCount} kamera (${syncedPathsCount} path streaming) dari database telah disinkronkan ke server MediaMTX.${
                prunedPathsCount > 0 ? ` Menghapus ${prunedPathsCount} path usang di server streaming.` : ""
            }`,
            synced_cameras: syncedCamerasCount,
            total_cameras: streams.length,
            synced_paths: syncedPathsCount,
            pruned_paths: prunedPathsCount,
            failed_items: failedItems,
        });
    } catch (err: unknown) {
        console.error("POST /api/streaming/sync error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan sistem saat menyinkronkan data ke MediaMTX." },
            { status: 500 }
        );
    }
}
