import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from "pdf-lib";
import fs from "fs/promises";
import path from "path";

export interface SpStudentData {
    full_name?: string;
    student_id?: string;
    department?: string | null;
    faculty?: string | null;
    entry_year?: number | string | null;
    gender?: string | null;
    email?: string | null;
    // Backward compatibility aliases
    nama_lengkap?: string;
    nim?: string;
    jurusan?: string | null;
    fakultas?: string | null;
    tahun_masuk?: number | string | null;
    jenis_kelamin?: string | null;
}

export interface SpViolationData {
    id: string;
    created_at?: string;
    location: string;
    location_group?: string | null;
    evidence_image_url: string;
    confidence_smoking?: number | null;
    face_similarity?: number | null;
    verified_by?: string | null;
    sp_number?: string | null;
}

// Format bulan romawi untuk nomor surat
const ROMAN_MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

// Format tanggal resmi bahasa Indonesia
export function formatIndonesianDate(dateInput: Date | string): string {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

// Generate nomor SP otomatis jika belum ada
export function generateSpNumber(violationId: string, createdAt?: string): string {
    const date = createdAt ? new Date(createdAt) : new Date();
    const roman = ROMAN_MONTHS[date.getMonth()] || "XI";
    const year = date.getFullYear();
    
    // Ambil angka atau 3 digit ID terakhir
    const cleanId = violationId.replace(/\D/g, "");
    const seq = cleanId ? cleanId.slice(-3).padStart(3, "0") : "001";

    return `SP/${seq}/PLT/${roman}/${year}`;
}

// Helper untuk text wrapping pada canvas PDF
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width <= maxWidth) {
            currentLine = testLine;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
}

/**
 * Membuat dokumen PDF Surat Peringatan berdasarkan template resmi UIN Syarif Hidayatullah Jakarta
 */
export async function generateSpPdf(
    violation: SpViolationData,
    student: SpStudentData
): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();

    // Standard Fonts
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

    // Palet Warna Resmi
    const colorBlack = rgb(0.1, 0.1, 0.1);
    const colorMuted = rgb(0.3, 0.3, 0.3);

    // Standard A4: 595.28 x 841.89 points
    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;
    const MARGIN_LEFT = 54;
    const MARGIN_RIGHT = 54;
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

    // =========================================================================
    // HALAMAN 1: SURAT PERINGATAN RESMI
    // =========================================================================
    const page1: PDFPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - 45;

    // 1. KOP SURAT
    // Muat logo UIN dari folder public jika ada
    try {
        const logoPath = path.join(process.cwd(), "public", "uin_logo.png");
        const logoBytes = await fs.readFile(logoPath);
        const logoImage = await pdfDoc.embedPng(logoBytes);
        
        // Ukuran logo proporsional
        const logoWidth = 72;
        const logoHeight = 72;
        page1.drawImage(logoImage, {
            x: MARGIN_LEFT,
            y: y - logoHeight + 8,
            width: logoWidth,
            height: logoHeight,
        });
    } catch {
        // Jika logo tidak ditemukan, abaikan tanpa gagalkan pembuatan PDF
    }

    // Teks Kop Surat di Sebelah Kanan Logo
    const headerLeftX = MARGIN_LEFT + 82;
    page1.drawText("KEMENTERIAN AGAMA", {
        x: headerLeftX,
        y: y,
        size: 13,
        font: timesBold,
        color: colorBlack,
    });
    y -= 15;

    page1.drawText("UIN SYARIF HIDAYATULLAH JAKARTA", {
        x: headerLeftX,
        y: y,
        size: 13,
        font: timesBold,
        color: colorBlack,
    });
    y -= 15;

    page1.drawText("FAKULTAS SAINS DAN TEKNOLOGI", {
        x: headerLeftX,
        y: y,
        size: 12,
        font: timesBold,
        color: colorBlack,
    });
    y -= 15;

    page1.drawText("Jl. Ir. H. Juanda No. 95 Ciputat 15412 Indonesia    Website : fst.uinjkt.ac.id", {
        x: headerLeftX,
        y: y,
        size: 8.5,
        font: timesRoman,
        color: colorMuted,
    });
    y -= 12;

    page1.drawText("Telp. (62-21) 7493606, 7493547 Fax. (62-21) 7493315    Email : fst@uinjkt.ac.id", {
        x: headerLeftX,
        y: y,
        size: 8.5,
        font: timesRoman,
        color: colorMuted,
    });
    y -= 16;

    // Garis Kop Surat Ganda (Garis tebal atas + garis tipis bawah)
    page1.drawLine({
        start: { x: MARGIN_LEFT, y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
        thickness: 2,
        color: rgb(0, 0, 0),
    });
    y -= 2.5;
    page1.drawLine({
        start: { x: MARGIN_LEFT, y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
        thickness: 0.75,
        color: rgb(0, 0, 0),
    });
    y -= 22;

    // 2. METADATA SURAT (Nomor, Lampiran, Perihal)
    const spNumber = violation.sp_number || generateSpNumber(violation.id, violation.created_at);
    
    page1.drawText("Nomor", { x: MARGIN_LEFT, y, size: 10.5, font: timesRoman, color: colorBlack });
    page1.drawText(`:  ${spNumber}`, { x: MARGIN_LEFT + 75, y, size: 10.5, font: timesBold, color: colorBlack });
    y -= 14;

    page1.drawText("Lampiran", { x: MARGIN_LEFT, y, size: 10.5, font: timesRoman, color: colorBlack });
    page1.drawText(":  Satu Lembar", { x: MARGIN_LEFT + 75, y, size: 10.5, font: timesRoman, color: colorBlack });
    y -= 14;

    page1.drawText("Perihal", { x: MARGIN_LEFT, y, size: 10.5, font: timesRoman, color: colorBlack });
    page1.drawText(":  Surat Peringatan", { x: MARGIN_LEFT + 75, y, size: 10.5, font: timesBold, color: colorBlack });
    y -= 25;

    // 3. JUDUL SURAT (SURAT PERINGATAN - Center & Underline)
    const titleText = "SURAT PERINGATAN";
    const titleWidth = timesBold.widthOfTextAtSize(titleText, 13);
    const titleX = (PAGE_WIDTH - titleWidth) / 2;

    page1.drawText(titleText, {
        x: titleX,
        y,
        size: 13,
        font: timesBold,
        color: colorBlack,
    });
    // Underline
    page1.drawLine({
        start: { x: titleX, y: y - 2 },
        end: { x: titleX + titleWidth, y: y - 2 },
        thickness: 1,
        color: colorBlack,
    });
    y -= 25;

    // 4. TUJUAN SURAT
    const rawGender = student.gender || student.jenis_kelamin || "";
    const isFemale =
        rawGender.toUpperCase().startsWith("P") ||
        rawGender.toLowerCase().includes("perempuan") ||
        rawGender.toLowerCase().includes("female");
    const sapaan = isFemale ? "Saudari" : "Saudara";
    const namaMahasiswa = student.full_name || student.nama_lengkap || "Mahasiswa Terkait";

    page1.drawText(`Yth. ${sapaan} ${namaMahasiswa}`, {
        x: MARGIN_LEFT,
        y,
        size: 11,
        font: timesBold,
        color: colorBlack,
    });
    y -= 18;

    // 5. PARAGRAF PEMBUKA
    const openingParagraph = 
        "Sehubungan dengan berlakunya Pedoman Umum Keselamatan dan Kesehatan Kerja (K3) Laboratorium di " +
        "Pusat Laboratorium Terpadu (PLT) UIN Syarif Hidayatullah Jakarta, khususnya pada poin 8 (delapan) " +
        "mengenai aktivitas yang tidak diperbolehkan selama bekerja di dalam laboratorium, bersama ini kami " +
        "sampaikan bahwa mahasiswa dengan identitas sebagai berikut:";

    const openingLines = wrapText(openingParagraph, timesRoman, 10.5, CONTENT_WIDTH);
    for (const line of openingLines) {
        page1.drawText(line, { x: MARGIN_LEFT, y, size: 10.5, font: timesRoman, color: colorBlack });
        y -= 14;
    }
    y -= 6;

    // 6. TABEL / INDENTASI DATA DIRI MAHASISWA
    const studentInfo = [
        { label: "Nama", value: student.full_name || student.nama_lengkap || "-" },
        { label: "NIM", value: student.student_id || student.nim || "-" },
        { label: "Jurusan", value: student.department || student.jurusan || "Teknik Informatika" },
        { label: "Fakultas", value: student.faculty || student.fakultas || "Fakultas Sains dan Teknologi" },
        { label: "Tahun Masuk", value: student.entry_year ? String(student.entry_year) : (student.tahun_masuk ? String(student.tahun_masuk) : "-") },
        { label: "Email", value: student.email || "-" },
    ];

    const labelColX = MARGIN_LEFT + 25;
    const valColX = MARGIN_LEFT + 125;

    for (const item of studentInfo) {
        page1.drawText(item.label, { x: labelColX, y, size: 10.5, font: timesRoman, color: colorBlack });
        page1.drawText(":", { x: valColX - 10, y, size: 10.5, font: timesRoman, color: colorBlack });
        page1.drawText(item.value, {
            x: valColX,
            y,
            size: 10.5,
            font: item.label === "Nama" || item.label === "NIM" ? timesBold : timesRoman,
            color: colorBlack,
        });
        y -= 15;
    }
    y -= 8;

    // 7. PARAGRAF ISI DAN KONSEKUENSI
    const bodyParagraph = 
        "Berdasarkan hasil pemantauan melalui Electronic Smoking Identification System (ESIS) yang terintegrasi " +
        "dengan kamera pengawas (CCTV) di lingkungan Pusat Laboratorium Terpadu (PLT), telah teridentifikasi aktivitas " +
        "yang terindikasi sebagai pelanggaran terhadap ketentuan larangan merokok di lingkungan laboratorium. " +
        "Berkaitan dengan hal tersebut, mahasiswa yang bersangkutan diberikan surat peringatan agar senantiasa mematuhi " +
        "Pedoman Umum K3 Laboratorium serta tidak mengulangi aktivitas serupa selama berada di lingkungan laboratorium. " +
        "Sebagai bahan pendukung, bersama surat ini dilampirkan satu lembar dokumentasi hasil pemantauan CCTV yang berkaitan " +
        "dengan kejadian tersebut. Demikian surat peringatan ini disampaikan untuk menjadi perhatian dan dilaksanakan sebagaimana mestinya.";

    const bodyLines = wrapText(bodyParagraph, timesRoman, 10.5, CONTENT_WIDTH);
    for (const line of bodyLines) {
        page1.drawText(line, { x: MARGIN_LEFT, y, size: 10.5, font: timesRoman, color: colorBlack });
        y -= 14;
    }
    y -= 15;

    // 8. TANGGAL DAN TANDA TANGAN
    const tanggalPelanggaranStr = formatIndonesianDate(violation.created_at || new Date());
    const signX = PAGE_WIDTH - MARGIN_RIGHT - 180;

    page1.drawText(`Jakarta, ${tanggalPelanggaranStr}`, {
        x: signX,
        y,
        size: 10.5,
        font: timesRoman,
        color: colorBlack,
    });
    y -= 15;

    page1.drawText("Hormat Kami,", {
        x: signX,
        y,
        size: 10.5,
        font: timesRoman,
        color: colorBlack,
    });
    y -= 60; // Ruang tanda tangan resmi

    page1.drawText("Kepala ESIS", {
        x: signX,
        y,
        size: 10.5,
        font: timesBold,
        color: colorBlack,
    });
    y -= 13;
    page1.drawText("Pusat Laboratorium Terpadu", {
        x: signX,
        y,
        size: 9.5,
        font: timesItalic,
        color: colorMuted,
    });

    // =========================================================================
    // HALAMAN 2: LAMPIRAN FOTO BUKTI DOKUMENTASI CCTV
    // =========================================================================
    const page2: PDFPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y2 = PAGE_HEIGHT - 45;

    // Judul Lampiran
    page2.drawText("LAMPIRAN", {
        x: MARGIN_LEFT,
        y: y2,
        size: 13,
        font: timesBold,
        color: colorBlack,
    });
    y2 -= 16;

    page2.drawText("DOKUMENTASI BUKTI PELANGGARAN MEROKOK (CCTV)", {
        x: MARGIN_LEFT,
        y: y2,
        size: 11,
        font: timesBold,
        color: colorBlack,
    });
    y2 -= 8;

    page2.drawLine({
        start: { x: MARGIN_LEFT, y: y2 },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: y2 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
    });
    y2 -= 20;

    // Info Berkas pada Lampiran
    page2.drawText(`Nomor Berkas : ${violation.id}`, { x: MARGIN_LEFT, y: y2, size: 9.5, font: timesBold, color: colorBlack });
    y2 -= 13;
    page2.drawText(`Lokasi            : ${violation.location} (${violation.location_group || "Gedung PLT"})`, { x: MARGIN_LEFT, y: y2, size: 9.5, font: timesRoman, color: colorBlack });
    y2 -= 13;
    page2.drawText(`Waktu             : ${formatIndonesianDate(violation.created_at || new Date())}`, { x: MARGIN_LEFT, y: y2, size: 9.5, font: timesRoman, color: colorBlack });
    if (violation.confidence_smoking != null) {
        y2 -= 13;
        const confPercent = Math.round(violation.confidence_smoking * 100);
        page2.drawText(`Keyakinan AI : ${confPercent}% (Deteksi Rokok)`, { x: MARGIN_LEFT, y: y2, size: 9.5, font: timesRoman, color: colorBlack });
    }
    y2 -= 22;

    // Sisipkan Foto Bukti CCTV
    let photoInserted = false;
    if (violation.evidence_image_url) {
        try {
            // Ambil gambar (bisa via HTTP/HTTPS atau file lokal)
            let imageBytes: ArrayBuffer;
            if (violation.evidence_image_url.startsWith("http://") || violation.evidence_image_url.startsWith("https://")) {
                const imgRes = await fetch(violation.evidence_image_url);
                if (imgRes.ok) {
                    imageBytes = await imgRes.arrayBuffer();
                } else {
                    throw new Error(`Failed to fetch image: ${imgRes.statusText}`);
                }
            } else {
                const localBuffer = await fs.readFile(violation.evidence_image_url);
                imageBytes = localBuffer.buffer;
            }

            const uint8 = new Uint8Array(imageBytes);
            let evidenceImg;
            // Deteksi format JPEG / PNG
            try {
                evidenceImg = await pdfDoc.embedJpg(uint8);
            } catch {
                evidenceImg = await pdfDoc.embedPng(uint8);
            }

            // Tentukan proporsi gambar (maksimal lebar 480, tinggi 320)
            const maxImgW = CONTENT_WIDTH;
            const maxImgH = 340;
            const scale = Math.min(maxImgW / evidenceImg.width, maxImgH / evidenceImg.height, 1);
            const drawW = evidenceImg.width * scale;
            const drawH = evidenceImg.height * scale;
            const imgX = MARGIN_LEFT + (CONTENT_WIDTH - drawW) / 2;
            const imgY = y2 - drawH;

            // Bingkai gambar
            page2.drawRectangle({
                x: imgX - 2,
                y: imgY - 2,
                width: drawW + 4,
                height: drawH + 4,
                borderWidth: 1,
                borderColor: rgb(0.7, 0.7, 0.7),
                color: rgb(0.96, 0.96, 0.96),
            });

            page2.drawImage(evidenceImg, {
                x: imgX,
                y: imgY,
                width: drawW,
                height: drawH,
            });

            y2 = imgY - 20;
            photoInserted = true;
        } catch (imgErr) {
            console.error("Gagal menyisipkan foto bukti ke PDF:", imgErr);
        }
    }

    if (!photoInserted) {
        // Kotak placeholder jika foto bukti belum dapat dimuat
        page2.drawRectangle({
            x: MARGIN_LEFT,
            y: y2 - 160,
            width: CONTENT_WIDTH,
            height: 160,
            borderWidth: 1,
            borderColor: rgb(0.8, 0.8, 0.8),
            color: rgb(0.96, 0.96, 0.96),
        });
        page2.drawText("[Foto Bukti CCTV Tersimpan di Cloudflare R2]", {
            x: MARGIN_LEFT + 110,
            y: y2 - 85,
            size: 11,
            font: timesItalic,
            color: colorMuted,
        });
        y2 -= 180;
    }

    // Catatan penutup lampiran
    page2.drawText("Catatan : Lembar lampiran ini dicetak secara otomatis melalui Electronic Smoking Identification System (ESIS).", {
        x: MARGIN_LEFT,
        y: y2,
        size: 8.5,
        font: timesItalic,
        color: colorMuted,
    });

    return await pdfDoc.save();
}
