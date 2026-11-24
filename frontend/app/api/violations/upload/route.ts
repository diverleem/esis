import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const dynamic = "force-dynamic";

function getR2Client() {
    const endpoint = process.env.R2_ENDPOINT || "https://ae683a81ba7db85821422f8864eee6bd.r2.cloudflarestorage.com";
    const accessKeyId = process.env.R2_ACCESS_KEY_ID || "2ade10a65df615bdb1e83643f6feee9c";
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "f6fe896bbf963560a3a4ec8e6ce2151537295e623231296f49390df0bdce0def";

    return new S3Client({
        region: "auto",
        endpoint,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
}

// POST /api/violations/upload - Upload foto bukti langsung ke Cloudflare R2
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ success: false, message: "File gambar ('file') tidak ditemukan." }, { status: 400 });
        }

        const bucketName = process.env.R2_BUCKET_NAME || "esis-violations";
        const publicBaseUrl = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://violations.ucim.my.id").replace(/\/+$/, "");

        const ext = file.name.split(".").pop() || "jpg";
        const cleanExt = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
        const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
        const randomStr = Math.random().toString(36).substring(2, 8);
        const filename = `manual_staff_${timestamp}_${randomStr}.${cleanExt || "jpg"}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const s3 = getR2Client();
        await s3.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: filename,
                Body: buffer,
                ContentType: file.type || "image/jpeg",
            })
        );

        const publicUrl = `${publicBaseUrl}/${filename}`;

        return NextResponse.json({
            success: true,
            message: "Foto bukti berhasil diunggah ke Cloudflare R2.",
            filename,
            url: publicUrl,
        });
    } catch (err: unknown) {
        console.error("POST /api/violations/upload error:", err);
        return NextResponse.json(
            { success: false, message: "Gagal mengunggah foto ke Cloudflare R2." },
            { status: 500 }
        );
    }
}
