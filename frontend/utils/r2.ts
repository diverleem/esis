import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export function getR2Client() {
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

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "esis-violations";
export const R2_PUBLIC_BASE_URL = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://violations.ucim.my.id").replace(/\/+$/, "");

/**
 * Upload buffer ke Cloudflare R2 dan mengembalikan URL publik
 */
export async function uploadToR2(
    fileBuffer: Buffer | Uint8Array,
    filename: string,
    contentType: string = "application/pdf"
): Promise<string> {
    const s3 = getR2Client();
    const body = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);

    await s3.send(
        new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: filename,
            Body: body,
            ContentType: contentType,
            ContentDisposition: `inline; filename="${filename}"`,
        })
    );

    return `${R2_PUBLIC_BASE_URL}/${filename}`;
}
