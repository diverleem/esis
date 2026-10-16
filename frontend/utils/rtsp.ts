/**
 * Utility helper untuk mengelola RTSP URL dan path MediaMTX E.S.I.S
 */

export interface RtspConfigParams {
    ip: string;
    port?: number | string;
    username?: string;
    password?: string;
}

export interface GeneratedRtspPaths {
    slug: string;
    ecamPath: string;
    camPath: string;
    ecamSource: string;
    camSource: string;
    port: number;
}

/**
 * Mengubah nama kamera menjadi slug yang aman untuk identifier MediaMTX
 * Contoh: "Lab Sisdig" -> "lab_sisdig"
 */
export function slugifyCameraName(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/^(cam_|ecam_)/, "") // hilangkan prefix jika ada
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
}

/**
 * Membangun URL RTSP dan 2 path MediaMTX otomatis:
 * 1. ecam_<slug> dengan channel 102 (Mode Hemat / Substream - default)
 * 2. cam_<slug> dengan channel 101 (Mode HD / Mainstream)
 */
export function generateDualRtspPaths(name: string, params: RtspConfigParams): GeneratedRtspPaths {
    const slug = slugifyCameraName(name) || "camera";
    const cleanIp = params.ip.trim();
    const port = params.port ? parseInt(String(params.port), 10) || 554 : 554;
    
    // Autentikasi opsional: hanya sertakan jika username diisi
    const hasAuth = params.username && params.username.trim().length > 0;
    const authPrefix = hasAuth
        ? `${encodeURIComponent(params.username!.trim())}:${encodeURIComponent((params.password || "").trim())}@`
        : "";

    const ecamPath = `ecam_${slug}`;
    const camPath = `cam_${slug}`;

    // Mode hemat (channel 102) dan Mode HD (channel 101)
    const ecamSource = `rtsp://${authPrefix}${cleanIp}:${port}/Streaming/Channels/102`;
    const camSource = `rtsp://${authPrefix}${cleanIp}:${port}/Streaming/Channels/101`;

    return {
        slug,
        ecamPath,
        camPath,
        ecamSource,
        camSource,
        port,
    };
}

/**
 * Mengurai string RTSP URL untuk mengekstrak kredensial dan IP
 */
export function parseRtspUrl(source: string) {
    try {
        const regex = /^rtsp:\/\/(?:([^:]+):([^@]+)@)?([^:/]+)(?::(\d+))?(\/.*)?$/;
        const match = source.match(regex);
        if (match) {
            return {
                username: match[1] ? decodeURIComponent(match[1]) : "",
                password: match[2] ? decodeURIComponent(match[2]) : "",
                ip: match[3] || "",
                port: match[4] ? parseInt(match[4], 10) : 554,
                channelPath: match[5] || "/Streaming/Channels/102",
            };
        }
    } catch {
        // fallback
    }
    return {
        username: "",
        password: "",
        ip: "",
        port: 554,
        channelPath: "/Streaming/Channels/102",
    };
}
