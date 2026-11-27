import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { formatIndonesianDate, generateSpNumber, SpStudentData, SpViolationData } from "./spGenerator";

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export interface HtmlSpOptions {
    autoPrint?: boolean;
}

/**
 * Membaca Template SP HTML dari frontend/templates dan menginjeksi data mahasiswa & pelanggaran secara dinamis.
 */
export async function generateHtmlSp(
    violation: SpViolationData,
    student: SpStudentData,
    options: HtmlSpOptions = {}
): Promise<string> {
    // 1. Cari path file template
    const possiblePaths = [
        path.join(process.cwd(), "templates", "Template SP Pelanggaran Merokok.html"),
        path.join(process.cwd(), "frontend", "templates", "Template SP Pelanggaran Merokok.html"),
        path.join(process.cwd(), "..", "frontend", "templates", "Template SP Pelanggaran Merokok.html"),
        path.resolve(__dirname, "../../templates/Template SP Pelanggaran Merokok.html"),
        path.resolve(__dirname, "../templates/Template SP Pelanggaran Merokok.html"),
    ];

    let templatePath = "";
    for (const p of possiblePaths) {
        if (fsSync.existsSync(p)) {
            templatePath = p;
            break;
        }
    }

    if (!templatePath) {
        throw new Error(
            "File 'Template SP Pelanggaran Merokok.html' tidak ditemukan di frontend/templates."
        );
    }

    let html = await fs.readFile(templatePath, "utf-8");

    // 2. Siapkan data yang akan diisi
    const spNumber = violation.sp_number || generateSpNumber(violation.id, violation.created_at);
    const dateObj = violation.created_at ? new Date(violation.created_at) : new Date();
    const formattedDate = formatIndonesianDate(dateObj);
    
    // Format jam:menit:detik WIB
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const fullName = student.full_name || student.nama_lengkap || "Mahasiswa";
    const studentId = student.student_id || student.nim || "-";
    const department = student.department || student.jurusan || "Teknik Informatika";
    const faculty = student.faculty || student.fakultas || "Fakultas Sains dan Teknologi";
    const entryYear = String(student.entry_year || student.tahun_masuk || 2021);
    const email = student.email || "-";
    const gender = (student.gender || student.jenis_kelamin || "L").toUpperCase();
    const salutation = gender === "P" ? "Saudari" : "Saudara";

    const location = violation.location || "Area Kampus PLT";
    
    // Confidence formatting
    let confidenceText = "92.5%";
    if (typeof violation.confidence_smoking === "number") {
        const confVal = violation.confidence_smoking > 1 ? violation.confidence_smoking : violation.confidence_smoking * 100;
        confidenceText = `${confVal.toFixed(1)}%`;
    }

    const evidenceUrl = violation.evidence_image_url || "";

    // 3. Ganti Placeholders di Halaman 1
    // a. Nomor Berkas
    html = html.replace(
        /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>Nomor Berkas<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g,
        `<div class="c0 t" style="z-index:250;transform:matrix(1,0,0,1,157.4,204.56)">${escapeHtml(spNumber)}</div>`
    );

    // b. Salam & Nama Mahasiswa ("Yth. Saudara/Saudari Nama Lengkap")
    const salutationNamePattern = /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>Saudara \/ Saudari<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>\s*<div class="c0 t"[^>]*>\s*<\/div>\s*<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>\s*<\/div>\s*<div class="c0 t"[^>]*>Nama Lengkap Mahasiswa\s*<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g;
    html = html.replace(
        salutationNamePattern,
        `<div class="c0 t" style="z-index:342;transform:matrix(1,0,0,1,83.23,327.53)">${escapeHtml(salutation)} ${escapeHtml(fullName)}</div>`
    );

    // c. Tabel Identitas Mahasiswa
    html = html.replace(
        /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>Nama Lengkap Mahasiswa<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g,
        `<div class="c0 t" style="z-index:754;transform:matrix(1,0,0,1,253.4,463.57)">${escapeHtml(fullName)}</div>`
    );
    html = html.replace(
        /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>NIM<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g,
        `<div class="c0 t" style="z-index:788;transform:matrix(1,0,0,1,253.4,482.76)">${escapeHtml(studentId)}</div>`
    );
    html = html.replace(
        /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>Jurusan<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g,
        `<div class="c0 t" style="z-index:805;transform:matrix(1,0,0,1,253.4,502.22)">${escapeHtml(department)}</div>`
    );
    html = html.replace(
        /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>Fakultas<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g,
        `<div class="c0 t" style="z-index:827;transform:matrix(1,0,0,1,253.4,521.73)">${escapeHtml(faculty)}</div>`
    );
    html = html.replace(
        /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>Tahun Masuk<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g,
        `<div class="c0 t" style="z-index:853;transform:matrix(1,0,0,1,253.4,541.2)">${escapeHtml(entryYear)}</div>`
    );
    html = html.replace(
        /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>Email<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g,
        `<div class="c0 t" style="z-index:877;transform:matrix(1,0,0,1,253.4,560.4)">${escapeHtml(email)}</div>`
    );

    // d. Tanggal tanda tangan
    html = html.replace(/\{Tanggal Pelanggaran\}/g, escapeHtml(formattedDate));

    // 4. Ganti Placeholders di Halaman 2 (Lampiran Bukti)
    // a. Lokasi / Nama Kamera
    html = html.replace(
        /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>Nama ka<\/div>\s*<div class="c0 t"[^>]*>mera<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g,
        `<div class="c0 t" style="z-index:263;transform:matrix(1,0,0,1,157.4,281.13)">${escapeHtml(location)}</div>`
    );
    // b. Tanggal Pelanggaran
    html = html.replace(
        /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>Tanggal Pelanggaran<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g,
        `<div class="c0 t" style="z-index:287;transform:matrix(1,0,0,1,157.4,297.93)">${escapeHtml(formattedDate)}</div>`
    );
    // c. Waktu Pelanggaran
    html = html.replace(
        /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>Waktu\s*<\/div>\s*<div class="c0 t"[^>]*>Pelanggaran<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g,
        `<div class="c0 t" style="z-index:318;transform:matrix(1,0,0,1,157.4,314.73)">${escapeHtml(formattedTime)} WIB</div>`
    );
    // d. AI Confidence
    html = html.replace(
        /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>AI C<\/div>\s*<div class="c0 t"[^>]*>onfidence<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g,
        `<div class="c0 t" style="z-index:354;transform:matrix(1,0,0,1,157.4,331.8)">${escapeHtml(confidenceText)}</div>`
    );
    // e. Foto Pelanggaran Merokok
    const imageBlock = evidenceUrl
        ? `<div style="position:absolute;left:53.63px;top:380px;width:686px;text-align:center;z-index:400;"><img src="${escapeHtml(evidenceUrl)}" alt="Bukti Pelanggaran" style="max-width:650px;max-height:520px;border-radius:6px;border:1px solid #ccc;object-fit:contain;box-shadow:0 2px 8px rgba(0,0,0,0.15);" /></div>`
        : `<div style="position:absolute;left:53.63px;top:380px;width:686px;text-align:center;z-index:400;padding:40px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:6px;font-family:sans-serif;color:#64748b;">(Bukti foto tidak tersedia)</div>`;

    html = html.replace(
        /<div class="c0 t"[^>]*>\{<\/div>\s*<div class="c0 t"[^>]*>Foto Pelanggaran Merokok<\/div>\s*<div class="c0 t"[^>]*>\}<\/div>/g,
        imageBlock
    );

    // 5. Tambahkan Toolbar Cetak / Simpan PDF di Bagian Atas
    const toolbarHtml = `
<div id="sp-print-toolbar" class="no-print" style="position:fixed;top:0;left:0;right:0;height:56px;background:#0f172a;color:#ffffff;display:flex;align-items:center;justify-content:space-between;padding:0 24px;box-shadow:0 4px 12px rgba(0,0,0,0.25);z-index:9999999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:flex;align-items:center;gap:12px;">
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#22c55e;"></span>
    <span style="font-weight:700;font-size:15px;letter-spacing:-0.2px;">Surat Peringatan Resmi (ESIS)</span>
    <span style="color:#94a3b8;font-size:13px;font-family:monospace;background:#1e293b;padding:2px 8px;border-radius:4px;border:1px solid #334155;">${escapeHtml(spNumber)}</span>
  </div>
  <div style="display:flex;align-items:center;gap:10px;">
    <button onclick="window.print()" style="background:#2563eb;color:#ffffff;border:none;padding:8px 18px;border-radius:6px;font-weight:600;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 2px 6px rgba(37,99,235,0.4);transition:all 0.15s ease;">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
      Cetak / Simpan ke PDF
    </button>
    <button onclick="window.close()" style="background:#334155;color:#f8fafc;border:1px solid #475569;padding:8px 14px;border-radius:6px;font-weight:500;font-size:13px;cursor:pointer;">
      Tutup
    </button>
  </div>
</div>
<style>
  body { padding-top: 64px !important; }
  @media print {
    #sp-print-toolbar, .no-print { display: none !important; }
    body { padding-top: 0 !important; background: #fff !important; }
    .page { margin: 0 !important; box-shadow: none !important; }
  }
</style>
${options.autoPrint ? `<script>window.addEventListener('load', function() { setTimeout(function() { window.print(); }, 500); });</script>` : ""}
`;

    // Sisipkan sebelum </body> atau di awal <body>
    if (html.includes("<body")) {
        html = html.replace(/<body([^>]*)>/i, `<body$1>\n${toolbarHtml}`);
    } else {
        html = toolbarHtml + html;
    }

    return html;
}
