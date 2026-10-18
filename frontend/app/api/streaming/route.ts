import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/utils/auth";
import { createClient } from "@supabase/supabase-js";
import { generateDualRtspPaths, parseRtspUrl, slugifyCameraName } from "@/utils/rtsp";

export const dynamic = "force-dynamic";

const MEDIAMTX_CONFIG_URL = process.env.MEDIAMTX_CONFIG_URL || "https://config.ucim.my.id";

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) are missing.");
    }
    return createClient(supabaseUrl, supabaseKey);
}

// Helper untuk operasi ke MediaMTX Control API (add / patch / delete)
async function syncSingleMtxPath(pathName: string, source: string, action: "add" | "patch" | "delete") {
    const cleanBase = MEDIAMTX_CONFIG_URL.replace(/\/+$/, "");
    try {
        if (action === "delete") {
            const res = await fetch(`${cleanBase}/v3/config/paths/delete/${encodeURIComponent(pathName)}`, {
                method: "DELETE",
            });
            return res.ok;
        }

        if (action === "add" || action === "patch") {
            // Coba add dulu, jika gagal coba patch, atau sebaliknya
            const addRes = await fetch(`${cleanBase}/v3/config/paths/add/${encodeURIComponent(pathName)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ source }),
            });

            if (!addRes.ok) {
                const patchRes = await fetch(`${cleanBase}/v3/config/paths/patch/${encodeURIComponent(pathName)}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ source }),
                });
                return patchRes.ok;
            }
            return true;
        }
    } catch (err) {
        console.error(`MediaMTX sync error (${action} ${pathName}):`, err);
        return false;
    }
    return false;
}

// GET /api/streaming - Mengambil daftar kamera CCTV
export async function GET(request: NextRequest) {
    try {
        const supabase = getSupabaseClient();
        const { searchParams } = new URL(request.url);
        const groupFilter = searchParams.get("group");

        let query = supabase.from("streaming").select("*").order("id", { ascending: true });
        if (groupFilter && groupFilter !== "all") {
            query = query.eq("location_group", groupFilter);
        }

        const { data: streams, error } = await query;

        // Jika tabel belum ada di Supabase, fallback membaca dari MediaMTX Control API
        if (error) {
            const isTableMissing =
                error.code === "PGRST205" ||
                error.message?.includes("does not exist") ||
                error.message?.includes("schema cache");

            if (isTableMissing) {
                try {
                    const mtxRes = await fetch(`${MEDIAMTX_CONFIG_URL.replace(/\/+$/, "")}/v3/config/paths/list`, {
                        cache: "no-store",
                    });
                    if (mtxRes.ok) {
                        const mtxData = await mtxRes.json();
                        const rawItems: Array<{ name: string; source: string }> = Array.isArray(mtxData?.items)
                            ? mtxData.items
                            : [];

                        // Kumpulkan path RTSP dan satukan pasangan cam & ecam menjadi 1 entri kamera
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

                            const slug = item.name.replace(/^(cam_|ecam_)/, "");
                            const parsed = parseRtspUrl(item.source);

                            // Format nama kamera manusiawi
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
                                ecam_source: isEcam ? item.source : "",
                                cam_source: isCam ? item.source : "",
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

                        const streamList = Array.from(cameraMap.values()).map((cam, idx) => ({
                            id: idx + 1,
                            name: cam.slug,
                            label: cam.label,
                            location_group: cam.location_group,
                            ip_address: cam.ip_address,
                            port: cam.port || 554,
                            username_rtsp: cam.username_rtsp || "",
                            password_rtsp: cam.password_rtsp || "",
                            ecam_path: cam.ecam_path,
                            cam_path: cam.cam_path,
                            ecam_source: cam.ecam_source,
                            cam_source: cam.cam_source,
                            protocol: "WebRTC",
                            is_active: true,
                        }));

                        return NextResponse.json({
                            success: true,
                            streams: streamList,
                            db_connected: false,
                            db_table_missing: true,
                            message: "Data streaming disatukan langsung dari MediaMTX Control API (Tabel Supabase belum dibuat).",
                        });
                    }
                } catch {
                    // fallback
                }
            }

            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

        // Jika data dari DB ada, format agar seragam
        const mappedStreams = (streams || []).map((s) => {
            const slug = slugifyCameraName(s.name || s.label);
            return {
                id: s.id,
                name: slug,
                label: s.label || s.name,
                location_group: s.location_group || s.floor || "Lantai 5 Gedung PLT",
                ip_address: s.ip_address,
                port: s.port || 554,
                username_rtsp: s.username_rtsp || "",
                password_rtsp: s.password_rtsp || "",
                ecam_path: s.ecam_path || `ecam_${slug}`,
                cam_path: s.cam_path || `cam_${slug}`,
                ecam_source: s.ecam_source || "",
                cam_source: s.cam_source || "",
                protocol: s.protocol || "WebRTC",
                is_active: s.is_active !== undefined ? s.is_active : true,
                created_at: s.created_at,
                updated_at: s.updated_at,
            };
        });

        return NextResponse.json({
            success: true,
            streams: mappedStreams,
            db_connected: true,
            db_table_missing: false,
        });
    } catch (err: unknown) {
        console.error("GET /api/streaming error:", err);
        return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server." }, { status: 500 });
    }
}

// POST /api/streaming - Menambah kamera baru dan membuat 2 path MediaMTX (ecam ch 102 & cam ch 101)
export async function POST(request: NextRequest) {
    const token = request.cookies.get("session_token")?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "superadmin") {
        return NextResponse.json(
            { success: false, message: "Akses ditolak. Fitur kelola streaming CCTV khusus untuk role superadmin." },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();
        const {
            label,
            ip_address,
            port,
            username_rtsp,
            password_rtsp,
            location_group = "Lantai 5 Gedung PLT",
            sync_mediamtx = true,
        } = body;

        if (!label || !label.trim() || !ip_address || !ip_address.trim()) {
            return NextResponse.json(
                { success: false, message: "Nama kamera dan Alamat IP CCTV wajib diisi." },
                { status: 400 }
            );
        }

        // Bangun 2 path MediaMTX secara otomatis (ecam ch 102 dan cam ch 101)
        const paths = generateDualRtspPaths(label, {
            ip: ip_address,
            port: port || 554,
            username: username_rtsp,
            password: password_rtsp,
        });

        let ecamSynced = false;
        let camSynced = false;

        // Sinkronisasi ke MediaMTX: otomatis membuat 2 path
        if (sync_mediamtx) {
            ecamSynced = await syncSingleMtxPath(paths.ecamPath, paths.ecamSource, "add");
            camSynced = await syncSingleMtxPath(paths.camPath, paths.camSource, "add");
        }

        const supabase = getSupabaseClient();
        const insertPayload = {
            name: paths.slug,
            label: label.trim(),
            location_group: location_group.trim(),
            floor: location_group.includes("6") ? "Lt. 6" : "Lt. 5",
            ip_address: ip_address.trim(),
            port: paths.port,
            username_rtsp: username_rtsp ? username_rtsp.trim() : "",
            password_rtsp: password_rtsp ? password_rtsp.trim() : "",
            channel_path: "/Streaming/Channels/101",
            ecam_path: paths.ecamPath,
            cam_path: paths.camPath,
            ecam_source: paths.ecamSource,
            cam_source: paths.camSource,
            protocol: "WebRTC",
            is_active: true,
        };

        const { data: newStream, error: dbError } = await supabase
            .from("streaming")
            .insert(insertPayload)
            .select("*")
            .single();

        if (dbError) {
            return NextResponse.json(
                {
                    success: false,
                    message: dbError.message,
                    paths_created: { ecam: paths.ecamPath, cam: paths.camPath },
                    mediamtx_synced: ecamSynced && camSynced,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Kamera "${label.trim()}" berhasil ditambahkan! 2 path MediaMTX (${paths.ecamPath} [Mode Hemat 102] & ${paths.camPath} [Mode HD 101]) telah dibuat.`,
            stream: newStream,
            paths,
            mediamtx_synced: ecamSynced && camSynced,
        });
    } catch (err: unknown) {
        console.error("POST /api/streaming error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan pada server saat menambahkan kamera." },
            { status: 500 }
        );
    }
}

// PATCH /api/streaming - Mengedit kamera dan memperbarui kedua path MediaMTX
export async function PATCH(request: NextRequest) {
    const token = request.cookies.get("session_token")?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "superadmin") {
        return NextResponse.json(
            { success: false, message: "Akses ditolak. Fitur kelola streaming CCTV khusus untuk role superadmin." },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();
        const {
            id,
            label,
            ip_address,
            port,
            username_rtsp,
            password_rtsp,
            location_group,
            is_active,
            sync_mediamtx = true,
        } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "ID kamera wajib disertakan." }, { status: 400 });
        }

        const supabase = getSupabaseClient();
        const { data: existing } = await supabase.from("streaming").select("*").eq("id", id).maybeSingle();

        const currentLabel = label || existing?.label || existing?.name || "camera";
        const currentIp = ip_address || existing?.ip_address || "";
        const currentPort = port !== undefined ? port : (existing?.port || 554);
        const currentUser = username_rtsp !== undefined ? username_rtsp : (existing?.username_rtsp || "");
        const currentPass = password_rtsp !== undefined ? password_rtsp : (existing?.password_rtsp || "");
        const currentGroup = location_group || existing?.location_group || "Lantai 5 Gedung PLT";

        const paths = generateDualRtspPaths(currentLabel, {
            ip: currentIp,
            port: currentPort,
            username: currentUser,
            password: currentPass,
        });

        let ecamSynced = false;
        let camSynced = false;

        if (sync_mediamtx) {
            ecamSynced = await syncSingleMtxPath(paths.ecamPath, paths.ecamSource, "patch");
            camSynced = await syncSingleMtxPath(paths.camPath, paths.camSource, "patch");
        }

        const updatePayload: Record<string, unknown> = {
            label: currentLabel.trim(),
            location_group: currentGroup,
            floor: currentGroup.includes("6") ? "Lt. 6" : "Lt. 5",
            ip_address: currentIp.trim(),
            port: paths.port,
            username_rtsp: currentUser ? currentUser.trim() : "",
            password_rtsp: currentPass ? currentPass.trim() : "",
            ecam_path: paths.ecamPath,
            cam_path: paths.camPath,
            ecam_source: paths.ecamSource,
            cam_source: paths.camSource,
            updated_at: new Date().toISOString(),
        };

        if (is_active !== undefined) {
            updatePayload.is_active = Boolean(is_active);
        }

        const { data: updatedStream, error: dbError } = await supabase
            .from("streaming")
            .update(updatePayload)
            .eq("id", id)
            .select("*")
            .single();

        if (dbError) {
            return NextResponse.json({ success: false, message: dbError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Kamera "${currentLabel}" berhasil diperbarui beserta path MediaMTX (${paths.ecamPath} & ${paths.camPath}).`,
            stream: updatedStream,
            mediamtx_synced: ecamSynced && camSynced,
        });
    } catch (err: unknown) {
        console.error("PATCH /api/streaming error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan pada server saat memperbarui kamera." },
            { status: 500 }
        );
    }
}

// DELETE /api/streaming - Menghapus kamera dan menghapus kedua path MediaMTX (ecam & cam)
export async function DELETE(request: NextRequest) {
    const token = request.cookies.get("session_token")?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "superadmin") {
        return NextResponse.json(
            { success: false, message: "Akses ditolak. Fitur kelola streaming CCTV khusus untuk role superadmin." },
            { status: 403 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const name = searchParams.get("name");

        if (!id && !name) {
            return NextResponse.json({ success: false, message: "ID atau nama kamera wajib disertakan." }, { status: 400 });
        }

        const supabase = getSupabaseClient();
        let findQuery = supabase.from("streaming").select("id, name, label, ecam_path, cam_path");
        if (id) {
            findQuery = findQuery.eq("id", id);
        } else if (name) {
            findQuery = findQuery.eq("name", name);
        }

        const { data: targetStream } = await findQuery.maybeSingle();

        const baseSlug = targetStream?.name || slugifyCameraName(name || "");
        const ecamPath = targetStream?.ecam_path || `ecam_${baseSlug}`;
        const camPath = targetStream?.cam_path || `cam_${baseSlug}`;

        // Hapus kedua path di MediaMTX Control API
        let ecamDeleted = false;
        let camDeleted = false;

        ecamDeleted = await syncSingleMtxPath(ecamPath, "", "delete");
        camDeleted = await syncSingleMtxPath(camPath, "", "delete");

        // Hapus juga jika nama asli dikirim tanpa prefix
        if (name && name !== ecamPath && name !== camPath) {
            await syncSingleMtxPath(name, "", "delete");
        }

        // Hapus dari database Supabase
        let deleteQuery = supabase.from("streaming").delete();
        if (id) {
            deleteQuery = deleteQuery.eq("id", id);
        } else if (name) {
            deleteQuery = deleteQuery.eq("name", name);
        }

        const { error: dbError } = await deleteQuery;
        if (dbError) {
            return NextResponse.json({ success: false, message: dbError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Kamera "${targetStream?.label || baseSlug}" dan kedua path MediaMTX (${ecamPath} & ${camPath}) berhasil dihapus.`,
            mediamtx_deleted: ecamDeleted && camDeleted,
        });
    } catch (err: unknown) {
        console.error("DELETE /api/streaming error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan pada server saat menghapus kamera." },
            { status: 500 }
        );
    }
}
